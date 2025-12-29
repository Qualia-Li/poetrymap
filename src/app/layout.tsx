import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: '唐诗三百首地名地图',
  description: '唐诗三百首地名地图是一个交互式可视化项目，通过地图展示唐诗中提及的城市、山川、河流、湖泊等地名，让读者从地理视角重新理解唐诗。',
  keywords: ['唐诗三百首', '唐诗', '地名', '地图', '可视化', '长安', '黄河', '长江', '李白', '杜甫', '王维', '中国古诗', '唐代', '地理'],
  authors: [{ name: 'Qualia Li' }],
  metadataBase: new URL('https://poetrymap.quanl.ai/'),
  alternates: {
    canonical: 'https://poetrymap.quanl.ai/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: '唐诗三百首地名地图',
    description: '唐诗三百首地名地图是一个交互式可视化项目，通过地图展示唐诗中提及的城市、山川、河流、湖泊等地名，让读者从地理视角重新理解唐诗。',
    siteName: '唐诗三百首地名地图',
    locale: 'zh_CN',
    type: 'website',
    url: 'https://poetrymap.quanl.ai/',
  },
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
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
