---
title: centos 6.4 用openswan ipsec和xl2tpd搭建l2tp VPN（适用于KVM VPS）
date: 2015-09-27 20:33:11
tags:
- VPN
- CentOS
- L2TP
- Openswan
- xl2tpd
categories:
- IT技术
id: '95'
---

参考文章:
- [http://www.maxwhale.com/how-to-install-l2tp-vpn-on-centos/](http://www.maxwhale.com/how-to-install-l2tp-vpn-on-centos/)
- [http://blog.earth-works.com/2013/02/22/how-to-set-up-openswan-l2tp-vpn-server-on-centos-6/](http://blog.earth-works.com/2013/02/22/how-to-set-up-openswan-l2tp-vpn-server-on-centos-6/)

## 第一步：准备工作

首先的首先，给系统的软件都升一下级:

```bash
yum update
```

再来，安装下面需要的软件，和编辑和编译环境相关的，都装上吧，下面有些在安装时会用到，比如`lsof`之类。

```bash
yum install -y make gcc gmp-devel xmlto bison flex xmlto libpcap-devel lsof vim-enhanced man
```

## 第二步：安装

下面正式开始安装l2tp VPN!

```bash
yum install openswan ppp xl2tpd
```

如果找不到的软件，那么可以去 [http://pkgs.org/](http://pkgs.org/) 找rpm包。比如`xl2tpd`我就找不到，去pkgs.org就可以搜到：

**CentOS 6**

**Atomic:**

*   `xl2tpd-1.2.7-1.el6.art.i686.rpm` Layer 2 Tunnelling Protocol Daemon (RFC 2661)
*   `xl2tpd-1.2.7-1.el6.art.x86_64.rpm` Layer 2 Tunnelling Protocol Daemon (RFC 2661)

**EPEL:**

*   `xl2tpd-1.3.1-7.el6.i686.rpm` Layer 2 Tunnelling Protocol Daemon (RFC 2661)
*   `xl2tpd-1.3.1-7.el6.x86_64.rpm` Layer 2 Tunnelling Protocol Daemon (RFC 2661)

根据自己的系统是`i686`还是`x86_64`找个对应的最新的`xl2tpd-1.3.1-7`下下来安装。其他包找不到同理一样做。都要找最新的！

```bash
yum install xl2tpd-1.3.1-7.el6.x86_64.rpm
```

## 第三步：配置

### 1. 编辑 `/etc/ipsec.conf`

```bash
vim /etc/ipsec.conf
```

把下面`xx.xxx.xxx.xxx`换成你自己VPS实际的外网固定IP。其他的不动。

```ini
config setup
    nat_traversal=yes
    virtual_private=%v4:10.0.0.0/8,%v4:192.168.0.0/16,%v4:172.16.0.0/12
    oe=off
    protostack=netkey

conn L2TP-PSK-NAT
    rightsubnet=vhost:%priv
    also=L2TP-PSK-noNAT

conn L2TP-PSK-noNAT
    authby=secret
    pfs=no
    auto=add
    keyingtries=3
    rekey=no
    ikelifetime=8h
    keylife=1h
    type=transport
    left=xxx.xxx.xxx.xxx
    leftprotoport=17/1701
    right=%any
    rightprotoport=17/%any
```

### 2. 编辑 `/etc/ipsec.secrets`

```bash
vim /etc/ipsec.secrets
```

```
xxx.xxx.xxx.xxx %any: PSK "YourPsk"
```

`xx.xxx.xxx.xxx`换成你自己VPS实际的外网固定IP, `YourPsk`你自己定一个，到时候连VPN的时候可以用，比如可以填`csdn.net`

注意空格。

### 3. 修改/添加 `/etc/sysctl.conf`

```bash
vim /etc/sysctl.conf
```

确保下面的字段都有，对应的值或下面一样。省事的话直接在`/etc/sysctl.conf`的末尾直接把下面内容的粘过去。

```
net.ipv4.ip_forward = 1
net.ipv4.conf.default.rp_filter = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.log_martians = 0
net.ipv4.conf.default.log_martians = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.icmp_ignore_bogus_error_responses = 1
```

### 4. 让修改后的`sysctl.conf`生效

```bash
sysctl -p
```

可能会有一些ipv6的错误，不用管他

```
error: "net.bridge.bridge-nf-call-ip6tables" is an unknown key
error: "net.bridge.bridge-nf-call-iptables" is an unknown key
error: "net.bridge.bridge-nf-call-arptables" is an unknown key
```

### 5. 验证ipsec运行状态

```bash
ipsec setup restart
ipsec verify
```

verify的内容如下所示，那么就离成功不远了。

```
Checking your system to see if IPsec got installed and started correctly:
Version check and ipsec on-path                                 [OK]
Linux Openswan U2.6.32/K2.6.32-431.11.2.el6.i686 (netkey)
Checking for IPsec support in kernel                            [OK]
 SAref kernel support                                           [N/A]
 NETKEY:  Testing for disabled ICMP send_redirects              [OK]
NETKEY detected, testing for disabled ICMP accept_redirects    [OK]
Checking that pluto is running                                  [OK]
 Pluto listening for IKE on udp 500                             [OK]
 Pluto listening for NAT-T on udp 4500                          [OK]
Checking for 'ip' command                                       [OK]
Checking /bin/sh is not /bin/dash                               [OK]
Checking for 'iptables' command                                 [OK]
Opportunistic Encryption Support                                [DISABLED]
```

如果有问题，你就得上网搜解决办法，否则下面进行不下去。比如有时你得把selinux关掉

把`SELINUX`设置成`disabled`，然后`reboot`一下机器就生效了。

```bash
vim /etc/sysconfig/selinux
```

```
SELINUX=disabled
```

### 6. 编辑 `/etc/xl2tpd/xl2tpd.conf`

```bash
vim /etc/xl2tpd/xl2tpd.conf
```

```ini
[global]
ipsec saref = yes
listen-addr = xxx.xxx.xxx.xxx ;服务器地址

[lns default]
ip range = 192.168.1.2-192.168.1.100 ;这里是VPN client的内网ip地址范围
local ip = 192.168.1.1 ;这里是VPN server的内网地址
refuse chap = yes
refuse pap = yes
require authentication = yes
ppp debug = yes
pppoptfile = /etc/ppp/options.xl2tpd
length bit = yes
```

### 7. 编辑 `/etc/ppp/options.xl2tpd`

```bash
vim /etc/ppp/options.xl2tpd
```

```
require-mschap-v2
ms-dns 8.8.8.8
ms-dns 8.8.4.4
asyncmap 0
auth
crtscts
lock
hide-password
modem
debug
name l2tpd
proxyarp
lcp-echo-interval 30
lcp-echo-failure 4
```

### 8. 配置用户名,密码:编辑 `/etc/ppp/chap-secrets`

```bash
vim /etc/ppp/chap-secrets
```

client和secret自己填，server和IP留`*`号，

```
# Secrets for authentication using CHAP
# client        server  secret                  IP addresses
username * userpass *
```

### 9. 重启xl2tp

```bash
service xl2tpd restart
```

### 10. 开放端口以及转发

原样执行下面所有命令，

```bash
#Allow ipsec traffic
iptables -A INPUT -m policy --dir in --pol ipsec -j ACCEPT
iptables -A FORWARD -m policy --dir in --pol ipsec -j ACCEPT

#Do not NAT VPN traffic
iptables -t nat -A POSTROUTING -m policy --dir out --pol none -j MASQUERADE

#Forwarding rules for VPN
iptables -A FORWARD -i ppp+ -p all -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

#Ports for Openswan / xl2tpd
iptables -A INPUT -m policy --dir in --pol ipsec -p udp --dport 1701 -j ACCEPT
iptables -A INPUT -p udp --dport 500 -j ACCEPT
iptables -A INPUT -p udp --dport 4500 -j ACCEPT

iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
```

再执行下面保存iptables

```bash
service iptables save
service iptables restart
```

### 11. 添加自启动

```bash
chkconfig xl2tpd on
chkconfig iptables on
chkconfig ipsec on
```

### 12. 重启

```bash
reboot
```

完成！回头再来写一个一键安装脚本。

## 调试：

连不上的时候先关闭iptables来调试。

```bash
service iptables stop
```

确定能连上以后再打开iptables

```bash
service iptables start
```

如果这时连不上了，那么就是iptables的问题了
特别注意iptables里的顺序， `INPUT`和`FORWARD`里的`REJECT`一定是写在最后面，否则写在他们之后的port就都被`REJECT`了！

下面是我自己的iptables，可供参考

```
*nat
:PREROUTING ACCEPT [82:15507]
:POSTROUTING ACCEPT [0:0]
:OUTPUT ACCEPT [6:447]
-A POSTROUTING -m policy --dir out --pol none -j MASQUERADE
COMMIT
# Completed on Fri Apr  4 05:44:30 2014
# Generated by iptables-save v1.4.7 on Fri Apr  4 05:44:30 2014
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [490:286471]
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
-A INPUT -m policy --dir in --pol ipsec -j ACCEPT
-A INPUT -p udp -m policy --dir in --pol ipsec -m udp --dport 1701 -j ACCEPT
-A INPUT -p udp -m udp --dport 500 -j ACCEPT
-A INPUT -p udp -m udp --dport 4500 -j ACCEPT
-A INPUT -p esp -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -m policy --dir in --pol ipsec -j ACCEPT
-A FORWARD -i ppp+ -m state --state NEW,RELATED,ESTABLISHED -j ACCEPT
-A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
```

via: http://blog.csdn.net/musiccow/article/details/22904997
