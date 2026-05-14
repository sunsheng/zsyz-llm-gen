# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

产业招商平台 (Industrial Investment Promotion Platform) — Vue 3 + Vite + Element Plus frontend SPA for government investment promotion, targeting 1920x1080 large-screen dashboards. Currently at **greenfield** stage: only `docs/` exists with PRD and dev prompt.

## Commands

```bash
# Project initialization (not yet done)
npm create vite@latest . -- --template vue-ts

# Install all dependencies
npm install element-plus @element-plus/icons-vue vue-router@4 pinia axios nprogress @vueuse/core dayjs
npm install echarts vue-echarts echarts-wordcloud d3 maptalks
npm install -D postcss-pxtorem autoprefixer sass unplugin-auto-import unplugin-vue-components

# Development server
npm run dev          # http://localhost:5173

# Production build
npm run build        # outputs to dist/, deployable to Nginx
```

No test framework is configured yet. No linter is configured yet.

## Architecture

### Tech Stack (must use exactly)

| Layer        | Library                                                         | Key detail                                               |
| ------------ | --------------------------------------------------------------- | -------------------------------------------------------- |
| UI framework | **Element Plus**                                                | Auto-imported via unplugin-vue-components                |
| Charts       | **ECharts 5** + vue-echarts                                     | All chart instances managed by `useECharts()` composable |
| Maps         | **Maptalks** (primary), Baidu Map overlay (heatmap)             | Managed by `useMaptalks()` composable                    |
| Graphs       | **D3 v7** force simulation (SVG)                                | Managed by `useForceGraph()` composable                  |
| State        | **Pinia** stores in `src/stores/`                               | user/app/map/industry/enterprise domains                 |
| Routing      | **Vue Router 4**, ~140 lazy-loaded leaf routes, 3-level nesting |
| Styling      | SCSS + postcss-pxtorem (rootValue=192 for 1920px design)        | No media queries — 1920x1080 only                        |

### Layout Shell (3-part)

All authenticated pages are wrapped by:

```
MainLayout.vue → AppHeader.vue (fixed top, h:56px) + AppSidebar.vue (fixed left, w:220px, collapsible to 64px) + <router-view> (scrolling content area)
```

- Sidebar renders recursively from `router/menuConfig.ts`, supports 3-level nested menus (10 top-level modules)
- Default route `/` redirects to `/map/chain/search`

### Component Hierarchy (6 layers)

Components live in `src/components/` organized by abstraction level:

1. **layout/** — MainLayout, AppHeader, AppSidebar, Breadcrumb
2. **common/** — PageHeader, StatCard, SearchFilterBar, EmptyState, LoadingSpinner, PaginationBar
3. **charts/** — BaseChart (lifecycle wrapper) + Line/Bar/Pie/Radar/Gauge/Scatter/Heatmap/WordCloud (8 types)
4. **map/** — MaptalksMap, MapControlPanel, MapLayerToggle, MapMarkerPopup, MapLegend, MapToolbar
5. **graph/** — ForceGraph, GraphNode, GraphEdge, GraphControls, GraphNodeDetailDrawer
6. **business/** — EnterpriseCard, EnterpriseTag, IndustryChainSelect, RegionCascadeSelect, RiskIndicator, ScoreRing, TrendIndicator, ComparisonBar

### 6 Page Templates (~140 pages map into these patterns)

| Type              | Core tech                       | Count | Example pages                                  |
| ----------------- | ------------------------------- | :---: | ---------------------------------------------- |
| A: Dashboard      | ECharts grid                    |  ~35  | 运行分析(22页), 企业监测(部分), 区域对标(部分) |
| B: Map            | Maptalks full-screen            |  ~15  | 产业地图(9页), 热力图                          |
| C: Graph          | D3 force-directed SVG           |  ~12  | 产业图谱(8页), 关系链招商                      |
| D: Portrait       | Mixed (cards+charts+tables)     |  ~18  | 企业画像, 龙头企业评估                         |
| E: List/Search    | el-table/el-card + filters      |  ~30  | 精准招商(39页), 招商情报(9页)                  |
| F: Report/Compare | Radar overlay + comparison bars |  ~20  | 园区对比报告, 五维评价                         |

### Route Structure Pattern

```
/login                              (standalone)
/  → redirects to /map/chain/search
/{module}/{sub}/{feature}           (all lazy-loaded inside MainLayout)
```

Routes defined in `src/router/routes.ts`, menu config in `src/router/menuConfig.ts`. Both must stay in sync — sidebar is rendered from menuConfig, not routes directly.

### Data Layer (Mock-only for now)

- **All data is mock** — no backend API. Mock factory functions in `src/api/mock/` (8 files: industry-chain, enterprises, analysis, map, intelligence, risk, ranking, report)
- API functions in `src/api/modules/*.ts` call mock factories but return Promise\<T\> so swapping to real HTTP later only changes internals
- TypeScript types defined in `src/api/types/`

## Design System (strictly enforced)

**Primary brand color**: `#1889E8` (blue). All UI derived from this.
Full token set in `src/assets/styles/variables.scss` (once created). Element Plus theme overrides in `src/assets/styles/element-custom.scss`.

Key visual rules:

- Cards: white bg, radius 4px, shadow `0 2px 12px 0 rgba(0,0,0,0.06)`, padding 20px
- Tables: striped + bordered, header bg `#FAFAFA`
- Stat cards: icon 32px, value 28px bold, trend arrow green↑/red↓
- Scrollbar: custom thin (8px), rounded thumb, semi-transparent
- Login page: split-screen 60%/40%, left gradient panel (#E8F4FD→#D0EBFF), right form card
- NProgress bar on route change, color #1889E8, height 3px
- Chart colors: `['#1889E8','#36CBCB','#4ECB73','#FBD437','#F2637B','#975FE5']`

## Git Workflow

代码通过 **GitHub PR** 合并到 `main`，禁止直接 push 到 `main`。

### 流程

1. **总结变更** — push 前，先检查本地与远程的差异，总结修改内容
2. **创建 feature 分支** — 根据变更内容命名，格式 `features/<描述性名称>`（如 `features/project-scaffold`、`features/login-page`）
3. **提交并推送** — 在 feature 分支上提交代码，push 到远程
4. **创建 PR** — 在 GitHub 上创建 PR，目标分支为 `main`，填写变更说明
5. **合并后清理** — 合并后切换到 `main`，pull 最新代码，删除本地 feature 分支

### 禁止

- 直接 push 到 `main` 分支
- 使用无意义或示例性的分支名（如 `features/xxx`、`features/test`）

### 示例

```bash
# 1. 总结变更
git status
git diff --stat

# 2. 创建并切换到 feature 分支
git checkout -b features/project-scaffold

# 3. 提交并推送
git add -A && git commit -m "feat: 描述变更"
git push -u origin features/project-scaffold

# 4. 在 GitHub 上创建 PR (main ← features/project-scaffold)

# 5. 合并后清理
git checkout main && git pull origin main
git branch -d features/project-scaffold
```

## Reference Documents

- **PRD**: `docs/PRD.md` — Complete functional spec (10 modules, 140 features, route table, page type definitions, layout diagrams)
- **Dev Prompt**: `docs/FrontendDevPrompt.md` — AI-executable build instructions (directory tree, component specs, mock architecture, nginx config, phased implementation plan)
- **Source of truth for features**: `九、产业招商平台.xlsx` (Excel with 10一级/40二级/140三级功能 rows)
