import { CATALOG_MODELS } from '../models/registry'
import type { AiAction, AiActionPlan, AiRoomType, AiSceneContext } from './types'
import { ROOM_TYPE_LABELS } from './types'

const ROOM_KEYS: { type: AiRoomType; keys: string[] }[] = [
  { type: 'living', keys: ['客厅', '起居室', '起居间', 'living room'] },
  { type: 'bedroom', keys: ['卧室', '主卧', '次卧', 'bedroom'] },
  { type: 'kitchen', keys: ['厨房', 'kitchen'] },
  { type: 'dining', keys: ['餐厅', '餐区', 'dining'] },
  { type: 'bathroom', keys: ['卫生间', '浴室', '洗手间', 'bathroom', 'bath room'] },
  { type: 'office', keys: ['书房', '办公室', '工作室', 'office', 'study'] },
  { type: 'generic', keys: ['房间', '屋子', 'room'] },
]

const MODEL_ALIASES: { keys: string[]; id: string }[] = [
  { keys: ['双人床', '大床', 'double bed'], id: 'bed-double' },
  { keys: ['床'], id: 'bed-double' },
  { keys: ['单人床', 'single bed'], id: 'bed-single' },
  { keys: ['双层床', '上下铺', 'bunk bed'], id: 'bunk-bed' },
  { keys: ['婴儿床', 'crib'], id: 'crib' },
  { keys: ['三人沙发', '长沙发', '大沙发', 'sofa'], id: 'sofa-3' },
  { keys: ['沙发'], id: 'sofa-3' },
  { keys: ['双人沙发', '小沙发', 'loveseat'], id: 'sofa-2' },
  { keys: ['单人扶手椅', '扶手椅', 'armchair'], id: 'armchair' },
  { keys: ['茶几', 'coffee table'], id: 'coffee-table' },
  { keys: ['边几', 'side table'], id: 'side-table' },
  { keys: ['电视柜', 'tv console'], id: 'tv-console' },
  { keys: ['电视', 'television', 'tv'], id: 'television' },
  { keys: ['书架', '书柜', 'bookshelf'], id: 'bookshelf' },
  { keys: ['落地灯', 'floor lamp'], id: 'floor-lamp' },
  { keys: ['脚凳', 'ottoman'], id: 'ottoman' },
  { keys: ['地毯', 'rug'], id: 'rug-rect' },
  { keys: ['壁炉', 'fireplace'], id: 'fireplace' },
  { keys: ['绿植', '盆栽', '室内植物', 'potted plant'], id: 'potted-plant' },
  { keys: ['衣柜', 'wardrobe'], id: 'wardrobe' },
  { keys: ['床头柜', 'nightstand'], id: 'nightstand' },
  { keys: ['斗柜', 'dresser'], id: 'dresser' },
  { keys: ['梳妆台', 'vanity'], id: 'vanity-table' },
  { keys: ['洗衣机', 'washer'], id: 'washer' },
  { keys: ['烘干机', 'dryer'], id: 'dryer' },
  { keys: ['厨房地柜', '橱柜', 'kitchen counter'], id: 'kitchen-counter' },
  { keys: ['中岛', '岛台', 'island'], id: 'kitchen-island' },
  { keys: ['水槽柜', '水槽', 'sink'], id: 'sink-unit' },
  { keys: ['灶台', '烤箱', 'stove'], id: 'stove' },
  { keys: ['冰箱', 'fridge'], id: 'fridge' },
  { keys: ['高柜', '食橱', 'pantry'], id: 'tall-cabinet' },
  { keys: ['洗碗机', 'dishwasher'], id: 'dishwasher' },
  { keys: ['六人餐桌', '餐桌', 'dining table'], id: 'dining-table' },
  { keys: ['圆餐桌', 'round table'], id: 'round-dining-table' },
  { keys: ['餐椅', 'dining chair'], id: 'dining-chair' },
  { keys: ['椅子', '座椅', 'chair'], id: 'dining-chair' },
  { keys: ['餐边柜', 'sideboard'], id: 'sideboard' },
  { keys: ['吧凳', '吧椅', 'bar stool'], id: 'bar-stool' },
  { keys: ['凳子'], id: 'bar-stool' },
  { keys: ['马桶', '坐便器', 'toilet'], id: 'toilet' },
  { keys: ['立柱盆', '洗手盆', 'pedestal sink'], id: 'pedestal-sink' },
  { keys: ['浴室柜', 'vanity mirror'], id: 'vanity-mirror' },
  { keys: ['浴缸', 'bathtub'], id: 'bathtub' },
  { keys: ['淋浴房', '淋浴', 'shower'], id: 'shower' },
  { keys: ['毛巾架', 'towel rack'], id: 'towel-rack' },
  { keys: ['办公桌', '书桌', 'desk'], id: 'desk' },
  { keys: ['人体工学椅', '办公椅', 'office chair'], id: 'office-chair' },
  { keys: ['文件柜', 'filing cabinet'], id: 'filing-cabinet' },
  { keys: ['打印机台', 'printer'], id: 'printer-stand' },
  { keys: ['白板', 'whiteboard'], id: 'whiteboard' },
  { keys: ['花园椅', '庭院椅', 'garden chair'], id: 'garden-chair' },
  { keys: ['户外餐桌', '庭院桌', 'patio table'], id: 'patio-table' },
  { keys: ['遮阳伞', '庭院伞', 'umbrella'], id: 'patio-umbrella' },
  { keys: ['躺椅', 'sun lounger'], id: 'sun-lounger' },
  { keys: ['烧烤炉', '烤炉', 'bbq'], id: 'bbq-grill' },
  { keys: ['花箱', 'planter'], id: 'planter-box' },
  { keys: ['凉亭', 'gazebo'], id: 'gazebo' },
  { keys: ['火盆', 'fire pit'], id: 'fire-pit' },
  { keys: ['野餐桌', 'picnic table'], id: 'picnic-table' },
  { keys: ['花园工具房', '工具房', 'garden shed'], id: 'garden-shed' },
  { keys: ['信箱', 'mailbox'], id: 'mailbox' },
  { keys: ['泳池', '游泳池', 'swimming pool', 'pool'], id: 'swimming-pool' },
  { keys: ['车棚', 'carport'], id: 'carport' },
  { keys: ['凉棚', '花架', 'pergola'], id: 'pergola' },
  { keys: ['橡树', 'oak'], id: 'tree-oak' },
  { keys: ['树'], id: 'tree-oak' },
  { keys: ['枫树', 'maple'], id: 'tree-maple' },
  { keys: ['松树', 'pine'], id: 'tree-pine' },
  { keys: ['白桦', 'birch'], id: 'tree-birch' },
  { keys: ['棕榈树', '棕榈', 'palm'], id: 'tree-palm' },
  { keys: ['灌木', 'bush'], id: 'bush-round' },
  { keys: ['绿篱', 'hedge'], id: 'hedge-block' },
  { keys: ['花坛', 'flower bed'], id: 'flower-bed' },
  { keys: ['草丛', 'grass tuft'], id: 'grass-tuft' },
  { keys: ['路灯', 'streetlight'], id: 'streetlight' },
  { keys: ['红绿灯', '交通灯', 'traffic light'], id: 'traffic-light' },
  { keys: ['长椅', '公园椅', 'bench'], id: 'bench-park' },
  { keys: ['垃圾桶', 'trash bin'], id: 'trash-bin' },
  { keys: ['公交站', 'bus stop'], id: 'bus-stop' },
  { keys: ['消防栓', 'hydrant'], id: 'fire-hydrant' },
  { keys: ['广告牌', 'billboard'], id: 'billboard' },
  { keys: ['喷泉', 'fountain'], id: 'fountain' },
  { keys: ['雕像', '雕塑', 'statue'], id: 'statue' },
  { keys: ['售货亭', 'kiosk'], id: 'kiosk' },
  { keys: ['自行车架', 'bike rack'], id: 'bicycle-rack' },
  { keys: ['轿车', '汽车', 'sedan'], id: 'car-sedan' },
  { keys: ['SUV', '越野车', 'suv'], id: 'car-suv' },
  { keys: ['货车', '厢式车', 'van'], id: 'car-van' },
  { keys: ['公交车', '巴士', 'bus'], id: 'city-bus' },
  { keys: ['掀背车', 'hatchback'], id: 'car-hatchback' },
  { keys: ['船', '游艇', 'boat'], id: 'boat' },
  { keys: ['圆柱', '罗马柱', 'column'], id: 'column-round' },
  { keys: ['方柱', 'structural column'], id: 'column-square' },
  { keys: ['直跑楼梯', '楼梯', 'stairs'], id: 'stair-straight' },
  { keys: ['螺旋楼梯', '旋转楼梯', 'spiral stair'], id: 'stair-spiral' },
  { keys: ['l形楼梯', '转角楼梯', 'l stair'], id: 'stair-l' },
  { keys: ['栏杆', '扶手', 'railing'], id: 'railing-section' },
]

const COLOR_WORDS = ['暖白', '白垩', '白色', '灰绿', '沙岩', '陶土', '深海蓝', '石墨', '灰粉']

function includesAny(text: string, keys: string[]): boolean {
  return keys.some((key) => text.includes(key))
}

function roomTypeFromText(text: string): AiRoomType | null {
  for (const entry of ROOM_KEYS) {
    if (includesAny(text, entry.keys)) return entry.type
  }
  return null
}

function findRequestedModels(text: string): string[] {
  const found: { id: string; position: number; length: number }[] = []
  for (const alias of MODEL_ALIASES) {
    for (const key of alias.keys) {
      const position = text.toLowerCase().indexOf(key.toLowerCase())
      if (position >= 0) {
        found.push({ id: alias.id, position, length: key.length })
      }
    }
  }
  for (const model of CATALOG_MODELS) {
    const position = text.indexOf(model.name)
    if (position >= 0) found.push({ id: model.id, position, length: model.name.length })
  }
  const ordered = found.sort((a, b) => a.position - b.position || b.length - a.length)
  const filtered = ordered.filter(
    (entry) =>
      !ordered.some(
        (other) =>
          other !== entry &&
          other.position <= entry.position &&
          other.position + other.length >= entry.position + entry.length &&
          other.length > entry.length,
      ),
  )
  const result: string[] = []
  for (const entry of filtered) {
    if (!result.includes(entry.id)) result.push(entry.id)
  }
  return result
}

function parseDimensionPair(text: string): [number, number] | null {
  const pair = text.match(/(\d+(?:\.\d+)?)\s*(?:米|m)?\s*[×xX*]\s*(\d+(?:\.\d+)?)\s*(?:米|m)?/)
  if (!pair) return null
  const a = Number(pair[1])
  const b = Number(pair[2])
  return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null
}

function parseMeters(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:米|m)/)
  return match ? Number(match[1]) : null
}

function parseCount(text: string, fallback: number): number {
  const match = text.match(/(\d+)\s*(?:棵|株|个|把|件)/) ?? text.match(/(\d+)/)
  if (!match) return fallback
  const value = Number(match[1])
  return Number.isFinite(value) ? value : fallback
}

function parseLevelIndex(text: string): number | null {
  const match = text.match(/第?\s*(\d+)\s*层/)
  if (match) return Math.max(0, Number(match[1]) - 1)
  const chinese: Record<string, number> = { 一: 0, 二: 1, 三: 2, 四: 3, 五: 4, 六: 5 }
  const zh = text.match(/第\s*([一二三四五六])\s*层/)
  return zh ? chinese[zh[1]] ?? null : null
}

function plan(reply: string, actions: AiAction[]): AiActionPlan {
  return { reply, actions, mode: 'local' }
}

function infoSummary(context: AiSceneContext): string {
  const count = (kind: string) => context.counts[kind] ?? 0
  return `当前项目「${context.projectName}」处于${context.activeLevel.name}（标高 ${context.activeLevel.elevation.toFixed(2)} m），共有 ${context.levels.length} 个楼层。场景中包含 ${count('object')} 件家具/道具、${count('wall')} 面墙、${count('opening')} 个门窗、${count('path')} 条路径、${count('slab')} 块楼板和 ${count('roof')} 个屋顶。${
    context.selected ? `当前选中了${context.selected.kind === 'object' ? context.selected.name : context.selected.kind}。` : ''
  }`
}

export function planLocal(text: string, context: AiSceneContext): AiActionPlan {
  const raw = text.trim()
  const lower = raw.toLowerCase()
  if (!raw) return plan('请告诉我你想建造或修改什么。', [])

  if (includesAny(lower, ['帮助', '能做什么', '怎么用', 'help', '你能'])) {
    return plan(
      '我可以操作当前场景：建造别墅或单个房间、布置现有房间、绘制道路/河流/池塘/桥梁/围栏、种树、加屋顶、增删楼层、放置任意组件、旋转/改色/开关选中的门。告诉我一个目标即可，例如「建一栋带泳池的现代别墅」或「把这个房间布置成卧室」。',
      [],
    )
  }
  if (includesAny(lower, ['有什么', '统计', '场景里', '现状', 'summar'])) {
    return plan(infoSummary(context), [])
  }
  if (includesAny(lower, ['你好', '嗨', 'hello', 'hi'])) {
    return plan(
      '你好，我是 Civitas Copilot。你可以让我直接改造场景，例如「建一栋 16×9 的别墅」「在附近画一条弯曲的河流」「布置这间卧室」。所有操作都可以用 Ctrl+Z 撤销。',
      [],
    )
  }

  if (includesAny(lower, ['撤销', 'undo', '取消上一步'])) return plan('好的，撤销上一步。', [{ type: 'undo' }])
  if (includesAny(lower, ['重做', 'redo'])) return plan('好的，重做上一步。', [{ type: 'redo' }])
  if (includesAny(lower, ['全览', '看全', '场景全部', '全景'])) return plan('正在切换为全览视角。', [{ type: 'focus_all' }])

  if (includesAny(lower, ['清空', '全部删除', '清掉当前楼层', 'clear level'])) {
    return plan('将清空当前楼层上的所有构件。这是危险操作，执行前会请你确认。', [{ type: 'clear_level' }])
  }
  if (includesAny(lower, ['删除选中', '删掉选中', '删除这个', '删掉它', '移除选中', 'delete selected'])) {
    if (!context.selected) return plan('当前没有选中的构件。请先在场景中选中要删除的对象。', [])
    return plan('将删除当前选中的构件。', [{ type: 'delete_selected' }])
  }

  const doorMatch =
    lower.match(
      /(?:把|将)?\s*(?:门|doors?)\s*(打开|开启|开|关闭|关上|关)\s*(?:到|至)?\s*(-?\d+(?:\.\d+)?)?\s*度?/,
    ) ??
    lower.match(
      /(打开|开启|开|关闭|关上|关)\s*(?:上|好)?\s*(?:门|doors?)\s*(?:到|至)?\s*(-?\d+(?:\.\d+)?)?\s*度?/,
    )
  const englishDoor = lower.match(/(open|close)\s+(?:the\s+)?door(?:\s+(?:to\s+)?(\d+(?:\.\d+)?)\s*(?:deg|degrees?)?)?/)
  if (doorMatch || englishDoor) {
    if (!context.selected) return plan('请先选中一扇门，我才能调整它的开启角度。', [])
    if (context.selected.kind !== 'opening') return plan('当前选中的不是门，请先选中一扇门。', [])
    const verb = doorMatch?.[1] ?? englishDoor?.[1] ?? '开'
    const closing = ['关闭', '关上', '关', 'close'].includes(verb)
    const rawAngle = doorMatch?.[2] ?? englishDoor?.[2]
    const openAngle = closing ? 0 : rawAngle ? Number(rawAngle) : 90
    const hinge: 'left' | 'right' | undefined = /左开|左铰|left/.test(lower)
      ? 'left'
      : /右开|右铰|right/.test(lower)
        ? 'right'
        : undefined
    return plan(closing ? '把选中的门关上。' : `把选中的门打开到 ${openAngle}°。`, [
      { type: 'modify_selected', openAngle, ...(hinge ? { hinge } : {}) },
    ])
  }

  const rotateMatch = lower.match(/(?:旋转|转)\s*(-?\d+(?:\.\d+)?)\s*度?/)
  if (rotateMatch) {
    if (!context.selected) return plan('请先选中一个家具、楼板或屋顶，我才能旋转它。', [])
    const degrees = Number(rotateMatch[1]) || 90
    return plan(`将选中的构件旋转 ${degrees}°。`, [{ type: 'modify_selected', rotateByDeg: degrees }])
  }

  if (includesAny(lower, ['刷成', '改成', '换色', '颜色', '刷一'])) {
    const color = COLOR_WORDS.find((word) => lower.includes(word))
    if (color) {
      if (!context.selected) return plan('请先选中一面墙，我才能修改它的墙面颜色。', [])
      return plan(`将选中的墙体刷成${color}。`, [{ type: 'modify_selected', color }])
    }
  }

  if (includesAny(lower, ['加一层', '新增楼层', '新楼层', '再加一层', 'add level', 'add floor'])) {
    return plan('将新增一个楼层并将其设为当前楼层。', [{ type: 'add_level' }])
  }
  if (includesAny(lower, ['切换到', '去第', '到第']) && /层/.test(lower)) {
    const index = parseLevelIndex(lower)
    if (index !== null && context.levels[index]) {
      return plan(`将当前楼层切换到${context.levels[index].name}。`, [{ type: 'set_active_level', index }])
    }
  }

  const isVilla = includesAny(lower, ['别墅', '住宅', '小楼', 'villa', 'house'])
  if (isVilla) {
    const pair = parseDimensionPair(lower)
    const width = pair?.[0] ?? 16
    const depth = pair?.[1] ?? 9
    const withPool = includesAny(lower, ['泳池', '游泳池', 'pool'])
    const withCarport = includesAny(lower, ['车棚', '车库', 'carport', 'garage'])
    const withGarden = !includesAny(lower, ['不要花园', '不带花园', '不要绿化']) && !includesAny(lower, ['仅建筑', '只要房子'])
    const flags = [
      withPool ? '泳池' : '',
      withCarport ? '车棚' : '',
      withGarden ? '庭院绿化' : '',
    ].filter(Boolean)
    return plan(
      `我会在当前视野附近寻找一块空地，建造一栋 ${width} × ${depth} m 的单层现代别墅，包含客厅、餐厨、卧室、木平台和自动屋顶${flags.length ? `，并配置${flags.join('、')}` : ''}。`,
      [{ type: 'build_villa', width, depth, withPool, withCarport, withGarden }],
    )
  }

  const roomType = roomTypeFromText(lower)
  const buildVerb = /(建|造|创建|做|盖|新盖|来一个|来一间|搭建|build|create)/.test(lower)
  const furnishVerb = /(布置|装修|配家具|搭配|配齐|furnish|decorate)/.test(lower)
  const hasDimensions = Boolean(parseDimensionPair(lower)) || Boolean(parseMeters(lower))
  if (roomType && (buildVerb || hasDimensions) && !/^这[个间]/.test(lower)) {
    const pair = parseDimensionPair(lower)
    const one = parseMeters(lower)
    const defaults: Record<AiRoomType, [number, number]> = {
      living: [7, 6],
      bedroom: [4.5, 4.5],
      kitchen: [5, 4],
      dining: [5, 4.5],
      bathroom: [3, 3],
      office: [4, 3.5],
      generic: [5, 4],
    }
    const width = pair?.[0] ?? one ?? defaults[roomType][0]
    const depth = pair?.[1] ?? (pair ? pair[1] : one) ?? defaults[roomType][1]
    const roof = !includesAny(lower, ['不要屋顶', '不加屋顶', '无屋顶', '露天'])
    const furnish = !includesAny(lower, ['空房', '空卧室', '空房间', '毛坯', '不要家具', '不带家具'])
    return plan(
      `我会在附近找一块空地，建造一间 ${width} × ${depth} m 的${ROOM_TYPE_LABELS[roomType]}${furnish ? '并布置家具' : ''}${roof ? '，同时生成屋顶' : ''}。`,
      [{ type: 'build_room', roomType, width, depth, roof, furnish }],
    )
  }
  if ((furnishVerb || includesAny(lower, ['家具', '布置一下', '装饰'])) && roomType) {
    return plan(`我会在附近寻找并布置${ROOM_TYPE_LABELS[roomType]}。`, [
      { type: 'furnish_room', roomType },
    ])
  }
  if (includesAny(lower, ['布置', '装修', '配家具', 'furnish', 'decorate']) && !roomType) {
    return plan('我会先把相机附近最近的一个封闭房间按客厅布置；如果你想指定房间，请告诉我「布置成卧室」等。', [
      { type: 'furnish_room', roomType: 'living' },
    ])
  }

  const explicitPlace = /(放|摆|放置|添加|加一个|加个|来一个|来张|来把|要一个|要一张)/.test(lower)
  const earlyModelIds = findRequestedModels(lower)
  if (explicitPlace && earlyModelIds.length > 0) {
    const actions: AiAction[] = earlyModelIds.slice(0, 6).map((modelId) => ({ type: 'place_model', modelId }))
    const names = actions
      .map((action) => CATALOG_MODELS.find((model) => model.id === (action as { modelId: string }).modelId)?.name ?? '')
      .filter(Boolean)
    return plan(`我会在当前视野附近放置：${names.join('、')}。`, actions)
  }

  const plantingIntent = /(种|栽|植)[^。]{0,10}(树|花|草|灌木|绿植|植物)/.test(lower)
  if (plantingIntent) {
    const count = parseCount(lower, 6)
    return plan(`我会在附近种下 ${count} 株植被，包括乔木和灌木，并避开建筑与道路。`, [
      { type: 'add_vegetation', count },
    ])
  }

  const wantsPond =
    includesAny(lower, ['池塘', '湖泊', '湖', 'pond', 'lake']) &&
    !includesAny(lower, ['泳池', '桥', '船', '码头']) &&
    /(挖|建|造|做|添加|加一个|来一个|生成|画)/.test(lower)
  if (wantsPond) {
    return plan('我会在当前视野附近挖一个自然形状的池塘。', [{ type: 'add_pond' }])
  }

  const pathIntent = includesAny(lower, ['道路', '马路', '公路', 'road']) 
    ? 'road'
    : includesAny(lower, ['桥', 'bridge'])
      ? 'bridge'
      : includesAny(lower, ['步道', '小路', '人行道', 'path'])
        ? 'footpath'
        : includesAny(lower, ['围栏', '栅栏', '篱笆', '绿篱', 'fence'])
          ? 'fence'
          : includesAny(lower, ['河', 'river'])
            ? 'river'
            : null
  if (pathIntent) {
    const length = parseMeters(lower)
    const curve = includesAny(lower, ['直', '笔直']) ? 0 : includesAny(lower, ['弯', '曲', '蜿蜒']) ? 4.5 : undefined
    const closed = includesAny(lower, ['闭合', '环形', '一圈', '环状'])
    const planLabel =
      pathIntent === 'road'
        ? '城市道路'
        : pathIntent === 'river'
          ? '河流'
          : pathIntent === 'bridge'
            ? '桥梁'
            : pathIntent === 'footpath'
              ? '步道'
              : '围栏'
    return plan(
      `我会在当前视野附近的空地上绘制${closed ? '闭合的' : ''}${pathIntent === 'bridge' ? '一座跨越河道的' : '一条'}${planLabel}，你可以随后拖动控制点修改走向。`,
      [{ type: 'draw_path', pathType: pathIntent, length: length ?? undefined, curve, closed }],
    )
  }

  if (includesAny(lower, ['屋顶', 'roof']) && includesAny(lower, ['加', '生成', '盖', '做', '补'])) {
    return plan('我会找到当前视野附近最近的封闭房间，并为它生成屋顶。', [{ type: 'add_roof' }])
  }

  if (
    includesAny(lower, ['种树', '绿化', '种些树', '种几棵', '种花', '栽花', '花园', 'plant', 'landscape']) ||
    /(种|栽|植)[^。]{0,10}(树|花|草|灌木|绿植|植物)/.test(lower)
  ) {
    const count = parseCount(lower, 6)
    return plan(`我会在附近种下 ${count} 株植被，包括乔木和灌木，并避开建筑与道路。`, [
      { type: 'add_vegetation', count },
    ])
  }

  const modelIds = findRequestedModels(lower)
  if (modelIds.length > 0) {
    const actions: AiAction[] = modelIds.slice(0, 6).map((modelId) => ({ type: 'place_model', modelId }))
    const names = actions
      .map((action) => CATALOG_MODELS.find((model) => model.id === (action as { modelId: string }).modelId)?.name ?? '')
      .filter(Boolean)
    return plan(`我会在当前视野附近放置：${names.join('、')}。`, actions)
  }

  if (includesAny(lower, ['家具', '沙发', '桌子', '椅子', '床', '柜子', '装饰'])) {
    return plan(
      '我可以在当前房间内放置家具。请告诉我更具体的对象，例如「放一张双人床」或「把这个房间布置成卧室」。',
      [],
    )
  }

  return plan(
    '我还不能确定要执行什么。你可以试试：\n• 建一栋带泳池的现代别墅\n• 建一个 6×5 米的卧室并布置家具\n• 画一条弯曲的河流\n• 在附近种 8 棵树\n• 布置这个房间成书房\n• 把选中的墙刷成灰绿色',
    [],
  )
}
