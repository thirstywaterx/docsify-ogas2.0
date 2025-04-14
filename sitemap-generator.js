const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "https://ogas.waterx.top"; // 你的网站地址
const DOCS_PATH = process.env.DOCS_PATH || "."; // 根目录，适配 Docsify

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith(".md")) {
      results.push(filePath);
    }
  });
  return results;
}

function mdPathToUrl(p) {
  let clean = p.replace(DOCS_PATH, "").replace(/\\/g, "/").replace(/\.md$/, "");
  if (clean.endsWith("/README")) {
    clean = clean.slice(0, -7);
  }
  return `${BASE_URL}${clean}`;
}

const files = walk(DOCS_PATH);
const urls = files.map(mdPathToUrl);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n") +
  `\n</urlset>`;

fs.writeFileSync(path.join(DOCS_PATH, "sitemap.xml"), sitemap);
console.log("✅ Sitemap generated.");