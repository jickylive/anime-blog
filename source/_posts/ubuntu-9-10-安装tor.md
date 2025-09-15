---
title: Ubuntu 9.10 安装TOR
tags: []
id: '16'
categories:
  - - IT技术
date: 2010-04-10 17:30:55
---

## Ubuntu 9.10 安装TOR

[ubuntu](http://bothlog.com/category/linux/ubuntu-linux/ "显示ubuntu的所有日志"), by vangie. 在/etc/apt/sources.list中添加

> deb http://mirror.noreply.org/pub/tor etch main deb-src http://mirror.noreply.org/pub/tor etch main

添加密钥

> gpg –keyserver keys.gnupg.net –recv 94C09C7F gpg –export 94C09C7F sudo apt-key add -

更新源

> sudo apt-get update

下载并安装libevent1

> http://packages.ubuntu.com/zh-cn/jaunty/libevent1

安装Tor

> sudo apt-get install tor privoxy

使用你最喜欢的编辑器打开 /etc/privoxy/config 文件，在最前面加上下面这一行（别漏了那个不起眼的“.”）：

> forward-socks4a / localhost:9050 .

重新启动 privoxy 服务

> sudo /etc/init.d/privoxy restart