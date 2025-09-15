---
title: Docker 上的 IPsec VPN 服务器
tags: []
id: '298'
categories:
  - - IT技术
date: 2019-04-05 12:05:20
---

# Docker 上的 IPsec VPN 服务器

[![Build Status](https://camo.githubusercontent.com/9c5b7d81621d74d07b71ee3855e435262ee48efd/68747470733a2f2f696d672e736869656c64732e696f2f7472617669732f687764736c322f646f636b65722d69707365632d76706e2d7365727665722e7376673f6d61784167653d31323030)](https://travis-ci.org/hwdsl2/docker-ipsec-vpn-server)

[![GitHub Stars](https://camo.githubusercontent.com/f578c973a7807949632fb6a79f050b3c4dca93ae/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f687764736c322f646f636b65722d69707365632d76706e2d7365727665722e7376673f6d61784167653d3836343030)](https://github.com/hwdsl2/docker-ipsec-vpn-server/stargazers)

[![Docker Stars](https://camo.githubusercontent.com/497abc8cc91f516a22f5c0829578e731fc8b6837/68747470733a2f2f696d672e736869656c64732e696f2f646f636b65722f73746172732f687764736c322f69707365632d76706e2d7365727665722e7376673f6d61784167653d3836343030)](https://hub.docker.com/r/hwdsl2/ipsec-vpn-server/)

[![Docker Pulls](https://camo.githubusercontent.com/9bd6ec3ad00cd12a705747169f1597f118376b24/68747470733a2f2f696d672e736869656c64732e696f2f646f636b65722f70756c6c732f687764736c322f69707365632d76706e2d7365727665722e7376673f6d61784167653d3836343030)](https://hub.docker.com/r/hwdsl2/ipsec-vpn-server/)

使用这个 Docker 镜像快速搭建 IPsec VPN 服务器。支持 `IPsec/L2TP` 和 `Cisco IPsec` 协议。

本镜像以 Debian 9 (Stretch) 为基础，并使用 [Libreswan](https://libreswan.org/) (IPsec VPN 软件) 和 [xl2tpd](https://github.com/xelerance/xl2tpd) (L2TP 服务进程)。

[**? 另见： IPsec VPN 服务器一键安装脚本**](https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/README-zh.md)

_其他语言版本: [English](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README.md), [简体中文](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md)._

#### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E7%9B%AE%E5%BD%95)目录

*   [安装 Docker](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%AE%89%E8%A3%85-docker)
*   [下载](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%B8%8B%E8%BD%BD)
*   [如何使用本镜像](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E6%9C%AC%E9%95%9C%E5%83%8F)
*   [下一步](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%B8%8B%E4%B8%80%E6%AD%A5)
*   [重要提示](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E9%87%8D%E8%A6%81%E6%8F%90%E7%A4%BA)
*   [更新 Docker 镜像](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%9B%B4%E6%96%B0-docker-%E9%95%9C%E5%83%8F)
*   [高级用法](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95)
*   [技术细节](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%8A%80%E6%9C%AF%E7%BB%86%E8%8A%82)
*   [另见](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%8F%A6%E8%A7%81)
*   [授权协议](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%8E%88%E6%9D%83%E5%8D%8F%E8%AE%AE)

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%AE%89%E8%A3%85-docker)安装 Docker

首先，在你的 Linux 服务器上 [安装并运行 Docker](https://docs.docker.com/install/)。

**注：** 本镜像不支持 Docker for Mac 或者 Windows。

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%B8%8B%E8%BD%BD)下载

预构建的可信任镜像可在 [Docker Hub registry](https://hub.docker.com/r/hwdsl2/ipsec-vpn-server/) 下载：

```
docker pull hwdsl2/ipsec-vpn-server
```

或者，你也可以自己从 GitHub [编译源代码](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%BB%8E%E6%BA%90%E4%BB%A3%E7%A0%81%E6%9E%84%E5%BB%BA)。Raspberry Pi 用户请看 [这里](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%9C%A8-raspberry-pi-%E4%B8%8A%E4%BD%BF%E7%94%A8)。

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E6%9C%AC%E9%95%9C%E5%83%8F)如何使用本镜像

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)环境变量

这个 Docker 镜像使用以下几个变量，可以在一个 `env` 文件中定义 （[示例](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/vpn.env.example)）：

```
VPN_IPSEC_PSK=your_ipsec_pre_shared_key
VPN_USER=your_vpn_username
VPN_PASSWORD=your_vpn_password
```

这将创建一个用于 VPN 登录的用户账户，它可以在你的多个设备上使用[\*](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E9%87%8D%E8%A6%81%E6%8F%90%E7%A4%BA)。 IPsec PSK (预共享密钥) 由 `VPN_IPSEC_PSK` 环境变量指定。 VPN 用户名和密码分别在 `VPN_USER` 和 `VPN_PASSWORD` 中定义。

支持创建额外的 VPN 用户，如果需要，可以像下面这样在你的 `env` 文件中定义。用户名和密码必须分别使用空格进行分隔，并且用户名不能有重复。所有的 VPN 用户将共享同一个 IPsec PSK。

```
VPN_ADDL_USERS=additional_username_1 additional_username_2
VPN_ADDL_PASSWORDS=additional_password_1 additional_password_2
```

**注：** 在你的 `env` 文件中，**不要**为变量值添加 `""` 或者 `''`，或在 `=` 两边添加空格。**不要**在值中使用这些字符： `\ " '`。一个安全的 IPsec PSK 应该至少包含 20 个随机字符。

所有这些环境变量对于本镜像都是可选的，也就是说无需定义它们就可以搭建 IPsec VPN 服务器。详情请参见以下部分。

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E8%BF%90%E8%A1%8C-ipsec-vpn-%E6%9C%8D%E5%8A%A1%E5%99%A8)运行 IPsec VPN 服务器

**重要：** 首先，在 Docker 主机上加载 IPsec `af_key` 内核模块。该步骤在 Ubuntu 和 Debian 上为可选步骤。

```
sudo modprobe af_key
```

为保证这个内核模块在服务器启动时加载，请参见以下链接： [Ubuntu/Debian](https://help.ubuntu.com/community/Loadable_Modules), [CentOS 6](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/deployment_guide/sec-persistent_module_loading), [CentOS 7](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Kernel_Administration_Guide/sec-Persistent_Module_Loading.html), [Fedora](https://docs.fedoraproject.org/en-US/fedora/f28/system-administrators-guide/kernel-module-driver-configuration/Working_with_Kernel_Modules/index.html#sec-Persistent_Module_Loading) 和 [CoreOS](https://coreos.com/os/docs/latest/other-settings.html)。

使用本镜像创建一个新的 Docker 容器 （将 `./vpn.env` 替换为你自己的 `env` 文件）：

```
docker run \
    --name ipsec-vpn-server \
    --env-file ./vpn.env \
    --restart=always \
    -p 500:500/udp \
    -p 4500:4500/udp \
    -v /lib/modules:/lib/modules:ro \
    -d --privileged \
    hwdsl2/ipsec-vpn-server
```

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E8%8E%B7%E5%8F%96-vpn-%E7%99%BB%E5%BD%95%E4%BF%A1%E6%81%AF)获取 VPN 登录信息

如果你在上述 `docker run` 命令中没有指定 `env` 文件，`VPN_USER` 会默认为 `vpnuser`，并且 `VPN_IPSEC_PSK` 和 `VPN_PASSWORD` 会被自动随机生成。要获取这些登录信息，可以查看容器的日志：

```
docker logs ipsec-vpn-server
```

在命令输出中查找这些行：

```
Connect to your new VPN with these details:

Server IP: 你的VPN服务器IP
IPsec PSK: 你的IPsec预共享密钥
Username: 你的VPN用户名
Password: 你的VPN密码
```

（可选步骤）备份自动生成的 VPN 登录信息（如果有）到当前目录：

```
docker cp ipsec-vpn-server:/opt/src/vpn-gen.env ./
```

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%9F%A5%E7%9C%8B%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%8A%B6%E6%80%81)查看服务器状态

如需查看你的 IPsec VPN 服务器状态，可以在容器中运行 `ipsec status` 命令：

```
docker exec -it ipsec-vpn-server ipsec status
```

或者查看当前已建立的 VPN 连接：

```
docker exec -it ipsec-vpn-server ipsec whack --trafficstatus
```

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%B8%8B%E4%B8%80%E6%AD%A5)下一步

配置你的计算机或其它设备使用 VPN 。请参见：

**[配置 IPsec/L2TP VPN 客户端](https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/docs/clients-zh.md)**

**[配置 IPsec/XAuth ("Cisco IPsec") VPN 客户端](https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/docs/clients-xauth-zh.md)**

如果在连接过程中遇到错误，请参见 [故障排除](https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/docs/clients-zh.md#%E6%95%85%E9%9A%9C%E6%8E%92%E9%99%A4)。

开始使用自己的专属 VPN !

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E9%87%8D%E8%A6%81%E6%8F%90%E7%A4%BA)重要提示

_其他语言版本: [English](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README.md#important-notes), [简体中文](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E9%87%8D%E8%A6%81%E6%8F%90%E7%A4%BA)._

**Windows 用户** 在首次连接之前需要[修改注册表](https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/docs/clients-zh.md#windows-%E9%94%99%E8%AF%AF-809)，以解决 VPN 服务器 和/或 客户端与 NAT（比如家用路由器）的兼容问题。

同一个 VPN 账户可以在你的多个设备上使用。但是由于 IPsec/L2TP 的局限性，如果需要同时连接在同一个 NAT （比如家用路由器）后面的多个设备到 VPN 服务器，你必须仅使用 [IPsec/XAuth 模式](https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/docs/clients-xauth-zh.md)。

对于有外部防火墙的服务器（比如 [EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html)/[GCE](https://cloud.google.com/vpc/docs/firewalls)），请为 VPN 打开 UDP 端口 500 和 4500。阿里云用户请参见 [#433](https://github.com/hwdsl2/setup-ipsec-vpn/issues/433)。

如果需要编辑 VPN 配置文件，你必须首先在正在运行的 Docker 容器中 [开始一个 Bash 会话](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%9C%A8%E5%AE%B9%E5%99%A8%E4%B8%AD%E8%BF%90%E8%A1%8C-bash-shell)。

如需添加，修改或者删除 VPN 用户账户，首先更新你的 `env` 文件，然后你必须按照 [下一节](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%9B%B4%E6%96%B0-docker-%E9%95%9C%E5%83%8F) 的说明来删除并重新创建 Docker 容器。高级用户可以 [绑定挂载](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E7%BB%91%E5%AE%9A%E6%8C%82%E8%BD%BD-env-%E6%96%87%E4%BB%B6) `env` 文件。

在 VPN 已连接时，客户端配置为使用 [Google Public DNS](https://developers.google.com/speed/public-dns/)。如果偏好其它的域名解析服务，请看[这里](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%BD%BF%E7%94%A8%E5%85%B6%E4%BB%96%E7%9A%84-dns-%E6%9C%8D%E5%8A%A1%E5%99%A8)。

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%9B%B4%E6%96%B0-docker-%E9%95%9C%E5%83%8F)更新 Docker 镜像

如需更新你的 Docker 镜像和容器，请按以下步骤进行：

```
docker pull hwdsl2/ipsec-vpn-server
```

如果 Docker 镜像已经是最新的，你会看到提示：

```
Status: Image is up to date for hwdsl2/ipsec-vpn-server:latest
```

否则，将会下载最新版本。要更新你的 Docker 容器，首先在纸上记下你所有的 VPN 登录信息（参见上面的 "获取 VPN 登录信息"）。然后删除 Docker 容器： `docker rm -f ipsec-vpn-server`。最后按照 "如何使用本镜像" 的说明来重新创建它。

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95)高级用法

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%BD%BF%E7%94%A8%E5%85%B6%E4%BB%96%E7%9A%84-dns-%E6%9C%8D%E5%8A%A1%E5%99%A8)使用其他的 DNS 服务器

在 VPN 已连接时，客户端配置为使用 [Google Public DNS](https://developers.google.com/speed/public-dns/)。如果偏好其它的域名解析服务，你可以在 `env` 文件中定义 `VPN_DNS_SRV1` 和 `VPN_DNS_SRV2`（可选），然后按照上面的说明重新创建 Docker 容器。比如你想使用 [Cloudflare 的 DNS 服务](https://1.1.1.1/)：

```
VPN_DNS_SRV1=1.1.1.1
VPN_DNS_SRV2=1.0.0.1
```

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%9C%A8-raspberry-pi-%E4%B8%8A%E4%BD%BF%E7%94%A8)在 Raspberry Pi 上使用

如需在 Raspberry Pi （ARM架构）上使用，你必须首先在你的 RPi 上按照 [从源代码构建](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%BB%8E%E6%BA%90%E4%BB%A3%E7%A0%81%E6%9E%84%E5%BB%BA) 中的说明自己构建这个 Docker 镜像，而不是从 Docker Hub 下载。然后按照本文档的其它步骤操作。

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E4%BB%8E%E6%BA%90%E4%BB%A3%E7%A0%81%E6%9E%84%E5%BB%BA)从源代码构建

高级用户可以从 GitHub 下载并自行编译源代码：

```
git clone https://github.com/hwdsl2/docker-ipsec-vpn-server.git
cd docker-ipsec-vpn-server
docker build -t hwdsl2/ipsec-vpn-server .
```

若不需要改动源码，也可以这样：

```
docker build -t hwdsl2/ipsec-vpn-server github.com/hwdsl2/docker-ipsec-vpn-server.git
```

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%9C%A8%E5%AE%B9%E5%99%A8%E4%B8%AD%E8%BF%90%E8%A1%8C-bash-shell)在容器中运行 Bash shell

在正在运行的 Docker 容器中开始一个 Bash 会话：

```
docker exec -it ipsec-vpn-server env TERM=xterm bash -l
```

（可选步骤） 安装 `nano` 编辑器：

```
apt-get update && apt-get -y install nano
```

然后在容器中运行你的命令。完成后退出并重启 Docker 容器 （如果需要）：

```
exit
docker restart ipsec-vpn-server
```

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E7%BB%91%E5%AE%9A%E6%8C%82%E8%BD%BD-env-%E6%96%87%E4%BB%B6)绑定挂载 env 文件

作为 `--env-file` 选项的替代方案，高级用户可以绑定挂载 `env` 文件。该方法的好处是你在更新 `env` 文件之后可以重启 Docker 容器以生效，而不需要重新创建它。要使用这个方法，你必须首先编辑你的 `env` 文件并将所有的变量值用单引号 `''`括起来。然后（重新）创建 Docker 容器（将第一个 `vpn.env` 替换为你自己的 `env` 文件）：

```
docker run \
    --name ipsec-vpn-server \
    --restart=always \
    -p 500:500/udp \
    -p 4500:4500/udp \
    -v "$(pwd)/vpn.env:/opt/src/vpn.env:ro" \
    -v /lib/modules:/lib/modules:ro \
    -d --privileged \
    hwdsl2/ipsec-vpn-server
```

### [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%90%AF%E7%94%A8-libreswan-%E6%97%A5%E5%BF%97)启用 Libreswan 日志

为了保持较小的 Docker 镜像，Libreswan (IPsec) 日志默认未开启。如果你是高级用户，并且需要启用它以便进行故障排除，首先在正在运行的 Docker 容器中开始一个 Bash 会话：

```
docker exec -it ipsec-vpn-server env TERM=xterm bash -l
```

然后运行以下命令：

```
apt-get update && apt-get -y install rsyslog
service rsyslog restart
service ipsec restart
sed -i '/modprobe/a service rsyslog restart' /opt/src/run.sh
exit
```

完成后你可以这样查看 Libreswan 日志：

```
docker exec -it ipsec-vpn-server grep pluto /var/log/auth.log
```

如需查看 xl2tpd 日志，请运行 `docker logs ipsec-vpn-server`。

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%8A%80%E6%9C%AF%E7%BB%86%E8%8A%82)技术细节

需要运行以下两个服务： `Libreswan (pluto)` 提供 IPsec VPN， `xl2tpd` 提供 L2TP 支持。

默认的 IPsec 配置支持以下协议：

*   IKEv1 with PSK and XAuth ("Cisco IPsec")
*   IPsec/L2TP with PSK

为使 VPN 服务器正常工作，将会打开以下端口：

*   4500/udp and 500/udp for IPsec

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E5%8F%A6%E8%A7%81)另见

*   [IPsec VPN Server on Ubuntu, Debian and CentOS](https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/README-zh.md)
*   [IKEv2 VPN Server on Docker](https://github.com/gaomd/docker-ikev2-vpn-server)

## [](https://github.com/hwdsl2/docker-ipsec-vpn-server/blob/master/README-zh.md#%E6%8E%88%E6%9D%83%E5%8D%8F%E8%AE%AE)授权协议

[![View my profile on LinkedIn](https://camo.githubusercontent.com/a2cd904f7c4d52cdc8a5c52f30f7affe417f5ad2/68747470733a2f2f7374617469632e6c6963646e2e636f6d2f736364732f636f6d6d6f6e2f752f696d672f77656270726f6d6f2f62746e5f766965776d795f3136307832352e706e67)](https://www.linkedin.com/in/linsongui)

版权所有 (C) 2016-2019 [Lin Song](https://www.linkedin.com/in/linsongui)   
基于 [Thomas Sarlandie 的工作](https://github.com/sarfata/voodooprivacy) (Copyright 2012) (版权所有 2012)

这个项目是以 [知识共享署名-相同方式共享3.0](http://creativecommons.org/licenses/by-sa/3.0/) 许可协议授权。  
必须署名： 请包括我的名字在任何衍生产品，并且让我知道你是如何改善它的！