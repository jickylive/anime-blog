---
title: 'Failed to start mysql.service: Unit mysql.service is masked.'
tags: []
id: '132'
categories:
  - - IT技术
date: 2016-03-06 12:56:44
---

rm -r /var/lib/mysql\* # Remove any old database setup mysql\_install\_db -u mysql # Install new database systemctl unmask mysql.service # Emables the service for systemd service mysql start # start the service.