---
title: systemctl命令完全指南
tags: []
id: '131'
categories:
  - - IT技术
date: 2016-03-06 12:38:49
---

# systemctl命令完全指南

Systemctl 是一个 systemd 工具，主要负责控制 systemd 系统和服务管理器。Systemd 是一个系统管理守护进程、工具和库的集合，用于取代 System V 初始进程。Systemd 的功能是用于集中管理和配置类 UNIX 系统。在 Linux 生态系统中，Systemd 被部署到了大多数的标准 Linux 发行版中，只有为数不多的几个发行版尚未部署。Systemd 通常是所有其它守护进程的父进程，但并非总是如此。

![systemd 架构图](http://www.linuxdiyf.com/linux/uploads/allimg/150731/2-150I1095131a8.jpg)

## 使用 Systemctl 管理 Linux 服务

本文旨在阐明在运行 systemd 的系统上“如何控制系统和服务”。

---

## Systemd 初体验和 Systemctl 基础

### 1. 检查 systemd 是否安装及版本

```bash
systemd --version
```

输出示例：

```
systemd 215
+PAM +AUDIT +SELINUX +IMA +SYSVINIT +LIBCRYPTSETUP +GCRYPT +ACL +XZ -SECCOMP -APPARMOR
```

### 2. 检查 systemd 和 systemctl 的安装位置

```bash
whereis systemd
whereis systemctl
```

### 3. 检查 systemd 是否运行

```bash
ps -eaf | grep [s]ystemd
```

> 注意：systemd 作为父进程（PID=1）运行。

### 4. 分析 systemd 启动进程

```bash
systemd-analyze
```

### 5. 分析启动时各进程耗时

```bash
systemd-analyze blame
```

### 6. 分析启动时的关键链

```bash
systemd-analyze critical-chain
```

> 重要：Systemctl 接受服务（.service）、挂载点（.mount）、套接口（.socket）和设备（.device）作为单元。

---

## Systemctl 常用操作

### 7. 列出所有可用单元

```bash
systemctl list-unit-files
```

### 8. 列出所有运行中单元

```bash
systemctl list-units
```

### 9. 列出所有失败单元

```bash
systemctl --failed
```

### 10. 检查某单元是否启用

```bash
systemctl is-enabled crond.service
```

### 11. 检查服务是否运行

```bash
systemctl status firewalld.service
```

---

## 控制和管理服务

### 12. 列出所有服务

```bash
systemctl list-unit-files --type=service
```

### 13. 启动、重启、停止、重载服务及检查状态

```bash
systemctl start httpd.service
systemctl restart httpd.service
systemctl stop httpd.service
systemctl reload httpd.service
systemctl status httpd.service
```

> 注意：start、restart、stop、reload 命令无输出，status 命令有输出。

### 14. 启用/禁用服务（开机自启）

```bash
systemctl is-active httpd.service
systemctl enable httpd.service
systemctl disable httpd.service
```

### 15. 屏蔽/取消屏蔽服务

```bash
systemctl mask httpd.service
systemctl unmask httpd.service
```

### 16. 杀死服务

```bash
systemctl kill httpd
systemctl status httpd
```

---

## 控制和管理挂载点

### 17. 列出所有挂载点

```bash
systemctl list-unit-files --type=mount
```

### 18. 挂载、卸载、重载挂载点及检查状态

```bash
systemctl start tmp.mount
systemctl stop tmp.mount
systemctl restart tmp.mount
systemctl reload tmp.mount
systemctl status tmp.mount
```

### 19. 启用/禁用挂载点

```bash
systemctl is-active tmp.mount
systemctl enable tmp.mount
systemctl disable tmp.mount
```

### 20. 屏蔽/取消屏蔽挂载点

```bash
systemctl mask tmp.mount
systemctl unmask tmp.mount
```

---

## 控制和管理套接口

### 21. 列出所有套接口

```bash
systemctl list-unit-files --type=socket
```

### 22. 启动、重启、停止、重载套接口及检查状态

```bash
systemctl start cups.socket
systemctl restart cups.socket
systemctl stop cups.socket
systemctl reload cups.socket
systemctl status cups.socket
```

### 23. 启用/禁用套接口

```bash
systemctl is-active cups.socket
systemctl enable cups.socket
systemctl disable cups.socket
```

### 24. 屏蔽/取消屏蔽套接口

```bash
systemctl mask cups.socket
systemctl unmask cups.socket
```

---

## 服务的 CPU 利用率（分配额）

### 25. 获取服务 CPU 分配额

```bash
systemctl show -p CPUShares httpd.service
```

> 默认 CPU 分配份额为 1024。

### 26. 设置服务 CPU 分配份额

```bash
systemctl set-property httpd.service CPUShares=2000
systemctl show -p CPUShares httpd.service
```

> 设置后会生成 `/etc/systemd/system/httpd.service.d/90-CPUShares.conf` 文件。

### 27. 检查服务所有配置细节

```bash
systemctl show httpd
```

### 28. 分析服务关键链

```bash
systemd-analyze critical-chain httpd.service
```

### 29. 获取服务依赖列表

```bash
systemctl list-dependencies httpd.service
```

---

## 控制组相关

### 30. 按等级列出控制组

```bash
systemd-cgls
```

### 31. 按 CPU、内存、I/O 列出控制组

```bash
systemd-cgtop
```

---

## 控制系统运行等级

### 32. 启动系统救援模式

```bash
systemctl rescue
```

### 33. 进入紧急模式

```bash
systemctl emergency
```

### 34. 列出当前运行等级

```bash
systemctl get-default
```

### 35. 启动图形模式（运行等级5）

```bash
systemctl isolate runlevel5.target
# 或
systemctl isolate graphical.target
```

### 36. 启动多用户模式（运行等级3）

```bash
systemctl isolate runlevel3.target
# 或
systemctl isolate multi-user.target
```

### 37. 设置默认运行等级

```bash
systemctl set-default runlevel3.target
systemctl set-default runlevel5.target
```

### 38. 重启、停止、挂起、休眠系统

```bash
systemctl reboot
systemctl halt
systemctl suspend
systemctl hibernate
systemctl hybrid-sleep
```

---

## 运行等级说明

- Runlevel 0 : 关闭系统
- Runlevel 1 : 救援/维护模式
- Runlevel 3 : 多用户，无图形系统
- Runlevel 4 : 多用户，无图形系统
- Runlevel 5 : 多用户，图形化系统
- Runlevel 6 : 关闭并重启机器

---

## 参考链接

- [教大家几个基本 systemctl 的用法](http://www.linuxdiyf.com/linux/11642.html)
- [CentOS 7 上 systemctl 的用法](http://www.linuxdiyf.com/linux/3800.html)
- [在 CentOS 7 上利用 systemctl 添加自定义系统服务](http://www.linuxdiyf.com/linux/1075.html)

via: <http://www.linuxdiyf.com/linux/13088.html>