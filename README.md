# 产业招商平台

政府产业招商数字化平台前端，面向 1920×1080 大屏可视化场景。基于 Vue 3 + Vite + Element Plus 构建，所有数据为 Mock（无后端依赖）。

## 技术栈

| 层级     | 技术                               |
| -------- | ---------------------------------- |
| 框架     | Vue 3 + TypeScript + Vite          |
| UI       | Element Plus（自动导入）           |
| 图表     | ECharts 5 + vue-echarts            |
| 地图     | Maptalks（高德底图）               |
| 关系图   | D3 v7 力导向图                     |
| 状态管理 | Pinia                              |
| 路由     | Vue Router 4（Hash 模式）          |
| 样式     | SCSS + postcss-pxtorem（rem 适配） |
| 测试     | Playwright E2E                     |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 常用命令

```bash
npm run dev              # 开发服务器 http://localhost:5173
npm run build            # vue-tsc + vite build → dist/
npm run preview          # 预览构建产物

npm run lint             # ESLint 检查
npm run lint:fix         # ESLint 自动修复
npm run format           # Prettier 格式化
npm run format:check     # Prettier 仅检查
npm run lint:style       # Stylelint 检查
npm run lint:style:fix   # Stylelint 自动修复
npm run check-all        # 完整检查 (lint + format + style + type)

npm run test:e2e         # Playwright E2E 测试
```

## 项目结构

```
src/
├── api/                  # 数据层（mock 工厂 + API 函数 + 类型定义）
├── assets/               # 静态资源（图片、SCSS 变量/主题）
├── components/           # 通用组件（6 层：layout/common/charts/map/graph/business）
├── composables/          # 组合式函数（useECharts/useMaptalks/useForceGraph 等）
├── directives/           # 自定义指令（v-permission）
├── router/               # 路由配置 + 菜单配置
├── stores/               # Pinia 状态管理
├── utils/                # 工具函数（auth/format/constants/storage）
└── views/                # 页面组件（~126 页，10 大模块）
```

## 功能模块

| 模块     | 说明                   | 页面类型               |
| -------- | ---------------------- | ---------------------- |
| 产业地图 | 地图可视化、产业链分布 | Map + Graph            |
| 产业图谱 | 产业链关系图、节点详情 | Graph + Dashboard      |
| 运行分析 | 产业数据看板、趋势分析 | Dashboard              |
| 产业动态 | 资讯列表、动态追踪     | List/Search            |
| 产业对比 | 区域/产业对标分析      | Comparison             |
| 风险预警 | 风险监测、预警信号     | Dashboard + List       |
| 区域地图 | 区域产业分布、热力图   | Map                    |
| 精准招商 | 企业筛选、招商推荐     | List/Search + Portrait |
| 招商情报 | 招商线索、机会洞察     | List/Search            |
| 企业监测 | 企业画像、经营监测     | Portrait + Dashboard   |

## 设计规范

- 主色：`#1889E8`
- 图表色板：`#1889E8` `#36CBCB` `#4ECB73` `#FBD437` `#F2637B` `#975FE5`
- 响应式：rem 等比缩放（设计稿 1920×1080，rootValue=100）
- 详细规范见 `src/assets/styles/variables.scss`

## 代码规范

- **Pre-commit**：husky + lint-staged 自动执行 ESLint、Prettier、Stylelint
- **Commit message**：commitlint 强制 conventional commits（feat/fix/docs 等），subject 上限 100 字符
- **推送前**：运行 `npm run check-all`，与 CI 流水线一致

## 文档

| 文档     | 路径                         | 说明                                                   |
| -------- | ---------------------------- | ------------------------------------------------------ |
| PRD      | `docs/prd/`                  | 产品需求规格（10 模块、~140 功能项、路由表、页面类型） |
| 开发指南 | `docs/dev-guide/`            | 目录结构、组件规格、Mock 架构、Nginx 配置、分阶段计划  |
| 功能依据 | `docs/prd/产业招商平台.xlsx` | 功能需求原始数据                                       |

## 部署

- **GitHub Pages**：推送 main 自动部署
- **Docker**：`docker build -t zsyz .` → nginx:alpine 镜像
- **GitHub Release**：自动构建 Docker 镜像 → ghcr.io + dist.zip 附件

## License

Private
