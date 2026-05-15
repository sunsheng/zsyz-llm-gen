# 项目初始化指令

> [返回目录](index.md)

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
