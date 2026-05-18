# 企业监测模块重写 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将企业监测模块16个页面从骨架/占位状态重写为完整功能页面，对接API+Mock数据，补充筛选器选项和图表

**Architecture:** 参照招商情报模块重写模式 — Mock工厂函数提供数据 → API层封装Promise → 页面组件调用API → 前端筛选+分页。保留已实现的3个overview页面结构，改用API层调用；重写其余13个占位页面。

**Tech Stack:** Vue 3 + TypeScript + Element Plus + ECharts (BaseChart) + SCSS

---

## 现状分析

| 分类              | 页面                                                                                                                                                  | 数量 | 问题                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----------------------------------------- |
| 已实现但绕过API层 | BasicInfo, EconomicContribution, DynamicRanking                                                                                                       | 3    | 直接调用getMock*，未用fetch*              |
| 硬编码静态数据    | KeyDashboard, ChainCollaborateMonitor, SustainableMonitor, FluctuationWarning, HealthIndex, MultiDimensionPortrait, ChainRelation, FiveDimensionModel | 8    | 图表数据写死[120,200,...]，kpiCards空数组 |
| 空数据/无数据     | MultiSourceRanking, BasicInfoFilter, BusinessQualFilter, ChainRelationFilter, RiskComplianceFilter                                                    | 5    | tableData=[]，pagination.total=0          |

## 重写模式（参照招商情报）

- API层: `fetch*` + `new Promise` + `setTimeout(200ms)` + 调用 `getMock*()`
- Mock: `Array.from({ length: count }, (_, i) => ({ id: \`prefix-\${i+1}\`, field: arr[i % arr.length] }))`
- 页面: PageHeader → SearchFilterBar → [StatCards] → [Charts] → content-card(table+pagination)
- v-loading: 放在 `<el-table>` 上
- 事件: handleSearch / handleFilter / handleReset / handlePageChange

---

### Task 1: 扩展Mock数据工厂

**Files:**

- Modify: `src/api/mock/monitor.ts`

新增接口和工厂函数：

1. `KeyDashboardKpi` — 纳税波动率/用电产能比/员工稳定性/综合评分
2. `KeyDashboardTrend` — 各指标月度趋势
3. `ChainCollaborateData` — 本地配套率/各环节配套率/低于阈值环节
4. `SustainabilityKpi` — 碳排放/合规率/绿电覆盖率
5. `SustainabilityData` — 碳排放趋势/合规率雷达/未达标企业
6. `RankingIntegrationItem` — 榜单来源/企业名/排名/类型/时间
7. `FluctuationWarningItem` — 企业名/横向波动/纵向波动/预警等级/原因
8. `FilterEnterpriseItem` — 统一筛选结果项(名称/行业/规模/状态/标签/关联信息)
9. `HealthIndexData` — 健康等级分布/评分明细
10. `MultiDimensionData` — 股权结构/资质标签/地理坐标
11. `ChainRelationNode` — 供应链关系图谱节点/边/控制力指数
12. `FiveDimensionData` — 五维评分/维度详细数据/趋势

工厂函数全部使用 `i % length` 模式，扩充数据池。

### Task 2: 扩展API层

**Files:**

- Modify: `src/api/modules/monitorApi.ts`

新增fetch函数对应每个新Mock工厂，保持 `new Promise + setTimeout(200ms)` 模式。

### Task 3: 重写经营健康度监测（3页）

**Files:**

- Rewrite: `src/views/monitor/health/KeyDashboard.vue`
- Rewrite: `src/views/monitor/health/ChainCollaborateMonitor.vue`
- Rewrite: `src/views/monitor/health/SustainableMonitor.vue`

KeyDashboard: KPI卡 + 仪表盘(Gauge) + 趋势折线图
ChainCollaborateMonitor: KPI卡 + 配套率仪表盘 + 柱状图 + 低配环节预警表格
SustainableMonitor: KPI卡 + 碳排放折线 + 合规率雷达 + 未达标企业表

### Task 4: 重写企业榜单（2页）

**Files:**

- Rewrite: `src/views/monitor/rankings/MultiSourceRanking.vue`
- Rewrite: `src/views/monitor/rankings/FluctuationWarning.vue`

MultiSourceRanking: SearchFilterBar(榜单类型/行业/时间) + 表格 + 分页
FluctuationWarning: KPI卡 + 散点图 + 折线图 + 预警列表表格

### Task 5: 重写企业筛选器（4页）

**Files:**

- Rewrite: `src/views/monitor/filter/BasicInfoFilter.vue`
- Rewrite: `src/views/monitor/filter/BusinessQualFilter.vue`
- Rewrite: `src/views/monitor/filter/ChainRelationFilter.vue`
- Rewrite: `src/views/monitor/filter/RiskComplianceFilter.vue`

全部改为 SearchFilterBar + 表格 + 分页模式，筛选器选项按PRD配置：

- BasicInfo: 行业分类(级联)/企业规模(营收+员工+用地)
- BusinessQual: 经营健康度(稳定/波动/异常)/研发投入强度(高/中/低)
- ChainRelation: 链主企业关联/技术协同关键词
- RiskCompliance: 风险排除(黑名单+财务)/合规准入

### Task 6: 重写企业画像（3页）

**Files:**

- Rewrite: `src/views/monitor/portrait/HealthIndex.vue`
- Rewrite: `src/views/monitor/portrait/MultiDimensionPortrait.vue`
- Rewrite: `src/views/monitor/portrait/ChainRelation.vue`

HealthIndex: KPI卡 + 健康评分环形图 + 等级分布饼图 + 指标明细表
MultiDimensionPortrait: 左侧面板(信息卡+评分+标签) + 右侧(股权结构+资质时间线)
ChainRelation: 力导向关系图 + 控制力指数仪表盘 + 关系详情表

### Task 7: 重写企业综合评价（1页）

**Files:**

- Rewrite: `src/views/monitor/evaluation/FiveDimensionModel.vue`

五维雷达图 + 维度对比条 + 详细数据表格 + 综合评分卡

### Task 8: 修复3个overview页面 — 改用API层

**Files:**

- Modify: `src/views/monitor/overview/BasicInfo.vue`
- Modify: `src/views/monitor/overview/EconomicContribution.vue`
- Modify: `src/views/monitor/overview/DynamicRanking.vue`

将 `import from '@/api/mock/monitor'` 改为 `import from '@/api/modules/monitorApi'`，使用 fetch\* 函数 + async/await。

### Task 9: 验证与提交

- `npm run check-all` 确保通过
- 提交代码
