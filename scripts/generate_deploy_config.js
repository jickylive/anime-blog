// generate_deploy_config.js
const fs = require('fs');
const path = require('path');

// 从环境变量中读取机密信息
const host = process.env.FTP_HOST;
const user = process.env.FTP_USER;
const pass = process.env.FTP_PASS;

if (!host || !user || !pass) {
  console.error("错误：FTP_HOST, FTP_USER, 或 FTP_PASS 环境变量未设置！");
  process.exit(1);
}

const configContent = `
# 这个文件由 CI/CD 脚本自动生成
deploy:
  type: ftpsync
  host: ${host}
  user: ${user}
  pass: ${pass}
  remote: /htdocs/public
  port: 21
  clear: false
  verbose: true
`;

// 写入配置到 _config.deploy.yml
const configPath = path.join(__dirname, '_config.deploy.yml');
fs.writeFileSync(configPath, configContent.trim());

console.log('已成功生成 _config.deploy.yml 文件。');