/**
 * 构建脚本 - 将 Hexo 博客构建到主项目的 dist/blog 目录
 * 
 * 使用方法:
 *   node build-to-dist.js
 *   node build-to-dist.js --clean  # 清理后构建
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 获取项目根目录
const BLOG_ROOT = __dirname;
const PROJECT_ROOT = path.resolve(BLOG_ROOT, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist', 'blog');

// 解析命令行参数
const args = process.argv.slice(2);
const shouldClean = args.includes('--clean') || args.includes('-c');

console.log('\n' + '='.repeat(60));
console.log('  Hexo 博客构建脚本 - 输出到 dist/blog');
console.log('='.repeat(60));
console.log(`\n📁 博客源目录：${BLOG_ROOT}`);
console.log(`📁 项目根目录：${PROJECT_ROOT}`);
console.log(`📁 目标目录：${DIST_DIR}`);
console.log(`🧹 清理模式：${shouldClean ? '是' : '否'}\n`);

try {
  // 1. 创建 dist/blog 目录
  if (!fs.existsSync(DIST_DIR)) {
    console.log('📁 创建目标目录...');
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // 2. 清理 Hexo 缓存 (可选)
  if (shouldClean) {
    console.log('🧹 清理 Hexo 缓存...');
    execSync('npx hexo clean', {
      cwd: BLOG_ROOT,
      stdio: 'inherit'
    });
  }

  // 3. 修改 public_dir 配置并生成
  console.log('🔨 生成静态文件...');
  
  // 创建临时配置文件
  const tempConfigPath = path.join(BLOG_ROOT, '_config.build.yml');
  const originalConfigPath = path.join(BLOG_ROOT, '_config.yml');
  
  // 读取原配置
  let configContent = fs.readFileSync(originalConfigPath, 'utf-8');
  
  // 修改 public_dir 为 dist/blog
  const newConfigContent = configContent.replace(
    /^public_dir:\s*\S+/m,
    `public_dir: ${DIST_DIR.replace(/\\/g, '/')}`
  );
  
  // 写入临时配置
  fs.writeFileSync(tempConfigPath, newConfigContent, 'utf-8');
  console.log(`📝 临时配置文件：${tempConfigPath}`);
  
  // 使用临时配置执行 hexo generate
  execSync(`npx hexo generate --config "${originalConfigPath}","${tempConfigPath}"`, {
    cwd: BLOG_ROOT,
    stdio: 'inherit'
  });
  
  // 删除临时配置
  fs.unlinkSync(tempConfigPath);
  console.log('🗑️  已删除临时配置文件');

  // 4. 验证构建结果
  if (fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.log('\n✅ 构建成功！');
    
    // 统计文件数量
    const files = fs.readdirSync(DIST_DIR, { recursive: true })
      .filter(f => fs.statSync(path.join(DIST_DIR, f)).isFile());
    
    console.log(`📊 生成文件数：${files.length}`);
    console.log(`📁 输出目录：${DIST_DIR}`);
  } else {
    console.warn('⚠️  警告：index.html 不存在，构建可能有问题');
  }

} catch (error) {
  console.error('\n❌ 构建失败:', error.message);
  process.exit(1);
}

console.log('\n' + '='.repeat(60) + '\n');
