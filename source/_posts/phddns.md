---
title: phddns
tags: []
id: '109'
categories:
  - - IT技术
date: 2016-02-16 21:53:50
---

# 花生壳 for Linux 的使用

在终端下运行：

```bash
phddns
```

会出现如下提示：

### 第一步：输入服务器地址

```
Enter server address (press ENTER use phddns60.oray.net):
```

提示输入花生壳服务器的域名。如果没有特殊说明，直接回车，使用默认的 `phddns60.oray.net`。

### 第二步：输入 Oray 账号

```
Enter your Oray account:
```

输入在花生壳网站注册的用户名。

### 第三步：输入密码

```
Password:
```

输入对应用户名的密码。

### 第四步：选择网络接口

```
Network interface(s): [eth0]=[IP:192.168.33.195] [lo]=[IP:127.0.0.1] Choose one(default eth0):
```

选择服务器的网络接口。若有多块网卡（如 eth0 和 eth1），可输入对应网卡名称。只有一块网卡或使用默认，直接回车。

### 第五步：设置日志文件路径

```
Log to use(default /var/log/phddns.log):
```

指定日志文件的保存路径，直接回车使用默认路径 `/var/log/phddns.log`。

### 第六步：保存配置文件

```
Save to configuration file (/etc/phlinux.conf) (yes/no/other):
```

- 输入 `yes` 或直接回车，使用默认 `/etc/phlinux.conf`。
- 输入 `other` 可自定义配置文件路径（需绝对路径）。
- 输入 `no` 不保存配置，下次需重新设置。

完成后，屏幕会显示：

```
defOnStatusChanged ok DomainsRegistered UserType
```

表示注册并运行成功。

---

## 设置开机自动运行

在 `/etc/rc.local` 添加：

```bash
/usr/bin/phddns -c /etc/phlinux.conf -d
```

- `-c` 指定配置文件路径
- `-d` 以守护进程方式运行

可用以下命令查看进程：

```bash
ps -ef | grep phddns
```

---

## 修改配置

首次安装配置后，如需修改，可直接编辑配置文件，终止相关进程后，使用：

```bash
/usr/bin/phddns -c /etc/phlinux.conf -d
```

即可按新配置运行。