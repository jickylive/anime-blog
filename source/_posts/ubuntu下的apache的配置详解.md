---
title: Ubuntu下的Apache的配置详解
tags: []
id: '22'
categories:
  - - IT技术
date: 2010-07-17 21:13:47
---

# Ubuntu下的Apache的配置详解

> 本帖最后由 灰儿 于 2010-1-28 21:29 编辑

普通的 Apache 发行版本配置文件通常只有一个，就是 `httpd.conf`。但在 Ubuntu Linux 上的 Apache 主配置文件是 `/etc/apache2/apache2.conf`，它把各个设置项分在了不同的配置文件中。看起来复杂，但仔细想想设计得确实很合理。

Apache 在启动时会自动读取这个文件的配置信息。而其他的一些配置文件，则是通过 `Include` 指令包含进来。在 `apache2.conf` 中引用到了以下文件：

```apache
# 包含动态模块的配置:
Include /etc/apache2/mods-enabled/*.load
Include /etc/apache2/mods-enabled/*.conf

# 包含用户自己的配置:
Include /etc/apache2/httpd.conf

# 包含端口监听的配置:
Include /etc/apache2/ports.conf

# 包含一般性的配置语句片断:
Include /etc/apache2/conf.d/

# 包含虚拟主机的配置指令:
Include /etc/apache2/sites-available/

# 软链接指向:
Include /etc/apache2/sites-enabled/
```

结合注释，可以很清楚地看出每个配置文件的大体作用。当然，你完全可以把所有的设置放在 `apache2.conf` 或者 `httpd.conf` 或者任何一个配置文件中。Apache2 的这种划分只是一种比较好的习惯。

---

## 1. 配置基于域名的多个虚拟主机

Apache2 提供了一个友好虚拟主机的缺省配置。它配置成单个缺省虚拟主机（使用 `VirtualHost` 语句）。如果您有单个站点，可以修改或直接使用它。如果您有多个站点的话，可以将其作为其它虚拟主机的模板。如果对其不加理会，该缺省虚拟主机将会作为您的缺省网站提供服务，或者如果网站用户所输入的 URL 并没有匹配您任何所定义站点的 `ServerName` 语句时，将看到该虚拟主机内容。

要修改缺省虚拟主机，可以编辑文件 `/etc/apache2/sites-available/default`。

如果您希望配置多个虚拟主机或站点，在同一目录中将拷贝该文件并将新文件重命名为您所想要的文件名，如在 `/etc/apache2/sites-available/` 目录中建立一个虚拟主机配置文件 `mynewsite`，然后编辑此文件。

为了使用基于域名的虚拟主机，你必须指定服务器 IP 地址（和可能的端口）来使主机接受请求，这个可以用 `NameVirtualHost` 指令来进行配置。

下一步就是为每个虚拟主机建立 `<VirtualHost>` 段。其参数与 `NameVirtualHost` 的参数必须是一样的（比如说，一个 IP 地址或 `*` 代表的所有地址）。

- `ServerAdmin` 语句指定服务器管理员的邮件地址，应该改成您的邮件地址。如果您的网站有问题，Apache2 将显示包含该邮件地址的错误信息以便报告该问题。
- `DocumentRoot` 语句指定 Apache 将到哪儿去寻找站点文件，缺省值为 `/var/www`。
- `ServerName` 语句是可选的，它指明您站点要应答什么 FQDN。缺省虚拟主机没有指定 `ServerName`，因为它要应答没有匹配其它虚拟主机 `ServerName` 语句的所有请求。
- `ServerAlias` 很多虚拟主机希望自己能通过不只一个域名被访问。我们可以通过这个语句来解决这个问题。您也可以在 `ServerAlias` 中使用通配符。例如，`ServerAlias *.sq01.cn` 将使您的网站响应任何域名以 `.sq01.cn` 结尾的请求。
- `ErrorLog` 设置该虚拟主机的出错日志。
- `CustomLog` 设置该虚拟主机的访问信息文件。

**示例：**

假设你正在为域名 `www.sq01.cn` 提供服务，而你又想在同一个 IP 地址上增加一个名叫 `www.sh0527.cn` 的虚拟主机，你只需在新建的配置文件中加入以下内容：

```apache
NameVirtualHost *:80

<VirtualHost *:80>
    ServerName www.sq01.cn
    ServerAlias sq01.cn *.sq01.cn
    DocumentRoot /www/sq01
    ServerAdmin sq01@163.com
    ErrorLog /var/log/apache2/sq01_errors.log
    CustomLog /var/log/apache2/sq01_accesses.log combined
</VirtualHost>

<VirtualHost *:80>
    ServerName www.sh0527.cn
    DocumentRoot /www/sh0527
</VirtualHost>
```

然后再运行命令：

```bash
sudo a2ensite mynewsite
```

你会发现在 `/etc/apache2/sites-enabled/` 目录中多了一个到 `/etc/apache2/sites-available/mynewsite` 的软链接。接下来重启你的 apache2：

```bash
sudo /etc/init.d/apache2 restart
```

这样虚拟主机的站点 `www.sq01.cn` 就设置成功了。

综上所述，`/etc/apache2/sites-available` 目录并不会被 Apache2 直接解析。在 `/etc/apache2/sites-enabled` 的软链接指向“可用的”站点。使用 `a2ensite`（Apache2 启用站点）工具可以创建这些软链接，如：

```bash
sudo a2ensite mynewsite
```

这里您站点的配置文件是 `/etc/apache2/sites-available/mynewsite`。同样，`a2dissite` 工具将用来禁用站点。

如果 apache 上配置了多个虚拟主机，每个虚拟主机的配置文件都放在 `sites-available` 下，那么对于虚拟主机的停用、启用就非常方便了：当在 `sites-enabled` 下建立一个指向某个虚拟主机配置文件的链接时，就启用了它；如果要关闭某个虚拟主机的话，只需删除相应的链接即可，根本不用去改配置文件。

---

## 2. 配置基于端口的多个虚拟主机

由于需要改变对应虚拟主机的默认端口设置，就需要编辑 `ports.conf` 这个文件，这里面设置了 Apache 使用的端口。

1. 编辑 `/etc/apache2/ports.conf` 文件，并添加一行：

    ```apache
    Listen 88  # 新端口号
    ```

2. 编辑 `/etc/apache2/sites-available/default` 并在结尾处添加一个 VirtualHost：

    ```apache
    <VirtualHost *:88>
        ServerName ubuntuServer
        DocumentRoot /root/www/
    </VirtualHost>
    ```

3. 重启 apache 服务：

    ```bash
    sudo /etc/init.d/apache2 restart
    ```

---

### 编辑网站默认编码

编辑 `/etc/apache2/conf.d/charset` 文件，在改动之前，请先将该配置文件做个备份，以便在出错的时候可以恢复。

将：

```apache
AddDefaultCharset UTF-8
```

改为：

```apache
AddDefaultCharset GB2312
```

这样的话，我们就不会每次打开网页都是乱码了！