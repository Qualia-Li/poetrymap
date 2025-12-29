import Link from 'next/link'
import { getLocationsWithPoems, getLocationStats } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '地点列表 | 唐诗三百首地名地图',
  description: '唐诗三百首中提及的所有地点，包括城市、山川、河流、湖泊等',
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

const typeColors: Record<string, string> = {
  city: 'bg-red-500',
  mountain: 'bg-green-600',
  river: 'bg-blue-500',
  lake: 'bg-cyan-500',
  region: 'bg-purple-500',
  foreign: 'bg-orange-500',
  landmark: 'bg-yellow-500',
}

export default function LocationsPage() {
  const locations = getLocationsWithPoems()
  const stats = getLocationStats()

  const sortedLocations = [...locations].sort((a, b) => b.poems.length - a.poems.length)

  const groupedByType: Record<string, typeof locations> = {}
  locations.forEach(loc => {
    if (!groupedByType[loc.type]) {
      groupedByType[loc.type] = []
    }
    groupedByType[loc.type].push(loc)
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-wider hover:opacity-80">
              唐诗三百首 · 地名地图
            </Link>
            <p className="text-sm opacity-80 mt-1">地点列表</p>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="hover:underline">地图</Link>
            <Link href="/locations" className="font-bold underline">地点</Link>
            <Link href="/poems" className="hover:underline">诗词</Link>
            <Link href="/about" className="hover:underline">关于</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-primary">{stats.totalLocations}</div>
            <div className="text-sm text-gray-600">地点总数</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-primary">{stats.totalPoems}</div>
            <div className="text-sm text-gray-600">相关诗词</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-primary">{Object.keys(stats.byType).length}</div>
            <div className="text-sm text-gray-600">地点类型</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-primary">
              {stats.topLocations[0]?.poems.length || 0}
            </div>
            <div className="text-sm text-gray-600">最多引用</div>
          </div>
        </div>

        {/* Type Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(typeNames).map(([type, name]) => (
            <div key={type} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${typeColors[type]}`}></span>
              <span className="text-sm">{name} ({stats.byType[type] || 0})</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-8">
          注：「域外」指唐代疆域以外的地区，此分类依据唐代疆域划分，与现代中国领土无关。
        </p>

        {/* Top 10 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-4">引用最多的地点</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {stats.topLocations.map((loc, index) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="bg-white rounded-lg p-4 shadow hover:shadow-md transition flex items-center gap-4"
              >
                <div className="text-2xl font-bold text-gray-300 w-8">
                  {index + 1}
                </div>
                <div className={`w-4 h-4 rounded-full ${typeColors[loc.type]}`}></div>
                <div className="flex-1">
                  <div className="font-medium">{loc.name}</div>
                  <div className="text-sm text-gray-500">
                    {loc.modernName} · {loc.aliases.slice(0, 3).join('、')}
                  </div>
                </div>
                <div className="text-primary font-bold">{loc.poems.length}首</div>
              </Link>
            ))}
          </div>
        </section>

        {/* By Type */}
        {Object.entries(groupedByType).map(([type, locs]) => (
          <section key={type} className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full ${typeColors[type]}`}></span>
              {typeNames[type]} ({locs.length})
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {locs.sort((a, b) => b.poems.length - a.poems.length).map(loc => (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.id}`}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{loc.name}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {loc.poems.length}首
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{loc.modernName}</div>
                  {loc.aliases.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      别称：{loc.aliases.slice(0, 3).join('、')}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>唐诗三百首地名地图 | <a href="https://poetrymap.quanl.ai" className="text-primary hover:underline">poetrymap.quanl.ai</a></p>
        </div>
      </footer>
    </div>
  )
}
