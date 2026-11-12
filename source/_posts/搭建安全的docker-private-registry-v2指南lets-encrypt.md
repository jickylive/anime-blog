---
title: 搭建安全的docker private registry v2指南(Let’s Encrypt)
tags: []
id: '300'
categories:
  - - IT技术
date: 2019-04-12 23:21:52
---

# 搭建安全的docker private registry v2指南(Let’s Encrypt)

[2018-03-29](http://www.iigrowing.cn/da_jian_an_quan_de_docker_private_registry_v2_zhi_nan_let_s_encrypt.html)  categories:[资料](http://www.iigrowing.cn/catalog/zi_liao)  author:[iigadmin](http://www.iigrowing.cn/author/iigadmin)

本站已实现https访问，访问地址：https://deepzz.com

### 权威Registry

获取安全证书有两个办法：互联网认证的CA处获取。自建CA自己给自己签名。

*   1、从认证CA处获取签名证书，大多数是需要付出一定费用的，近些年也有认证CA提供免费证书，例如Let’s Encrypt(被大多数浏览器信任)。下文使用Let’s Encrypt的例子您将清楚地看到这个步骤。
*   2、自建CA并签名证书的方式所带来的问题是CA本身的维护以及客户端方面的维护。要保证自建CA的安全需要有比较扎实的基础安全知识，维护它的运转需要有对签名流程进行干预的控制能力，或自动、或手工。客户端方面，同样需要对所有客户端按照其CA安装机制来进行额外安装。若将自建CA维护到与认证CA同等的安全性和便利性，所付出的代价将超过付费证书。因此这种方式主要用于试验性环境。

#### LetsEncrypt证书

1、准备一台服务器(有公网IP)，已做好域名解析。这里以Ubuntu 14.04 TLS为例。  
2、确保该服务器80，443端口可以从互联网访问到且不被占用(关掉占用端口的服务器)。

> 因为LetsEncrypt申请证书是需要联网签名的，并且要用到80端口。

在成功获取证书后，服务器IP和端口就可另作他用。因此，可以在某台有公网IP的主机服务器上获取证书，再将证书转移到其它服务器进行使用。若采用这样的方式，Docker客户端需要将私网IP和dockie.mydomain.com对应写入hosts文件或将该解析写到私网DNS服务器里。但证书到期renew的时候还需要同样的公网域名（公网IP可以不同）。

3、在服务器上获取签名证书

**SH**`$ git clone https://github.com/letsencrypt/letsencrypt.git
$ cd letsencrypt
$ sudo ./certbot-auto certonly --standalone --email admin@example.com -d example.com -d www.example.com -d other.example.net` 

> 这里直接根据官方提供的方法从GITHUB获取安装包和目录安装，上面是一个标准的格式，根据我们的邮箱、以及需要添加的域名设置，如果多域名直接 在后面添加-d就可以，比如继续添加其他域名 -d www.laojiang.me -d laojiang.me以此类推。

```
IMPORTANT NOTES:
- Congratulations! Your certificate and chain have been saved at
  /etc/letsencrypt/live/laojiang.me/fullchain.pem. Your cert will
  expire on 2016-07-13. To obtain a new version of the certificate in
  the future, simply run Let's Encrypt again.
- If you like Let's Encrypt, please consider supporting our work by:
Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
Donating to EFF:                    https://eff.org/donate-le
```

看到这样的文字和提示就代表获取Let’s Encrypt证书成功，时间是90天，我们需要在到期前手手动续约就可以继续90天。然后我们在”/etc/letsencrypt/live/域名/“目录中看到4个文件（cert.pem chain.pem fullchain.pem privkey.pem）。

4、更新证书  
使用下面这条命令，更新证书，它将更新到期时间不到30天的证书，而且它会根据你当初生成证书的设置更新你的证书。

```
$ ./certbot-auto renew --dry-run
```

5、通过钩子更新证书

```
$ ./certbot-auto renew --standalone --pre-hook "service nginx stop" --post-hook "service nginx start"
```

这里使用了一个钩子，`--pre-hook`\>更新前执行命令命令，`--post-hook`更新之后执行命令。

#### 自签名证书

执行以下命令，它会在文件夹下生成domain.key和domain.crt

**SH**`mkdir -p certs && openssl req \
 -newkey rsa:4096 \
 -nodes -sha256 \
 -keyout certs/domain.key \
 -x509 -days 365 \
 -out certs/domain.crt` 

相关参数说明：

**SH**`Country Name (2 letter code) [AU]:CN                               #国家代码，中国CN
State or Province Name (full name) [Some-State]:Sichuan            #省份全拼
Locality Name (eg, city) []:Chengdu                                #城市
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Person  #组织名，公司名
Organizational Unit Name (eg, section) []:Chen                     #部门名称
Common Name (e.g. server FQDN or YOUR name) []:registry.domain.com #这里必须填写Docker Registry使用的域名
Email Address []:ccc@domain.com                                    #电子邮件` 

> 自签名证书，使用Docker Registry的Docker机需要将domain.crt拷贝到 /etc/docker/certs.d/\[docker\_registry\_domain\]/ca.crt，然后重启docker，将domain.crt内容放入系统的CA bundle文件当中，使操作系统信任我们的自签名证书。

CentOS 6 / 7中bundle文件的位置在/etc/pki/tls/certs/ca-bundle.crt：

```
cat domain.crt >> /etc/pki/tls/certs/ca-bundle.crt
```

Ubuntu/Debian Bundle文件地址/etc/ssl/certs/ca-certificates.crt

```
cat domain.crt >> /etc/ssl/certs/ca-certificates.crt
```

Mac

```
1、点击钥匙串访问
2、点击系统
3、点击证书
4、将domain.crt拖到目录下
5、输入密码，添加成功
6、双击该证书，点击信任，选择
7、退出
```

### 安装docker

详细步骤请跳转：docker 安装、配置步骤

### 搭建Docker registry

创建`certs`目录：

```
$ cd ~
$ mkdir -p certs
```

复制或者添加你的证书文件到`certs/domain.cert`，你的私钥文件到`certs/domain.key`：

**SH**`# Let's Encrypt证书
$ sudo cp /etc/letsencrypt/live/registry.domain.com/fullchain.pem ~/certs/domain.cert
$ sudo cp /etc/letsencrypt/live/registry.domain.com/privkey.pem ~/certs/domain.key
# 自签名证书，直接复制文件夹到 ~/certs` 

获取`registry`镜像

```
$ sudo docker pull registry:2
```

一切准备就绪，运行registry：

**SH**`$ sudo docker run -d -p 5000:5000 --restart=always --name registry \
    -v /data/registry:/var/lib/registry \
    -v ~/certs/:/certs \
    -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.cert \
    -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
    -e REGISTRY_STORAGE_DELETE_ENABLED=true \
    registry:2` 

测试registry是否启动成功：

**SH**`$ docker ps                                            #你可以查看运行了那些容器
$ telnet dockie.mydomain.com 5000                      #查看能否连接成功
$ curl -i -k -v https://registry.mydomain.com:5000     #使用curl来测试TLS是否工作正常` 

浏览器访问`https://registry.mydomain.com:5000`，可以看到该连接可以安全访问了。

你现在通过其它docker主机应该能够访问你的registry：

**SH**`$ docker pull ubuntu
$ docker tag ubuntu myregistrydomain.com:5000/ubuntu
$ docker push myregistrydomain.com:5000/ubuntu
$ docker pull myregistrydomain.com:5000/ubuntu` 

#### 实现访问限制

最简单的方法是通过basic authentication。  
首先，创建密码文件。你需要替换这两个参数，用户名：testuser，密码：testpasswd。

**SH**`$ cd ~
$ mkdir auth
$ docker run --entrypoint htpasswd registry:2 -Bbn testuser testpassword > auth/htpasswd` 

然后，停止你的registry，之后，用下面的代码再次启动：

**SH**`docker run -d -p 5000:5000 --restart=always --name registry \
  -v /data/registry:/var/lib/registry \
  -v ~/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -v ~/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  -e REGISTRY_STORAGE_DELETE_ENABLED=true \
  registry:2` 

现在，你可以:

```
docker login registry.domain.com:5000
```

然后，然后，你就可以通过该user进行push和pull操作了。

### 移除 Registry

使用 `-v` 来删除容器卷。

```
$ docker stop registry && docker rm -v registry
```

本文链接：https://deepzz.com/post/secure-docker-registry.html，参与评论 ?

–EOF–

发表于 2016-10-05 21:25:00，并被添加「docker-registry、registry-v2」标签。

本站使用「署名 4.0 国际」创作共享协议，转载请注明作者及原网址。更多说明 ?

来源：https://deepzz.com/post/secure-docker-registry.html