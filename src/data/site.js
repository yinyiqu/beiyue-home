/**
 * 站点与卡片的全部内容都在这个文件里。
 * 改文案、换名字、加一张牌，都不需要动组件。
 *
 * 一张牌支持这些字段：
 *   id      必填，唯一，用来做动画的 key
 *   name    必填，卡片正面的大字
 *   en      英文名，显示在名字下面的小字里
 *   tag     分类，一个词，例如「工具」
 *   desc    一句话介绍，鼠标悬停时也可以看到
 *   url     点击跳转的地址；留空则视为示例卡，点击只提示
 *   emoji   图标；也可以用 icon: '/icons/xxx.png' 换成图片
 *   hue     这张牌的主色相 0–360，不写则按顺序自动分配
 */

export const site = {
  name: 'Beiyue',
  sub: 'home',
  title: 'Beiyue home',
  hint: '上下滑动翻牌 · 点开就用',
  author: 'Beiyue',
  since: 2026,
  github: '',
  email: '',
  footerNote: '用 Vue 3 + Vite 手写的一叠牌'
}

/** 12 个主色相轮转：新增卡片自动取色，不需要手动配 */
const HUES = [32, 202, 344, 164, 268, 12, 190, 96, 222, 316, 48, 148]

/** 示例牌：把 url 换成你自己的项目地址即可 */
const SAMPLES = [
  {
    id: 'imghub-image-host',
    name: 'Imghub 图床',
    en: 'Image Host',
    tag: '工具',
    desc: '拖进图片，马上拿到一个能直接用的链接。',
    url: 'https://beii.cc.cd',
    emoji: '🖼️'
  },
  {
    id: 'danmaku',
    name: '弹幕',
    en: 'Danmaku',
    tag: '趣味',
    desc: '打开就能发，屏幕上飘过的都是别人的碎碎念。',
    url: 'https://yue.dpdns.org',
    emoji: '🎬'
  },
  {
    id: 'gameboy',
    name: 'GameBoy',
    en: 'Game Boy Live',
    tag: '游戏',
    desc: '拖一张卡带进去，就能在浏览器里玩 GB / GBC / GBA。',
    url: `${import.meta.env.BASE_URL}GameBoyLive/`,
    emoji: '🕹️'
  }
]

export const apps = SAMPLES.map((app, i) => ({
  ...app,
  url: app.url || '',
  hue: app.hue ?? HUES[i % HUES.length],
  sort: i
}))
