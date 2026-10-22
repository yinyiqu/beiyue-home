# Beiyue home

一叠卡片式的个人主页：小工具、小游戏码成一叠，只露出每张的顶部一条，悬停就把整张向左抽出来。

Vue 3 + Vite，无 UI 框架，样式手写。

## 特点

- **之字形牌堆**：卡片只占容器 5/6 宽，偶数张靠右、奇数张贴左，纵向逐张下移；每张露出 L 形的一块，最后一张整张露出，牌心是淡编号
- **抽出**：悬停或键盘聚焦时，这张牌滑到正中、浮到最上层并轻轻抬起，像从一叠牌里抽出来看清楚
- **搜索**：`/` 聚焦、`Esc` 清空，按名称、英文名、分类、简介过滤
- **响应式**：≥720px 是 16:9 横卡 + 左侧车道；窄屏是 9:16 竖卡，悬停改为轻抬
- **主题**：深色 / 浅色，跟随系统，手动切换后记忆
- **内置模拟器**：`/GameBoyLive/` 是一台跑在浏览器里的 GB / GBC / GBA

## 结构

```
yuehome/
├─ src/
│  ├─ components/      顶栏、工具条、牌堆、单卡、背景、提示
│  ├─ composables/     主题、指针、提示
│  ├─ data/site.js     站点文案与卡片清单
│  ├─ styles.css       设计令牌与全局样式
│  └─ styles/card.css  卡面样式
├─ public/
│  ├─ GameBoyLive/     模拟器构建产物
│  ├─ og.jpg           分享预览图
│  └─ favicon.svg
├─ .github/workflows/  GitHub Pages 自动部署
└─ vite.config.js
```

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
npm run preview
```

## 改内容

站点文案和卡片都在 `src/data/site.js`。一张牌只需要：

```js
{ id: 'gameboy', name: 'GameBoy', tag: '游戏', desc: '一句话', url: '...', emoji: '🕹️' }
```

`url` 是点开后跳转的地址；`hue` 控制这张牌的主色相，不写就按顺序自动分配。

## 部署

推到 `main` 后，仓库 **Settings → Pages → Source** 选 **GitHub Actions**，工作流会构建 `dist/` 并发布。绑定自有域名时，在 Pages 里填域名，DNS 加一条 CNAME 指向 `<用户名>.github.io`。

> 模拟器目录 `public/GameBoyLive/` 为 MIT 许可项目的构建产物，许可证随目录附上（`public/GameBoyLive/LICENSE`）。
