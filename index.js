import matter from "gray-matter";
import { marked } from "marked";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 首页：动态读取 posts.json
    if (url.pathname === "/") {
      const res = await env.ASSETS.fetch(new Request("/posts.json"));
      const posts = await res.json();

      const listHtml = posts.map(
        (p) => `<li><a href="/post/${p.slug}">${p.title}</a> (${p.date || ""})</li>`
      ).join("");

      const html = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>My Blog</title>
            <link rel="stylesheet" href="/style.css">
          </head>
          <body>
            <h1>My Blog</h1>
            <ul>${listHtml}</ul>
          </body>
        </html>
      `;

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      });
    }

    // 文章页
    if (url.pathname.startsWith("/post/")) {
      const slug = url.pathname.replace("/post/", "");
      try {
        const mdFile = await env.ASSETS.fetch(new Request(`/posts/${slug}.md`));
        if (!mdFile.ok) throw new Error("not found");

        const rawMd = await mdFile.text();
        const parsed = matter(rawMd);
        const htmlContent = marked.parse(parsed.content);

        const html = `
          <html>
            <head>
              <meta charset="utf-8">
              <title>${parsed.data.title || slug}</title>
              <link rel="stylesheet" href="/style.css">
            </head>
            <body>
              <a href="/">← Back</a>
              <h1>${parsed.data.title || slug}</h1>
              <p><em>${parsed.data.date || ""}</em></p>
              <article>${htmlContent}</article>
            </body>
          </html>
        `;

        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=UTF-8" },
        });
      } catch {
        return new Response("Post not found", { status: 404 });
      }
    }

    // 其他静态资源
    return env.ASSETS.fetch(request);
  },
};
