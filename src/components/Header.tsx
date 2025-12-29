'use client'

import { useState } from 'react'

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: string
  setFilterType: (type: string) => void
}

const typeLabels: Record<string, string> = {
  all: '全部',
  city: '城市',
  mountain: '山川',
  river: '河流',
  lake: '湖泊',
  region: '地区',
  foreign: '域外',
  landmark: '名胜',
}

export default function Header({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white px-3 md:px-6 py-3 md:py-4 shadow-lg relative z-[1000]">
      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-wider">唐诗三百首 · 地名地图</h1>
          <p className="text-sm opacity-80 mt-1">探索诗人笔下的山川河流与历史地理</p>
        </div>

        <div className="flex items-center gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索地名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 px-4 py-2 pl-10 rounded-full bg-white/20 backdrop-blur text-white placeholder-white/60 outline-none focus:bg-white/30 transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 类型过滤 */}
          <div className="flex gap-2">
            {Object.entries(typeLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilterType(value)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterType === value
                    ? 'bg-white text-primary font-medium'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 反馈链接 */}
          <a
            href="https://github.com/Qualia-Li/poetrymap/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-sm bg-white/20 hover:bg-white/30 transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
            </svg>
            反馈
          </a>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-wider">唐诗三百首 · 地名地图</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              aria-label="筛选"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <a
              href="https://github.com/Qualia-Li/poetrymap/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              aria-label="反馈"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile expandable filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/20">
            {/* 搜索框 */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="搜索地名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-full bg-white/20 backdrop-blur text-white placeholder-white/60 outline-none focus:bg-white/30 transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* 类型过滤 - 横向滚动 */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 scrollbar-hide">
              {Object.entries(typeLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilterType(value)}
                  className={`px-3 py-1.5 rounded-full text-sm transition whitespace-nowrap flex-shrink-0 ${
                    filterType === value
                      ? 'bg-white text-primary font-medium'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
