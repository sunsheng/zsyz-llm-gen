# 产业招商平台 — 前端开发提示词

> **用途**: AI 可执行开发指令，不写具体代码，只输出清晰可执行的开发指令  
> **目标**: 让 AI 根据 PRD 生成 Vue 3 页面代码  
> **技术栈**: Vue 3 + Vite + TypeScript + Element Plus + ECharts + Maptalks + D3

---

## 一、项目初始化指令

### 1.1 创建项目

```bash
cd /Volumes/Data/kaizhou/chan_ye_zhao_shang/zsyz-llm-gen
npm create vite@latest . -- --template vue-ts
```

### 1.2 安装依赖

```bash
# UI 框架与核心库
npm install element-plus @element-plus/icons-vue
npm install vue-router@4 pinia
npm install axios nprogress @vueuse/core dayjs

# 图表与可视化
npm install echarts vue-echarts echarts-wordcloud
npm install d3

# 地图
npm install maptalks

# 开发依赖 (rem 适配 / 样式)
npm install -D postcss-pxtorem autoprefixer sass
npm install -D unplugin-auto-import unplugin-vue-components
```

### 1.3 关键配置文件说明

#### `postcss.config.ts` — 大屏 rem 适配（1920x1080 设计稿）

必须配置以下参数:
- `rootValue: 192` （设计稿宽度 1920 / 10）
- `propList: ['*']` （转换所有 px 属性）
- `exclude: /node_modules/` （排除第三方库）
- 目标: 所有页面基于 1920x1080 大屏分辨率自动缩放

#### `vite.config.ts` — 必须配置项

- `base: './'` （Nginx 部署兼容）
- `resolve.alias`: `'@' → 'src'` （路径别名）
- **自动导入插件**: 
  - `unplugin-auto-import`: 自动导入 Vue / VueRouter / Pinia API（无需手动 import ref/reactive/useRoute 等）
  - `unplugin-vue-components`: 自动导入 Element Plus 组件（无需手动注册）
- 构建分包策略: 将 Element Plus、ECharts、D3 等大包拆分为独立 chunk

#### `index.html` — 入口配置

在 `<html>` 或 `<body>` 标签中设置:
- `<meta name="viewport" content="width=1920">`
- 引入 lib-flexible 脚本或内联 rem 基准设置脚本（设置 html font-size 基于 1920px 宽度）

---

## 二、目录结构规范

### 2.1 完整目录树

```
zsyz-llm-gen/
├── index.html                          # SPA 入口 HTML
├── public/
│   ├── favicon.ico
│   └── map-data/                       # GeoJSON 地图数据
│       ├── china.json                  # 中国省界
│       └── province/                   # 各省/市边界
│
├── src/
│   ├── main.ts                         # 应用入口 (注册 ElementPlus/Router/Pinia)
│   ├── App.vue                         # 根组件
│   ├── env.d.ts                        # TypeScript 类型声明
│   │
│   ├── assets/                         # 静态资源
│   │   ├── images/
│   │   │   ├── logo.png                # 平台 Logo
│   │   │   ├── login-bg.svg            # 登录页左侧插画
│   │   │   └── sidebar-icons/          # 侧边栏图标集
│   │   ├── styles/
│   │   │   ├── variables.scss          # ★ 设计令牌变量 (颜色/字体/间距)
│   │   │   ├── common.scss             # ★ 全局工具类 (flex/margin/font 等)
│   │   │   ├── element-custom.scss      # ★ Element Plus 主题覆盖
│   │   │   ├── mixins.scss             # SCSS 混入 (响应式断点等)
│   │   │   └── reset.scss              # CSS Reset
│   │   └── fonts/                      # 字体文件 (PingFang SC 回退)
│   │
│   ├── components/                     # 可复用组件库 (~50 个)
│   │   │
│   │   ├── common/                     # ★ 通用基础组件 (6 个)
│   │   │   ├── PageHeader.vue          # 页面标题 + 面包屑 + 操作按钮
│   │   │   ├── StatCard.vue            # KPI 统计卡 (icon/value/trend)
│   │   │   ├── SearchFilterBar.vue     # 搜索+筛选栏 (可复用)
│   │   │   ├── EmptyState.vue          # 空状态占位
│   │   │   ├── LoadingSpinner.vue      # 加载态包裹器
│   │   │   └── PaginationBar.vue       # 统一分页组件
│   │   │
│   │   ├── charts/                     # ★ ECharts 封装组件 (8 个)
│   │   │   ├── BaseChart.vue           # 基础图表容器 (resize/dispose 生命周期管理)
│   │   │   ├── LineChart.vue           # 折线图
│   │   │   ├── BarChart.vue            # 柱状图
│   │   │   ├── PieChart.vue            # 饼图/玫瑰图
│   │   │   ├── RadarChart.vue          # 雷达图
│   │   │   ├── GaugeChart.vue          # 仪表盘/环形评分图
│   │   │   ├── ScatterChart.vue        # 散点图/气泡图
│   │   │   ├── HeatmapChart.vue        # 热力图
│   │   │   └── WordCloud.vue           # 词云图
│   │   │
│   │   ├── map/                        # ★ 地图相关组件 (6 个)
│   │   │   ├── MaptalksMap.vue         # Maptalks 地图容器 (生命周期封装)
│   │   │   ├── MapControlPanel.vue     # 左侧控制面板外壳
│   │   │   ├── MapLayerToggle.vue      # 图层开关组
│   │   │   ├── MapMarkerPopup.vue      # 标记点击弹窗
│   │   │   ├── MapLegend.vue           # 地图图例
│   │   │   └── MapToolbar.vue          # 工具条 (缩放/全屏/量测)
│   │   │
│   │   ├── graph/                      # ★ D3 关系图组件 (5 个)
│   │   │   ├── ForceGraph.vue          # 力导向图画布 (Vue 封装 D3)
│   │   │   ├── GraphNode.vue           # 单个节点渲染器
│   │   │   ├── GraphEdge.vue           # 边/连线渲染器
│   │   │   ├── GraphControls.vue       # 缩放/平移/小地图控件
│   │   │   └── GraphNodeDetailDrawer.vue # 节点详情右侧抽屉
│   │   │
│   │   ├── business/                   # ★ 业务领域组件 (8 个)
│   │   │   ├── EnterpriseCard.vue      # 企业信息卡片 (列表/卡片视图用)
│   │   │   ├── EnterpriseTag.vue       # 企业类型/状态彩色标签
│   │   │   ├── IndustryChainSelect.vue # 产业链级联选择器
│   │   │   ├── RegionCascadeSelect.vue  # 省/市/区级联选择器
│   │   │   ├── RiskIndicator.vue       # 风险等级指示器 (颜色编码)
│   │   │   ├── ScoreRing.vue          # 环形评分仪表盘
│   │   │   ├── TrendIndicator.vue      # 趋势箭头 (↑↓→ + 百分比)
│   │   │   └── ComparisonBar.vue      # 水平对比条 (用于对标页)
│   │   │
│   │   └── layout/                     # ★ 布局壳组件 (4 个)
│   │       ├── MainLayout.vue         # 主布局壳 (Header + Sidebar + Content)
│   │       ├── AppHeader.vue          # 顶部导航栏
│   │       ├── AppSidebar.vue         // 左侧可折叠菜单
│   │       └── Breadcrumb.vue         # 面包屑导航
│   │
│   ├── views/                          # 页面组件 (~140 个, 按模块组织)
│   │   ├── login/
│   │   │   └── index.vue              # 登录页
│   │   │
│   │   ├── map/                       # 模块一: 产业地图 (9 页)
│   │   │   ├── chain/                 # 产业链地图 (5 页)
│   │   │   ├── supply/                # 供应链地图 (2 页)
│   │   │   └── tech/                  # 技术链地图 (2 页)
│   │   │
│   │   ├── atlas/                     # 模块二: 产业图谱 (8 页)
│   │   │   ├── national/              # 全国图谱 (4 页)
│   │   │   └── regional/              # 区域图谱 (4 页)
│   │   │
│   │   ├── analysis/                  # 模块三: 运行分析 (22 页)
│   │   │   ├── overview/              # 产业总览 (4 页)
│   │   │   ├── layout/                # 企业布局 (2 页)
│   │   │   ├── evaluation/            # 整体评价 (5 页)
│   │   │   ├── carrier/               # 载体分析 (3 页)
│   │   │   ├── strength/              # 强弱分析 (2 页)
│   │   │   ├── report/                # 运行报告 (3 页)
│   │   │   ├── comparison/            # 对比报告 (3 页)
│   │   │   └── ent-report/            # 企业报告 (3 页)
│   │   │
│   │   ├── dynamics/                  # 模块四: 产业动态 (4 页)
│   │   ├── benchmarking/              # 模块五: 区域对标 (8 页)
│   │   ├── warning/                   # 模块六: 风险预警 (6 页)
│   │   ├── regional-map/              # 模块七: 区域地图 (3 页)
│   │   │
│   │   ├── invest/                    # 模块八: 精准招商 (39 页) ← 最大模块
│   │   │   ├── chain/                 # 产业链招商 (4 页)
│   │   │   ├── map/                   # 地图招商 (4 页)
│   │   │   ├── extension/             # 补链招商 (3 页)
│   │   │   ├── relation/              # 关系链 (3 页)
│   │   │   ├── merchant/              # 以商招商 (3 页)
│   │   │   ├── listed/                # 榜单招商 (4 页)
│   │   │   ├── leading/               # 龙头骨干 (3 页)
│   │   │   ├── qualified/             # 资质企业 (3 页)
│   │   │   ├── fund/                  |# 投行基金 (3 页)
│   │   │   ├── research/              # 科研机构 (3 页)
│   │   │   ├── owner/                 # 链主适配 (3 页)
│   │   │   └── park/                  # 园区招商 (3 页)
│   │   │
│   │   ├── intelligence/              # 模块九: 招商情报 (9 页)
│   │   └── monitor/                   # 模块十: 企业监测 (17 页)
│   │       ├── overview/              # 总览 (3 页)
│   │       ├── health/                # 健康度 (3 页)
│   │       ├── rankings/              # 榜单 (2 页)
│   │       ├── filter/                # 筛选器 (4 页)
│   │       ├── portrait/              # 画像 (3 页)
│   │       └── evaluation/            # 评价 (1 页)
│   │
│   ├── router/                        # 路由配置
│   │   ├── index.ts                   # Router 实例创建 + 导航守卫
│   │   ├── routes.ts                  # ★ 完整路由定义 (~140 条)
│   │   └── menuConfig.ts              # ★ 侧边栏菜单层级配置
│   │
│   ├── stores/                        # Pinia 状态管理 (~8 个 store)
│   │   ├── user.ts                    # 用户认证状态 (token/userInfo)
│   │   ├── app.ts                     # 应用全局状态 (sidebar 折叠/主题等)
│   │   ├── map.ts                     # 地图状态 (图层/中心点/缩放级别)
│   │   ├── industry.ts                # 选中产业链状态
│   │   └── enterprise/                # 企业域状态
│   │       ├── list.ts                # 企业列表/筛选状态
│   │       └── portrait.ts            # 企业详情/画像状态
│   │
│   ├── api/                           # 接口层 (全部为 Mock 实现)
│   │   ├── request.ts                 # Axios 实例配置 (拦截器/错误处理)
│   │   ├── mock/                      # ★ Mock 数据工厂函数 (8 个模块)
│   │   │   ├── industry-chain.ts      # 产业链图谱数据 (5 条链 + 图结构)
│   │   │   ├── enterprises.ts         # 企业列表数据 (支持筛选/分页)
│   │   │   ├── analysis.ts            # 分析/统计/图表数据
│   │   │   ├── map.ts                 # GIS 地理数据 (GeoJSON + 标记点)
│   │   │   ├── intelligence.ts        # 招商情报数据
│   │   │   ├── risk.ts                # 风险预警数据
│   │   │   ├── ranking.ts             # 榜单排名数据
│   │   │   └── report.ts              # 报告模板数据
│   │   ├── modules/                  # 按 API 领域分组
│   │   │   ├── mapApi.ts              # 地图相关 API
│   │   │   ├── atlasApi.ts            # 图谱相关 API
│   │   │   ├── analysisApi.ts         # 运行分析 API
│   │   │   ├── investApi.ts           # 精准招商 API
│   │   │   ├── monitorApi.ts          # 企业监测 API
│   │   │   └── intelligenceApi.ts     # 招商情报 API
│   │   └── types/                    # TypeScript 类型定义
│   │       ├── enterprise.ts          # 企业数据类型
│   │       ├── industry.ts            # 产业链数据类型
│   │       ├── map.ts                 # 地图数据类型
│   │       ├── analysis.ts            # 分析数据类型
│   │       └── common.ts              # 公共类型 (分页/筛选/通用响应)
│   │
│   ├── composables/                   # Vue 3 组合式函数 (~7 个)
│   │   ├── useECharts.ts             # ★ ECharts 初始化/resize/dispose 生命周期
│   │   ├── useMaptalks.ts            # Maptalks 地图生命周期封装
│   │   ├── useForceGraph.ts          # D3 Force Graph 生命周期封装
│   │   ├── usePagination.ts          # 分页逻辑
│   │   ├── useSearchFilter.ts        # 搜索+筛选状态管理
│   │   ├── useExport.ts              # 导出功能 (PDF/图片/Excel)
│   │   └── useResponsive.ts          # ResizeObserver 响应式处理
│   │
│   ├── utils/                        # 工具函数
│   │   ├── format.ts                 # 数字/日期格式化 (万元/亿元/百分比)
│   │   ├── auth.ts                   # Token 管理 (localStorage 读写)
│   │   ├── storage.ts                # localStorage 封装
│   │   └── constants.ts              # 全局常量 (API路径前缀/默认值)
│   │
│   └── directives/                   # 自定义指令
│       └── permission.ts             # v-permission 权限控制
│
├── docs/                             # 文档 (本文件所在位置)
│   ├── PRD.md                       # 产品需求文档
│   └── FrontendDevPrompt.md          # 本文件 (前端开发提示词)
│
├── nginx.conf                        # Nginx 部署配置
├── .env                              # 环境变量 (公共)
├── .env.development                  # 开发环境
├── .env.production                   # 生产环境
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 三、组件拆分建议

按复用性和抽象层次，将组件分为 **6 层**：

### 3.1 第一层：布局壳 (Layout Layer) — 4 个组件

| 组件 | 职责 | 使用频率 |
|------|------|---------|
| `MainLayout.vue` | 整体布局骨架：Header(固定顶部) + Sidebar(固定左) + Content(滚动主区域) | 所有需登录页面 |
| `AppHeader.vue` | 顶栏：Logo/标题 + 面包屑 + 用户菜单 | 同上 |
| `AppSidebar.vue` | 左侧菜单：递归渲染 menuConfig，支持 3 级嵌套，可折叠(220px ↔ 64px) | 同上 |
| `Breadcrumb.vue` | 当前路径面包屑，从 route.meta.title 生成 | 同上 |

**关键实现要点**:
- MainLayout 必须使用 `<router-view>` 包裹所有子路由
- Sidebar 折叠时 MainContent 区域 margin-left 同步变化（CSS transition 0.3s ease）
- Header 高度固定 56px，Sidebar 宽度 220px（折叠 64px）

### 3.2 第二层：通用基础组件 (Common Layer) — 6 个组件

| 组件 | 职责 | Props | 使用场景 |
|------|------|-------|---------|
| `PageHeader.vue` | 页面标题区 | title, subtitle, breadcrumbs, actions (slot) | 几乎所有页面 |
| `StatCard.vue` | KPI 统计卡片 | icon, label, value, trend (up/down/flat), unit | Type A 仪表盘页 |
| `SearchFilterBar.vue` | 搜索+筛选栏 | fields (字段配置数组), placeholder | Type E 列表页 |
| `EmptyState.vue` | 空数据占位 | icon, description, actionText (slot) | 所有列表/图表空态 |
| `LoadingSpinner.vue` | 加载态包裹 | loading (boolean), type ('skeleton'\|'spinner') | 数据加载期间 |
| `PaginationBar.vue` | 统一分页 | current, total, pageSize, @change | 所有表格/列表 |

**StatCard 详细规范**:
```
尺寸: 约 240px × 120px (flex-1 自适应均分)
内容:
  [图标] 32px × 32px, 颜色 = 指标类别色 (蓝/绿/橙/红)
  标题 14px regular, #606266
  数值 28px bold, #303133
  趋势 12px, 绿↑(正向) 红↓(负向) 灰→(持平) + 百分比
交互: hover 时轻微上浮 (transform: translateY(-2px)) + 阴影加深
```

### 3.3 第三层：图表组件 (Chart Layer) — 8 个组件

**核心原则**: 所有图表组件必须通过 `useECharts()` composable 管理 ECharts 实例生命周期。

| 组件 | ECharts 类型 | 典型使用场景 | 配置要点 |
|------|-------------|-------------|---------|
| `LineChart.vue` | line | 趋势分析、时间序列 | 多线叠加、面积填充、tooltip十字准星 |
| `BarChart.vue` | bar | 对比排行、分布统计 | 横/纵切换、柱宽自适应、排序 |
| `PieChart.vue` | pie / roseType | 占比分析 | 玫瑰图模式、标签引导线、高亮扇区 |
| `RadarChart.vue` | radar | 五维评价、多维度对比 | 多层数据叠加、半透明填充 |
| `GaugeChart.vue` | gauge | 健康指数、风险评分 | 自定义刻度范围、颜色分段 |
| `ScatterChart.vue` | scatter | 相关性分析、气泡分布 | 气泡大小映射第三维度 |
| `HeatmapChart.vue` | heatmap | 空间热力分布 | 色阶映射、数值标注 |
| `WordCloud.vue` | wordCloud | 舆情热词、标签云 | 形状约束、颜色随机/分类着色 |

**统一配色方案** (所有 ECharts 实例必须遵循):
```javascript
const COLORS = [
  '#1889E8',  // 主蓝色 (品牌色)
  '#36CBCB',  // 青绿色
  '#4ECB73',  // 绿色
  '#FBD437',  // 金黄色
  '#F2637B',  // 玫红色
  '#975FE5',  // 紫色
]
// 图表 series.color = COLORS
// 渐变色: 从主色调透明到实色的线性渐变
```

**BaseChart 基础容器要求**:
- 接收 DOM ref，在 onMounted 中 init ECharts 实例
- 使用 ResizeObserver 监听容器尺寸变化并调用 resize()
- 在 onUnmounted 中 dispose() 防止内存泄漏
- 提供 setOption(data) 方法供父组件动态更新
- 支持 loading 状态 (showLoading/hideLoading)

### 3.4 第四层：地图组件 (Map Layer) — 6 个组件

**技术选型**: 主用 **maptalks**，热力图叠加百度地图 API。

| 组件 | 职责 | 说明 |
|------|------|------|
| `MaptalksMap.vue` | 地图容器 | 封装 Maptalks.Map 的创建/销毁/事件绑定 |
| `MapControlPanel.vue` | 左侧控制面板 | 固定宽度 ~360px，半透明白底+毛玻璃效果 backdrop-filter |
| `MapLayerToggle.vue` | 图层开关组 | el-checkbox-group 形式，每个图层一个选项 |
| `MapMarkerPopup.vue` | 点击弹窗 | Maptalks.ui.InfoWindow 定制样式，显示企业名称/行业/关键指标/"查看详情"按钮 |
| `MapLegend.vue` | 右下角图例 | 半透明白底，图例项带颜色标识 |
| `MapToolbar.vue` | 工具条 | 放大/缩小/全屏/复位/测距 按钮，位于右上角 |

**地图交互规范**:
- 标记密集时使用 Maptalks ClusterLayer 聚合（聚合数字角标显示）
- 点击标记弹出 InfoWindow（自定义 HTML 内容，非系统默认弹窗）
- 图例位于地图右下角，可折叠
- 缩放控件位于右上角
- 支持滚轮缩放 + 双击放大 + 右键拖拽平移

### 3.5 第五层：关系图组件 (Graph Layer) — 5 个组件

**技术**: D3 v7 force simulation，渲染在 SVG 元素内。

| 组件 | 职责 | 说明 |
|------|------|------|
| `ForceGraph.vue` | 力导向图画布 | D3 force simulation 生命周期封装在 Vue composable 中 |
| `GraphNode.vue` | 节点渲染 | 圆形节点，半径 ∝ 重要性指标，颜色按类别区分，带文字标签 |
| `GraphEdge.vue` | 边渲染 | 贝塞尔曲线连线 + 方向箭头（有向边），线条粗细 ∝ 关系强度 |
| `GraphControls.vue` | 控件 | 缩放滑块 + 平移 + 小地图(minimap)概览 |
| `GraphNodeDetailDrawer.vue` | 详情抽屉 | 从右侧滑出 (~400px)，显示节点基本信息+关联企业列表 |

**关系图交互**:
- click 节点 → 打开右侧详情抽屉
- hover 节点 → 高亮该节点及直接相连的节点/边，其余变淡 (opacity: 0.15)
- drag 节点 → 重定位（力模拟持续运行）
- 滚轮/控件 → 缩放整个画布
- 支持双击画布空白处关闭抽屉

### 3.6 第六层：业务组件 (Business Layer) — 8 个组件

| 组件 | 职责 | Props | 使用场景 |
|------|------|-------|---------|
| `EnterpriseCard.vue` | 企业信息卡片 | enterprise (对象), showFields (字段列表) | Type E 列表页的卡片视图 |
| `EnterpriseTag.vue` | 企业彩色标签 | text, type ('industry'\|'scale'\|'status'\|'qualify') | 企业名旁的状态/资质标签 |
| `IndustryChainSelect.vue` | 产业链选择器 | modelValue, multiple (是否多选) | 图谱/招商页面筛选 |
| `RegionCascadeSelect.vue` | 地区级联选择 | modelValue, level (省\|省市\|省市区) | 大部分筛选条件含地区 |
| `RiskIndicator.vue` | 风险等级指示 | level ('low'\|'medium'\|'high'\|'critical'), score (0-100) | 风险预警/企业健康度 |
| `ScoreRing.vue` | 环形评分 | value (0-100), color (按分数段), size | 企业画像/评价页面 |
| `TrendIndicator.vue` | 趋势指示器 | direction ('up'\|'down'\|'flat'), value (%数), isGood (正负向判断) | 统计卡/表格列 |
| `ComparisonBar.vue` | 水平对比条 | items (对比实体数组), metricKey, maxValue | Type F 对比报告页 |

**EnterpriseTag 颜色规范**:
| type | 示例值 | 背景色 | 文字色 |
|------|--------|--------|--------|
| industry | 新材料/数字经济/高端装备 | #ECF5FF | #1889E8 |
| scale | 规上/上市/独角兽 | #F0F9EB | #67C23A |
| status | 运营/注销/迁出 | #FDF6EC | #E6A23C |
| qualify | 高企/专精特新/绿色工厂 | #FEF0F0 | #F56C6C |

---

## 四、路由配置

### 4.1 路由设计原则

1. **全部懒加载**: 每个叶子路由使用 `() => import('@/views/xxx.vue')` 动态导入
2. **嵌套最多 3 层**: 一级模块(/module) → 二级模块(/module/sub) → 三级功能(/module/sub/feature)
3. **meta 字段标准化**: 每个 leaf route 必须携带 `{ title, icon? }` 用于侧边栏动态生成和页面标题
4. **默认重定向**: `/` → `/map/chain/search`（第一个功能页作为默认首页）
5. **404 兜底**: `/:pathMatch(.*)*` → 404 页面
6. **登录拦截**: 通过 router beforeEach 守卫检查 token，未登录跳转 /login

### 4.2 路由配置文件结构

```
router/
├── index.ts          # createRouter + beforeEach 守卫
├── routes.ts         # ★ 所有 ~140 条路由定义 (按模块组织)
└── menuConfig.ts     # ★ 与 routes 对应的侧边栏菜单配置 (用于 AppSidebar)
```

#### `routes.ts` 编写要点:

```typescript
// 使用懒加载工厂函数减少重复代码
const lazy = (path: string) => () => import(`@/views/${path}.vue`)

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: lazy('login/index'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    redirect: '/map/chain/search',
    children: [
      // ===== 模块一: 产业地图 =====
      {
        path: 'map',
        meta: { title: '产业地图', icon: 'Location' },
        redirect: '/map/chain/search',
        children: [
          {
            path: 'chain', meta: { title: '产业链地图' },
            redirect: '/map/chain/search',
            children: [
              { path: 'search', component: lazy('map/chain/ResourceSearch'), meta: { title: '产业资源搜索' } },
              { path: 'filter', component: lazy('map/chain/ResourceFilter'), meta: { title: '产业资源筛选' } },
              { path: 'layers', component: lazy('map/chain/LayerSwitch'), meta: { title: '产业图层切换' } },
              { path: 'space', component: lazy('map/chain/SpaceDistribution'), meta: { title: '产业空间分布' } },
              { path: 'clusters', component: lazy('map/chain/ClusterDistribution'), meta: { title: '产业集群分布' } },
            ]
          },
          // ... supply/, tech/ 子模块同上模式
        ]
      },
      // ... 模块二~十 按同样模式展开 (详见 PRD.md 第三章完整路由表)
      
      // 404
      { path: '/:pathMatch(.*)*', redirect: '/error/404' },
      { path: '/error/404', component: lazy('error/404') }
    ]
  }
]
```

#### `menuConfig.ts` 结构:

```typescript
// 与路由一一对应，AppSidebar 用此配置递归渲染菜单
export const menuConfig: MenuItem[] = [
  {
    title: '产业地图',
    icon: 'Location',
    path: '/map',
    children: [
      { title: '产业链地图', path: '/map/chain', children: [
        { title: '产业资源搜索', path: '/map/chain/search' },
        // ...
      ]},
      { title: '供应链地图', path: '/map/supply', children: [...] },
      { title: '技术链地图', path: '/map/tech', children: [...] },
    ]
  },
  // ... 模块二~十
]
```

---

## 五、UI 复刻要点（逐条执行清单）

> 以下每一条都是必须严格遵循的视觉规范，来自对参考系统的截图和样式分析。

### 5.1 颜色体系 — 精确匹配

在 `src/assets/styles/variables.scss` 中定义以下 CSS 变量，全局生效:

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `$color-primary` | `#1889E8` | **品牌主色** — 按钮、链接、激活态、图表第一系列 |
| `$color-primary-dark` | `#0970F0` | hover/active 深蓝 |
| `$color-primary-light-3` | `#79BBFF` | 浅背景、hover 提示 |
| `$color-primary-light-5` | `#A0CFFF` | 更浅背景 |
| `$color-primary-light-7` | `#C6E2FF` | 表头、标签背景 |
| `$color-primary-light-9` | `#ECF5FF` | 极浅背景 |
| `$bg-page` | `#F6F7FB` | 页面底色 (`body` 背景) |
| `$bg-card` | `#FFFFFF` | 卡片/面板背景 |
| `$text-primary` | `#303133` | 标题、重要文字 |
| `$text-regular` | `#606266` | 正文文字 |
| `$text-secondary` | `#909399` | 辅助/占位文字 |
| `$border-color` | `#DCDFE6` | 边框、分割线 |

### 5.2 Element Plus 主题覆盖

在 `src/assets/styles/element-custom.scss` 中覆盖 Element Plus 默认 CSS 变量:

```scss
:root {
  --el-color-primary: #1889E8;
  --el-color-primary-light-3: #79BBFF;
  --el-color-primary-light-5: #A0CFFF;
  --el-color-primary-light-7: #C6E2FF;
  --el-color-primary-light-9: #ECF5FF;
  --el-border-radius-base: 4px;
  --el-font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --el-box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.06);  // 比默认更轻
  --el-table-header-bg-color: #FAFAFA;  // 表头灰底
}
```

**确保此文件在 main.ts 中全局引入。**

### 5.3 卡片样式公约

所有 `.content-card` 类的元素必须遵循:

```
background: #FFFFFF
border-radius: 4px
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06)   // 轻微阴影
padding: 20px                                  // 内边距
margin-bottom: 16px                            // 卡片间距
```

卡片头部 `.card-header`:
- 字号 16px, 字重 600, 颜色 #303133
- 底部 padding-bottom: 12px + border-bottom: 1px solid #EBEEF5
- margin-bottom: 16px
- flex 两端对齐（标题 + 操作按钮 slot）

### 5.4 表格样式公约

所有 el-table 必须设置以下 props:

```html
<el-table
  :data="tableData"
  stripe          <!-- 斑马纹 -->
  border          <!-- 边框 -->
  :header-cell-style="{ background: '#FAFAFA', color: '#303133', fontWeight: 600 }"
  :row-style="{ cursor: 'pointer' }"
  size="default"
>
```

### 5.5 登录页视觉规范

从参考系统登录页截图中提取的精确规格：

**整体布局**:
- 左右分屏：左侧 60% / 右侧 40%
- 无额外外边距/内边距，铺满视口

**左侧面板**:
- 背景: 线性渐变，方向从左下到右上，颜色约 `#E8F4FD` → `#D0EBFF`
- 内容垂直水平居中
- 品牌 Logo: 圆形图标，主蓝色 (#1889E8)，直径约 56px
- 平台名称: "产业招商平台"，32px，粗体(bold)，深色(#1a1a1a)
- 副标题: "TERMINUS 特斯联 城市级物联网综合服务商"，14px，灰色(#909399)
- 插画: 等距(isometric) 3D 风格城市/数据/人物场景 SVG，居中偏下放置

**右侧面板**:
- 白色背景卡片，圆角 8px，轻微阴影
- 卡片垂直居中，最大宽度 420px，内边距 40px
- 表单标题: 24px 粗体
- 输入框: 高度 ~44px，圆角 4px，focus 时边框变为 #1889E8
- "记住密码" checkbox: 默认字号 14px
- "忘记密码?" link: 右对齐，次要文字色
- 登录按钮: type="primary"，全宽，高度 44px，无特殊圆角（跟随 Element Plus 默认 4px），字号 16px
- 底部可选: "用户协议" | "隐私政策" 链接行

**body 背景**: 登录页 body 不使用 #F6F7FB（那是内页底色），登录页整体就是左右分屏本身

### 5.6 地图页交互规范

- 地图容器必须填满父元素剩余空间（width: 100%, height: 100%）
- 左侧控制面板: 宽度 360px（可折叠），背景 `rgba(255,255,255,0.95)` + `backdrop-filter: blur(10px)`
- 标记点击弹窗: 白底圆角卡片，阴影略深，包含: 企业名称(加粗) + 行业标签 + 核心指标 + "查看详情 >" 链接
- 图例: 右下角浮动，半透明白底，圆角 4px，每项含色块 + 文字
- 工具条: 右上角浮动，白色圆形按钮组（icon button），间距 4px
- 地图加载中: 显示 loading spinner 或 skeleton 占位

### 5.7 动画与过渡规范

| 交互场景 | 效果 | 参数 |
|---------|------|------|
| 页面路由切换 | fade + slide (淡入+位移) | duration 300ms, ease-out |
| 侧边栏折叠/展开 | width 动画 | transition width 0.3s cubic-bezier(0.4, 0, 0.2, 1) |
| Modal/Dialog 打开 | 缩放 + 淡入 | transform scale(0.9→1) + opacity, 200ms |
| 按钮 hover | 颜色加深 | darken($color-primary, 10%) |
| 表格行 hover | 背景微变 | background: #F5F7FA, transition 150ms |
| 统计卡 hover | 上浮 + 阴影加深 | translateY(-2px) + box-shadow 增强, transition 200ms |
| ECharts 图表动画 | 内置动画 | animationDuration: 800ms, easing: 'cubicOut' |
| Loading 状态 | el-skeleton 骨架屏 | rows: 3-5, animated: true |
| 搜索结果出现 | 列表依次淡入 | stagger delay 50ms per item |

### 5.8 滚动条自定义

全局 CSS（应用于所有可滚动容器）:

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.10);
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.20);
}
::-webkit-scrollbar-track {
  background: transparent;
}
```

### 5.9 NProgress 页面加载条

路由切换时的顶部进度条:
- 颜色: `#1889E8`（与主色一致）
- 高度: 3px
- 在 router beforeEach 开始，afterEach 结束

### 5.10 响应式注意事项

本项目**仅面向 1920x1080 大屏**，不做移动端适配。
- 最小支持分辨率: 1440x900（rem 适配会自动缩放）
- 低于 1440px 宽度可能出现横向滚动，这是可接受的
- 不需要媒体查询断点

---

## 六、Mock 数据架构

### 6.1 设计原则

由于暂不考虑后端接口，**所有数据来源均为静态 Mock**:

1. 每个 Mock 文件导出**工厂函数**（非静态常量），接受筛选/分页参数
2. 数据内容必须为**真实的中文业务数据**（非 lorem ipsum）
3. 支持模拟异步请求延迟（setTimeout 200-500ms）模拟网络等待
4. 数据量适中：列表接口返回 20-50 条/页，图表接口返回完整数据集

### 6.2 Mock 文件清单

| 文件 | 职责 | 核心导出函数 | 数据特点 |
|------|------|------------|---------|
| `industry-chain.ts` | 产业链数据 | `getMockChains()`, `getMockChainGraph(code)` | 5 条产业链，每条 80-150 个节点 + 边 |
| `enterprises.ts` | 企业数据 | `getMockEnterpriseList(params)`, `getMockEnterpriseDetail(id)` | 200+ 条企业记录，含工商/经营/资质字段 |
| `analysis.ts` | 分析统计数据 | `getMockKpiCards()`, `getMockChartData(type)` | KPI 卡 4 个/组，图表数据按 type 返回不同结构 |
| `map.ts` | GIS 数据 | `getMockGeoFeatures(region)`, `getMockMarkers(filters)` | GeoJSON 边界 + 标记点坐标数组 |
| `intelligence.ts` | 情报数据 | `getMockNewsList()`, `getMockProjectList()` 等 | 新闻/项目/技术/资质/资本各 30-80 条 |
| `risk.ts` | 风险数据 | `getMockRiskIndicators()`, `getMockWarningList()` | 预警指标 + 风险事件列表 |
| `ranking.ts` | 榜单数据 | `getMockRankingList(type)` | Top100 企业榜单，含多维评分 |
| `report.ts` | 报告数据 | `getMockReportTemplates()`, `getMockReportData(id)` | 报告模板 + 已生成报告内容 |

### 6.3 Mock 数据内容规范

**企业命名规则示例**:
- 制造型: `浙江{地名}{核心产品}{公司后缀}` → "浙江桐乡新材料科技有限公司"
- 科技型: `{城市}{技术领域}{科技}{有限}` → "杭州智能装备科技有限公司"
- 规模词: 可加"集团"、"股份"表示大型企业

**行业名称**（覆盖 Excel 提到的主导产业）:
- 高端装备制造（汽车汽配）、前沿材料（玻纤复合材料/新能源材料/碳纤维）
- 数字经济（5G/集成电路/先进计算/智能安防）
- 时尚产业、现代服务业

**地区数据**（真实中国行政区划）:
- 省: 浙江、江苏、上海、广东、北京...
- 市: 杭州、宁波、嘉兴、桐乡、苏州...

**金额单位**:
- 企业营收: 万元/亿元
- 投资: 万元
- 税收: 万元

**时间范围**: 2019-2025 年（历史数据 + 近期预测）

### 6.4 API 层对接方式

`api/request.ts` — Axios 配置:
```typescript
// baseURL: '' (相对路径，Mock 直接返回)
// 拦截器: request 注入 mock-token, response 统一错误处理
// 开发环境下: 直接返回 mock 数据（不走 HTTP）
// 生产环境预留: baseURL 可配置指向真实后端
```

`api/modules/*.ts` — 各模块 API 函数:
- 每个函数内部调用对应 mock 工厂函数
- 返回 Promise<T> 保持 async/await 调用风格
- 未来接入真实 API 时只需替换内部实现，不影响页面组件代码

---

## 七、Nginx 部署配置

### 7.1 `nginx.conf` 内容

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain application/javascript application/json text/css image/svg+xml;
    gzip_min_length 1024;

    # SPA 路由 fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长期缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 禁止访问 source map
    location ~* \.map$ {
        deny all;
    }
}
```

### 7.2 构建部署流程

```bash
# 1. 构建
npm run build

# 2. 产物在 dist/ 目录
# 3. 将 dist/ 内容复制到 Nginx root 目录 (/usr/share/nginx/html/)
# 4. 确保 nginx.conf 正确放置
# 5. nginx -t && nginx -s reload
```

### 7.3 Vite 构建配置注意

- `build.outDir`: `'dist'`
- `build.assetsDir`: `'assets'` (JS/CSS/图片归类)
- `build.rollupOptions.output.manualChunks`: 将 vendor 拆分为独立 chunk
  - `element-plus` → `vendor-element.js`
  - `echarts` → `vendor-echarts.js`
  - `d3` → `vendor-d3.js`
  - `maptalks` → `vendor-maptalks.js`
- `build.chunkSizeWarningLimit`: `1000` (允许较大 chunk)

---

## 八、开发优先级与执行顺序

### Phase 1: 基础设施 (必须最先完成)

| 序号 | 任务 | 产出物 | 预估占比 |
|:---:|------|--------|:-------:|
| 1.1 | 项目脚手架 + 依赖安装 | 可运行的空白 Vue 项目 | 5% |
| 1.2 | 全局样式 (variables/common/element-custom/reset) | 完整的设计系统 | 5% |
| 1.3 | MainLayout + AppHeader + AppSidebar | 布局壳可用 | 8% |
| 1.4 | Login 页面 (完整视觉复刻) | 登录页 | 5% |
| 1.5 | Router 完整配置 (~140 路由 + menuConfig) | 路由系统 + 侧边栏菜单 | 8% |
| 1.6 | Pinia Stores (user/app 至少) | 状态管理框架 | 3% |
| 1.7 | 通用组件 (PageHeader/StatCard/SearchFilterBar/PaginationBar) | 基础组件库 | 8% |

**Phase 1 完成标志**: 可以看到带侧边栏的主界面框架，能正常路由切换（虽然页面是空的占位）。

### Phase 2: 核心可视化能力

| 序号 | 任务 | 产出物 | 预估占比 |
|:---:|------|--------|:-------:|
| 2.1 | `useECharts()` composable + BaseChart + 8 种图表组件 | 图表体系 | 8% |
| 2.2 | `useMaptalks()` composable + 地图组件组 (6 个) | 地图体系 | 6% |
| 2.3 | `useForceGraph()` composable + 关系图组件组 (5 个) | 图谱体系 | 5% |
| 2.4 | Mock 数据基础设施 (8 个文件) | Mock 数据就绪 | 6% |

### Phase 3: 核心模块实现

| 序号 | 模块 | 页面数 | 页面类型 | 预估占比 |
|:---:|------|:-----:|:-------:|:-------:|
| 3.1 | **产业地图** (Module 1) | 9 | Type B (地图) | 6% |
| 3.2 | **产业图谱** (Module 2) | 8 | Type C (关系图) | 5% |
| 3.3 | **运行分析** (Module 3) | 22 | Type A (仪表盘) | 10% |

### Phase 4: 业务模块实现

| 序号 | 模块 | 页面数 | 主要页面类型 | 预估占比 |
|:---:|------|:-----:|:-----------||:-------:|
| 4.1 | **企业监测** (Module 10) | 17 | A/D/E 混合 | 6% |
| 4.2 | **区域对标** (Module 5) | 8 | A/B/F 混合 | 3% |
| 4.3 | **风险预警** (Module 6) | 6 | Type A | 2% |
| 4.4 | **精准招商** (Module 8) | 39 | Type E 为主 | 12% |
| 4.5 | **招商情报** (Module 9) | 9 | Type E | 3% |
| 4.6 | **产业动态** (Module 4) | 4 | Timeline/List | 2% |
| 4.7 | **区域地图** (Module 7) | 3 | E/F 混合 | 1% |

### Phase 5: 收尾优化

| 序号 | 任务 | 说明 | 预估占比 |
|:---:|------|------|:-------:|
| 5.1 | 跨模块一致性审查 | 颜色/字体/间距/交互统一 | 2% |
| 5.2 | 性能优化 | 路由懒加载验证、chunk 分包检查、大图/大数据加载优化 | 2% |
| 5.3 | Nginx 配置 + 构建验证 | npm run build 成功，dist/ 产物可部署 | 1% |
| 5.4 | 最终 QA | 对照 PRD 和参考系统截图做视觉验收 | 2% |

---

*文档结束*
