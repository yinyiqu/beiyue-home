# Beiyue home

一叠卡片式的个人主页：小工具、小游戏都收在牌堆里，抽一张就打开。

Vue 3 + Vite，无 UI 框架，样式手写。

## 特点

- **牌堆**：纵向叠放，只露出每张牌的顶部一条；悬停抽出、放大、提亮，其余牌压暗
- **滚动堆叠**：上下滑动时牌一张张压上来，当前那张自动突出、其余压暗
- **移动端**：与桌面同款堆叠交互，按下先高亮再跳转
- **搜索 / 洗牌 / 键盘**：`/` 搜索、`↑↓` 换牌、`Enter` 打开、`Esc` 清空
- **内置模拟器**：`/GameBoyLive/` 是一台跑在浏览器里的 GB / GBC / GBA

## 结构

```
beiyue-home/
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

`url` 留空会当成占位牌，点击只弹提示；`hue` 控制这张牌的主色相，不写就自动分配。

## 部署

推到 `main` 后，仓库 **Settings → Pages → Source** 选 **GitHub Actions**，工作流会构建 `dist/` 并发布。绑定自有域名时，在 Pages 里填域名，DNS 加一条 CNAME 指向 `<用户名>.github.io`。

> 模拟器目录 `public/GameBoyLive/` 为 MIT 许可项目的构建产物，许可证随目录附上（`public/GameBoyLive/LICENSE`）。
