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
  name: 'yuetool',
  title: 'yuetool · 牌堆',
  hint: '悬停抽一张 · 点击打开',
  author: 'yuetool',
  since: 2026,
  github: '',
  email: '',
  footerNote: '用 Vue 3 + Vite 手写的一叠牌',
  about: {
    title: '关于这叠牌',
    meta: 'Colophon · 说明',
    glyph: '❖',
    paragraphs: [
      '这里收着我用零碎时间做的小工具和小游戏：有的解决一点小麻烦，有的只是好玩。',
      '新牌会不定期发下来，旧的也会慢慢翻新。想聊天、提建议，或者只是路过，都欢迎。'
    ]
  }
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
    id: 'text-alchemy',
    name: '文字炼金',
    en: 'Text Alchemy',
    tag: '工具',
    desc: '大小写、全半角、繁简、编码，一次转干净。',
    emoji: '⚗️'
  },
  {
    id: 'slacker-calendar',
    name: '摸鱼日历',
    en: 'Slacker Calendar',
    tag: '生活',
    desc: '距离下一个假期，还有几天零几个小时。',
    emoji: '🐟'
  },
  {
    id: 'pixel-weather',
    name: '像素天气',
    en: 'Pixel Weather',
    tag: '工具',
    desc: '把天气预报做成 8-bit 的一小块天空。',
    emoji: '🌤️'
  },
  {
    id: 'voice-lab',
    name: '声纹实验室',
    en: 'Voice Lab',
    tag: '实验',
    desc: '对着麦克风哼一段，看声音长成什么形状。',
    emoji: '🎙️'
  },
  {
    id: 'one-second-poem',
    name: '一秒诗',
    en: 'One Second Poem',
    tag: '趣味',
    desc: '随机三个词，拼成一句只属于此刻的诗。',
    emoji: '🪶'
  },
  {
    id: 'tomato-timer',
    name: '番茄钟',
    en: 'Tomato Timer',
    tag: '效率',
    desc: '二十五分钟专注，五分钟看窗外。',
    emoji: '🍅'
  },
  {
    id: 'album',
    name: '拾光相册',
    en: 'Album',
    tag: '记录',
    desc: '一些随手拍下的光，和光里的人。',
    emoji: '📷'
  },
  {
    id: 'maze',
    name: '迷宫',
    en: 'Maze',
    tag: '游戏',
    desc: '每次刷新都是新的一局，走出去就算赢。',
    emoji: '🌀'
  }
]

export const apps = SAMPLES.map((app, i) => ({
  ...app,
  url: app.url || '',
  hue: app.hue ?? HUES[i % HUES.length],
  sort: i
}))
