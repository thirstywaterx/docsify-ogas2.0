const fs = require('fs');
const path = require('path');

const baseUrl = 'https://your-domain.com'; // 改成你的域名
const docsPath = path.join(__dirname, 'docs');

function getAllMarkdownFiles(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  let results = [];

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = path.join(prefix, file);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath, relPath));
    } else if (file.endsWith('.md')) {
      results.push(relPath.replace(/\\/g, '/').replace(/\.md$/, ''));
    }
  });

  return results;
}

const urls = getAllMarkdownFiles(docsPath).map(p => {
  const url = p === 'index' ? '' : p;
  return `<url><loc>${baseUrl}/${url}</loc></url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('sitemap.xml generated.');