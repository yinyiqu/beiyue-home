import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * base 说明：
 * 默认用相对路径 './'，同一份产物在下面两种地址都能正常加载：
 *   - https://<user>.github.io/<repo>/   （项目主页）
 *   - https://你的域名/                  （自定义域名）
 * 如确需固定绝对路径，用环境变量覆盖：SITE_BASE=/repo/ npm run build
 */
export default defineConfig(({ command }) => ({
  base: command === 'build' ? process.env.SITE_BASE || './' : '/',
  plugins: [vue()],
  server: { host: true, port: 5173 },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: { vue: ['vue'] }
      }
    }
  }
}))
