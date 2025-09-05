const TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{title}}</title>
    <link rel="stylesheet" href="https://unpkg.com/sakura.css/css/sakura.css">
  </head>
  <body>
    {{body}}
  </body>
</html>`; // HTML 模板

const NAME = "我的博客"; // 博客名称

// 以下勿动
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDir = "./posts";
const publicDir = "./public";
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(path.join(publicDir, "post"))) fs.mkdirSync(path.join(publicDir, "post"));

function render(template, data) {
  return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || "");
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), "utf8");
  const parsed = matter(content);
  const slug = file.replace(/\.md$/, "");
  return {
    slug,
    title: parsed.data.title || slug,
    date: parsed.data.date || "",
    content: parsed.content,
    data: parsed.data,
  };
});

// 按日期降序排序
posts.sort((a, b) => (b.date || "") > (a.date || "") ? 1 : -1);

// 生成首页 html
const listHtml = posts.map(
  (p) => `<li><a href="/post/${p.slug}.html">${p.title}</a> (${formatDate(p.data.date)})</li>`
).join("");
const indexHtml = render(TEMPLATE, {
  title: NAME,
  body: `<h1>${NAME}</h1><ul>${listHtml}</ul>`
});
fs.writeFileSync(path.join(publicDir, "index.html"), indexHtml);

// 生成每篇文章 html
posts.forEach(post => {
  const htmlContent = marked.parse(post.content);
  const body = `<a href="/index.html">← Back</a>
    <h1>${post.data.title || post.slug}</h1>
    <p class="date"><em>${formatDate(post.data.date)}</em></p>
    <article>${htmlContent}</article>`;
  const html = render(TEMPLATE, {
    title: post.title,
    body
  });
  fs.writeFileSync(path.join(publicDir, `post/${post.slug}.html`), html);
});

console.log("静态 html 已生成到 public/");

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(d);
}