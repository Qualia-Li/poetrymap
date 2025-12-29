import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPoemById, getPoems, getLocationById } from '@/lib/data'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const poem = getPoemById(parseInt(id))

  if (!poem) {
    return { title: '诗词未找到' }
  }

  return {
    title: `《${poem.title}》${poem.author} | 唐诗三百首地名地图`,
    description: poem.contents.substring(0, 150),
  }
}

export async function generateStaticParams() {
  const poems = getPoems()
  return poems.map(poem => ({ id: poem.id.toString() }))
}

export default async function PoemPage({ params }: Props) {
  const { id } = await params
  const poem = getPoemById(parseInt(id))

  if (!poem) {
    notFound()
  }

  const locationDetails = poem.locations
    ?.map(locId => getLocationById(locId))
    .filter(Boolean) || []

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
          <span className="text-primary">{poem.title}</span>
        </nav>

        {/* Poem */}
        <article className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <header className="text-center mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-primary mb-2">《{poem.title}》</h1>
            <div className="text-lg text-gray-600">{poem.author}</div>
            <div className="text-sm text-gray-400 mt-1">{poem.type}</div>
          </header>

          <div className="text-xl leading-loose text-center text-gray-800 whitespace-pre-line font-serif">
            {poem.contents}
          </div>
        </article>

        {/* Locations */}
        {locationDetails.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">诗中地名</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {locationDetails.map(loc => loc && (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.id}`}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <div className="font-medium text-gray-800">{loc.name}</div>
                  <div className="text-sm text-gray-500">{loc.modernName}</div>
                  <div className="text-xs text-gray-400 mt-1">{loc.description}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {poem.id > 1 && (
            <Link
              href={`/poems/${poem.id - 1}`}
              className="text-primary hover:underline"
            >
              ← 上一首
            </Link>
          )}
          <div className="flex-1"></div>
          {poem.id < 319 && (
            <Link
              href={`/poems/${poem.id + 1}`}
              className="text-primary hover:underline"
            >
              下一首 →
            </Link>
          )}
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
