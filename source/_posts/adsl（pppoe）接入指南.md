---
title: ADSL（PPPOE）接入指南
tags:
- ADSL
- PPPOE
- Ubuntu
- Linux
- Network
id: '12'
categories:
  - - IT技术
date: 2010-04-10 02:06:18
---

> 出自 Ubuntu 中文

Ubuntu Linux 自带 ADSL 拨号网络（PPPOE 调制解调器）支持，但没有 Windows 下拨号那么方便。其实 Ubuntu 下 ADSL 上网也并不难，目前在中国 ADSL 家庭用户居多，下面介绍 Ubuntu 下 ADSL（PPPOE）拨号的方法。

## 配置 ADSL

Ubuntu 8.10 已自带网络配置向导，可通过顶部菜单进入 `系统 -> 首选项 -> Network Configuration -> DSL` 进行设置，依次填写用户名、服务及密码即可。

Ubuntu 9.10 的 Network Management 存在 bug，可能无法正常使用 ADSL。此时需更新 Network Management，或使用 `pppoeconf` 拨号。

### 方法一：使用 pppoeconf 命令拨号

1. 启用有线连接：
   ```bash
   sudo ifconfig eth0 up
   ```
2. 运行 pppoeconf：
   ```bash
   sudo pppoeconf
   ```
   按照提示完成以下步骤：
   - 确认以太网卡已被检测到。
   - 输入 ISP 提供的用户名（注意先清除输入框中的“username”）。
   - 输入 ISP 提供的密码。
   - 若已配置 PPPoE 连接，会提示将被修改。
   - 选择 `noauth` 和 `defaultroute`，去掉 `nodetach`，选择 "Yes"。
   - Use peer DNS - 选择 "Yes"。
   - Limited MSS problem - 选择 "Yes"。
   - 是否开机自动连接 - 可选 "Yes"。
   - 是否立即建立连接 - 按需选择。

3. 启动 ADSL 连接：
   ```bash
   sudo pon dsl-provider
   ```
4. 断开 ADSL 连接：
   ```bash
   sudo poff
   ```
5. 查看日志：
   ```bash
   plog
   ```
6. 查看接口信息：
   ```bash
   ifconfig ppp0
   ```

**Network Manager 显示设备未托管的解决办法：**

- 编辑配置文件：
  ```bash
  sudo gedit /etc/NetworkManager/nm-system-settings.conf
  ```
  将 `[ifupdown] managed=false` 改为 `[ifupdown] managed=true`。

- 编辑网络接口文件，仅保留：
  ```
  auto lo
  iface lo inet loopback
  ```

- 删除 DNS 设置：
  ```bash
  sudo mv /etc/resolv.conf /etc/resolv.conf_backup
  ```

- 重启 network-manager 服务：
  ```bash
  sudo service network-manager restart
  ```

### 方法二：使用新版 NetworkManager

参考 lainme 的回复：[论坛链接](http://forum.ubuntu.org.cn/viewtopic.php?f=48&t=239763&start=3)

1. 从 PPA 更新 network-manager：
   ```bash
   sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys BC8EBFE8
   ```
   在 `/etc/apt/sources.list` 末尾添加：
   ```
   deb http://ppa.launchpad.net/network-manager/trunk/ubuntu karmic main
   deb-src http://ppa.launchpad.net/network-manager/trunk/ubuntu karmic main
   ```
   然后执行：
   ```bash
   sudo aptitude update
   sudo aptitude safe-upgrade
   ```

2. 解决 pppoeconf 和 network-manager 冲突：
   - 修改 `/etc/NetworkManager/nm-system-settings.conf`，将 `managed=true`。
   - 修改 `/etc/network/interfaces`，仅保留：
     ```
     auto lo
     iface lo inet loopback
     ```
   - 删除 `/etc/resolv.conf`。
   - 重启 network-manager：
     ```bash
     sudo /etc/init.d/network-manager restart
     ```
   - 若无 nm 图标，按 `ALT+F2` 输入 `nm-applet`，并添加自启动。

3. 右击 NM 图标，编辑连接，切换到 DSL，新建，输入用户名和密码。

## ADSL 命令

_注意：以下命令为日常操作，不是设置步骤。_

- 拨号 ADSL：
  ```bash
  pon dsl-provider
  ```
- 断开 ADSL：
  ```bash
  poff dsl-provider
  ```
- 查看拨号日志：
  ```bash
  plog
  ```

可在菜单编辑器或面板中为上述命令创建快捷方式，方便拨号。方法如下：

- 右击面板，选择“添加到面板” -> “自定义应用程序启动器” -> 添加
  - 类型：终端中的应用程序
  - 名称：ADSL 拨号
  - 命令：pon dsl-provider
  - 注释：ADSL 拨号

断开网络快捷方式同理，将 `pon` 改为 `poff`。

如需更改拨号名称，可将 `dsl-provider` 改为自定义名称：

```bash
cd /etc/ppp/peers
mv dsl-provider name
```
若不确定 `/etc/ppp/peers` 中有哪些文件，可用：
```bash
ls
```

## 如何设置动态域名（可选）

1. 访问 [http://www.3322.org](http://www.3322.org) 申请动态域名。
2. 修改 `/etc/ppp/ip-up`，增加拨号时更新域名指令：
   ```bash
   sudo gedit /etc/ppp/ip-up
   ```
   在文件末尾添加：
   ```bash
   w3m -no-cookie -dump 'http://username:password@members.3322.org/dyndns/update?system=dyndns&hostname=yourdns.3322.org'
   ```
   将 `username:password` 替换为你的用户名和密码，`hostname` 替换为你的域名。这样设置后，拨号时会自动更新动态域名解析。
