import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPoems, getLocationsWithPoems } from '@/lib/data'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ author: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author } = await params
  const decodedAuthor = decodeURIComponent(author)
  const poems = getPoems()
  const authorPoems = poems.filter((p) => p.author === decodedAuthor)

  if (authorPoems.length === 0) {
    return { title: '诗人未找到' }
  }

  return {
    title: `${decodedAuthor}的诗 | 唐诗三百首地名地图`,
    description: `唐诗三百首中${decodedAuthor}的${authorPoems.length}首诗词`,
  }
}

export async function generateStaticParams() {
  const poems = getPoems()
  const authors = Array.from(new Set(poems.map((p) => p.author)))
  return authors.map((author) => ({ author: encodeURIComponent(author) }))
}

export default async function AuthorPage({ params }: Props) {
  const { author } = await params
  const decodedAuthor = decodeURIComponent(author)

  const poems = getPoems()
  const locations = getLocationsWithPoems()
  const authorPoems = poems.filter((p) => p.author === decodedAuthor)

  if (authorPoems.length === 0) {
    notFound()
  }

  const poemsWithLocs = authorPoems.filter((p) => p.locations && p.locations.length > 0)
  const locationMap = new Map(locations.map((l) => [l.id, l.name]))

  // Get all unique locations mentioned by this author
  const authorLocations = new Set<string>()
  authorPoems.forEach((poem) => {
    poem.locations?.forEach((locId) => {
      const locName = locationMap.get(locId)
      if (locName) authorLocations.add(locName)
    })
  })

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
          <Link href="/poems" className="hover:text-primary">诗词</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{decodedAuthor}</span>
        </nav>

        {/* Author Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">{decodedAuthor}</h1>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-primary">{authorPoems.length}</div>
              <div className="text-sm text-gray-500">诗词数</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-primary">{poemsWithLocs.length}</div>
              <div className="text-sm text-gray-500">含地名</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-primary">{authorLocations.size}</div>
              <div className="text-sm text-gray-500">涉及地点</div>
            </div>
          </div>

          {authorLocations.size > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-2">提及的地点：</div>
              <div className="flex flex-wrap gap-2">
                {Array.from(authorLocations).slice(0, 10).map((loc) => (
                  <span key={loc} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {loc}
                  </span>
                ))}
                {authorLocations.size > 10 && (
                  <span className="text-xs text-gray-400">+{authorLocations.size - 10}个</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Poems */}
        <h2 className="text-xl font-bold text-primary mb-4">诗词作品</h2>
        <div className="space-y-4">
          {authorPoems.map((poem) => (
            <Link
              key={poem.id}
              href={`/poems/${poem.id}`}
              className="block bg-white rounded-lg p-5 shadow hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium text-gray-800">《{poem.title}》</span>
                <span className="text-xs text-gray-400">{poem.type}</span>
              </div>
              <div className="text-gray-600 text-sm leading-relaxed line-clamp-3 whitespace-pre-line">
                {poem.contents}
              </div>
              {poem.locations && poem.locations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {poem.locations.map((locId) => (
                    <span
                      key={locId}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                    >
                      {locationMap.get(locId) || locId}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/poems"
            className="inline-block px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary transition"
          >
            返回诗词列表
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
