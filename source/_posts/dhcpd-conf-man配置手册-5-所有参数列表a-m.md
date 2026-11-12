---
title: dhcpd.conf MAN配置手册-- 5 所有参数列表(A-M)
tags:
- dhcpd
- Linux
- Network
id: '21'
categories:
  - - IT技术
date: 2010-07-16 22:32:19
---

## always-broadcast语句

`always-broadcast flag;`

DHCP 和BOOTP 协议都需要DHCP和BOOTP客户端在BOOTP信息头的标志位设置广播标志，不幸的是，有些DHCP 和BOOTP客户不这样做，因此它们不会从DHCP服务器中获得回应。DHCP服务器可以通过relevant scope设置标志设置成总是广播它的回应到客户端，relevant scope可以在一个conditional语句中，作为一个类的参数，或者host的参数。为了避免网络中出现过多的广播包，推荐尽量限制使用这个选项。例如， Microsoft DHCP 客户端已知没有这个问题，OpenTransport和ISC DHCP 客户端也没有这个问题。

## always-reply-rfc1048 语句

`always-reply-rfc1048 flag;`

一些BOOTP 客户端需要FC1048格式的回应，但是发送请求时却不遵守RFC1048的规定。可以告诉有这个问题的客户端，如果它没有获得你为它配置的选项，同时如果在服务器的日志中找到对应于每一个BOOTREQUEST 的"(non-rfc1048)"，可以为这样的客户提供rfc1048 回应：在客户的host语句中设置这个选项，这样DHCP服务器就会为这个客户提供RFC-1048-style 的回应了。这个标志可以设置在任何地方，对它起作用的区域都产生影响。

## Authoritative语句

`authoritative;`
`not authoritative;`

对于一个指定的网段配置信息，DHCP 服务器通常不知道自己是否是合法和权威的。因此，如果一个天真的用户安装了DHCP服务器，也不知道如何配置它，它就不会为收到的DHCP请求发送假的 DHCPNAK信息。 网络管理员为他们的网络设置权威的DHCP服务器，需要在配置文件的顶层添加authoritative语句，来指示此 DHCP服务器应该回应 DHCPNAK信息。如果没有做这些，客户端在改变子网后就不能得到正确的IP地址，除非它们旧的租约已经到期，这可能需要相当长的时间。 通常，在配置文件的顶部标明authoritative应该是足够的，但是如果一个DHCP服务器知道它在一些子网中是权威的服务器，而在另一些子网中不是，它就需要在需要的网段声明自己是权威的。 注意，这个权威的概念更多的存在于物理网络中，不管是多子网环境还是单子网环境。指定一个服务器在某个多子网环境中的单个子网中是权威的而在别的子网中不是权威的是没有意义的。

## boot-unknown-clients语句

`boot-unknown-clients flag;`

如果有boot-unknown-clients语句并且值是false 或者 off，那么对于没有host 语句定义的客户端将不允许获得IP地址。如果这个语句不存在或者值为true 或on，没有用host语句定义的客户端将被允许获得IP地址。如同那些在池中没有被allow或者deny语句限制的地址一样。

## ddns-hostname语句

`ddns-hostname name;`

这个name 参数是hostname，它将被用来设置客户端的A和PTR记录。如果没有ddns-hostname 设定，服务器将会自动使用hostname代替，两种方法使用不同的算法更新。

## ddns-domainname 语句

`ddns-domainname name;`

这个name参数是域名，它添加到客户端hostname后面，形成一个完整有效的域名domain-name (FQDN)。

## ddns-rev-domainname语句

`ddns-rev-domainname name;`

这个name参数是域名，它会添加到客户端的反向IP地址（reversed IP address）中，在客户端的PTR记录中产生一个可用的名字。默认情况下，它是"in-addr.arpa."，但是这里可以修改默认值。 这个被添加的域名的客户端的反向IP地址，是由点“.”分隔的，例如，如果客户端得到的IP地址是10.17.92.74，那么反向IP地址就是 74.92.17.10，那么客户端的PTR记录就会是10.17.92.74.in-addr.arpa.（好像不对呀，应该是92.17.10.in -addr.arpa）

## ddns-update-style 参数

`ddns-update-style style;`

这个style参数必须是ad-hoc、interim或者什么也没有。ddns-update-style语句只在外部范围使用―― 它只在读入dhcpd.conf 文件时进行解释，而不是每次客户端获得地址时，因此不可能为不同的客户使用不同的DNS更新方法。

## ddns-updates语句

`ddns-updates flag;`

这个ddns-updates参数控制当一个租约确定后服务器是否尝试进行DNS更新。 设置成off在其范围内将不会尝试更新。默认这个值是on。在全部范围内禁止DNS 更新，使用ddns-update-style 语句，把值设置成none。

## default-lease-time语句

`default-lease-time time;`

Time是以秒为单位的租约时长，如果客户端没有要求特殊的延期的话。

## do-forward-updates语句

`do-forward-updates flag;`

do-forward-updates语句在客户端获得或更新租约时指示DHCP服务器是否尝试更新DHCP客户的A记录。这个语句在DNS更新有效并且 ddns-update-style设置为interim时才有用。默认些值是enable的。如果这个语句用于禁止Forward updates，DHCP服务器将会不再尝试更新客户端的A记录，如果客户端提供在PTR记录中使用的FQDN信息时，服务器将尝试更新客户端的PTR记录 。如果这个选项设为enabled，DHCP服务器将会信任client-updates 标志。

## dynamic-bootp-lease-cutoff 语句

`dynamic-bootp-lease-cutoff date;`

这个dynamic-bootp-lease-cutoff 语句设置所有动态分配的BOOTP客户端租约的结束时间。因为BOOTP客户端没有任何方法更新租约，而且不知道他们的租约会过期，默认情况下，dhcpd 分配给BOOTP客户无限的租约，然而，有时给BOOTP用户设置一个终止时间是有意义的。例如，学期结束时，或者到晚上设备关机时。日期应该是所有 BOOTP租约结束时，日期应该以下面的格式设定： W YYYY/MM/DD HH:MM:SS W 是表示星期几的数字，从0(星期日)到6 (星期六)， YYYY 是4位的年号， MM是月份，从1 到12，DD 是一月中的哪一天。从1开始。HH 是小时从0到23，MM是分钟，SS是秒，时间总是设定为Coordinated Universal Time (世界时UTC)，而不是本地时间。

## dynamic-bootp-lease-length 语句

`dynamic-bootp-lease-length length;`

这个dynamic-bootp-lease-length语句用来设置动态分配的BOOTP客户租约的时长。在某些站点，可能会假设如果在一段时间里如果BOOTP或者DHCP客户没有再次申请继续租用它的地址，就认为这个客户已经不使用这个地址了。这个时长设定使用秒为单位。如果使用BOOTP 的客户端重启时超过租约时间，租约将会重新设定为原来租约的长度，这样一个足够频繁启动的BOOTP客户总是不会丢失租约。不需说明，这个参数应该非常小心的设置。

## filename语句

`filename "filename";`

这个filename语句可以用来指定客户端启动要载入的初始启动文件，这个文件名应该是客户端能够识别的任何文件传送协议，可以用来传送那个文件。

## fixed-address声明语句

`fixed-address address [, address ... ];`

这个fixed-address声明语句用来给一个客户端分配一个或者多个固定地址。它只能出现在host语句中。如果提供了多个地址，当客户端启动时，它会被分配到相应子网中的那个地址。如果没有一个fixed-address对于那个子网是有效的，客户端就不匹配这个host语句。每一个 fixed-address 语句中都应该是IP地址或者是可以解析成IP地址的域名。

## get-lease-hostnames语句

`get-lease-hostnames flag;`

这个get-lease-hostnames 语句用来告诉dhcpd是否查找租约池中每一个IP地址对应的域名，并且使用这个地址作为hostname选项。如果设置为true，就对范围内所有地址进行查找。默认是false，不进行查找。

## hardware语句

`hardware hardware-type hardware-address;`

为了能够被识别BOOTP客户端，它的网络硬件地址必须在host语句中使用hardware子句声明。hardware-type必须是物理硬件接口类型，现在只可以识别ethernet和token-ring 类型，虽然支持fddi类型 (或者其它的)。硬件地址应该是一组16进制数(从0到ff) ，扩冒号分隔。hardware 语句也用于DHCP 客户端。

## lease-file-name语句

`lease-file-name name;`

这里的名字是DHCP服务器存放租约的文件名。默认是/var/lib/dhcp/dhcpd.leases。这个语句必须出现在配置文件的顶部，出现在其它位置无效。

## local-port语句

`local-port port;`

这个语句使DHCP 服务器在指定的UDP端口侦听DHCP 请求，而不一定是默认的67。

## log-facility语句

`log-facility facility;`

这个语句使DHCP服务器把它的所有日志记录到一个指定的日志设备上，一旦dhcpd.conf 文件被读入，默认DHCP服务器就到后台设备。可能的设备有auth， authpriv, cron, daemon, ftp, kern, lpr, mail, mark, news, ntp, security, syslog, user, uucp, local0到local7。这些设备并不是在所有系统中都可以使用，有些系统中可能还有其它可用的设备。 除了设定这个值，可能还需要修改 syslog.conf 文件来配置日志记录DHCP服务器的行为。例如，可能会需要增加这样一行： local7.debug /var/log/dhcpd.log 不同操作系统中syslog.conf 文件的语句可能有些不同，要查看syslog.conf manual手册来确定一下。为了让syslog 开始记录一个新文件，必须先用有权限的用户名建立一个新文件(通常是与/var/log/messages或者/usr/adm/messages文件拥有者或与之有相同权限的)，并且发送一个SIGHUP 信号给syslogd。有些系统支持通过脚本或者一个叫newsyslog或者logrotate的程序循环记录日志，你可以配置它们，以免日志文件大的不可控制。 因为日志机制由dhcpd.conf 控制，因此分析dhcpd.conf 文件的日志会记录在默认的日志设备上，为了避免它，参看本发行版的README文件，那里描述了如何改变默认的日志设备。当使用这个参数时，DHCP服务器在分析完配置文件后立即把它的信息写入指定设备，这样日志就尽量完整了。

## max-lease-time语句

`max-lease-time time;`

Time是以秒为单位的时间，用来分配的最长租约。例外的只有动态BOOTP租约长度，它不由客户端指定，也不由这个值限制。

## min-lease-time语句

`min-lease-time time;`

Time 是用于租约的以秒为单位的最短时间。

## min-secs语句

`min-secs seconds;`

Seconds是从客户端试图获得一个新的租约开始到DHCP服务器回应客户端请求时最小的秒数。这个秒数基于客户端的报告，客户端可以报告的最大值是255秒。通常设置它会导致DHCP服务器对客户端的第一次请求不做回应，但却对其第二次请求回应。 利用这个参数可以设置一个秒级DHCP服务器，通常他不对客户端分配地址，直到主服务器给它一个机会。如果主服务器死机，客户端就会绑定到这个次服务器上，但其它情况客户端都绑定在主服务器上。注意这个语句不能单独完成上面的功能，需要允许主、次服务器共享一个动态地址分配池。
