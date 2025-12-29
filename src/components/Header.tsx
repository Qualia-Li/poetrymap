'use client'

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
  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
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
        </div>
      </div>
    </header>
  )
}
