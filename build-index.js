import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = "./posts";
const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), "utf8");
  const parsed = matter(content);
  const slug = file.replace(/\.md$/, "");
  return {
    slug,
    title: parsed.data.title || slug,
    date: parsed.data.date || null,
  };
});

// 按日期降序排序
posts.sort((a, b) => (b.date || "") > (a.date || "") ? 1 : -1);

fs.writeFileSync("./posts.json", JSON.stringify(posts, null, 2));
console.log("Generated posts.json");
