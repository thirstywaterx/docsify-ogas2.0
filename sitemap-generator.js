// generate-sitemap.js
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://ogas.waterx.top'; // 替换成你的域名
const docsDir = path.join(__dirname, 'docs');
const output = path.join(__dirname, 'sitemap.xml');

let urls = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const rel = path.relative(docsDir, full);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (file.endsWith('.md')) {
      const url = baseUrl + '/' + rel.replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/?README$/, '');
      urls.push(`<url><loc>${url}</loc></url>`);
    }
  }
}

walk(docsDir);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(output, sitemap);
console.log('Sitemap generated!');