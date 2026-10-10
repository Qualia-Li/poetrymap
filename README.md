# 唐诗三百首地名地图 | Tang Poetry 300 Geographic Map

🌏 **Live Demo: [poetrymap.quanl.ai](https://poetrymap.quanl.ai)**

An interactive map visualization of geographic references in the classic Chinese poetry collection "Three Hundred Tang Poems" (唐诗三百首).

![Tang Poetry Map](https://img.shields.io/badge/诗-319首-red) ![Locations](https://img.shields.io/badge/地点-57个-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- 🗺️ **Interactive Map** - Explore 57 locations mentioned in Tang Dynasty poetry
- 📍 **Location Categories** - Cities, Mountains, Rivers, Lakes, Regions, Foreign Lands
- 📜 **Poetry Display** - Click any location to see related poems with highlighted verses
- 🔍 **Search & Filter** - Find locations by name, aliases, or type
- 🏷️ **Alias Recognition** - Same location with different poetic names (e.g., 长安 = 京华 = 帝京)

## Statistics

| Category | Count | Examples |
|----------|-------|----------|
| 城市 Cities | 20 | 长安、洛阳、金陵、扬州 |
| 山川 Mountains | 12 | 泰山、华山、终南山、庐山 |
| 河流 Rivers | 6 | 黄河、长江、渭河、淮河 |
| 湖泊 Lakes | 4 | 洞庭湖、太湖、镜湖 |
| 地区 Regions | 8 | 江南、关中、巴蜀、楚 |
| 域外 Foreign | 7 | 匈奴、日本、龟兹、吐蕃 |

**Top Referenced Locations:**
1. 长江 (Yangtze River) - 72 poems
2. 汉水 (Han River) - 38 poems
3. 黄河 (Yellow River) - 30 poems
4. 长安 (Chang'an) - 26 poems
5. 匈奴 (Xiongnu) - 24 poems

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map**: Leaflet + React-Leaflet
- **Data**: JSON (analyzed from 319 Tang poems)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/user/poetrymap.git
cd poetrymap

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── page.tsx        # Main page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   ├── MapComponent.tsx  # Leaflet map
│   ├── Header.tsx        # Search & filters
│   └── Sidebar.tsx       # Location list & poem details
└── data/
    ├── analyzed_locations.json  # Location data with poems
    └── poems.json               # All 319 poems
```

## Data Analysis

The location analysis was performed using pattern matching to identify:
- **Direct references**: 长安、洛阳、黄河...
- **Poetic aliases**: 京华 (for 长安), 岱宗 (for 泰山)...
- **Regional references**: 楚天、吴越、关中...
- **Foreign lands**: 日本、龟兹、匈奴...

## Examples

### 长安 (Chang'an / Xi'an)
**Aliases**: 京城、京华、帝京、咸阳、凤城...

> 长安一片月，万户捣衣声。—— 李白《子夜四时歌·秋歌》

### 日本 (Japan)
**Aliases**: 东瀛、扶桑、瀛洲

> 上国随缘住，来途若梦行。浮天沧海远，去世法舟轻。—— 钱起《送僧归日本》

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Poetry data from [chinese-poetry](https://github.com/chinese-poetry/chinese-poetry)
- Map tiles from [OpenStreetMap](https://www.openstreetmap.org/copyright) (override with `NEXT_PUBLIC_MAP_TILE_URL` / `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION`)
- Font: [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC)

---

Made with ❤️ for classical Chinese poetry lovers
