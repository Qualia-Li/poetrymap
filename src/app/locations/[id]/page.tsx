import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocationById, getLocationsWithPoems } from '@/lib/data'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const location = getLocationById(id)

  if (!location) {
    return { title: '地点未找到' }
  }

  return {
    title: `${location.name}（${location.modernName}）| 唐诗三百首地名地图`,
    description: `${location.description}。共有${location.poems.length}首唐诗提及此地。`,
  }
}

export async function generateStaticParams() {
  const locations = getLocationsWithPoems()
  return locations.map(loc => ({ id: loc.id }))
}

const typeNames: Record<string, string> = {
  city: '城市',
  mountain: '山川',
  river: '河流',
  lake: '湖泊',
  region: '地区',
  foreign: '域外',
  landmark: '名胜',
}

export default async function LocationPage({ params }: Props) {
  const { id } = await params
  const location = getLocationById(id)

  if (!location || location.poems.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-wider hover:opacity-80">
              唐诗三百首 · 地名地图
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="hover:underline">地图</Link>
            <Link href="/locations" className="hover:underline">地点</Link>
            <Link href="/poems" className="hover:underline">诗词</Link>
            <Link href="/about" className="hover:underline">关于</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/locations" className="hover:text-primary">地点</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{location.name}</span>
        </nav>

        {/* Location Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{location.name}</h1>
              <div className="text-gray-600">{location.modernName}</div>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {typeNames[location.type]}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{location.description}</p>

          {location.aliases.length > 0 && (
            <div className="mb-4">
              <span className="text-gray-500">诗中别称：</span>
              <span className="text-secondary font-medium">
                {location.aliases.join('、')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>坐标：{location.coordinates.join(', ')}</span>
            <span>•</span>
            <span>共 <strong className="text-primary">{location.poems.length}</strong> 首诗提及</span>
          </div>
        </div>

        {/* Poems */}
        <h2 className="text-xl font-bold text-primary mb-4">相关诗词</h2>
        <div className="space-y-6">
          {location.poems.map((poem, index) => (
            <article
              key={`${poem.poem_id}-${index}`}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <Link
                  href={`/poems/${poem.poem_id}`}
                  className="text-lg font-bold text-primary hover:underline"
                >
                  《{poem.title}》
                </Link>
                <span className="text-gray-500">{poem.author}</span>
              </div>

              {poem.relevant_lines.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <div className="text-sm text-gray-500 mb-1">相关诗句：</div>
                  {poem.relevant_lines.map((line, i) => (
                    <div key={i} className="text-gray-800">{line}</div>
                  ))}
                </div>
              )}

              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {poem.content}
              </div>
            </article>
          ))}
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/locations"
            className="inline-block px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary transition"
          >
            返回地点列表
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>唐诗三百首地名地图 | <a href="https://poetrymap.quanl.ai" className="text-primary hover:underline">poetrymap.quanl.ai</a></p>
        </div>
      </footer>
    </div>
  )
}
