---
title: Tor与Privoxy安装设置指南 出自Ubuntu中文
tags: []
id: '15'
categories:
  - - IT技术
date: 2010-04-10 17:30:28
---

# Tor与Privoxy安装设置指南

### 出自Ubuntu中文

Option one: Tor on Debian lenny, Debian sid, or Debian testing <#debian> If you're using Debian stable (lenny), unstable (sid), or testing (squeeze), just run apt-get install tor tor-geoipdb Note that this might not always give you the latest stable Tor version, but you will receive important security fixes. To make sure that you're running the latest stable version of Tor, see option two below. Now Tor is installed and running. Move on to step two <../docs/tor-doc-unix.html.en#polipo> of the "Tor on Linux/Unix" instructions.

* * *

   Option two: Tor on Ubuntu or Debian <#ubuntu>

*   Do not use the packages in Ubuntu's universe.\* They are unmaintained

and out of date. That means you'll be missing stability and security fixes. You'll need to set up our package repository before you can fetch Tor. First, you need to figure out the name of your distribution. If you're using Ubuntu 9.04, it's "jaunty". Ubuntu 8.10 is "intrepid", and Ubuntu 8.04 is "hardy". If you're using Debian Etch, it's "etch", Debian Lenny is "lenny". Then add this line to your /etc/apt/sources.list file: deb [http://deb.torproject.org/torproject.org](http://deb.torproject.org/torproject.org "http://deb.torproject.org/torproject.org") <DISTRIBUTION> main where you substitute the above word (etch, lenny, sid, jaunty, intrepid, hardy) in place of <DISTRIBUTION>. We don't currently have Ubuntu 9.10 (Karmic Koala) packages, but the packages for Debian sid work. Instead of putting "karmic" in your sources.list line, use "sid". Then run gpg --keyserver keys.gnupg.net --recv 886DDD89 gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 sudo apt-key add - apt-get update apt-get install tor tor-geoipdb Now Tor is installed and running. Move on to step two <../docs/tor-doc-unix.html.en#polipo> of the "Tor on Linux/Unix" instructions. The DNS name deb.torproject.org is actually a set of independent servers in a DNS round robin configuration. If you for some reason cannot access it you might try to use the name of one of its part instead. Try deb-master.torproject.org, mirror.netcologne.de or tor.mirror.youam.de.

* * *

   Option three: Using the development branch of Tor on Debian or
   Ubuntu <#development>

If you want to use the development branch <../download.html.en#packagediff> of Tor instead (more features and more bugs), you need to add a different set of lines to your /etc/apt/sources.list file: deb [http://deb.torproject.org/torproject.org](http://deb.torproject.org/torproject.org "http://deb.torproject.org/torproject.org") <DISTRIBUTION> main deb [http://deb.torproject.org/torproject.org](http://deb.torproject.org/torproject.org "http://deb.torproject.org/torproject.org") experimental-<DISTRIBUTION> main where you substitute the name of your distro (etch, lenny, sid, jaunty, intrepid, hardy) in place of <DISTRIBUTION>. Then run gpg --keyserver keys.gnupg.net --recv 886DDD89 gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 sudo apt-key add - apt-get update apt-get install tor tor-geoipdb Now Tor is installed and running. Move on to step two <../docs/tor-doc-unix.html.en#polipo> of the "Tor on Linux/Unix" instructions.

* * *

   Building from source <#source>

If you want to build your own debs from source you must first add an appropriate deb-src line to sources.list. deb-src [http://deb.torproject.org/torproject.org](http://deb.torproject.org/torproject.org "http://deb.torproject.org/torproject.org") <DISTRIBUTION> main deb-src [http://deb.torproject.org/torproject.org](http://deb.torproject.org/torproject.org "http://deb.torproject.org/torproject.org") <DISTRIBUTION> main deb-src [http://deb.torproject.org/torproject.org](http://deb.torproject.org/torproject.org "http://deb.torproject.org/torproject.org") experimental-<DISTRIBUTION> main You also need to install the necessary packages to build your own debs and the packages needed to build Tor: apt-get install build-essential fakeroot devscripts apt-get build-dep tor Then you can build Tor in ~/debian-packages: mkdir ~/debian-packages; cd ~/debian-packages apt-get source tor cd tor-\* debuild -rfakeroot -uc -us cd .. Now you can install the new package: sudo dpkg -i tor\_\*.deb Now Tor is installed and running. Move on to step two <../docs/tor-doc-unix.html.en#polipo> of the "Tor on Linux/Unix" instructions.

* * *

If you have suggestions for improving this document, please send them to us <../contact.html.en>. Thanks!