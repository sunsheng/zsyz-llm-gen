# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

产业招商平台 (Industrial Investment Promotion Platform) — Vue 3 + Vite + Element Plus frontend SPA for government investment promotion, targeting 1920x1080 large-screen dashboards. All data is mock (no backend).

架构详情见 `docs/dev-guide/`，功能规格见 `docs/prd/`。

## Commands

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
npm run check-all        # 完整检查 (lint + format:check + lint:style + vue-tsc --noEmit)

npm run test:e2e         # Playwright E2E 测试
npm run test:e2e:ui      # Playwright 交互式 UI
npm run test:e2e:debug   # Playwright 调试模式
```

## Code Quality (auto-enforced)

**Pre-commit (husky)**: `lint-staged` runs ESLint --fix + Prettier --write on staged files, Stylelint --fix on CSS/SCSS/Vue
**Commit message (husky)**: `commitlint` enforces conventional commits (feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert), subject max 100 chars

**Push 前**务必运行 `npm run check-all`，与 CI 流水线检查一致。

## Responsive Scheme

`index.html` 内联脚本: `html.fontSize = window.innerWidth / 19.2 + 'px'` (max 1920px → 100px)。配合 `postcss-pxtorem rootValue=100`，设计稿中的 px 值自动转为 rem 实现等比缩放。Element Plus 组件通过 `selectorBlackList: [/^\.el-/]` 排除转换。

> 注：`docs/dev-guide/` 中 rootValue 写的是 192，实际代码中为 100，以代码为准。

## Design System

**Primary brand color**: `#1889E8`. Full token set in `src/assets/styles/variables.scss`. Element Plus theme overrides in `src/assets/styles/element-custom.scss`.

SCSS global injection via `vite.config.ts`: `@use "@/assets/styles/variables.scss" as *;` — no manual import needed.

Chart colors: `['#1889E8','#36CBCB','#4ECB73','#FBD437','#F2637B','#975FE5']`

更多视觉规范见 `docs/dev-guide/` 第 5 章。

## TypeScript

`tsconfig.json`: strict=false, noImplicitAny=false. Auto-generated `src/auto-imports.d.ts` and `src/components.d.ts` — do not edit these manually.

## Environment Variables

| File               | Key                 | Dev value    | Prod value   |
| ------------------ | ------------------- | ------------ | ------------ |
| `.env`             | `VITE_APP_TITLE`    | 产业招商平台 | 产业招商平台 |
| `.env.development` | `VITE_APP_BASE_API` | (empty)      | —            |
| `.env.development` | `VITE_APP_MOCK`     | true         | —            |
| `.env.production`  | `VITE_APP_BASE_API` | (empty)      | —            |
| `.env.production`  | `VITE_APP_MOCK`     | false        | —            |

## CI/CD

- **ci.yml** — PR to main: lint + format:check + lint:style + vue-tsc + build
- **deploy-pages.yml** — Push to main: deploy to GitHub Pages
- **release.yml** — GitHub Release: Docker image → ghcr.io, dist.zip → Release assets

## Git Workflow

代码通过 **GitHub PR** 合并到 `main`，禁止直接 push 到 `main`。使用 `gh` CLI 创建 PR。

### 流程

1. **提交代码** — `git add -A && git commit -m "feat: 描述变更"` (husky 自动执行 lint-staged + commitlint)
2. **本地验证** — `npm run check-all` 确保与 CI 一致
3. **总结变更** — `git fetch origin && git log origin/main..HEAD --oneline`，根据全部差异总结命名
4. **创建 feature 分支** — 格式 `features/<描述性名称>`（如 `features/project-scaffold`）
5. **推送** — `git push -u origin features/<name>`
6. **创建 PR** — `gh pr create --base main --head features/<name> --title "feat: 描述" --body "说明"`
7. **合并后清理** — 切回 main, pull, 删除本地和远程 feature 分支, `git remote prune origin`

### 禁止

- 直接 push 到 `main` 分支
- 无意义分支名（`features/xxx`、`features/test`）
- 仅根据当前提交命名分支，应基于与远程 main 的全部差异

## Reference Documents

- **PRD**: `docs/prd/` — Complete functional spec (10 modules, ~140 features, route table, page types)
- **Dev Guide**: `docs/dev-guide/` — AI-executable build instructions (directory tree, component specs, mock architecture, nginx config, phased plan)
- **Source of truth for features**: `docs/prd/产业招商平台.xlsx`
