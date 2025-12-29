import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '唐诗三百首地名地图',
  description: '探索唐诗三百首中的地理意象，感受诗人笔下的山川河流',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
