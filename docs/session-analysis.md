# 产业招商平台 — 会话记录分析与需求范例

> **基于**: 23 个 CodeBuddy Code 会话记录（2026-05-12 ~ 2026-05-14）
> **目的**: 提炼开发经验，输出参考资源清单和可复用的需求范例

---

## 一、开发历程总结

### 1.1 项目时间线

项目从零到部署，历经约 26 小时、23 个会话，覆盖完整的前端工程生命周期：

| 阶段           | 会话       | 关键活动                                                                                 |
| -------------- | ---------- | ---------------------------------------------------------------------------------------- |
| **需求分析**   | #001       | 分析 2 个现有内部系统 UI，读取 Excel 功能规格，创建 PRD + CODEBUDDY.md                   |
| **项目搭建**   | #001, #004 | Vite + Vue 3 脚手架，依赖安装，目录结构，6 阶段并行构建                                  |
| **核心可视化** | #004       | composable（useECharts/useMaptalks/useForceGraph），8 种图表组件，地图组件，力导向图组件 |
| **模块开发**   | #004       | 6 个并行 team agent 开发 140 页面（地图/图谱/分析/招商/情报/监测）                       |
| **地图适配**   | #011       | 切换高德中文瓦片，定位凯州新城（104.612, 30.884），zoom=15                               |
| **规格对齐**   | #012       | 移除 Excel 中不存在的功能（全局搜索、通知）                                              |
| **UI 修复**    | #015, #022 | 力导向图动画修复，地图工具栏样式，scoped style 穿透                                      |
| **构建优化**   | #014       | Element Plus 3.x 废弃属性修复（label→value），大 chunk 分包                              |
| **工程化**     | #019       | ESLint/Prettier/Stylelint/Commitlint/Husky，Playwright e2e 迁移                          |
| **CI/CD**      | #018, #021 | GitHub Actions CI + Release（Docker + dist.zip），GitHub Pages 部署                      |
| **Git 规范**   | #020       | 建立 PR 工作流，feature 分支命名规则，CODEBUDDY.md 更新                                  |

### 1.2 会话详细记录

#### Session #001 — Vue 3 System Development（177 msgs, 3.5MB）

- **目标**: 初始项目启动，以资深 Vue 架构师角色开发产业招商平台前端
- **关键活动**:
  - 用浏览器自动化分析 2 个现有内部系统的 UI 模式
  - 读取 Excel 功能规格文件，提取 141 条功能需求
  - 创建 CODEBUDDY.md 项目指令文件
  - 从 PRD 出发进行多阶段构建（Phase 1-5）
  - 使用 team/并行 agent 并行实现模块（Phase 3, 4A, 4B）
  - Phase 4 的两个并行 agent 因速率限制（429 错误）失败
  - 完成 Phase 5 收尾工作，验证开发服务器，提交 git
- **参考网站**: `terminus-chaininvest.istari.cn`, `terminus-chainmonitor.istari.cn`, `skills.sh`

#### Session #004 — Frontend Development（231 msgs, 5.1MB）

- **目标**: 按照 FrontendDevPrompt.md 指令构建整个 Vue 3 前端
- **关键活动**:
  - Phase 1: 项目脚手架 — Vite + Vue 3 项目结构、配置文件、目录布局
  - Phase 2: 核心可视化 — composable 和图表/地图/关系图组件
  - Phase 3: 6 个并行 teammate agent 同时开发所有页面模块（地图9页、图谱8页、分析25页、模块4-7共21页、招商39页、模块9-10共25页）
  - Phase 4: 功能测试 — 发现并修复 SCSS 循环引用、空侧边栏、Element Plus label→value 废弃等问题
  - 用 agent-browser 进行浏览器自动化验证
- **关键决策**: CARTO 瓦片（后改为高德）；分阶段实施；并行 team agent 开发

#### Session #011 — 地图显示配置（115 msgs, 849KB）

- **目标**: 配置地图显示中文名称，中心定位至凯州新城智能制造产业园
- **关键活动**:
  - 地图中心从浙江杭州切换到凯州新城（四川德阳），坐标 (104.612, 30.884)
  - 瓦片从 CARTO 英文切换到高德中文
  - 缩放级别设为 15
  - 调试构建和部署问题：`npm run build` 成功但 Python HTTP 服务器对 chunked JS 文件返回 502
  - 修复 Element Plus `el-radio` 废弃警告（label → value）
- **参考网站**: maptalks.org 瓦片文档, abcdtools.com GPS 坐标查询, 百度地图

#### Session #012 — Excel 功能查询（13 msgs, 318KB）

- **目标**: 检查"全局搜索"和"通知"功能是否存在于 Excel 规格中
- **结果**: Excel 141 条功能中没有这两项，确认 PRD 和代码中属于多余功能
- **操作**: 从 PRD.md、FrontendDevPrompt.md、AppHeader.vue 中移除相关内容
- **教训**: Excel 规格表是唯一真相源，发现偏差立即修正

#### Session #015 — UI Bug 修复（69 msgs, 807KB）

- **目标**: 修复力导向图动画和地图工具栏问题
- **修复**:
  - MapToolbar: 移除全屏按钮，按钮尺寸从 small 改为 56x56px，图标 24px，`align-items: center` 对齐
  - ForceGraph: 添加分类颜色映射、点击涟漪动画、节点边界约束、力仿真参数调优
- **验证**: 用 agent-browser 截图验证图谱页面

#### Session #019 — 项目工程化配置（127 msgs, 3.2MB）

- **目标**: 添加前端工程化工具链 + 迁移 e2e 测试到 Playwright
- **关键活动**:
  - 删除根目录重复的 nginx.conf，保留 deploy/nginx.conf
  - 安装配置: ESLint, Prettier, Stylelint, Commitlint, Husky, lint-staged
  - CI workflow 增加 lint 检查
  - e2e 测试从 Python 迁移到 Playwright
  - 运行 154 个 Playwright 测试: 153 通过, 1 失败

#### Session #020 — Git 分支操作（81 msgs, 797KB）

- **目标**: 建立规范的 Git PR 工作流
- **关键活动**:
  - 创建多个 feature 分支和 PR: `features/project-scaffold`, `features/update-codebuddy-git-workflow`, `features/project-structure-refactor`, `features/move-excel-to-docs`
  - 确立规则: 分支名基于与远程 main 的全部差异总结（非仅当前提交）
  - 更新 CODEBUDDY.md Git 工作流规范
  - 保存 Git PR 工作流记忆

#### Session #021 — GitHub Pages 部署（16 msgs, 229KB）

- **目标**: 部署静态站点到 GitHub Pages
- **关键决策**:
  - 保留 `base: './'`（相对路径），不改为 `/zsyz-llm-gen/`，避免破坏本地开发体验
  - 项目使用 hash 路由，不存在 SPA 刷新问题
  - 修复 favicon 路径: `/favicon.ico` → `./favicon.ico`

### 1.3 核心开发模式

1. **PRD 驱动开发**: Excel 规格表 → PRD.md → FrontendDevPrompt.md → 代码生成
2. **并行构建**: 用 Team Agent 并行开发独立模块，显著提速
3. **参考先行**: 先浏览现有系统 UI，再设计新系统
4. **渐进修复**: 构建 → 发现 → 修复 → 验证循环
5. **规范对齐**: 发现代码/文档与规格表偏差后立即修正

---

## 二、参考网站与资源清单

### 2.1 项目直接参考的系统

| 网站                                                                      | 用途             | 关键学习点                           |
| ------------------------------------------------------------------------- | ---------------- | ------------------------------------ |
| `https://terminus-chaininvest.istari.cn/industry-overview/trend-analysis` | 产业投资分析系统 | 趋势分析页面的图表布局、数据展示模式 |
| `https://terminus-chainmonitor.istari.cn/#/industry-map/industry-chain`   | 产业链监测系统   | 地图交互模式、产业图谱可视化方案     |

### 2.2 技术文档与工具

| 资源                                   | 用途                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| `https://element-plus.org/`            | Element Plus 组件库文档（注意 3.x label→value 废弃） |
| `https://maptalks.org/`                | Maptalks 地图引擎文档                                |
| `https://echarts.apache.org/`          | ECharts 图表库文档                                   |
| `https://d3js.org/`                    | D3.js 力导向图文档                                   |
| `https://sass-lang.com/d/import`       | SASS @import 迁移指南                                |
| `https://rollupjs.org/`                | Vite 底层 Rollup 分包策略                            |
| `https://www.conventionalcommits.org/` | Conventional Commits 规范                            |

### 2.3 地图瓦片服务

| 服务                 | URL 模式                                                                                           | 说明                         |
| -------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------- |
| **高德地图**（中文） | `https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}` | 项目最终选用，支持中文标注   |
| CARTO Light（英文）  | `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`                                      | 初始选用，后因无中文标注弃用 |

### 2.4 工具/技能市场

| 资源                                           | 用途                                             |
| ---------------------------------------------- | ------------------------------------------------ |
| `https://skills.sh/`                           | AI 技能市场（frontend-design、agent-browser 等） |
| `https://github.com/vercel-labs/agent-browser` | 浏览器自动化技能（截图、表单、导航）             |

### 2.5 部署与 CI/CD

| 资源             | 用途                                                       |
| ---------------- | ---------------------------------------------------------- |
| GitHub Actions   | CI（PR 构建+检查）、Release（Docker+dist.zip）、Pages 部署 |
| GHCR (`ghcr.io`) | Docker 镜像仓库                                            |
| `nginx:alpine`   | 生产部署容器                                               |

---

## 三、全新应用需求清单（通用范例）

> 以下是从本项目经验提炼的可复用需求清单模板，适用于任何从零开始的企业级前端应用。
> 每个条目均可作为项目管理工具中的独立任务追踪。

### 3.1 需求准备阶段

- [ ] **功能规格文档**: Excel/表格形式的完整功能层级树（一级模块→二级模块→三级功能），含功能说明
- [ ] **产品需求文档 (PRD)**: 从规格文档衍生，包含模块总览、功能层级树、页面类型分类、路由结构
- [ ] **UI 参考系统**: 找到 1-2 个同类产品，记录可借鉴的交互模式和布局方案
- [ ] **设计规范**: 品牌色、字体、间距、卡片/表格/统计卡等组件视觉规则
- [ ] **数据模型定义**: TypeScript 类型定义，API 接口契约（即使先用 mock）

### 3.2 技术选型清单

| 决策项   | 必须明确的内容                                     |
| -------- | -------------------------------------------------- |
| UI 框架  | 具体库 + 版本 + 自动导入方案                       |
| 图表库   | 具体库 + 封装策略（composable vs 组件）            |
| 地图引擎 | 具体库 + 瓦片服务 + 坐标系                         |
| 关系图   | 具体库 + 渲染方式（SVG/Canvas）                    |
| 状态管理 | 具体库 + store 划分策略                            |
| 路由     | 路由结构 + 菜单配置方案 + 权限控制                 |
| 样式方案 | CSS 预处理器 + 设计令牌 + 适配方案（rem/viewport） |
| 构建工具 | 具体工具 + 分包策略 + 路径别名                     |

### 3.3 项目搭建清单

- [ ] 脚手架初始化（如 `npm create vite@latest . -- --template vue-ts`）
- [ ] 依赖安装（核心库 + 开发依赖，一次性安装避免多次锁文件冲突）
- [ ] 目录结构创建（components/views/stores/router/api/assets 按层级组织）
- [ ] 关键配置文件:
  - [ ] `vite.config.ts` — 别名、自动导入、分包策略
  - [ ] `postcss.config.ts` — rem 适配参数（如 rootValue=192 对应 1920 设计稿）
  - [ ] `tsconfig.json` — 路径别名、严格模式
  - [ ] `index.html` — viewport 设置、rem 基准脚本
- [ ] 设计令牌文件（`variables.scss`）
- [ ] UI 框架主题覆盖（如 `element-custom.scss`）
- [ ] CSS Reset + 全局工具类
- [ ] `CODEBUDDY.md` 项目指令文件

### 3.4 核心可视化层清单

- [ ] **图表 composable**（如 `useECharts`）: 初始化、resize 监听、dispose 生命周期管理
- [ ] **地图 composable**（如 `useMaptalks`）: 地图实例创建、瓦片加载、标记/弹窗管理
- [ ] **关系图 composable**（如 `useForceGraph`）: D3 力仿真、节点交互、边界约束
- [ ] **基础图表组件**（按需）: Line/Bar/Pie/Radar/Gauge/Scatter/Heatmap/WordCloud
- [ ] **地图组件**（按需）: 容器、控制面板、图层开关、标记弹窗、图例、工具栏
- [ ] **关系图组件**（按需）: 力导向画布、节点、边、控件、详情抽屉

### 3.5 通用组件清单

- [ ] **布局壳**: MainLayout、AppHeader、AppSidebar、Breadcrumb
- [ ] **通用**: PageHeader、StatCard、SearchFilterBar、EmptyState、LoadingSpinner、PaginationBar
- [ ] **业务领域**: 根据项目需要定制（如 EnterpriseCard、IndustryChainSelect、ScoreRing 等）

### 3.6 页面模板分类

| 类型         | 核心技术       | 适用场景             |
| ------------ | -------------- | -------------------- |
| A: 仪表盘    | ECharts 网格   | 数据概览、多指标分析 |
| B: 地图页    | 地图全屏       | GIS 可视化、空间分析 |
| C: 图谱页    | D3 力导向      | 关系网络、产业链     |
| D: 画像页    | 卡片+图表+表格 | 综合详情展示         |
| E: 列表/搜索 | 表格+筛选      | 数据检索、列表管理   |
| F: 报告/对比 | 雷达图+对比条  | 多维对比、评估报告   |

### 3.7 数据层清单

- [ ] TypeScript 类型定义（`src/api/types/`）
- [ ] Mock 工厂函数（`src/api/mock/`），按领域拆分文件
- [ ] API 模块函数（`src/api/modules/`），返回 `Promise<T>` 以便后续替换真实接口
- [ ] 状态管理 stores（按领域拆分: user/app/map/industry/enterprise 等）

### 3.8 路由清单

- [ ] 路由定义（`src/router/routes.ts`），所有页面懒加载
- [ ] 菜单配置（`src/router/menuConfig.ts`），与路由同步
- [ ] 默认路由重定向
- [ ] 路由切换进度条（NProgress 等）

### 3.9 工程化清单

- [ ] ESLint 配置
- [ ] Prettier 配置
- [ ] Stylelint 配置
- [ ] Commitlint 配置（Conventional Commits）
- [ ] Husky pre-commit 钩子（lint-staged）
- [ ] e2e 测试框架（推荐 Playwright）
- [ ] CI pipeline（PR 构建 + 类型检查 + lint）
- [ ] Release pipeline（Docker 镜像 + 静态资源包）
- [ ] 部署方案（GitHub Pages / Vercel / 自建 Nginx）

### 3.10 Git 工作流清单

- [ ] 禁止直接 push main
- [ ] Feature 分支命名: `features/<描述性名称>`
- [ ] 分支名基于与远程 main 的全部差异总结（非仅当前提交）
- [ ] PR 合并后清理 feature 分支
- [ ] Conventional Commits 格式

### 3.11 上线前检查清单

- [ ] 所有 UI 框架废弃 API 已更新
- [ ] 地图瓦片服务支持目标区域语言
- [ ] 大 chunk 分包（vendor 拆分为独立 chunk）
- [ ] `base` 路径配置兼容部署环境（相对路径 vs 绝对路径）
- [ ] 生产构建无报错（`npm run build`）
- [ ] e2e 关键路径测试通过
- [ ] Web 服务器配置正确（SPA history fallback 或 hash 路由）

---

## 四、关键经验教训

| #   | 教训                             | 来源 | 建议                                                          |
| --- | -------------------------------- | ---- | ------------------------------------------------------------- |
| 1   | **先分析再动手**                 | #001 | 浏览 1-2 个同类系统 UI 后再设计，避免走弯路                   |
| 2   | **规格表是唯一真相源**           | #012 | PRD 和代码必须与 Excel 功能表对齐，发现偏差立即修正           |
| 3   | **并行开发有风险**               | #001 | 6 个并行 agent 中 2 个因速率限制失败，需要重试机制            |
| 4   | **关注第三方库版本**             | #014 | Element Plus 3.x 有 label→value 废弃，提前确认兼容性          |
| 5   | **CSS 穿透要小心**               | #022 | scoped 样式无法穿透子组件包装器，需用 `:deep()`               |
| 6   | **地图瓦片选型要早定**           | #011 | CARTO 英文瓦片不适合中国场景，应一开始就选高德/天地图         |
| 7   | **适配方案要兼顾开发体验**       | #021 | `base: './'` 比 `/repo-name/` 更兼容本地开发                  |
| 8   | **SCSS 避免循环引用**            | #004 | `@import` 可能造成循环依赖，用 `@use` 替代或拆分文件          |
| 9   | **Chunk 体积需关注**             | #014 | Element Plus (1152KB) + ECharts (1036KB) 需分包，避免首屏过慢 |
| 10  | **feature 分支命名基于全量差异** | #020 | 不只看当前提交，应总结与远程 main 的所有差异后命名            |

---

## 五、可复用的开发提示词模板

基于本项目经验，以下是一个可用于新项目的开发提示词框架：

```markdown
# {项目名称} — 前端开发提示词

## 一、项目初始化指令

- 脚手架创建命令
- 依赖安装命令（核心库 + 开发依赖）
- 关键配置文件说明（vite.config.ts / postcss.config.ts / tsconfig.json）

## 二、目录结构规范

- 完整目录树（components / views / stores / router / api / assets）
- 每个目录的职责和文件命名规则

## 三、设计系统

- 品牌色、字体、间距令牌
- 组件视觉规则（卡片、表格、统计卡等）
- 图表配色方案

## 四、组件规范

- 布局壳组件（Header + Sidebar + Content）
- 通用组件（PageHeader / StatCard / SearchFilterBar 等）
- 可视化组件（图表 / 地图 / 关系图）

## 五、页面模板

- 按类型分类（仪表盘 / 地图 / 图谱 / 画像 / 列表 / 报告）
- 每种模板的核心代码结构

## 六、数据层

- TypeScript 类型定义
- Mock 工厂函数（返回 Promise<T>）
- Pinia stores 划分

## 七、路由结构

- 路由定义（懒加载）
- 菜单配置（与路由同步）

## 八、分阶段实施计划

- Phase 1: 项目脚手架 + 布局壳
- Phase 2: 核心可视化 composable + 组件
- Phase 3: 页面模块开发（可并行）
- Phase 4: 集成测试 + Bug 修复
- Phase 5: 工程化 + CI/CD + 部署
```
