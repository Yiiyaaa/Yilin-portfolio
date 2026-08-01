# 依林 Yilin · 个人宇宙

我的个人品牌主页 —— 作品集、自造的 AI 助手、方法与联系方式。

**🌐 [yiiyaaa.github.io/Yilin-portfolio](https://yiiyaaa.github.io/Yilin-portfolio/)**

> 我喜欢把脑子里的想法、观察和经验，做成可以被读懂、被看见、被使用的东西。
> 语言、AI 视觉与产品，是我把念头从脑内带到现实的三种方式。

---

## 页面里有什么

| 章节 | 内容 |
|---|---|
| **What I Do** | 三条主线：语言表达 / AI 视觉 / 产品与工作流 |
| **Selected Work** | 「树下坐」个人写作品牌、AI 商业视觉作品集 |
| **The Lab** | 我给自己造的工具：己子、奈绪、朵拉、Visionboard、漫画工作流、效率管理系统 |
| **Advantages · Skill Matrix** | 硬技能 / 软技能，以及每个方向的可交付物 |
| **About · Now** | 兴趣、原则，以及最近在做和正在探索的事 |

## 关于「The Lab」

这一部分收集我自己动手做出来的 AI 助手和系统。每一个都从一个真实的麻烦开始 ——
先解决我自己的问题，再看它能不能解决别人的。

- **己子** · 个人助手 —— 飞书对话入口，接过 ChatGPT / Claude / DeepSeek，带长期记忆
- **奈绪** · 信息源漂洗 —— 飞书/微信收集 → 课程音频抓取转写 → 多步漂洗归档 → Notion & 飞书文档
- **朵拉** · 生成图片的工作流助手
- **Visionboard** · 愿景板 Web 原型
- **漫画工作流** · 从故事到成图的流水线（进行中）
- **效率管理系统** · 时间与进展管理

## 技术说明

零依赖、零构建。页面结构、样式与交互仍在 `index.html`，可编辑内容由一个很小的同步运行层覆盖。

- 原生 HTML / CSS / JavaScript，无框架、无打包工具
- 惯性平滑滚动、3D 指针倾斜、自定义光标、逐词揭幕、灯箱画廊，均为手写
- 星空视差、极光与流星为纯 CSS + Web Animations API
- 完整支持 `prefers-reduced-motion`；键盘可达，含焦点管理与跳转链接
- 文字对比度按 WCAG AA 校准；含打印 / 存为 PDF 样式

```
index.html          # 全站结构、样式与主要交互
content-data.js     # 本机编辑器保存的内容与顺序
content-runtime.js  # 在动效启动前应用内容
gallery-data.js     # 图库顺序、注释与替代文字的唯一清单
gallery-runtime.js  # 渲染作品区与 Lab 证据图库
assets/gallery/     # 按栏目整理、可由编辑器扫描的作品图片
assets/             # 二维码、图标与分享封面
```

## 沉浸式编辑器

本机编辑器位于同级目录 `..\Yilin-editor\`，不会作为 GitHub Pages 页面发布。双击其中的
`start-editor.cmd`，即可在真实页面上直接修改文字、替换普通图片、调整章节和卡片顺序；“图片库”支持批量上传、改注释与替代文字、排序、定位、扫描本地文件夹和软删除。

“保存本地草稿”只修改本机文件；“发布给所有人”才会创建 Git commit 并推送。编辑器只会暂存
`content-data.js`、`gallery-data.js` 和两者明确引用的图片，不会把 `deliverables/` 等其它目录带入公开仓库。

本地预览：

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 联系

- ✉️ 1954063280@qq.com
- 💬 WeChat · YL1010Go
- 📷 Instagram · [@yvelinegong](https://www.instagram.com/yvelinegong)

---

© 2026 Yilin Gong · El universo de Yilin · 树下坐 · Yveline
