import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocationsWithPoems } from '@/lib/data'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ type: string }>
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

const typeDescriptions: Record<string, string> = {
  city: '唐诗中提及的城市与都邑，包括长安、洛阳、金陵等',
  mountain: '唐诗中描绘的名山大川，包括泰山、华山、终南山等',
  river: '唐诗中歌咏的江河水系，包括黄河、长江、渭河等',
  lake: '唐诗中描写的湖泊水域，包括洞庭湖、太湖等',
  region: '唐诗中涉及的地理区域，包括江南、关中、巴蜀等',
  foreign: '唐代疆域以外的地区（注：此分类依据唐代疆域，与现代中国领土无关）',
  landmark: '唐诗中提及的著名建筑与名胜，包括黄鹤楼、鹳雀楼等',
}

const typeColors: Record<string, string> = {
  city: 'bg-red-500',
  mountain: 'bg-green-600',
  river: 'bg-blue-500',
  lake: 'bg-cyan-500',
  region: 'bg-purple-500',
  foreign: 'bg-orange-500',
  landmark: 'bg-yellow-500',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const typeName = typeNames[type]

  if (!typeName) {
    return { title: '类型未找到' }
  }

  return {
    title: `${typeName} | 唐诗三百首地名地图`,
    description: typeDescriptions[type],
  }
}

export async function generateStaticParams() {
  return Object.keys(typeNames).map((type) => ({ type }))
}

export default async function LocationTypePage({ params }: Props) {
  const { type } = await params
  const typeName = typeNames[type]

  if (!typeName) {
    notFound()
  }

  const allLocations = getLocationsWithPoems()
  const locations = allLocations.filter((loc) => loc.type === type)
    .sort((a, b) => b.poems.length - a.poems.length)

  const totalPoems = new Set(locations.flatMap((l) => l.poems.map((p) => p.poem_id))).size

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
          <span className="text-primary">{typeName}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-6 h-6 rounded-full ${typeColors[type]}`}></span>
            <h1 className="text-3xl font-bold text-primary">{typeName}</h1>
          </div>
          <p className="text-gray-700 mb-4">{typeDescriptions[type]}</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>共 <strong className="text-primary">{locations.length}</strong> 个地点</span>
            <span>涉及 <strong className="text-primary">{totalPoems}</strong> 首诗</span>
          </div>
        </div>

        {/* Location List */}
        <div className="grid md:grid-cols-2 gap-4">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.id}`}
              className="bg-white rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-lg">{loc.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {loc.poems.length}首
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-1">{loc.modernName}</div>
              <div className="text-xs text-gray-400 line-clamp-2">{loc.description}</div>
              {loc.aliases.length > 0 && (
                <div className="text-xs text-gray-400 mt-2">
                  别称：{loc.aliases.slice(0, 3).join('、')}
                  {loc.aliases.length > 3 && '...'}
                </div>
              )}
            </Link>
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
