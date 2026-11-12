---
title: linux interfaces文件配置
tags:
- Linux
- Network
- interfaces
id: '23'
categories:
  - - IT技术
date: 2010-07-17 21:34:41
---

## 基本配置示例

```bash
auto lo
iface lo inet loopback

# The primary network interface
auto eth0
iface eth0 inet static
    address 192.168.0.42
    network 192.168.0.0
    netmask 255.255.255.0
    broadcast 192.168.0.255
    gateway 192.168.0.1
```

-   **第1行和第5行：** `lo` 和 `eth0` 接口会在系统启动时被自动配置。
-   **第2行：** 将 `lo` 接口设置为本地回环（loopback）地址。
-   **第6行：** `eth0` 接口为静态（static）IP配置。
-   **第7-11行：** 分别设置 `eth0` 的 IP、网络号、掩码、广播地址和网关。

## 更复杂的配置

```bash
auto eth0
iface eth0 inet static
    address 192.168.1.42
    network 192.168.1.0
    netmask 255.255.255.128
    broadcast 192.168.1.0
    up route add -net 192.168.1.128 netmask 255.255.255.128 gw 192.168.1.2
    up route add default gw 192.168.1.200
    down route del default gw 192.168.1.200
    down route del -net 192.168.1.128 netmask 255.255.255.128 gw 192.168.1.2
```

-   更复杂的掩码和广播地址。
-   `up` 和 `down` 关键字用于接口启用/禁用时添加或删除路由。

## 配置物理网卡的多个接口

```bash
auto eth0 eth0:1
iface eth0 inet static
    address 192.168.0.100
    network 192.168.0.0
    netmask 255.255.255.0
    broadcast 192.168.0.255
    gateway 192.168.0.1

iface eth0:1 inet static
    address 192.168.0.200
    network 192.168.0.0
    netmask 255.255.255.0
```

-   在 `eth0` 上配置多个地址，常用于一块网卡多个地址的场景。

## pre-up 和 post-down 命令

```bash
auto eth0
iface eth0 inet dhcp
    pre-up [ -f /etc/network/local-network-ok ]
```

-   `pre-up` 在激活 `eth0` 之前检查 `/etc/network/local-network-ok` 文件是否存在。

## 更进一步的例子

```bash
auto eth0 eth1
iface eth0 inet static
    address 192.168.42.1
    netmask 255.255.255.0
    pre-up /path/to/check-mac-address.sh eth0 11:22:33:44:55:66
    pre-up /usr/local/sbin/enable-masq

iface eth1 inet dhcp
    pre-up /path/to/check-mac-address.sh eth1 AA:BB:CC:DD:EE:FF
    pre-up /usr/local/sbin/firewall
```

-   `check-mac-address.sh` 用于检测网卡的 MAC 地址，确保正确后才启用网卡。
-   适用于防止网卡名互换问题。

## 逻辑接口映射

```bash
auto eth0 eth1
mapping eth0 eth1
    script /path/to/get-mac-address.sh
    map 11:22:33:44:55:66 lan
    map AA:BB:CC:DD:EE:FF internet

iface lan inet static
    address 192.168.42.1
    netmask 255.255.255.0
    pre-up /usr/local/sbin/enable-masq $IFACE

iface internet inet dhcp
    pre-up /usr/local/sbin/firewall $IFACE
```

-   通过脚本获取 MAC 地址，将逻辑接口映射到物理接口。

## 仅启用网卡，不分配 IP

```bash
auto eth0
iface eth0 inet manual
    up ifconfig $IFACE 0.0.0.0 up
    up /usr/local/bin/myconfigscript
    down ifconfig $IFACE down
```

-   启用网卡但不设置 IP，由外部程序配置。

## 启用混杂模式（监听接口）

```bash
auto eth0
iface eth0 inet manual
    up ifconfig $IFACE 0.0.0.0 up
    up ip link set $IFACE promisc on
    down ip link set $IFACE promisc off
    down ifconfig $IFACE down
```

-   启用网卡混杂模式，常用于监听。

---

interfaces 文件中以太网卡的配置基本介绍完毕。
