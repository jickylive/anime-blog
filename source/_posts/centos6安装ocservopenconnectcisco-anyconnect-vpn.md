---
title: Centos6安装ocserv/openconnect/cisco AnyConnect vpn
tags:
- CentOS
- VPN
- ocserv
- openconnect
- AnyConnect
id: '87'
categories:
  - - IT技术
date: 2015-09-27 13:24:48
---

[Centos](https://www.haiyun.me/tag/centos) 7使用[epel](http://www.haiyun.me/archives/centos-yum-epel.html)源可直接使用Yum安装。

安装编译环境及依赖，如部分软件不能安装请先安装epel源。

```bash
yum install pam-devel readline-devel http-parser-devel unbound gmp-devel
yum install tar gzip xz wget gcc make autoconf
```

ocserv编译安装依赖，ocserv需要gnutls3版本以上，gnutls依赖nettle2.7.1：

```bash
wget ftp://ftp.gnu.org/gnu/nettle/nettle-2.7.1.tar.gz
tar zxvf nettle-2.7.1.tar.gz
cd nettle-2.7.1/
./configure --prefix=/usr/local/nettle
make && make install
echo '/usr/local/nettle/lib64/' > /etc/ld.so.conf.d/nettle.conf
ldconfig
```

安装gnutls3.3.9：

```bash
export NETTLE_CFLAGS="-I/usr/local/nettle/include/"
export NETTLE_LIBS="-L/usr/local/nettle/lib64/ -lnettle"
export HOGWEED_LIBS="-L/usr/local/nettle/lib64/ -lhogweed"
export HOGWEED_CFLAGS="-I/usr/local/nettle/include"
wget ftp://ftp.gnutls.org/gcrypt/gnutls/v3.3/gnutls-3.3.9.tar.xz
tar xvf gnutls-3.3.9.tar.xz
cd gnutls-3.3.9/
./configure --prefix=/usr/local/gnutls
make && make install
ln -s /usr/local/gnutls/bin/certtool /usr/bin/certtool
echo '/usr/local/gnutls/lib/' > /etc/ld.so.conf.d/gnutls.conf
ldconfig
```

安装libnl：

```bash
yum install bison flex
wget http://www.carisma.slowglass.com/~tgr/libnl/files/libnl-3.2.24.tar.gz
tar xvf libnl-3.2.24.tar.gz
cd libnl-3.2.24
./configure --prefix=/usr/local/libnl
make && make install
echo '/usr/local/libnl/lib/' > /etc/ld.so.conf.d/libnl.conf
ldconfig
```

安装ocserv：

```bash
export LIBNL3_CFLAGS="-I/usr/local/libnl/include/libnl3"
export LIBNL3_LIBS="-L//usr/local/libnl/lib/ -lnl-3 -lnl-route-3"
export LIBGNUTLS_LIBS="-L/usr/local/gnutls/lib/ -lgnutls"
export LIBGNUTLS_CFLAGS="-I/usr/local/gnutls/include/"
wget ftp://ftp.infradead.org/pub/ocserv/ocserv-0.9.0.1.tar.xz
tar xvf ocserv-0.9.0.1.tar.xz
cd ocserv-0.9.0
./configure --prefix=/usr/local/ocserv
make && make install
echo 'export PATH=$PATH://usr/local/ocserv/sbin/:/usr/local/ocserv/bin/' >> $HOME/.bashrc
source $HOME/.bashrc
```

生成SSL证书：

```bash
mkdir /etc/ocserv/
cd /etc/ocserv

#CA私钥：
certtool --generate-privkey --outfile ca-key.pem

#CA模板：
cat << EOF > ca.tmpl
cn = "www.haiyun.me"
organization = "www.haiyun.me"
serial = 1
expiration_days = 3650
ca
signing_key
cert_signing_key
crl_signing_key
EOF

#CA证书：
certtool --generate-self-signed --load-privkey ca-key.pem --template ca.tmpl --outfile ca-cert.pem

#Server私钥：
certtool --generate-privkey --outfile server-key.pem

#Server证书模板：
cat << EOF > server.tmpl
cn = "www.haiyun.me"
o = "www.haiyun.me"
expiration_days = 3650
signing_key
encryption_key
tls_www_server
EOF

#Server证书：
certtool --generate-certificate --load-privkey server-key.pem --load-ca-certificate ca-cert.pem --load-ca-privkey ca-key.pem --template server.tmpl --outfile server-cert.pem
```

密码登录，生成密码文件：

```bash
ocpasswd -c /etc/ocserv/passwd username
```

证书登录：

```bash
#user私钥
certtool --generate-privkey --outfile user-key.pem

#user模板
cat << EOF > user.tmpl
cn = "some random name"
unit = "some random unit"
expiration_days = 365
signing_key
tls_www_client
EOF

#user证书
certtool --generate-certificate --load-privkey user-key.pem --load-ca-certificate ca-cert.pem --load-ca-privkey ca-key.pem --template user.tmpl --outfile user-cert.pem
```

配置文件：

```
auth = "plain[/etc/ocserv/passwd]"
#证书认证
#auth = "certificate"
ca-cert /etc/ocserv/ca-cert.pem
max-clients = 16
max-same-clients = 2
tcp-port = 5551
udp-port = 5551
keepalive = 32400
try-mtu-discovery = true
cisco-client-compat = true
server-cert = /etc/ocserv/server-cert.pem
server-key = /etc/ocserv/server-key.pem
auth-timeout = 40
pid-file = /var/run/ocserv.pid
socket-file = /var/run/ocserv-socket
run-as-user = nobody
run-as-group = daemon
device = vpns
ipv4-network = 192.168.1.0
ipv4-netmask = 255.255.255.0
route = 192.168.1.0/255.255.255.0
```

启动opserv：

```bash
ocserv -f -c /etc/ocserv/ocserv.conf
```

IP转发及SNAT：

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
echo "echo 1 > /proc/sys/net/ipv4/ip_forward " >> /etc/rc.local
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

使用用户密码连接：

```bash
echo passwd | openconnect -u username www.haiyun.me:5551 --no-cert-check
```

使用证书连接：

```bash
openconnect -k user-key.pem -c user-cert.pem www.haiyun.me:5551 --no-cert-check
```

via: https://www.haiyun.me/archives/1071.html/comment-page-1
