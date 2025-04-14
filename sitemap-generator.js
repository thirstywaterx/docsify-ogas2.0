const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ogas.waterx.top'; // 替换为你的域名
const DOCS_DIR = path.join(__dirname, 'docs');
const OUTPUT = path.join(__dirname, 'docs', 'sitemap.xml');

function getMarkdownPaths(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const relPath = path.join(base, file);

    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownPaths(filePath, path.join(base, file)));
    } else if (file.endsWith('.md')) {
      let url = relPath.replace(/\\/g, '/').replace(/\.md$/, '');
      if (url === 'index') url = '';
      results.push(`${BASE_URL}/${url}`);
    }
  });

  return results;
}

function generateSitemap(urls) {
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc><lastmod>${now}</lastmod></url>`).join('\n')}
</urlset>`;
  return xml;
}

const urls = getMarkdownPaths(DOCS_DIR);
const sitemap = generateSitemap(urls);

fs.writeFileSync(OUTPUT, sitemap, 'utf8');
console.log('sitemap.xml generated at', OUTPUT);