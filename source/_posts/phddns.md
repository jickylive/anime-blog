---
title: phddns
tags: []
id: '109'
categories:
  - - IT技术
date: 2016-02-16 21:53:50
---

花生壳?for?linux的使用   在终端下运行：   phddns   会出现如下一系列的提示问题：   第一步：Enter?server?address(press?ENTER?use?phddns60.oray.net):   这是提示您输入花生壳服务器的域名，如果网站上没有更新域名的公告说明，这一步直接回车即可，会使用默认的?phddns60.oray.net?域名。   第二步：Enter?your?Oray?account:   这是提示您输入在花生壳网站注册的用户名，请根据实际情况输入。   第三步：Password：   这是提示您输入在花生壳网站注册的用户名所对应的密码，请根据实际情况输入。   第四步：Network?interface(s): \[eth0\]?=?\[IP:192.168.33.195\] \[lo\]?=?\[IP:127.0.0.1\] Choose?one(default?eth0):   这是要配置您这台服务器的网络参数，花生壳软件会自动检查，并输出您的网络情况。eth0部分可能和上面的不一样，是您的实际网络设置。   如果您有两块网卡，eth0?和eth1?,而您希望用eth1来绑定花生壳，请在这里输入?eth1?，然后回车。如果您只有一块网卡，或者您希望使用?eth0来绑定花生壳，在这里直接回车即可。     第五步：Log?to?use(default?/var/log/phddns.log):   这是提示您输入花生壳软件日志的保存位置，请使用绝对路径指定日志文件名。如果直接回车，会使用?/var/log/phddns.log?来保存日志。   第六步：?Save?to?configuration?file?(/etc/phlinux.conf)?(yes/no/other):   这是提示您输入上述配置的保存文件名。 如果输入yes?或直接回车，将会使用/etc/phlinux.conf?来作为配置的保存文件名。 如果输入other?，将会提示您自行指定文件名，请使用绝对路径来指定这个配置文件名。 如果输入no?,不对上述配置进行保存,下次重新使用花生壳时,需要手动指定配置文件或再次通过交互模式进行设置.   第六步执行完毕后，屏幕上会依次出现：   defOnStatusChanged?ok DomainsRegistered UserType   这就表示花生壳软件注册并运行成功。     通过在/etc/rc.local?添加   /usr/bin/phddns?-c?/etc/phlinux.conf?-d   可实现开机自动运行   其中： -c?所指定的是配置文件,如不是按默认设置,需要按实际填写 -d?以守护进行运行   你可以使用?ps?-ef??grep?phddns?来查看是否有花生壳软件的相关进程。   第一次安装配置完毕后，以后需要修改相关配置，可以自己自行编辑配置文件，然后终止相关进程，利用   /usr/bin/phddns?-c?/etc/phlinux.conf?-d   再次启动，就可以按修改后的配置文件内容运行。