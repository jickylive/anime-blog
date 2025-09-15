---
title: DD-WRT PPTP Client Setup
tags:
- DD-WRT
- PPTP
- VPN
- Router
id: '83'
categories:
  - IT技术
date: 2015-03-19 20:21:41
---

_Last updated by Shayne on September 01, 2013 10:12_

> For pre-configured VPNSecure DD-WRT or Tomato based routers, please purchase a router from [Flashrouters.com](http://flashrouters.com/).

### Prerequisites

- Ensure you have internet access through the DD-WRT router.
- In this example, do **not** connect the DD-WRT WAN (Internet) port.
- Connect an ethernet cable to any of the switch ports on your DD-WRT router.
- Set up a static IP on your computer, using the DD-WRT router as your gateway.

### Basic Setup

1.  Browse to the router’s configuration page and click the **Setup** button in the top menu.
2.  Ensure the following settings are correct for your network:
    - **Local IP Address**
    - **Subnet Mask**
    - **Gateway** (should be the IP address of your existing router)
    - **Local DNS**
3.  Avoid running more than one DHCP server on your network. Choose one:
    - **Option 1:** Disable DHCP on your existing router if you want all devices to use the VPN.
    - **Option 2:** Disable DHCP on the DD-WRT if only certain devices should use the VPN (set static gateway IP on those devices to the DD-WRT router).

### PPTP Client Configuration

1.  Click the **Services** tab, then select **VPN** from the submenu.
2.  Enable **PPTP Client Options**.
3.  Obtain the server address from the [VPNSecure Members area](http://www.vpnsecure.me/members).
    Example: To connect to a USA server, use `pptp-us1.vpnsecure.me`.

#### PPTP Client Settings

| Field | Value |
| :--- | :--- |
| Server IP or DNS Name | `pptp-us1.vpnsecure.me` |
| Remote Subnet | `10.168.0.0` |
| Remote Subnet Mask | `255.255.255.0` |
| MPPE Encryption | `mppe required,no40,no56,stateless` |
| MTU | `1450` |
| MRU | `1450` |
| NAT | Enable |
| User Name / Password | Your VPNSecure credentials |

4.  Click **Save** then **Apply Settings**.

### Startup Script

1.  Go to the **Administration** tab, then **Commands**.
2.  Copy and paste the following script into the Commands Box:

```sh
#!/bin/sh

cat <<'EOF' > /tmp/vpnsecure.sh
#!/bin/sh
/tmp/pptpd_client/vpn stop
cat /tmp/pptpd_client/options.vpn | sed -e 's/lcp-echo-failure 3/lcp-echo-failure 0/g' > /tmp/options.new
rm -Rf /tmp/pptpd_client/options.vpn
mv /tmp/options.new /tmp/pptpd_client/options.vpn
/tmp/pptpd_client/vpn start
echo "`date`" > /tmp/vpnsecureStatus.txt
echo "`nvram get lan_gateway`" >> /tmp/vpnsecureStatus.txt
echo "`nvram get pptpd_client_srvip`" >> /tmp/vpnsecureStatus.txt
echo "`ifconfig`" >> /tmp/vpnsecureStatus.txt
echo "`route -n`" >> /tmp/vpnsecureStatus.txt
echo "Waiting for VPN UP" >> /tmp/vpnsecureStatus.txt
vpnGatewayTmp=`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1`
while [ ${#vpnGatewayTmp} -eq "0" ]; do
  vpnGatewayTmp=`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1`
  sleep 10
done;
echo "VPN UP" >> /tmp/vpnsecureStatus.txt
sleep 10
routeViaLan=$(nvram get pptpd_client_srvip)
lanGateway=`ip route show to 0/0 | cut -d ' ' -f3`
vpnGateway=`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1`
ip route add $routeViaLan/32 via $lanGateway
ip route add 0.0.0.0/1 via $vpnGateway
ip route add 128.0.0.0/1 via $vpnGateway
iptables -t nat -I POSTROUTING -o ppp0 -j MASQUERADE
echo "Monitoring VPN Connection" >> /tmp/vpnsecureStatus.txt
vpnGatewayTmp=`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1`
while [ ${#vpnGatewayTmp} -gt 0 ]; do
  vpnGatewayTmp=`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1`
  sleep 10
done;
echo "VPN failed" >> /tmp/vpnsecureStatus.txt
/tmp/pptpd_client/vpn stop
/sbin/route del -net 0.0.0.0/1 gw $vpnGateway
/sbin/route del -net 128.0.0.0/1 gw $vpnGateway
iptables -t nat -D POSTROUTING -o ppp0 -j MASQUERADE
/tmp/vpnsecure.sh &
EOF

chmod +x /tmp/vpnsecure.sh
/tmp/vpnsecure.sh &
```

3.  Click **Save Startup**.

4.  Reboot your router.

### Final Steps

-   After reboot, the router should connect to the VPNSecure PPTP Network.
-   Depending on your DHCP setup, you may need to set your computer's default gateway to the DD-WRT router.

For more details, see: [DD-WRT PPTP Client Setup](http://support.vpnsecure.me/articles/getting-started-dd-wrt-routers/dd-wrt-pptp-client-setup)