---
title: zt IPV6资源（通过安装miredo访问）mplayer播放IPv6下的一些在线视频资料
tags: []
id: '54'
categories:
  - - IT技术
date: 2010-04-10 01:17:05
---

目前有很多网站支持 IPv6 连接，例如：

- [http://www.ipv6bbs.com/address.php](http://www.ipv6bbs.com/address.php)
- [http://www.ipv6bbs.com/wall.php](http://www.ipv6bbs.com/wall.php)
- ~~IPv6之家~~
- ~~IPv6电视墙~~
- [http://ipv6.google.com](http://ipv6.google.com)

但对大部分人来说，这些网址是无法访问的，因为没有设置好 IPv6。目前 ISP 很少提供 IPv6 连接，用户一般需要使用 IPv6 tunnel broker 来建立管道访问 IPv6 站点。

在 Linux 下，这个工作很简单。以 Debian 为例，安装 miredo 包（包名是“多来咪”反过来）：

```bash
sudo apt-get install miredo
```

安装后，输入：

```bash
/sbin/ifconfig
```

如果看到 `teredo` 这个虚拟网卡，就可以用它访问 IPv6 了。例如：

```bash
ping6 ipv6.google.com
```

示例输出：

```bash
may@may-desktop:~$ ping6 ipv6.google.com
PING ipv6.google.com(tx-in-x68.google.com) 56 data bytes
64 bytes from tx-in-x68.google.com: icmp_seq=2 ttl=58 time=486 ms
64 bytes from tx-in-x68.google.com: icmp_seq=1 ttl=58 time=1490 ms
64 bytes from tx-in-x68.google.com: icmp_seq=3 ttl=58 time=415 ms
^C
--- ipv6.google.com ping statistics ---
4 packets transmitted, 3 received, 25% packet loss, time 2999ms
rtt min/avg/max/mdev = 415.945/797.864/1490.825/490.851 ms, pipe 2
may@may-desktop:~$
```

现在应该可以访问 [http://ipv6.google.com](http://ipv6.google.com) 了。如果成功访问，你会看到熟悉的 Google 页面。

附件：

[![Screenshot-5.png](./download/file.php?id=77923&t=1&sid=3c1bbef477426e58409c6288765f372f "Click to enlarge")](./download/file.php?id=77923&sid=3c1bbef477426e58409c6288765f372f&mode=view/Screenshot-5.png)  
Screenshot-5.png \[52.58 KiB 被浏览 1642 次\]

---

以下资源来源：[http://ipv6.ustb.edu.cn/](http://ipv6.ustb.edu.cn/)  
[http://ipv6.jx.edu.cn/ipv6-zy-web.htm](http://ipv6.jx.edu.cn/ipv6-zy-web.htm)

附件：

[![Screenshot-6.png](./download/file.php?id=77924&t=1&sid=3c1bbef477426e58409c6288765f372f "Click to enlarge")](./download/file.php?id=77924&sid=3c1bbef477426e58409c6288765f372f&mode=view/Screenshot-6.png)  
Screenshot-6.png \[120.85 KiB 被浏览 1642 次\]

- ~~上海交通大学IPv6视频点播：[http://video6.sjtu.edu.cn](http://video6.sjtu.edu.cn)（校园网可用）~~
- 上海交通大学IPv6实验站：[http://ipv6.sjtu.edu.cn](http://ipv6.sjtu.edu.cn)
- ~~北京邮电大学支持IPv6的IPTV：[http://iptv.bupt.edu.cn](http://iptv.bupt.edu.cn)~~
- 大连理工大学IPv6实验网：[http://ipv6.dlut.edu.cn](http://ipv6.dlut.edu.cn)
- 北京交通大学IPv6实验站：[http://media6.njtu.edu.cn](http://media6.njtu.edu.cn)
- ~~浙江大学视频点播系统：[http://media.zju6.edu.cn](http://media.zju6.edu.cn)~~
- 浙江大学IPv6实验网：[http://ipv6.zju.edu.cn](http://ipv6.zju.edu.cn)
- 中国科技大学CERNET2主节点：[http://ipv6.ustc.edu.cn](http://ipv6.ustc.edu.cn)
- 东北大学IPv6站：[http://ipv6.neu6.edu.cn](http://ipv6.neu6.edu.cn)
- 清华大学IPv6：[http://ipv6.tsinghua.edu.cn](http://ipv6.tsinghua.edu.cn)
- CERNET2：[http://www.cernet2.edu.cn](http://www.cernet2.edu.cn)

以下或需登录方可使用：

- 吉林大学IPv6站：[http://www.jlu6.edu.cn](http://www.jlu6.edu.cn)
- 北京大学 IPv6：[https://its.pku.edu.cn/ipv6/index.htm](https://its.pku.edu.cn/ipv6/index.htm)

---

以下资源来源：[http://ipv6.dlut.edu.cn/resource.htm](http://ipv6.dlut.edu.cn/resource.htm)

**CERNET2资源：**

- CERNET2: [http://www.cernet2.edu.cn](http://www.cernet2.edu.cn)
- ~~上海交通大学 IPv6论坛~~
- 清华大学IPv6：[http://ipv6.tsinghua.edu.cn](http://ipv6.tsinghua.edu.cn)
- 上海交通大学IPv6实验站：[http://ipv6.sjtu.edu.cn](http://ipv6.sjtu.edu.cn)
- ~~北京大学 IPv6~~
- 北京交通大学IPv6实验站：[http://media6.njtu.edu.cn](http://media6.njtu.edu.cn)
- 中国科技大学CERNET2主节点：[http://ipv6.ustc.edu.cn](http://ipv6.ustc.edu.cn)
- 东北大学IPv6站：[http://ipv6.neu6.edu.cn](http://ipv6.neu6.edu.cn)
- 浙江大学IPv6实验网：[http://ipv6.zju.edu.cn](http://ipv6.zju.edu.cn)

**FTP资源：**

- ~~上海交通大学支持IPv6的搜索引擎：[http://ftpun6.sjtu.edu.cn](http://ftpun6.sjtu.edu.cn)~~
- [动漫] 复旦大学IPV6 [ftp://[2001:da8:8001:64:210:5cff:feac:97b9]](ftp://[2001:da8:8001:64:210:5cff:feac:97b9])
- [游戏] 上交大pcgame6 [ftp://sjtu:sjtu@pcgame6.sjtu.edu.cn:5566](ftp://sjtu:sjtu@pcgame6.sjtu.edu.cn:5566)
- [电影] SCAU IPv6 MOVIE_FTP [ftp://movie.ipv6.scau.edu.cn](ftp://movie.ipv6.scau.edu.cn)
- [电影] 北邮人ipv6站 [ftp://byr:c21e277d@movie.byr.edu.cn](ftp://byr:c21e277d@movie.byr.edu.cn)
- [电视] 上交大omtv6 [ftp://sjtu:sjtu@omtv6.sjtu.edu.cn:5566](ftp://sjtu:sjtu@omtv6.sjtu.edu.cn:5566)
- [电视] SCAU IPv6 TV [ftp://tv.ipv6.scau.edu.cn](ftp://tv.ipv6.scau.edu.cn)
- [电视] 上交大tv6 [ftp://sjtu:sjtu@tv6.sjtu.edu.cn:5566](ftp://sjtu:sjtu@tv6.sjtu.edu.cn:5566)
- [电视] 北邮人ipv6 [ftp://byr:c21e277d@tv.byr.edu.cn](ftp://byr:c21e277d@tv.byr.edu.cn)
- [综合] 中国人民大学IPv6站 [ftp://[2001:da8:21c:100::94]](ftp://[2001:da8:21c:100::94])
- [综合] 北航IPv6站 [ftp://ftp.buaa6.edu.cn](ftp://ftp.buaa6.edu.cn)
- [综合] 浙江大学ipv6 [ftp://[2001:da8:e000:1000::17]](ftp://[2001:da8:e000:1000::17])
- [综合] 第二军医大学IPv6站 [ftp://ftp.smmu6.edu.cn](ftp://ftp.smmu6.edu.cn)
- [综合] 重庆大学IPV6 [ftp://download.cqu6.edu.cn](ftp://download.cqu6.edu.cn)
- [软件] SCAU IPv6 SOFT [ftp://ftp.ipv6.scau.edu.cn](ftp://ftp.ipv6.scau.edu.cn)
- [软件] 东北大学ipv6 [ftp://ftp.neu6.edu.cn](ftp://ftp.neu6.edu.cn)
- [音乐] music.gdin.edu.cn [ftp://music.gdin.edu.cn](ftp://music.gdin.edu.cn)

**其他资源：**

- 国外支持IPv6的ftp，有很多Linux源 [ftp://ftp.belnet.be/](ftp://ftp.belnet.be/)
- 支持IPv6的搜索引擎 Google [http://ipv6.google.com](http://ipv6.google.com)
- ~~6bone实验床 [http://www.6bone.net](http://www.6bone.net)~~
- IPv6论坛 [http://www.ipv6forum.org](http://www.ipv6forum.org)
- IPv6论坛中文版 [http://www.ipv6.net.cn](http://www.ipv6.net.cn)
- ~~中国协议分析网 IPv6协议~~
- 日本ftp1 BSD，misc [ftp://ftp.iij.ad.jp](ftp://ftp.iij.ad.jp)
- 日本ftp2 Software [ftp://ftp.ring.gr.jp](ftp://ftp.ring.gr.jp)
- 日本ftp3 BSD，ipv6,misc [ftp://ftp.kddlabs.co.jp/](ftp://ftp.kddlabs.co.jp/)
- 其他资源（有可能重复） [http://ipv6.jx.edu.cn/ipv6-zy-web.htm](http://ipv6.jx.edu.cn/ipv6-zy-web.htm)
- [http://www.ipv6.pku.edu.cn/](http://www.ipv6.pku.edu.cn/)
- ~~YouTube [http://www.youtube.com.sixxs.org/](http://www.youtube.com.sixxs.org/)~~

附件：

[![Screenshot-25.png](./download/file.php?id=78105&t=1&sid=3c1bbef477426e58409c6288765f372f "Click to enlarge")](./download/file.php?id=78105&sid=3c1bbef477426e58409c6288765f372f&mode=view/Screenshot-25.png)  
Screenshot-25.png \[899.27 KiB 被浏览 1475 次\]

---

## 修改 hosts 文件

编辑 hosts 文件：

```bash
sudo gedit /etc/hosts
```

示例内容：

```
# Google
2001:4860:c004::68 www.google.com
2001:4860:c004::68 www.l.google.com

# Images
2001:4860:c004::68 images.google.com
2001:4860:c004::68 tbn0.google.com
2001:4860:c004::68 tbn1.google.com
2001:4860:c004::68 tbn2.google.com
2001:4860:c004::68 tbn3.google.com
2001:4860:c004::68 tbn4.google.com
2001:4860:c004::68 tbn5.google.com
2001:4860:c004::68 tbn6.google.com

# Shopping
2001:4860:c004::68 base0.googlehosted.com
2001:4860:c004::68 base1.googlehosted.com
2001:4860:c004::68 base2.googlehosted.com
2001:4860:c004::68 base3.googlehosted.com
2001:4860:c004::68 base4.googlehosted.com
2001:4860:c004::68 base5.googlehosted.com

# Books
2001:4860:c004::68 books.google.com
2001:4860:c004::68 bks0.books.google.com
2001:4860:c004::68 bks1.books.google.com
2001:4860:c004::68 bks2.books.google.com
2001:4860:c004::68 bks3.books.google.com
2001:4860:c004::68 bks4.books.google.com
2001:4860:c004::68 bks5.books.google.com
2001:4860:c004::68 bks6.books.google.com
2001:4860:c004::68 bks7.books.google.com
2001:4860:c004::68 bks8.books.google.com
2001:4860:c004::68 bks9.books.google.com

# Video
2001:4860:c004::68 video.google.com
2001:4860:c004::68 0.gvt0.com
2001:4860:c004::68 1.gvt0.com
2001:4860:c004::68 2.gvt0.com
2001:4860:c004::68 3.gvt0.com
2001:4860:c004::68 4.gvt0.com
2001:4860:c004::68 5.gvt0.com

# Mail (POP3/SMTP)
2001:4860:c004::68 pop.gmail.com
2001:4860:c004::68 smtp.gmail.com
2001:4860:c004::68 mail.google.com

# WebMail
2001:4860:c004::68 mail.google.com
2001:4860:c004::68 googlemail.l.google.com

# Docs
2001:4860:c004::68 writely-china.l.google.com
2001:4860:c004::68 writely.l.google.com
2001:4860:c004::68 docs.google.com

# Map
2001:4860:c004::68 map.google.com
2001:4860:c004::68 maps.google.com
2001:4860:c004::68 khm.google.com
2001:4860:c004::68 mt0.google.com
2001:4860:c004::68 mt1.google.com
2001:4860:c004::68 mt2.google.com
2001:4860:c004::68 mt.l.google.com
2001:4860:c004::68 maps.l.google.com

# Scholar
2001:4860:c004::68 scholar.google.com
2001:4860:c004::68 scholar.l.google.com

# Group
2001:4860:c004::68 groups.google.com
2001:4860:c004::68 groups.l.google.com

# Picasa
2001:4860:c004::68 picasa.google.com
2001:4860:c004::68 photos.google.com
2001:4860:c004::68 picasaweb.google.com
2001:4860:c004::68 lh0.ggpht.com
2001:4860:c004::68 lh1.ggpht.com
2001:4860:c004::68 lh2.ggpht.com
2001:4860:c004::68 lh3.ggpht.com
2001:4860:c004::68 lh4.ggpht.com
2001:4860:c004::68 lh5.ggpht.com
2001:4860:c004::68 lh6.ggpht.com
2001:4860:c004::68 lh7.ggpht.com

# Translate
2001:4860:c004::68 translate.google.com

# Sites
2001:4860:c004::68 sites.google.com

# Code
2001:4860:c004::68 code.google.com
2001:4860:c004::68 code.l.google.com

# Labs
2001:4860:c004::68 appspot.l.google.com
2001:4860:c004::68 labs.google.com

# Knol
2001:4860:c004::68 knol.google.com

# Sketchup
2001:4860:c004::68 sketchup.google.com

# Pack
2001:4860:c004::68 pack.google.com

# News
2001:4860:c004::68 news.google.com
2001:4860:c004::68 nt0.ggpht.com
2001:4860:c004::68 nt1.ggpht.com
2001:4860:c004::68 nt2.ggpht.com
2001:4860:c004::68 nt3.ggpht.com
2001:4860:c004::68 nt4.ggpht.com
2001:4860:c004::68 nt5.ggpht.com

# Calendar
2001:4860:c004::68 calendar.google.com

# Blogger
2001:4860:c004::68 blogger.l.google.com
2001:4860:c004::68 blogger.google.com

# Orkut
2001:4860:c004::68 orkut.google.com
2001:4860:c004::68 orkut.l.google.com

# Toolbar
2001:4860:c004::68 toolbar.google.com

# Apps
2001:4860:c004::68 apps.google.com

# Chrome
2001:4860:c004::68 chrome.google.com

# Finance
2001:4860:c004::68 finance.google.com

# Desktop
2001:4860:c004::68 desktop.google.com

# Ajax
2001:4860:c004::68 ajax.googleapis.com
2001:4860:c004::68 googleapis-ajax.l.google.com

# Modules
2001:4860:c004::68 1.ig.gmodules.com
2001:4860:c004::68 2.ig.gmodules.com
2001:4860:c004::68 3.ig.gmodules.com
2001:4860:c004::68 4.ig.gmodules.com
2001:4860:c004::68 5.ig.gmodules.com
2001:4860:c004::68 6.ig.gmodules.com

# Misc
2001:4860:c004::68 id.l.google.com
2001:4860:c004::68 skins.gmodules.com
2001:4860:c004::68 googlehosted.l.google.com
2001:4860:c004::68 img0.gmodules.com
2001:4860:c004::68 blogsearch.google.com
2001:4860:c004::68 www2.l.google.com
2001:4860:c004::68 www3.l.google.com
2001:4860:c004::68 buttons.googlesyndication.com

# YouTube
2001:4860:c004::68 youtube.com
2001:4860:c004::68 gdata.youtube.com
2001:4860:c004::68 help.youtube.com
2001:4860:c004::68 upload.youtube.com
2001:4860:c004::68 insight.youtube.com
```