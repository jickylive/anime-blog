---
title: onekey
date: 2025-09-14 16:04:46
tags:
---
# 一键部署

Hexo 提供快速、简便的部署策略。您只需一条命令即可将网站部署到服务器上：

```bash
hexo deploy
```

请确保已安装与服务器/存储库兼容的部署插件。

部署通常通过 `_config.yml` 进行配置，必须包含 `type` 字段。例如：

```yaml
deploy:
    type: git
```

您可同时使用多个 deployer，Hexo 会依照顺序执行每个 deployer：

```yaml
deploy:
    - type: git
        repo:
    - type: heroku
        repo:
```

更多部署插件请参考 [插件列表](https://hexo.io/plugins/)。

---

## 常用部署方式

### Git

1. 安装 `hexo-deployer-git`：

        ```bash
        npm install hexo-deployer-git --save
        ```

2. 编辑 `_config.yml`（示例）：

        ```yaml
        deploy:
            type: git
            repo: <repository url> # 例如：https://bitbucket.org/JohnSmith/johnsmith.bitbucket.io
            branch: [branch]
            message: [message]
        ```

        | 选项    | 描述                       | 默认值                                      |
        | ------- | -------------------------- | ------------------------------------------- |
        | repo    | 目标存储库的 URL           |                                             |
        | branch  | 分支名称                   | gh-pages (GitHub)、coding-pages (Coding.net)、master (其他) |
        | message | 自定义提交信息             | Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }} |
        | token   | 用于认证 repo 的令牌（可选）| 使用 `$` 前缀从环境变量读取                 |

- 若需自定义域名，请将 `CNAME` 文件放在 `source` 目录下。
- 除非使用令牌或 SSH 密钥认证，否则会提示输入用户名和密码。
- `hexo-deployer-git` 不会存储你的认证信息，可用 `git-credential-cache` 临时保存。
- 请在仓库设置中将默认分支设置为 `_config.yml` 配置的分支名称。

---

### Heroku

1. 安装 `hexo-deployer-heroku`：

        ```bash
        npm install hexo-deployer-heroku --save
        ```

2. 修改配置：

        ```yaml
        deploy:
            type: heroku
            repo: <repository url>
            message: [message]
        ```

        | 选项    | 描述                  |
        | ------- | --------------------- |
        | repo    | Heroku 仓库地址       |
        | message | 自定义提交信息        |

---

### Netlify

Netlify 提供持续部署、全球 CDN、DNS、HTTPS 等功能。

- **网页端部署**：通过 Netlify 网站新建项目，关联 GitHub/BitBucket/Gitlab 仓库，按提示操作。
- **CLI 部署**：使用 Netlify CLI 管理和部署站点。
- **一键部署按钮**：可在项目 README 增加“部署至 Netlify”按钮，方便他人一键部署。

---

### Rsync

1. 安装 `hexo-deployer-rsync`：

        ```bash
        npm install hexo-deployer-rsync --save
        ```

2. 修改配置：

        ```yaml
        deploy:
            type: rsync
            host: <host>
            user: <user>
            root: <root>
            port: [port]
            delete: [true|false]
            verbose: [true|false]
            ignore_errors: [true|false]
        ```

        | 选项         | 描述               | 默认值  |
        | ------------ | ------------------ | ------- |
        | host         | 远程主机地址       |         |
        | user         | 用户名             |         |
        | root         | 远程根目录         |         |
        | port         | 端口               | 22      |
        | delete       | 删除旧文件         | true    |
        | verbose      | 显示调试信息       | true    |
        | ignore_errors| 忽略错误           | false   |

---

### OpenShift

> `hexo-deployer-openshift` 已于 2022 年弃用。

1. 安装：

        ```bash
        npm install hexo-deployer-openshift --save
        ```

2. 修改配置：

        ```yaml
        deploy:
            type: openshift
            repo: <repository url>
            message: [message]
        ```

        | 选项    | 描述                  |
        | ------- | --------------------- |
        | repo    | OpenShift 仓库地址    |
        | message | 自定义提交信息        |

---

### FTPSync

1. 安装 `hexo-deployer-ftpsync`：

        ```bash
        npm install hexo-deployer-ftpsync --save
        ```

2. 修改配置：

        ```yaml
        deploy:
            type: ftpsync
            host: <host>
            user: <user>
            pass: <password>
            remote: [remote]
            port: [port]
            clear: [true|false]
            verbose: [true|false]
        ```

        | 选项    | 描述               | 默认值  |
        | ------- | ------------------ | ------- |
        | host    | 远程主机地址       |         |
        | user    | 用户名             |         |
        | pass    | 密码               |         |
        | remote  | 远程根目录         | /       |
        | port    | 端口               | 21      |
        | clear   | 上传前清空远程目录 | false   |
        | verbose | 显示调试信息       | false   |

---

### SFTP

1. 安装 `hexo-deployer-sftp`：

        ```bash
        npm install hexo-deployer-sftp --save
        ```

2. 修改配置：

        ```yaml
        deploy:
            type: sftp
            host: <host>
            user: <user>
            pass: <password>
            remotePath: [remote path]
            port: [port]
            privateKey: [path/to/privateKey]
            passphrase: [passphrase]
            agent: [path/to/agent/socket]
        ```

        | 选项         | 描述                   | 默认值         |
        | ------------ | ---------------------- | -------------- |
        | host         | 远程主机地址           |                |
        | port         | 端口                   | 22             |
        | user         | 用户名                 |                |
        | pass         | 密码                   |                |
        | privateKey   | SSH 私钥路径           |                |
        | passphrase   | 私钥密码（可选）       |                |
        | agent        | ssh 套接字路径         | $SSH_AUTH_SOCK |
        | remotePath   | 远程根目录             | /              |
        | forceUpload  | 覆盖现有文件           | false          |
        | concurrency  | 最大并发任务数         | 100            |

---

### Vercel

Vercel 是云平台，支持 Jamstack 网站和服务的即时部署与自动扩展。

1. 在 `package.json` 添加构建脚本：

        ```json
        {
            "scripts": {
                "build": "hexo generate"
            }
        }
        ```

2. 将 Hexo 网站推送到 Git 仓库后，通过 Vercel 导入项目，相关选项可自定义。推送到分支会生成预览部署，主分支更改会生成生产部署。

---

### Bip

Bip 是商业托管服务，支持零停机部署、全球 CDN、SSL 等。

1. 初始化项目目录：

        ```bash
        bip init
        ```

2. 部署网站：

        ```bash
        hexo generate --deploy && bip deploy
        ```

---

### RSS3

> `hexo-deployer-rss3` 已于 2023 年弃用。

RSS3 是为 Web 3.0 设计的开放协议。

```yaml
deploy:
    - type: rss3
        endpoint: https://hub.rss3.io
        privateKey: <your-private-key>
        ipfs:
            deploy: true
            gateway: pinata
            api:
                key: <api-key>
                secret: <api-secret>
```

| 参数           | 描述                   |
| -------------- | ---------------------- |
| endpoint       | RSS3 Hub 链接          |
| privateKey     | 64 字节私钥            |
| ipfs/deploy    | 是否部署到 IPFS        |
| ipfs/gateway   | IPFS API 网关          |
| ipfs/api/key   | IPFS 网关验证内容      |
| ipfs/api/secret| IPFS 网关验证内容      |

---

### Edgio (原 Layer0)

Edgio 是互联网规模的平台，支持 Hexo 部署。

1. 安装 Edgio CLI：

        ```bash
        npm i -g @edgio/cli
        ```

2. 安装 Hexo 连接器：

        ```bash
        edgio init --connector=@edgio/hexo
        ```

3. 部署：

        ```bash
        edgio deploy
        ```

---

## 其他部署方法

Hexo 生成的所有静态文件都位于 `public` 文件夹中。您可以手动将这些文件通过 FTP、SCP、WebDAV 或其他方式上传到任意服务器或静态托管服务。

```bash
# 生成静态文件
hexo generate

# 进入 public 目录
cd public

# 使用 scp 上传到服务器
scp -r * user@host:/path/to/webroot
```

请根据您的服务器环境选择合适的上传方式。

---

> 更多部署方式和插件，请参考 [Hexo 官方插件列表](https://hexo.io/plugins/)。