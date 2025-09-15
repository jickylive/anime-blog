---
title: ubuntu系统为ppp接口配置IPv6隧道(IPv6-in-IPv4 tunnel)
tags: []
id: '266'
categories:
  - - IT技术
date: 2010-04-10 01:20:21
---

Linux 最早的 IPv6/IPng 支持代码始于 kernel 2.1.8（1996 年 11 月），历史悠久。IPv6 在 1998 年 8 月 10 日成为 IETF 草案标准。Ubuntu 9.10 默认开启 IPv6 协议，也就是说主机为 IPv4/IPv6 双栈。可以通过检查 `/proc/net/if_inet6` 文件是否存在来确定内核是否支持 IPv6。如果该文件不存在，系统极有可能通过可加载模块支持 IPv6。

虽然内核支持 IPv6，但目前除教育网外，大多数网络用户无法直接访问 IPv6 网站。主机成了 IPv6 “孤岛”，只能通过 IPv6-in-IPv4 隧道协议访问 IPv6 资源。实现这种隧道有多种方式，这里介绍 ISATAP（Intra-Site Automatic Tunnel Addressing Protocol），一种点对点隧道协议。

使用 ISATAP 需要知道隧道路由器的 IPv4 地址、IPv6 地址及其网络前缀和本地 IPv4 地址。可以使用教育网提供的隧道路由器，例如 [上海交大](http://ipv6.sjtu.edu.cn/news/041231.php)。以下以该隧道路由器为例，设置本地 ppp 接口。

IPv6 提供了以 `2001:` 和 `2002:` 开头的地址用于 IPv6-in-IPv4 隧道，ISATAP 一般使用 `2001:` 开头的 IPv6 地址。建立隧道的脚本 `build_ipv6_tunnel` 如下：

```bash
#!/bin/bash

ipv4_addr=$(ifconfig ppp0 | grep 'inet addr' | cut -d':' -f2 | cut -d' ' -f1)
ip tunnel add sit1 mode sit remote 202.120.58.150 local ${ipv4_addr}
ifconfig sit1 up
ifconfig sit1 add 2001:da8:8000:d010:0:5efe:${ipv4_addr}/64
ip -6 route add ::/0 via 2001:da8:8000:d010::1 metric 1 dev sit1
```

- `ipv4_addr`：本地 ppp 接口获取的 IPv4 地址
- 隧道路由器 IPv4 地址：`202.120.58.150`
- 隧道路由器 IPv6 地址：`2001:da8:8000:d010::1`
- IPv6 网络前缀：`2001:da8:8000:d010::/64`
- 本地 IPv6 地址主机部分：`0:5efe:${ipv4_addr}`

两部分合并后，本地 IPv6 地址为 `2001:da8:8000:d010:0:5efe:${ipv4_addr}/64`。这里为静态设置，ISATAP 也支持动态配置客户端 IPv6 地址。

`mode sit` 处的 sit 是 Simple Internet Transition 的缩写。接口名可自定义，但建议不要用 sit0。

拆除隧道的脚本 `delete_ipv6_tunnel` 如下：

```bash
#!/bin/bash

ip -6 route del ::/0 via 2001:da8:8000:d010::1 dev sit1
ip link set sit1 down
ip tunnel del sit1
```

将 `build_ipv6_tunnel` 放在 `/etc/ppp/ip-up.d/`，`delete_ipv6_tunnel` 放在 `/etc/ppp/ip-down.d/`，即可随 ppp0 接口的建立和拆除自动建立和拆除隧道。

现在访问 http://www.ipv6.org，如果看到类似 “You are using IPv6 from 2001:da8:8000:d010:0:5efe:xxxx:xxxx” 的信息，说明 IPv6 已正常工作。

如果能找到 IPv6 反向代理，就可以用 IPv6 访问一些平常不能访问的站点，比如 Twitter，详见 “[用IPv6反向代理访问Twitter](http://internet.solidot.org/article.pl?sid=09/12/09/0347210&tid=48)”。