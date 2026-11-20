import type { App } from 'vue'

// public/ の画像をバインド式 (:src, :image) で参照するためのヘルパー。
// バインド式は Vite の asset 変換を通らず --base が付かないので、ここで BASE_URL を前置する
export default ({ app }: { app: App }) => {
  app.config.globalProperties.$asset = (path: string) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $asset: (path: string) => string
  }
}
