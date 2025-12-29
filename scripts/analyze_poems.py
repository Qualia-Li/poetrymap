#!/usr/bin/env python3
"""
分析唐诗三百首中的地名并建立诗句与地名的关联
修正版：更精确的地名匹配，避免过度匹配
"""
import json
import re
from pathlib import Path

# 读取原始诗歌数据
poems_path = Path(__file__).parent.parent / "src" / "data" / "poems.json"
locations_path = Path(__file__).parent / "locations_base.json"
output_locations_path = Path(__file__).parent.parent / "src" / "data" / "analyzed_locations.json"
output_poems_path = Path(__file__).parent.parent / "src" / "data" / "poems.json"

# 基础地名数据
locations_base = {
  "locations": [
    {"id": "changan", "name": "长安", "type": "city", "aliases": ["京城", "京华", "帝京", "咸阳", "凤城", "帝都", "九重", "金阙", "紫禁", "皇州"], "modernName": "西安", "coordinates": [108.9402, 34.3416], "description": "唐朝首都，位于今陕西西安"},
    {"id": "luoyang", "name": "洛阳", "type": "city", "aliases": ["东都", "神都", "河洛", "京洛"], "modernName": "洛阳", "coordinates": [112.4539, 34.6197], "description": "唐朝东都，位于今河南洛阳"},
    {"id": "jinling", "name": "金陵", "type": "city", "aliases": ["建康", "石头城", "秦淮", "乌衣巷", "朱雀桥", "台城", "六朝"], "modernName": "南京", "coordinates": [118.7969, 32.0603], "description": "六朝古都，位于今江苏南京"},
    {"id": "yangzhou", "name": "扬州", "type": "city", "aliases": ["广陵", "维扬", "江都"], "modernName": "扬州", "coordinates": [119.4130, 32.3944], "description": "唐代繁华商业城市，位于今江苏扬州"},
    {"id": "chengdu", "name": "成都", "type": "city", "aliases": ["锦官城", "锦城", "益州", "蜀都"], "modernName": "成都", "coordinates": [104.0668, 30.5728], "description": "蜀地中心城市，位于今四川成都"},
    {"id": "xiangyang", "name": "襄阳", "type": "city", "aliases": ["襄州", "襄水"], "modernName": "襄阳", "coordinates": [112.1220, 32.0090], "description": "位于今湖北襄阳"},
    {"id": "jiangling", "name": "江陵", "type": "city", "aliases": ["荆州", "荆门"], "modernName": "荆州", "coordinates": [112.2390, 30.3260], "description": "位于今湖北荆州"},
    {"id": "suzhou", "name": "苏州", "type": "city", "aliases": ["姑苏", "吴门"], "modernName": "苏州", "coordinates": [120.5853, 31.2989], "description": "位于今江苏苏州"},
    {"id": "hangzhou", "name": "杭州", "type": "city", "aliases": ["钱塘", "临安"], "modernName": "杭州", "coordinates": [120.1551, 30.2741], "description": "位于今浙江杭州"},
    {"id": "changsha", "name": "长沙", "type": "city", "aliases": [], "modernName": "长沙", "coordinates": [112.9389, 28.2282], "description": "位于今湖南长沙"},
    {"id": "youzhou", "name": "幽州", "type": "city", "aliases": ["幽燕", "燕", "蓟门", "蓟北", "燕台"], "modernName": "北京", "coordinates": [116.4074, 39.9042], "description": "位于今北京地区"},
    {"id": "lintao", "name": "临洮", "type": "city", "aliases": [], "modernName": "临洮", "coordinates": [103.8594, 35.3760], "description": "唐代边塞重镇，位于今甘肃临洮"},
    {"id": "liangzhou", "name": "凉州", "type": "city", "aliases": [], "modernName": "武威", "coordinates": [102.6349, 37.9283], "description": "河西走廊重镇，位于今甘肃武威"},
    {"id": "luntai", "name": "轮台", "type": "city", "aliases": [], "modernName": "轮台", "coordinates": [84.2520, 41.7770], "description": "西域边塞重镇，位于今新疆轮台"},
    {"id": "dunhuang", "name": "敦煌", "type": "city", "aliases": ["玉门关", "玉关", "阳关"], "modernName": "敦煌", "coordinates": [94.6618, 40.1421], "description": "丝绸之路重镇，位于今甘肃敦煌"},
    {"id": "xunyang", "name": "浔阳", "type": "city", "aliases": ["九江", "江州"], "modernName": "九江", "coordinates": [116.0010, 29.7050], "description": "位于今江西九江"},
    {"id": "yueyang", "name": "岳阳", "type": "city", "aliases": ["巴陵"], "modernName": "岳阳", "coordinates": [113.1286, 29.3571], "description": "位于今湖南岳阳"},
    {"id": "hanyang", "name": "汉阳", "type": "city", "aliases": ["汉口", "鄂州"], "modernName": "武汉", "coordinates": [114.2657, 30.5840], "description": "位于今湖北武汉"},
    {"id": "tongguan", "name": "潼关", "type": "city", "aliases": ["秦关"], "modernName": "潼关", "coordinates": [110.2408, 34.5437], "description": "著名关隘，位于今陕西潼关"},
    {"id": "jiange", "name": "剑阁", "type": "city", "aliases": ["剑门"], "modernName": "剑阁", "coordinates": [105.5244, 32.2879], "description": "著名关隘，位于今四川剑阁"},
    {"id": "taishan", "name": "泰山", "type": "mountain", "aliases": ["岱宗", "岱", "东岳"], "modernName": "泰山", "coordinates": [117.1013, 36.2565], "description": "五岳之首，位于今山东泰安"},
    {"id": "huashan", "name": "华山", "type": "mountain", "aliases": ["太华", "西岳"], "modernName": "华山", "coordinates": [110.0889, 34.4936], "description": "五岳之一，位于今陕西华阴"},
    {"id": "songshan", "name": "嵩山", "type": "mountain", "aliases": ["嵩高", "中岳"], "modernName": "嵩山", "coordinates": [113.0381, 34.4839], "description": "五岳之一，位于今河南登封"},
    {"id": "hengshan", "name": "衡山", "type": "mountain", "aliases": ["衡岳", "南岳"], "modernName": "衡山", "coordinates": [112.6887, 27.2543], "description": "五岳之一，位于今湖南衡阳"},
    {"id": "zhongnan", "name": "终南山", "type": "mountain", "aliases": ["南山", "太乙"], "modernName": "终南山", "coordinates": [108.8160, 33.9500], "description": "位于今陕西西安南部"},
    {"id": "lushan", "name": "庐山", "type": "mountain", "aliases": ["匡庐"], "modernName": "庐山", "coordinates": [115.9594, 29.5601], "description": "位于今江西九江"},
    {"id": "emei", "name": "峨眉山", "type": "mountain", "aliases": ["峨眉", "峨嵋"], "modernName": "峨眉山", "coordinates": [103.3323, 29.5203], "description": "位于今四川峨眉"},
    {"id": "tianshan", "name": "天山", "type": "mountain", "aliases": [], "modernName": "天山", "coordinates": [86.0000, 42.0000], "description": "位于今新疆"},
    {"id": "yinshan", "name": "阴山", "type": "mountain", "aliases": [], "modernName": "阴山", "coordinates": [110.0000, 41.0000], "description": "位于今内蒙古"},
    {"id": "wushan", "name": "巫山", "type": "mountain", "aliases": ["巫峡"], "modernName": "巫山", "coordinates": [110.2220, 31.0500], "description": "位于今重庆巫山"},
    {"id": "tianmu", "name": "天姥山", "type": "mountain", "aliases": ["天姥"], "modernName": "天姥山", "coordinates": [120.8500, 29.2500], "description": "位于今浙江新昌"},
    {"id": "helanshan", "name": "贺兰山", "type": "mountain", "aliases": ["贺兰"], "modernName": "贺兰山", "coordinates": [105.9000, 38.8000], "description": "位于今宁夏与内蒙古交界"},
    {"id": "luermen", "name": "鹿门山", "type": "mountain", "aliases": ["鹿门"], "modernName": "鹿门山", "coordinates": [112.0900, 31.9700], "description": "位于今湖北襄阳"},
    {"id": "yellowriver", "name": "黄河", "type": "river", "aliases": [], "modernName": "黄河", "coordinates": [105.0000, 36.0000], "description": "中华民族母亲河"},
    {"id": "yangtze", "name": "长江", "type": "river", "aliases": ["大江"], "modernName": "长江", "coordinates": [118.0000, 32.0000], "description": "中国第一大河"},
    {"id": "weihe", "name": "渭河", "type": "river", "aliases": ["渭水", "渭城", "渭川"], "modernName": "渭河", "coordinates": [108.0000, 34.5000], "description": "黄河最大支流，流经关中平原"},
    {"id": "huaihe", "name": "淮河", "type": "river", "aliases": ["淮水", "淮", "清淮"], "modernName": "淮河", "coordinates": [117.0000, 33.0000], "description": "中国南北分界河流"},
    {"id": "hanshui", "name": "汉水", "type": "river", "aliases": ["汉江"], "modernName": "汉江", "coordinates": [112.0000, 32.0000], "description": "长江最大支流"},
    {"id": "dongting", "name": "洞庭湖", "type": "lake", "aliases": ["洞庭", "云梦泽", "云梦", "君山"], "modernName": "洞庭湖", "coordinates": [112.8000, 29.4000], "description": "中国第二大淡水湖"},
    {"id": "taihu", "name": "太湖", "type": "lake", "aliases": ["五湖", "震泽"], "modernName": "太湖", "coordinates": [120.2000, 31.2000], "description": "中国第三大淡水湖"},
    {"id": "jinghu", "name": "镜湖", "type": "lake", "aliases": ["鉴湖"], "modernName": "绍兴鉴湖", "coordinates": [120.5000, 30.0000], "description": "位于今浙江绍兴"},
    {"id": "xiangjiang", "name": "湘江", "type": "river", "aliases": ["潇湘", "湘水"], "modernName": "湘江", "coordinates": [112.0000, 28.0000], "description": "流经湖南的主要河流"},
    {"id": "qinghai", "name": "青海", "type": "lake", "aliases": ["青海湾", "西海"], "modernName": "青海湖", "coordinates": [100.2000, 36.9000], "description": "中国最大咸水湖"},
    {"id": "xiongnu", "name": "匈奴", "type": "foreign", "aliases": ["单于"], "modernName": "古代北方游牧民族", "coordinates": [110.0000, 45.0000], "description": "古代北方游牧民族政权"},
    {"id": "qiuci", "name": "龟兹", "type": "foreign", "aliases": [], "modernName": "库车", "coordinates": [82.9370, 41.7178], "description": "西域古国，位于今新疆库车"},
    {"id": "wusun", "name": "乌孙", "type": "foreign", "aliases": [], "modernName": "伊犁地区", "coordinates": [81.3240, 43.9160], "description": "西域古国，位于今新疆伊犁"},
    {"id": "tubo", "name": "吐蕃", "type": "foreign", "aliases": ["羌"], "modernName": "西藏", "coordinates": [91.1000, 29.6500], "description": "古代藏族政权"},
    {"id": "cheshi", "name": "车师", "type": "foreign", "aliases": [], "modernName": "吐鲁番", "coordinates": [89.1870, 42.9470], "description": "西域古国，位于今新疆吐鲁番"},
    {"id": "japan", "name": "日本", "type": "foreign", "aliases": ["东瀛", "扶桑", "瀛洲"], "modernName": "日本", "coordinates": [139.6917, 35.6895], "description": "东海之外的岛国，唐代有频繁的文化交流"},
    {"id": "liaodong", "name": "辽东", "type": "region", "aliases": ["辽阳"], "modernName": "辽宁东部", "coordinates": [123.4000, 41.8000], "description": "东北地区"},
    {"id": "guanzhong", "name": "关中", "type": "region", "aliases": ["秦川", "秦地", "三秦"], "modernName": "陕西关中平原", "coordinates": [108.5000, 34.5000], "description": "关中平原地区"},
    {"id": "jiangnan", "name": "江南", "type": "region", "aliases": ["吴越", "吴"], "modernName": "长江以南地区", "coordinates": [120.0000, 31.0000], "description": "长江以南富庶地区"},
    {"id": "bashu", "name": "巴蜀", "type": "region", "aliases": ["蜀道", "三巴", "巴峡"], "modernName": "四川盆地", "coordinates": [104.0000, 30.5000], "description": "四川盆地地区"},
    {"id": "chu", "name": "楚", "type": "region", "aliases": ["楚天", "楚地", "荆楚", "荆蛮"], "modernName": "湖北湖南地区", "coordinates": [114.0000, 30.5000], "description": "古楚国地区"},
    {"id": "longxi", "name": "陇西", "type": "region", "aliases": ["陇", "陇头"], "modernName": "甘肃东部", "coordinates": [104.5000, 35.0000], "description": "甘肃东部地区"},
    {"id": "qilu", "name": "齐鲁", "type": "region", "aliases": ["齐", "鲁"], "modernName": "山东", "coordinates": [117.0000, 36.5000], "description": "山东地区"},
    {"id": "huanghelou", "name": "黄鹤楼", "type": "landmark", "aliases": [], "modernName": "黄鹤楼", "coordinates": [114.3046, 30.5458], "description": "著名楼阁，位于今湖北武汉"},
    {"id": "guanquelou", "name": "鹳雀楼", "type": "landmark", "aliases": [], "modernName": "鹳雀楼", "coordinates": [110.2500, 34.8500], "description": "著名楼阁，位于今山西永济"},
  ]
}

# 精确匹配关键词 - 避免过度匹配
# 注意：移除了单字"江"的匹配，因为"江"在诗中可能指任何河流
location_keywords = {
    # 长安相关 - 不使用"国"因为太泛
    "长安": "changan", "京华": "changan", "帝京": "changan", "咸阳": "changan",
    "凤城": "changan", "九重": "changan", "金阙": "changan", "紫禁": "changan",
    "皇州": "changan", "帝都": "changan",

    # 洛阳相关
    "洛阳": "luoyang", "东都": "luoyang", "河洛": "luoyang", "京洛": "luoyang",

    # 金陵相关
    "金陵": "jinling", "石头城": "jinling", "秦淮": "jinling",
    "乌衣巷": "jinling", "朱雀桥": "jinling", "台城": "jinling",

    # 扬州相关
    "扬州": "yangzhou", "广陵": "yangzhou", "维扬": "yangzhou", "江都": "yangzhou",

    # 成都相关
    "锦官城": "chengdu", "锦城": "chengdu", "锦江": "chengdu",

    # 山川
    "岱宗": "taishan", "泰山": "taishan",
    "太华": "huashan", "华山": "huashan", "华阴": "huashan",
    "嵩山": "songshan", "嵩高": "songshan",
    "衡岳": "hengshan", "衡山": "hengshan",
    "终南": "zhongnan", "太乙": "zhongnan",
    "庐山": "lushan", "匡庐": "lushan",
    "峨眉": "emei", "峨嵋": "emei",
    "天山": "tianshan",
    "阴山": "yinshan",
    "巫山": "wushan", "巫峡": "wushan",
    "天姥": "tianmu",
    "贺兰山": "helanshan", "贺兰": "helanshan",
    "鹿门": "luermen",

    # 河流湖泊 - 注意：不使用单字"江"或"河"
    "黄河": "yellowriver",
    "长江": "yangtze", "大江": "yangtze",  # 移除"扬子"因为不常见
    "渭水": "weihe", "渭城": "weihe", "渭川": "weihe",
    "淮水": "huaihe", "淮河": "huaihe", "清淮": "huaihe",
    "汉水": "hanshui", "汉江": "hanshui",
    "洞庭": "dongting", "云梦泽": "dongting", "云梦": "dongting", "君山": "dongting",
    "太湖": "taihu", "五湖": "taihu",
    "镜湖": "jinghu", "鉴湖": "jinghu",
    "潇湘": "xiangjiang", "湘水": "xiangjiang", "湘江": "xiangjiang",
    "青海": "qinghai",

    # 边塞
    "轮台": "luntai",
    "临洮": "lintao",
    "凉州": "liangzhou",
    "玉门关": "dunhuang", "玉关": "dunhuang", "阳关": "dunhuang",
    "萧关": "tongguan",
    "龙城": "youzhou",
    "蓟门": "youzhou", "蓟北": "youzhou", "幽州": "youzhou", "燕台": "youzhou",
    "幽燕": "youzhou",

    # 地区 - 注意：不使用单字"蜀"因为可能过度匹配
    "关中": "guanzhong", "秦川": "guanzhong", "秦地": "guanzhong", "三秦": "guanzhong",
    "江南": "jiangnan", "吴越": "jiangnan",
    "巴蜀": "bashu", "蜀道": "bashu", "三巴": "bashu", "巴峡": "bashu",
    "楚天": "chu", "楚地": "chu", "荆楚": "chu",
    "陇西": "longxi", "陇头": "longxi",
    "辽东": "liaodong", "辽阳": "liaodong",
    "齐鲁": "qilu",

    # 外族/域外 - 注意：不使用单字"胡"因为太泛
    "匈奴": "xiongnu", "单于": "xiongnu",
    "龟兹": "qiuci",
    "乌孙": "wusun",
    "吐蕃": "tubo",
    "车师": "cheshi",
    "日本": "japan", "东瀛": "japan", "扶桑": "japan", "瀛洲": "japan",

    # 城市
    "苏州": "suzhou", "姑苏": "suzhou",
    "杭州": "hangzhou", "钱塘": "hangzhou",
    "长沙": "changsha",
    "襄阳": "xiangyang", "襄水": "xiangyang",
    "江陵": "jiangling", "荆门": "jiangling",
    "浔阳": "xunyang", "九江": "xunyang", "江州": "xunyang",
    "岳阳": "yueyang", "巴陵": "yueyang",
    "汉阳": "hanyang", "汉口": "hanyang", "鄂州": "hanyang",
    "潼关": "tongguan", "秦关": "tongguan",
    "剑阁": "jiange", "剑门": "jiange",

    # 著名地标
    "黄鹤楼": "huanghelou",
    "鹳雀楼": "guanquelou",
}

# 需要读取已有的poems.json来获取原始诗歌内容
# 因为poems.json可能已经有locations字段，我们需要原始数据
# 从tang_poems_raw.json读取或者从poems.json提取content

# 如果没有原始数据，从poems.json读取
with open(poems_path, 'r', encoding='utf-8') as f:
    poems = json.load(f)

# 分析每首诗
location_poem_map = {}  # location_id -> [{poem_id, title, author, relevant_lines}]

for poem in poems:
    poem_id = poem['id']
    content = poem.get('contents', poem.get('content', ''))
    title = poem['title']
    author = poem['author']

    found_locations = set()

    # 搜索诗句中的地名
    for keyword, loc_id in location_keywords.items():
        if keyword in content or keyword in title:
            found_locations.add(loc_id)

            # 找出包含该地名的具体诗句
            lines = content.split('\n')
            relevant_lines = []
            for line in lines:
                if keyword in line:
                    relevant_lines.append(line)

            if loc_id not in location_poem_map:
                location_poem_map[loc_id] = []

            # 避免重复添加
            existing = [p for p in location_poem_map[loc_id] if p['poem_id'] == poem_id]
            if not existing:
                location_poem_map[loc_id].append({
                    'poem_id': poem_id,
                    'title': title,
                    'author': author,
                    'content': content,
                    'relevant_lines': relevant_lines,
                    'keyword': keyword
                })
            else:
                # 更新相关诗句
                for e in existing:
                    for line in relevant_lines:
                        if line not in e['relevant_lines']:
                            e['relevant_lines'].append(line)

    # 更新poem的locations字段
    poem['locations'] = list(found_locations)

# 更新locations数据
locations_data = locations_base.copy()
for loc in locations_data['locations']:
    loc_id = loc['id']
    if loc_id in location_poem_map:
        loc['poems'] = location_poem_map[loc_id]
    else:
        loc['poems'] = []

# 保存分析结果
with open(output_locations_path, 'w', encoding='utf-8') as f:
    json.dump(locations_data, f, ensure_ascii=False, indent=2)

with open(output_poems_path, 'w', encoding='utf-8') as f:
    json.dump(poems, f, ensure_ascii=False, indent=2)

# 打印统计信息
poems_with_locations = [p for p in poems if p.get('locations') and len(p['locations']) > 0]
print(f"总共分析了 {len(poems)} 首诗")
print(f"包含地名的诗有 {len(poems_with_locations)} 首")
print(f"识别到的地点有 {len(location_poem_map)} 个")

# 按引用次数排序
location_counts = [(loc_id, len(poems_list)) for loc_id, poems_list in location_poem_map.items()]
location_counts.sort(key=lambda x: x[1], reverse=True)

print("\n引用最多的地点:")
for loc_id, count in location_counts[:15]:
    loc_name = next((l['name'] for l in locations_data['locations'] if l['id'] == loc_id), loc_id)
    print(f"  {loc_name}: {count} 首诗")
