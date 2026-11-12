---
title: ubuntu8.04做PXE安装服务器
tags: []
id: '20'
categories:
  - - IT技术
date: 2010-07-15 23:25:39
---

首先安装需要的几个软件包 sudo apt-get install tftpd-hpa dhcp3-server portmap nfs-kernel-server 还有apache 安装完后tftpd服务自动启动，这个不用管，但是dhcpd出现错误，不知道怎么回事。不用管安，配置一下dhcp vi /etc/dhcp3/dhcp.conf subnet 192.168.1.0 netmask 255.255.255.0 { range 192.168.1.100 192.168.1.200; option domain-name-servers 202.102.128.68, 202.102.134.68; option domain-name "tm.net.my"; option routers 192.168.1.1; option broadcast-address 192.168.1.255; default-lease-time 600; max-lease-time 7200; filename "pxelinux.0"; } 现在启动dhcpd sudo /etc/init.d/dhcp3-server restart 然后再配置nfs(这是其它 linux用到的，ubuntu只有netboot方式) vi /etc/exports /mnt/iso 192.168.1.0/24(ro,sync) 其中/mnt/iso是我挂载光盘镜像的目录 启动nfs服务 sudo /etc/init.d/nfs-kernel-server restart ubuntu是要用http的 mkdir /var/www/ubuntu sudo mount -o loop ubuntu-8.04.1-alternate-i386.iso /var/www/ubuntu 在安装过程中会要求选择服务器，选最上面的手动输入，服务器填你的IP，目录就不用改了。这里你也可以同步官方服务器的这个目录，这样安装完成就不用再升级了 把光盘中的netboot目录中的所有都拷到/var/lib/tftpboot/中 sudo cp /mnt/iso/install/netboot/\* /var/lib/tftpboot/ 修改默认的配置文件 sudo vi /var/lib/tftpboot/pxelinux.cfg/default 把其中的 LABEL install kernel linux append vga=normal initrd=initrd.gz 改为 LABEL install kernel linux append vga=normal initrd=initrd.gz OK了，现在就可以从另一台电脑用PXE启动安装ubuntu了 但是有一点要注意，上面安装的portmap是不自动启动的，如果不启动这个，nfs传输就是慢得出奇，所以这个也是必须启动的 sudo /etc/init.d/portmap restart