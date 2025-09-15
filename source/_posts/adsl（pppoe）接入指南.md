---
title: ADSL（PPPOE）接入指南
tags: []
id: '12'
categories:
  - - IT技术
date: 2010-04-10 02:06:18
---

# ADSL（PPPOE）接入指南

### 出自Ubuntu中文

Ubuntu Linux是自带ADSL拨号网络（PPPOE调制解调器）支持的，但是没有Windows下拨号那么方便。其实Ubuntu下ADSL上网也并不是很难，目前在中国ADSL家庭用户居多，在此就介绍一下Ubuntu下ADSL（PPPOE）拨号的方法。

### \[[编辑](/index.php?title=ADSL%EF%BC%88PPPOE%EF%BC%89%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97&action=edit&section=1 "编辑段落: 配置 ADSL")\] 配置 ADSL

Ubuntu8.10 里面已经自带了网络配置向导，在顶部菜单中进入系统->首选项->Network Configuration->DSL，进行设置，依次填写用户名，服务以及密码即可。 Ubuntu9.10 里的network management有bug，可能无法按照以上使用方式正常使用adsl，所以需要更新network management，或使用pppoeconf作为拨号方式。 **方法一：使用pppoeconf命令拨号** 启用有线连接：sudo ifconfig eth0 up 在终端中输入:sudo pppoeconf 一个基于文本菜单的程序会指导你进行下面的步骤： 1. 确认以太网卡已被检测到。 2. 输入你的用户名（由ISP所提供 注意：输入时请先清除输入框中的“username“，否则可能造成验证错误）。 3. 输入你的密码（由ISP所提供）。 4. 如果你已经配置了一个PPPoE的连接，会通知你这个连接将会被修改。 5. 弹出一个选项:你被询问是否需要'noauth'和'defaultroute'选项和去掉'nodetach',这里选择"Yes"。 6. Use peer DNS - 选择 "Yes". 7. Limited MSS problem - 选择 "Yes". 8. 当你被询问是否在需要在进入系统的时候自动连接，你可以选择"Yes"。 9. 最后，你会被询问是否马上建立连接。 在需要的时候启动ADSL连接，可以在终端中输入：sudo pon dsl-provider 断开ADSL连接，可以在终端中输入：sudo poff 如果你发现连接正常工作，尝试手动去调整你之前ADSL连接的配置（参考前一节）。 需要查看日志，可以在终端中输入：plog 获得接口信息，可以在终端中输入：ifconfig ppp0 使用pppoeconf拨号后，Network Manager显示设备未托管的解决办法： 在终端中输入以下命令，来配置网络连接管理文件： sudo gedit /etc/NetworkManager/nm-system-settings.conf 打开后，找到 \[ifupdown\] managed=false 修改成： \[ifupdown\] managed=true 终端运行sudo gedit /etc/network/interfaces 只保留 auto lo iface lo inet loopback 删除dns设置 sudo mv /etc/resolv.conf /etc/resolv.conf\_backup 之后重启 network-manager服务： sudo service network-manager restart **方法二：使用新版的NetworkManager** 直接引用 lainme简洁明了的回复； [http://forum.ubuntu.org.cn/viewtopic.php?f=48&t=239763&start=3](http://forum.ubuntu.org.cn/viewtopic.php?f=48&t=239763&start=3 "http://forum.ubuntu.org.cn/viewtopic.php?f=48&t=239763&start=3") 1、从PPA更新network-manager sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys BC8EBFE8 在/etc/apt/sources.list最后加上 deb [http://ppa.launchpad.net/network-manager/trunk/ubuntu](http://ppa.launchpad.net/network-manager/trunk/ubuntu) karmic main deb-src [http://ppa.launchpad.net/network-manager/trunk/ubuntu](http://ppa.launchpad.net/network-manager/trunk/ubuntu) karmic main sudo aptitude update sudo aptitude safe-upgrade 2、 解决pppoeconf和network-manager冲突 更改/etc/NetworkManager/nm-system- settings.conf中的managed＝true 更改/etc/network/interfaces，只保留 auto lo iface lo inet loopback 删除/etc/resolv.conf 然后sudo /etc/init.d/network-manager restart 如果面板没有nm图标，ALT+F2输入nm-applet，并添加自 启动（我的安装时没有添加） 3、右击NM图标，编辑链接，切换到DSL，新建，输入用户名和密码。

### \[[编辑](/index.php?title=ADSL%EF%BC%88PPPOE%EF%BC%89%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97&action=edit&section=2 "编辑段落: ADSL命令")\] ADSL命令

_注意:以下命令不是设置步骤，只是教你如何进行adsl拨号的日常操作_ 拨号 ADSL

pon dsl-provider

断开 ADSL

poff dsl-provider

查看拨号日志

plog

对于 拨号 ADSL 和 断开 ADSL 可以在菜单编辑器中或面板中依照以上命令行建立相应的快捷方式以方便拨号。 在面板上右击，选择添加到面板 -> 自定义应用程序启动器 -> 添加 类型： 终端中的应用程序 名称： ADSL 拨号 命令：pon dsl-provider 注释： ADSL 拨号 以后需要连接ADSL拨号只需要点击该快捷方式，点击之后会弹出终端窗口提示用户输入密码，输入完成后即连接网络。 断开网络的快捷方式与此类似，只需将pon改为poff。 用户还可以更改拨号名称，将dsl-prvider改为自己想要的更简短的名字。 使用应用程序／附件／超级用户终端

cd /etc/ppp/peers

mv dsl-provider name

注：cd 目标路径 ；mv 原文件名 目标文件名。 若不确定/etc/ppp/peers中有哪些文件，可以使用命令

ls

显示文件夹中文件的文件名。

### \[[编辑](/index.php?title=ADSL%EF%BC%88PPPOE%EF%BC%89%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97&action=edit&section=3 "编辑段落: 如何设置动态域名(可选)")\] 如何设置动态域名(可选)

#首先去 http://www.3322.org 申请一个动态域名
#然后修改 /etc/ppp/ip-up 增加拨号时更新域名指令
sudo gedit /etc/ppp/ip-up
#在最后增加如下行
w3m -no-cookie -dump 'http://username:password@members.3322.org/dyndns/update?system=dyndns&hostname=yourdns.3322.org'

将username:password按格式替换为你的用户名和密码 hostname替换为你的域名，其他不必更改。以上设置将在拨号时自动将动态域名解析挂载好。