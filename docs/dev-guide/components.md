# 组件拆分建议

> [返回目录](index.md)

按复用性和抽象层次，将组件分为 **6 层**：

### 3.1 第一层：布局壳 (Layout Layer) — 4 个组件

| 组件             | 职责                                                                   | 使用频率       |
| ---------------- | ---------------------------------------------------------------------- | -------------- |
| `MainLayout.vue` | 整体布局骨架：Header(固定顶部) + Sidebar(固定左) + Content(滚动主区域) | 所有需登录页面 |
| `AppHeader.vue`  | 顶栏：Logo/标题 + 面包屑 + 用户菜单                                    | 同上           |
| `AppSidebar.vue` | 左侧菜单：递归渲染 menuConfig，支持 3 级嵌套，可折叠(220px ↔ 64px)     | 同上           |
| `Breadcrumb.vue` | 当前路径面包屑，从 route.meta.title 生成                               | 同上           |

**关键实现要点**:

- MainLayout 必须使用 `<router-view>` 包裹所有子路由
- Sidebar 折叠时 MainContent 区域 margin-left 同步变化（CSS transition 0.3s ease）
- Header 高度固定 56px，Sidebar 宽度 220px（折叠 64px）

### 3.2 第二层：通用基础组件 (Common Layer) — 6 个组件

| 组件                  | 职责         | Props                                           | 使用场景          |
| --------------------- | ------------ | ----------------------------------------------- | ----------------- |
| `PageHeader.vue`      | 页面标题区   | title, subtitle, breadcrumbs, actions (slot)    | 几乎所有页面      |
| `StatCard.vue`        | KPI 统计卡片 | icon, label, value, trend (up/down/flat), unit  | Type A 仪表盘页   |
| `SearchFilterBar.vue` | 搜索+筛选栏  | fields (字段配置数组), placeholder              | Type E 列表页     |
| `EmptyState.vue`      | 空数据占位   | icon, description, actionText (slot)            | 所有列表/图表空态 |
| `LoadingSpinner.vue`  | 加载态包裹   | loading (boolean), type ('skeleton'\|'spinner') | 数据加载期间      |
| `PaginationBar.vue`   | 统一分页     | current, total, pageSize, @change               | 所有表格/列表     |

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

| 组件               | ECharts 类型   | 典型使用场景         | 配置要点                            |
| ------------------ | -------------- | -------------------- | ----------------------------------- |
| `LineChart.vue`    | line           | 趋势分析、时间序列   | 多线叠加、面积填充、tooltip十字准星 |
| `BarChart.vue`     | bar            | 对比排行、分布统计   | 横/纵切换、柱宽自适应、排序         |
| `PieChart.vue`     | pie / roseType | 占比分析             | 玫瑰图模式、标签引导线、高亮扇区    |
| `RadarChart.vue`   | radar          | 五维评价、多维度对比 | 多层数据叠加、半透明填充            |
| `GaugeChart.vue`   | gauge          | 健康指数、风险评分   | 自定义刻度范围、颜色分段            |
| `ScatterChart.vue` | scatter        | 相关性分析、气泡分布 | 气泡大小映射第三维度                |
| `HeatmapChart.vue` | heatmap        | 空间热力分布         | 色阶映射、数值标注                  |
| `WordCloud.vue`    | wordCloud      | 舆情热词、标签云     | 形状约束、颜色随机/分类着色         |

**统一配色方案** (所有 ECharts 实例必须遵循):

```javascript
const COLORS = [
  '#1889E8', // 主蓝色 (品牌色)
  '#36CBCB', // 青绿色
  '#4ECB73', // 绿色
  '#FBD437', // 金黄色
  '#F2637B', // 玫红色
  '#975FE5', // 紫色
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

| 组件                  | 职责         | 说明                                                                       |
| --------------------- | ------------ | -------------------------------------------------------------------------- |
| `MaptalksMap.vue`     | 地图容器     | 封装 Maptalks.Map 的创建/销毁/事件绑定                                     |
| `MapControlPanel.vue` | 左侧控制面板 | 固定宽度 ~360px，半透明白底+毛玻璃效果 backdrop-filter                     |
| `MapLayerToggle.vue`  | 图层开关组   | el-checkbox-group 形式，每个图层一个选项                                   |
| `MapMarkerPopup.vue`  | 点击弹窗     | Maptalks.ui.InfoWindow 定制样式，显示企业名称/行业/关键指标/"查看详情"按钮 |
| `MapLegend.vue`       | 右下角图例   | 半透明白底，图例项带颜色标识                                               |
| `MapToolbar.vue`      | 工具条       | 放大/缩小/全屏/复位/测距 按钮，位于右上角                                  |

**地图交互规范**:

- 地图定位中心点: 凯州科技创新产业园，默认缩放级别: 15
- 标记密集时使用 Maptalks ClusterLayer 聚合（聚合数字角标显示）
- 点击标记弹出 InfoWindow（自定义 HTML 内容，非系统默认弹窗）
- 图例位于地图右下角，可折叠
- 缩放控件位于右上角
- 支持滚轮缩放 + 双击放大 + 右键拖拽平移

### 3.5 第五层：关系图组件 (Graph Layer) — 5 个组件

**技术**: D3 v7 force simulation，渲染在 SVG 元素内。

| 组件                        | 职责         | 说明                                                     |
| --------------------------- | ------------ | -------------------------------------------------------- |
| `ForceGraph.vue`            | 力导向图画布 | D3 force simulation 生命周期封装在 Vue composable 中     |
| `GraphNode.vue`             | 节点渲染     | 圆形节点，半径 ∝ 重要性指标，颜色按类别区分，带文字标签  |
| `GraphEdge.vue`             | 边渲染       | 贝塞尔曲线连线 + 方向箭头（有向边），线条粗细 ∝ 关系强度 |
| `GraphControls.vue`         | 控件         | 缩放滑块 + 平移 + 小地图(minimap)概览                    |
| `GraphNodeDetailDrawer.vue` | 详情抽屉     | 从右侧滑出 (~400px)，显示节点基本信息+关联企业列表       |

**关系图交互**:

- click 节点 → 打开右侧详情抽屉
- hover 节点 → 高亮该节点及直接相连的节点/边，其余变淡 (opacity: 0.15)
- drag 节点 → 重定位（力模拟持续运行）
- 滚轮/控件 → 缩放整个画布
- 支持双击画布空白处关闭抽屉

### 3.6 第六层：业务组件 (Business Layer) — 8 个组件

| 组件                      | 职责         | Props                                                              | 使用场景                |
| ------------------------- | ------------ | ------------------------------------------------------------------ | ----------------------- |
| `EnterpriseCard.vue`      | 企业信息卡片 | enterprise (对象), showFields (字段列表)                           | Type E 列表页的卡片视图 |
| `EnterpriseTag.vue`       | 企业彩色标签 | text, type ('industry'\|'scale'\|'status'\|'qualify')              | 企业名旁的状态/资质标签 |
| `IndustryChainSelect.vue` | 产业链选择器 | modelValue, multiple (是否多选)                                    | 图谱/招商页面筛选       |
| `RegionCascadeSelect.vue` | 地区级联选择 | modelValue, level (省\|省市\|省市区)                               | 大部分筛选条件含地区    |
| `RiskIndicator.vue`       | 风险等级指示 | level ('low'\|'medium'\|'high'\|'critical'), score (0-100)         | 风险预警/企业健康度     |
| `ScoreRing.vue`           | 环形评分     | value (0-100), color (按分数段), size                              | 企业画像/评价页面       |
| `TrendIndicator.vue`      | 趋势指示器   | direction ('up'\|'down'\|'flat'), value (%数), isGood (正负向判断) | 统计卡/表格列           |
| `ComparisonBar.vue`       | 水平对比条   | items (对比实体数组), metricKey, maxValue                          | Type F 对比报告页       |

**EnterpriseTag 颜色规范**:
| type | 示例值 | 背景色 | 文字色 |
|------|--------|--------|--------|
| industry | 新材料/数字经济/高端装备 | #ECF5FF | #1889E8 |
| scale | 规上/上市/独角兽 | #F0F9EB | #67C23A |
| status | 运营/注销/迁出 | #FDF6EC | #E6A23C |
| qualify | 高企/专精特新/绿色工厂 | #FEF0F0 | #F56C6C |
