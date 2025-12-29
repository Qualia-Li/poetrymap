import Link from 'next/link'
import { getLocationStats } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于 | 唐诗三百首地名地图',
  description: '关于唐诗三百首地名地图项目的介绍',
}

export default function AboutPage() {
  const stats = getLocationStats()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-wider hover:opacity-80">
              唐诗三百首 · 地名地图
            </Link>
            <p className="text-sm opacity-80 mt-1">关于项目</p>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="hover:underline">地图</Link>
            <Link href="/locations" className="hover:underline">地点</Link>
            <Link href="/poems" className="hover:underline">诗词</Link>
            <Link href="/about" className="font-bold underline">关于</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-primary mb-6">关于本项目</h1>

          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">项目简介</h2>
            <p className="text-gray-700 leading-relaxed">
              唐诗三百首地名地图是一个交互式可视化项目，旨在探索唐诗中的地理意象。
              通过对《唐诗三百首》全部319首诗进行文本分析，识别出诗中提及的城市、山川、河流、湖泊等地名，
              并在地图上进行可视化展示，让读者能够从地理视角重新理解唐诗。
            </p>
          </section>

          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">数据统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-primary">319</div>
                <div className="text-sm text-gray-600">诗词总数</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-primary">{stats.totalLocations}</div>
                <div className="text-sm text-gray-600">地点总数</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-primary">{stats.totalPoems}</div>
                <div className="text-sm text-gray-600">含地名诗词</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-primary">7</div>
                <div className="text-sm text-gray-600">地点类型</div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">地名类型</h2>
            <ul className="space-y-2 text-gray-700">
              <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span><strong>城市</strong>：长安、洛阳、金陵、扬州、成都等唐代重要城市</li>
              <li><span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2"></span><strong>山川</strong>：泰山、华山、终南山、庐山、峨眉山等名山</li>
              <li><span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span><strong>河流</strong>：黄河、长江、渭河、淮河、汉水等大河</li>
              <li><span className="inline-block w-3 h-3 bg-cyan-500 rounded-full mr-2"></span><strong>湖泊</strong>：洞庭湖、太湖、镜湖、青海等湖泊</li>
              <li><span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span><strong>地区</strong>：江南、关中、巴蜀、楚地等地理区域</li>
              <li><span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span><strong>域外</strong>：匈奴、日本、龟兹、吐蕃等唐代疆域以外的地区（注：此分类依据唐代疆域，与现代中国领土无关）</li>
              <li><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span><strong>名胜</strong>：黄鹤楼、鹳雀楼等著名建筑</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">别名识别</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              唐诗中常用典故、别称来指代地名。本项目识别了大量的地名别称，例如：
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>长安</strong>：京城、京华、帝京、咸阳、凤城、九重、金阙、紫禁、皇州</li>
              <li><strong>金陵</strong>：建康、石头城、秦淮、乌衣巷、朱雀桥、台城</li>
              <li><strong>泰山</strong>：岱宗、岱、东岳</li>
              <li><strong>日本</strong>：东瀛、扶桑、瀛洲</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">技术栈</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>框架</strong>：Next.js 14 (App Router, SSR/SSG)</li>
              <li><strong>语言</strong>：TypeScript</li>
              <li><strong>样式</strong>：Tailwind CSS</li>
              <li><strong>地图</strong>：Leaflet + React-Leaflet</li>
              <li><strong>数据</strong>：JSON (基于NLP分析生成)</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">开源</h2>
            <p className="text-gray-700 leading-relaxed">
              本项目采用 MIT 许可证开源，欢迎贡献代码和提出建议。
            </p>
            <div className="mt-4">
              <a
                href="https://github.com/Qualia-Li/poetrymap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
                GitHub
              </a>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-primary mb-4">致谢</h2>
            <ul className="space-y-2 text-gray-700">
              <li>诗词数据来源：<a href="https://github.com/chinese-poetry/chinese-poetry" className="text-primary hover:underline">chinese-poetry</a></li>
              <li>地图服务：<a href="https://carto.com/" className="text-primary hover:underline">CARTO</a></li>
              <li>字体：<a href="https://fonts.google.com/noto/specimen/Noto+Serif+SC" className="text-primary hover:underline">Noto Serif SC</a></li>
            </ul>
          </section>
        </article>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>唐诗三百首地名地图 | <a href="https://poetrymap.quanl.ai" className="text-primary hover:underline">poetrymap.quanl.ai</a></p>
        </div>
      </footer>
    </div>
  )
}
