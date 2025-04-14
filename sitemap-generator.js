// generate-sitemap.js
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://ogas.waterx.top"; // 替换成你的域名
const DOCS_DIR = "docs"; // Docsify 的文档目录

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (file.endsWith(".md") && file.toLowerCase() !== "readme.md") {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function buildUrl(filepath) {
  const relativePath = filepath.replace(`${DOCS_DIR}/`, "").replace(/\.md$/, "");
  return `${BASE_URL}/#/${relativePath}`;
}

const pages = walk(DOCS_DIR);
const urls = pages.map(p => `  <url><loc>${buildUrl(p)}</loc></url>`).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap);
console.log("sitemap.xml generated.");