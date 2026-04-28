import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 加上這一行，/italy-handbook/ 必須與您的 GitHub Repo 名稱完全一致！
  base: '/italy-handbook/', 
})
