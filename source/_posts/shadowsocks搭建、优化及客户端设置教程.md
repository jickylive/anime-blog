---
title: Shadowsocks搭建、优化及客户端设置教程
tags: []
id: '89'
categories:
  - - IT技术
date: 2015-09-27 14:13:38
---

# [Shadowsocks搭建、优化及客户端设置教程](http://aisheji.org/web/centos-build-shadowsocks.html)

*   作者: [Tod](http://aisheji.org/author/1/)

*   　　先说几句废话，急着看教程的可以略过这段，博客使用了新的系统，前面的数据没有导入，大多是一些私人日记文章，被我放到路由器上当日记本用了，时逢Digitalocean搞活动，入手了便宜主机，主要是用来安装shadowsocks，具体的作用和使用方法不再细说，这里讲下centos 7搭建shadowsocks的过程及优化步骤，一方面当个备忘录，方便我以后使用，另一方面可以试用下markdown。

* * *

**1、安装组件，运行以下指令：**

```
yum install m2crypto python-setuptools
easy_install pip
pip install shadowsocks
```

　　安装时部分组件需要输入`Y`确认。

**2、安装完成后配置服务器参数，运行以下指令：**

```
vi  /etc/shadowsocks.json
```

　　写入配置如下：

```
{
    "server":"0.0.0.0",
    "server_port":8388,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"mypassword",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false,
    "workers": 1
}
```

　　将上面的mypassword替换成你的密码，server\_port也是可以修改的，例如3024，传说端口越小，效果越好，这个我没有去验证，但建议不要小于1024，以免引起不必要的麻烦。

**3、运行下面的命令，启动shadowsocks**

```
ssserver -c /etc/shadowsocks.json
```

　　至此shadowsocks搭建完成，shadowsocks已经可以使用，如果你没有过高的要求，下面的步骤可以省略，下面是后台运行和优化步骤。

* * *

**4、安装supervisor，运行以下命令**

```
yum install python-setuptools
easy_install supervisor
```

　　然后创建配置文件

```
echo_supervisord_conf > /etc/supervisord.conf
```

　　修改配置文件

```
vi /etc/supervisord.conf
```

　　在文件末尾添加

```
[program:ssserver]
command = ssserver -c /etc/shadowsocks.json
autostart=true
autorestart=true
startsecs=3
```

　　[配置文件说明](http://supervisord.org/configuration.html "supervisord配置说明")  
　　运行命令：

```
supervisord
```

**5、设置supervisord开机启动**  
　　编辑文件：

```
vi /etc/rc.local
```

　　在末尾另起一行添加

```
supervisord
```

　　保存退出（和上文类似）。  
　　另centos7还需要为rc.local添加执行权限

```
chmod +x /etc/rc.local
```

　　至此运用supervisord控制shadowsocks开机自启和后台运行设置完成

* * *

**6、shadowsocks服务器TCP优化**

　　编辑limits.conf

```
vi /etc/security/limits.conf
```

　　添加下面两行

```
* soft nofile 51200
* hard nofile 51200
```

　　开启shadowsocks服务之前，先设置一下ulimit

```
ulimit -n 51200
```

　　把sysctl.conf备份到root目录

```
cp /etc/sysctl.conf /root/
```

　　修改sysctl.conf配置文件

```
vi /etc/sysctl.conf
```

　　将内容**替换如下**

```
fs.file-max = 51200

net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.core.netdev_max_backlog = 250000
net.core.somaxconn = 4096

net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 0
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.ip_local_port_range = 10000 65000
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_max_tw_buckets = 5000
net.ipv4.tcp_fastopen = 3
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_congestion_control = hybla
```

　　开启hybla算法，注意下，openvz可能不生效。

```
/sbin/modprobe tcp_hybla
```

　　查看可用的算法。看hybla是否有hybla，如果没有，用cubic。

```
sysctl net.ipv4.tcp_available_congestion_control
```

　　使其生效:

```
sysctl -p
```

* * *

**7、Shadowsocks WIN客户端设置**

　　Win客户端下载地址：http://sourceforge.net/projects/shadowsocksgui/files/dist/

　　设置界面如下：  
![Shadowsocks Win客户端设置界面](http://z.aisheji.org/Shadowsocks.jpg "Shadowsocks Win客户端设置界面")

　　其中：Server IP为服务器IP，Server Port为远程端口（在服务器端shadowsocks.json中设置），Password为密码，Encryption为加密方式，选择`AES-256-CFB`，Proxy Port为本地端口（在服务器端shadowsocks.json中设置），Remarks为别名。

　　配置好客户端后，我们需要选择合适的浏览器和插件来应用本地代理，下面分别介绍了Chrome和Firefox的设置方法。

　　1、Chrome  
　　Chrome使用本地代理需要用到插件[SwitchySharp](http://switchysharp.com/install.html "Switchysharp下载地址")，安装好插件后，打开插件的设置界面，填入如下设置  
![SwitchySharp设置](http://z.aisheji.org/SwitchySharp.png "SwitchySharp设置")

　　设置完成后选择插件的代理模式为`Shadowsocks`(或者你自己命名的情景模式)后即可。

　　上面的设置为全局代理，如需实现智能代理需要手动添加规则，还可以订阅GFWlist，地址为：http://autoproxy-gfwlist.googlecode.com/svn/trunk/gfwlist.txt 由于这个地址不通过代理无法访问，所以你可以通过其它途径下载到本地，这方面资料网上比较丰富，再者使用起来不是很方便，在此我就不赘述了。下面介绍另一种规则，[gfwlist2pac](https://github.com/clowwindy/gfwlist2pac "gfwlist2pac")，这是网友在Gfwlist的基础上，更新了部分网址转化成的PAC规则文件，目前我就采用的是这种方式，体验不错，当然，由于规则文件都具有时效性，也许你看到这篇文章时这个规则或许不是最好用的了，这里只是讲一种思路，你可以自行选择其他规则，甚至是自定义的规则，使用PAC规则设置如下:  
![GFWlist2PAC设置](http://z.aisheji.org/GFWlist2PAC.png "GFWlist2PAC设置")  
　　PAC规则地址：https://raw.githubusercontent.com/clowwindy/gfwlist2pac/master/test/proxy\_abp.pac  
　　设置完成后选择插件的代理模式为`gfwlist2pac`(或者你自己命名的情景模式)后即可。

　　2、Firefox  
　　Firefox使用本地代理需要用到插件[Autoproxy](http://fxthunder.com/blog/archives/2866/ "Autoproxy")，这个插件原作者已经没有更新了，本文使用的是其他作者的继续更新版，修复了无法订阅gfwlist的bug，订阅方法和上述类似，同样由于原地址无法直接访问，所以可以通过其他途径下载到本地然后导入。

* * *

**8、Shadowsocks android客户端设置**  
　　首先需要下载android客户端，Shadowsocks的中文名称为`影梭`，可以从googleplay下载，如果你无法使用googleplay,可从下面的地址下载:https://github.com/shadowsocks/shadowsocks-android/releases ，android版的设置和PC端类似  
![Shadowsocks-android](http://z.aisheji.org/Shadowsocks-android.png "Shadowsocks-android")

* * *

　　参考文章：  
　　　　　[Shadowsocks官方教程](https://github.com/clowwindy/shadowsocks "shadowsocks官方使用说明")

标签: [shadowsocks](http://aisheji.org/tag/shadowsocks/)

via:http://aisheji.org/web/centos-build-shadowsocks.html