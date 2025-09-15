---
title: EC2 AMI实例 配置 VPN（PPTP）
tags:
- EC2
- AMI
- VPN
- PPTP
id: '30'
categories:
  - - IT技术
date: 2012-08-04 22:34:13
---

由于朋友想要弄一个VPN，所以在EC2上的AMI实例上装了一个，下面是配置的步骤：

```bash
sudo -i
yum -y install rpm-build gcc
yum -y install ppp
yum -y install make
wget 'http://downloads.sourceforge.net/project/poptop/pptpd/pptpd-1.3.4/pptpd-1.3.4.tar.gz?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fpoptop%2Ffiles%2Fpptpd%2F&ts=1306811287&use_mirror=cdnetworks-kr-2'
tar xzvf pptpd-1.3.4.tar.gz
cd pptpd-1.3.4
./configure –prefix=/usr/local/pptpd –enable-bcrelay –with-libwrap
make
make install
mkdir /usr/local/pptpd/etc
```

编辑 `/usr/local/pptpd/etc/pptpd.conf` 文件：
```bash
vi /usr/local/pptpd/etc/pptpd.conf
```

填入内容如下：

```
# pptpd.conf
option /usr/local/pptpd/etc/options.pptpd
debug
stimeout 30
localip 10.0.0.254  # 你EC2的ip地址 ＊根据自己EC2情况设定
remoteip 10.0.0.200-210 # 客户端地址（与你EC2同网段地址）＊根据自己EC2情况设定
```

**说明：**

*   `option /usr/local/pptpd/etc/options.pptpd` ———— 指定 pptpd 扩展属性配置文件 options.pptpd 的位置。
*   `debug` ———— 开启调试模式，有关 pptpd 的信息和错误都会记录在 /var/logs/message 中，方便排错和调试。
*   `stimeout 30` ———— 设置客户端连接 pptpd server 时的最长连接等待时间（连接超时时间），30 秒。
*   `localip 10.0.0.254` ———— pptpd server 所在服务器的 IP 地址，可以设置为服务器上绑定的任意一个 IP 地址。
*   `remoteip 10.0.0.200-210` ———— 设置客户端连接到 pptpd server 后可供分配的 IP 地址范围( 10.0.0.200 – 10.0.0.210 )，可以这样设置：10.0.0.200-208,10.0.0.209,10.0.0.210，效果是一样的。

编辑 `/usr/local/pptpd/etc/options.pptpd` 文件：
```bash
vi /usr/local/pptpd/etc/options.pptpd
```

填入内容如下：

```
# options.pptpd
name IsMole-VPN
refuse-pap
refuse-chap
refuse-mschap
require-mschap-v2
require-mppe-128
ms-dns 8.8.8.8
proxyarp
debug
lock
nobsdcomp
novj
novjccomp
nologfd
```

**说明：**

*   `name IsMole-VPN` ———— pptpd server 的名称。
*   `refuse-pap` ———— 拒绝 pap 身份验证模式。
*   `refuse-chap` ———— 拒绝 chap 身份验证模式。
*   `refuse-mschap` ———— 拒绝 mschap 身份验证模式。
*   `require-mschap-v2` ———— 在端点进行连接握手时需要使用微软的 mschap-v2 进行自身验证。
*   `require-mppe-128` ———— MPPE 模块使用 128 位加密。
*   `ms-dns 8.8.8.8` ————— DNS 服务器
*   `proxyarp` ———— 建立 ARP 代理键值。
*   `debug` ———— 开启调试模式，相关信息同样记录在 /var/logs/message 中。
*   `lock` ———— 锁定客户端 PTY 设备文件。
*   `nobsdcomp` ———— 禁用 BSD 压缩模式。
*   `novj`
*   `novjccomp` ———— 禁用 Van Jacobson 压缩模式。
*   `nologfd` ———— 禁止将错误信息记录到标准错误输出设备(stderr)。

配置好上面的两个文件后，我们开始添加客户端帐号。

客户端帐号控制文件位于：`/etc/ppp/chap-secrets`

```bash
vi /etc/ppp/chap-secrets
```

```
# PPTP User Accounts
# username server_name “password” ip
vpnuser1 IsMole-VPN “123456″ 10.0.0.201
```

### 三、启动 PPTPD

```bash
/usr/local/pptpd/sbin/pptpd -c /usr/local/pptpd/etc/pptpd.conf -o /usr/local/pptpd/etc/options.pptpd
```

如果tcp的1723端口是打开的，就说明启动OK。

### 四、打开linux路由转发

```bash
sysctl -w net.ipv4.ip_forward=1
iptables -t nat -A POSTROUTING -j MASQUERADE
```

参考感谢：[http://hi.baidu.com/%BA%DA%B7%E7%D5%AF%B6%FE%B5%B1%BC%D2/blog/item/39d12d11f6e9ae1eb9127b86.html](http://hi.baidu.com/%BA%DA%B7%E7%D5%AF%B6%FE%B5%B1%BC%D2/blog/item/39d12d11f6e9ae1eb9127b86.html)
