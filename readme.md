极简 workers 博客

# nano-workers-blog

<a href="https://deploy.workers.cloudflare.com/?url=https://github.com/vpslog/nano-workers-blog" target="_blank">
	<img src="https://deploy.workers.cloudflare.com/button.svg" alt="Deploy to Cloudflare" />
</a>

一个极简静态博客生成器，基于 Node.js，支持 Markdown 文章，自动生成 HTML 页面，适用于 Cloudflare Workers 或任意静态托管。

## 功能

- 极简，核心代码 80 行
- 支持 Markdown 格式的博客文章，自动解析 front-matter 元数据（如标题、日期）
- 自动生成首页和每篇文章的 HTML 页面
- 文章列表按日期降序排列
- 使用 [sakura.css](https://github.com/oxalorg/sakura) 提供简洁美观的样式，可自由切换 Class less 样式

## 目录结构

```
posts/           # 存放 Markdown 文章
public/          # 自动生成的静态 HTML 文件
build.js         # 构建脚本
package.json     # 依赖配置
wrangler.jsonc   # Cloudflare Workers 配置
```


## 添加文章

在 `posts/` 目录下新建 Markdown 文件，例如：

```markdown
---
title: Hello World
date: 2025-09-04
---

# Welcome

这是一篇示例博客文章。
```


## 部署到 Cloudflare Workers

<a href="https://deploy.workers.cloudflare.com/?url=https://github.com/vpslog/nano-workers-blog" target="_blank">
	<img src="https://deploy.workers.cloudflare.com/button.svg" alt="Deploy to Cloudflare" />
</a>


## 依赖

- [gray-matter](https://github.com/jonschlinkert/gray-matter) 用于解析 Markdown 元数据
- [marked](https://github.com/markedjs/marked) 用于 Markdown 转 HTML

## License

MIT
