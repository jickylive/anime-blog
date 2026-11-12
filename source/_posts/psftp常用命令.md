---
title: PSFTP常用命令
tags: []
id: '61'
categories:
  - - IT技术
date: 2013-08-17 18:57:02
---

### 启动PSFTP

?

在Windows命令提示符中输入

set PATH=C:PSFTP.exe所在路径;%PATH%

之后，用psftp登录服务器

psftp username@server.example.com

也可以直接双击运行psftp.exe，命令提示符中出现以下信息

psftp: no hostname specified; use "open host.name" to connect

psftp>

这时用open命令登录服务器

open username@server.example.com

编辑本段

PSFTP

?

### 2.1 文件名中有空格时使用双引号

如"space name.txt"

### 2.2 使用通配符

\* 代替任何字串

? 替代一个字母

\[abc\] 在a b c范围内替代一个字母

\[a-z\] 在a到z范围内替代一个字母

\[^abc\] 替代一个字母，不包括a b cmatches a single character that is not a, b, or c.

\[-a\] 代表连接号（-）

\[a^\] 代表脱字符号（^）

放在上面的所有通配符之前，以取消其（通配符）涵义

（文件夹名称不支持通配符）

### 2.3 open, quit, close, help命令

从名字就可以知道它们的作用了。其中quit是关闭PSFTP（bey和exit与quit相同），close是切断连接但不关闭PSFTP。

### 2.4 cd, pwd, lcd, lpwd命令

你已经知道cd和pwd是干什么的了，它们在远程服务器上工作。lcd和lpwd是在cd和pwd前加了Local，就是本地机器的改变路径和显示路径。也可以用!cd, !pwd来实现lcd, lpwd。

### 2.5 get, put命令

拿和放，象形命令:)，代表下载和上传。

get something.txt

get something.txt another.txt

上面的代码第一行代表下载something.txt，第二行代表下载something.txt，并重命名为another.txt。上传以此类推

put something.txt

put something.txt another.txt

如果是下载上传文件夹，加上那个递归符号 -r

get -r mydir newname

put -r mydir newname

可以直接输入文件或文件夹的绝对路径下载上传，就不用老打cd, lcd命令了。

### 2.6 mget, mput, reget，reput命令

可以理解为Multiple get, Multiple put，用来一次下载或上传多个文件和文件夹。除了不可以重命名文件或文件夹，其它参数和get, put一样。

re是resume的简写，那么它们就是续传命令了。

### 2.7 dir, del, mkdir rmdir命令

dir就是ls；del是rm，但不可以删除文件夹；mkdir还是原来的意思（建立文件夹）；rmdir是删除文件夹（某些服务器不允许删除非空文件夹，得现删除其中的文件才行）。

### 2.8 chmod命令

其参数u, g, o, a, +, -, r, w, x涵义分别是:

u (the owning user)文档所有者

g (members of the owning group)组成员

o (everybody else - 'others')其它所有人

a ('all', everyone)所有人

\+ 加上（授予）

\- 减去（剥夺）

r (permission to read the file)读

w (permission to write to the file)写

x (permission to execute the file）运行

chmod go-rwx,u+w privatefile

上面代码的涵义是剥夺组成员及其它任何人的读写运行权限，授予文件所有者写权限也（也就是私人文档）

chmod a+r public\*

上面代码的涵义授予所有人读权限（也就是公开公开公开）

直接用权限数字代码也可以

chmod 640 groupfile1 groupfile2

### 2.9 mv命令

如果使用mv是更改文件或文件夹名称，也可以使用ren, rename命令

### 2.10 !命令

在上面的命令前加上叹号!，则在本地机器操作。