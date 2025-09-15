---
title: DD-WRT PPTP Client Setup
tags: []
id: '83'
categories:
  - IT技术
date: 2015-03-19 20:21:41
---

## DD-WRT PPTP Client Setup

_Last updated by Shayne on September 01, 2013 10:12_

> For pre-configured VPNSecure DD-WRT or Tomato based routers, please purchase a router from [Flashrouters.com](http://flashrouters.com/).

### Prerequisites

- Ensure you have internet access through the DD-WRT router.
- In this example, do **not** connect the DD-WRT WAN (Internet) port.
- Connect an ethernet cable to any of the switch ports on your DD-WRT router.
- Set up a static IP on your computer, using the DD-WRT router as your gateway.

### Basic Setup

1. Browse to the router’s configuration page and click the **Setup** button in the top menu.
2. Ensure the following settings are correct for your network:
    - **Local IP Address**
    - **Subnet Mask**
    - **Gateway** (should be the IP address of your existing router)
    - **Local DNS**
3. Avoid running more than one DHCP server on your network. Choose one:
    - **Option 1:** Disable DHCP on your existing router if you want all devices to use the VPN.
    - **Option 2:** Disable DHCP on the DD-WRT if only certain devices should use the VPN (set static gateway IP on those devices to the DD-WRT router).

### PPTP Client Configuration

1. Click the **Services** tab, then select **VPN** from the submenu.
2. Enable **PPTP Client Options**.
3. Obtain the server address from the [VPNSecure Members area](http://www.vpnsecure.me/members).  
   Example: To connect to a USA server, use `pptp-us1.vpnsecure.me`.

#### PPTP Client Settings

| Field                     | Value                                 |
|---------------------------|---------------------------------------|
| Server IP or DNS Name     | `pptp-us1.vpnsecure.me`               |
| Remote Subnet             | `10.168.0.0`                          |
| Remote Subnet Mask        | `255.255.255.0`                       |
| MPPE Encryption           | `mppe required,no40,no56,stateless`   |
| MTU                       | `1450`                                |
| MRU                       | `1450`                                |
| NAT                       | Enable                                |
| User Name / Password      | Your VPNSecure credentials            |

4. Click **Save** then **Apply Settings**.

### Startup Script

1. Go to the **Administration** tab, then **Commands**.
2. Copy and paste the following commands into the Commands Box:

    ```sh
    echo "#!/bin/sh" > /tmp/vpnsecure.sh;
    echo "/tmp/pptpd_client/vpn stop" >> /tmp/vpnsecure.sh;
    echo "cat /tmp/pptpd_client/options.vpn | sed -e 's/lcp-echo-failure 3/lcp-echo-failure 0/g' > /tmp/options.new" >> /tmp/vpnsecure.sh;
    echo "rm -Rf /tmp/pptpd_client/options.vpn" >> /tmp/vpnsecure.sh;
    echo "mv /tmp/options.new /tmp/pptpd_client/options.vpn" >> /tmp/vpnsecure.sh;
    echo "/tmp/pptpd_client/vpn start" >> /tmp/vpnsecure.sh;
    echo "echo \`date\` > /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "echo \`nvram get lan_gateway\` >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "echo \`nvram get pptpd_client_srvip\` >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "echo \`ifconfig\` >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "echo \`route -n\` >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "echo \"Waiting for VPN UP\" >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "vpnGatewayTmp=\`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1\`" >> /tmp/vpnsecure.sh;
    echo "while [ \${#vpnGatewayTmp} -eq \"0\" ]; do" >> /tmp/vpnsecure.sh;
    echo "  vpnGatewayTmp=\`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1\`" >> /tmp/vpnsecure.sh;
    echo "  sleep 10" >> /tmp/vpnsecure.sh;
    echo "done;" >> /tmp/vpnsecure.sh;
    echo "echo \"VPN UP\" >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "sleep 10" >> /tmp/vpnsecure.sh;
    echo "routeViaLan=\$(nvram get pptpd_client_srvip)" >> /tmp/vpnsecure.sh;
    echo "lanGateway=\`ip route show to 0/0 | cut -d ' ' -f3\`" >> /tmp/vpnsecure.sh;
    echo "vpnGateway=\`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1\`" >> /tmp/vpnsecure.sh;
    echo "ip route add \$routeViaLan/32 via \$lanGateway" >> /tmp/vpnsecure.sh;
    echo "ip route add 0.0.0.0/1 via \$vpnGateway" >> /tmp/vpnsecure.sh;
    echo "ip route add 128.0.0.0/1 via \$vpnGateway" >> /tmp/vpnsecure.sh;
    echo "iptables -t nat -I POSTROUTING -o ppp0 -j MASQUERADE" >> /tmp/vpnsecure.sh;
    echo "echo \"Monitoring VPN Connection\" >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "vpnGatewayTmp=\`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1\`" >> /tmp/vpnsecure.sh;
    echo "while [ \${#vpnGatewayTmp} -gt 0 ]; do" >> /tmp/vpnsecure.sh;
    echo "  vpnGatewayTmp=\`ip addr sh dev ppp0 | grep peer | cut -d ' ' -f8 | cut -d '/' -f1\`" >> /tmp/vpnsecure.sh;
    echo "  sleep 10" >> /tmp/vpnsecure.sh;
    echo "done;" >> /tmp/vpnsecure.sh;
    echo "echo \"VPN failed\" >> /tmp/vpnsecureStatus.txt" >> /tmp/vpnsecure.sh;
    echo "/tmp/pptpd_client/vpn stop" >> /tmp/vpnsecure.sh;
    echo "/sbin/route del -net 0.0.0.0/1 gw \$vpnGateway" >> /tmp/vpnsecure.sh;
    echo "/sbin/route del -net 128.0.0.0/1 gw \$vpnGateway" >> /tmp/vpnsecure.sh;
    echo "iptables -t nat -D POSTROUTING -o ppp0 -j MASQUERADE" >> /tmp/vpnsecure.sh;
    echo "/tmp/vpnsecure.sh &" >> /tmp/vpnsecure.sh;
    chmod +x /tmp/vpnsecure.sh; /tmp/vpnsecure.sh &
    ```

3. Click **Save Startup**.

4. Reboot your router.

### Final Steps

- After reboot, the router should connect to the VPNSecure PPTP Network.
- Depending on your DHCP setup, you may need to set your computer's default gateway to the DD-WRT router.

For more details, see: [DD-WRT PPTP Client Setup](http://support.vpnsecure.me/articles/getting-started-dd-wrt-routers/dd-wrt-pptp-client-setup)
