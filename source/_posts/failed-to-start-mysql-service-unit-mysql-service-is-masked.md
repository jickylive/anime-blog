---
title: 'Failed to start mysql.service: Unit mysql.service is masked.'
tags:
- MySQL
- systemd
- Linux
id: '132'
categories:
  - - IT技术
date: 2016-03-06 12:56:44
---

If you encounter the error "Failed to start mysql.service: Unit mysql.service is masked.", you can try the following steps to fix it.

This typically happens when `mysql.service` is linked to `/dev/null`.

1.  **Remove old database setup:**
    ```bash
    rm -r /var/lib/mysql*
    ```

2.  **Install a new database system:**
    ```bash
    mysql_install_db -u mysql
    ```

3.  **Unmask the service:**
    This will re-enable the service for systemd.
    ```bash
    systemctl unmask mysql.service
    ```

4.  **Start the service:**
    ```bash
    service mysql start
    ```
