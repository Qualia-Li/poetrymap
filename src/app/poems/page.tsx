import Link from 'next/link'
import { getPoems, getLocationsWithPoems } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '诗词列表 | 唐诗三百首地名地图',
  description: '唐诗三百首全部319首诗词，包含地名标注',
}

export default function PoemsPage() {
  const poems = getPoems()
  const locations = getLocationsWithPoems()
  const poemsWithLocs = poems.filter(p => p.locations && p.locations.length > 0)

  // Group by author
  const byAuthor: Record<string, typeof poems> = {}
  poems.forEach(poem => {
    if (!byAuthor[poem.author]) {
      byAuthor[poem.author] = []
    }
    byAuthor[poem.author].push(poem)
  })

  // Sort authors by poem count
  const sortedAuthors = Object.entries(byAuthor)
    .sort((a, b) => b[1].length - a[1].length)

  // Get location name by id
  const locationMap = new Map(locations.map(l => [l.id, l.name]))

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-wider hover:opacity-80">
              唐诗三百首 · 地名地图
            </Link>
            <p className="text-sm opacity-80 mt-1">诗词列表</p>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="hover:underline">地图</Link>
            <Link href="/locations" className="hover:underline">地点</Link>
            <Link href="/poems" className="font-bold underline">诗词</Link>
            <Link href="/about" className="hover:underline">关于</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="text-3xl font-bold text-primary">{poems.length}</div>
            <div className="text-sm text-gray-600">诗词总数</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="text-3xl font-bold text-primary">{poemsWithLocs.length}</div>
            <div className="text-sm text-gray-600">含地名诗词</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="text-3xl font-bold text-primary">{sortedAuthors.length}</div>
            <div className="text-sm text-gray-600">诗人数量</div>
          </div>
        </div>

        {/* By Author */}
        {sortedAuthors.map(([author, authorPoems]) => (
          <section key={author} className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              {author}
              <span className="text-sm font-normal text-gray-500">({authorPoems.length}首)</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authorPoems.map(poem => (
                <Link
                  key={poem.id}
                  href={`/poems/${poem.id}`}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <div className="font-medium text-gray-800 mb-1">《{poem.title}》</div>
                  <div className="text-xs text-gray-500 mb-2">{poem.type}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {poem.contents.split('\n')[0]}...
                  </div>
                  {poem.locations && poem.locations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {poem.locations.slice(0, 3).map(locId => (
                        <span
                          key={locId}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                        >
                          {locationMap.get(locId) || locId}
                        </span>
                      ))}
                      {poem.locations.length > 3 && (
                        <span className="text-xs text-gray-400">+{poem.locations.length - 3}</span>
                      )}
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
