# 目录结构规范

> [返回目录](index.md)

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
│   │   ├── map.ts                     # 地图状态 (图层/中心点/缩放级别) — 中心点: 凯州科技创新产业园, 缩放级别: 15
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
├── docs/                             # 文档
│   ├── prd/                          # 产品需求
│   │   ├── index.md                  # 产品需求文档 (PRD)
│   │   └── 产业招商平台.xlsx          # 功能依据原始数据
│   ├── dev-guide/                    # 开发指南
│   │   └── index.md                  # 本文件 (前端开发指南)
│   └── reports/                      # 分析报告
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
