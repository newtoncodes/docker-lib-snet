# Docker snet

**Openvpn client to put in a docker overlay network.**

This is a very simple application that uses **socat** to completely redirect traffic
from **openvpn** to the overlay network and the other way around.

## Use case

You have a docker swarm, the mysql is in there.
You want to access the mysql server from your PC, but you don't want to publish the port, because it's completely insecure.

Run **snet** on one of the nodes, add password-less openvpn configs in the volume directory.
Restart **snet** and you have your ports exposed to the vpn.

## Usage

Volume path:
```bash
/etc/snet
```

Only one environment variable is accepted:
```bash
PORTS=3306:mysql:3306 3307:mysql2:3306 3308:mysql2:3306
```

The format is:
```bash
${PUBLISHED_PORT_TO_VPN}:${SERVICE_HOST}:${SERVICE_PORT}
```