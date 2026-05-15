# UI 复刻要点

> [返回目录](index.md)

> 以下每一条都是必须严格遵循的视觉规范，来自对参考系统的截图和样式分析。

### 5.1 颜色体系 — 精确匹配

在 `src/assets/styles/variables.scss` 中定义以下 CSS 变量，全局生效:

| 变量名                   | 值        | 用途                                            |
| ------------------------ | --------- | ----------------------------------------------- |
| `$color-primary`         | `#1889E8` | **品牌主色** — 按钮、链接、激活态、图表第一系列 |
| `$color-primary-dark`    | `#0970F0` | hover/active 深蓝                               |
| `$color-primary-light-3` | `#79BBFF` | 浅背景、hover 提示                              |
| `$color-primary-light-5` | `#A0CFFF` | 更浅背景                                        |
| `$color-primary-light-7` | `#C6E2FF` | 表头、标签背景                                  |
| `$color-primary-light-9` | `#ECF5FF` | 极浅背景                                        |
| `$bg-page`               | `#F6F7FB` | 页面底色 (`body` 背景)                          |
| `$bg-card`               | `#FFFFFF` | 卡片/面板背景                                   |
| `$text-primary`          | `#303133` | 标题、重要文字                                  |
| `$text-regular`          | `#606266` | 正文文字                                        |
| `$text-secondary`        | `#909399` | 辅助/占位文字                                   |
| `$border-color`          | `#DCDFE6` | 边框、分割线                                    |

### 5.2 Element Plus 主题覆盖

在 `src/assets/styles/element-custom.scss` 中覆盖 Element Plus 默认 CSS 变量:

```scss
:root {
  --el-color-primary: #1889e8;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-9: #ecf5ff;
  --el-border-radius-base: 4px;
  --el-font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --el-box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.06); // 比默认更轻
  --el-table-header-bg-color: #fafafa; // 表头灰底
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

| 交互场景          | 效果                     | 参数                                                 |
| ----------------- | ------------------------ | ---------------------------------------------------- |
| 页面路由切换      | fade + slide (淡入+位移) | duration 300ms, ease-out                             |
| 侧边栏折叠/展开   | width 动画               | transition width 0.3s cubic-bezier(0.4, 0, 0.2, 1)   |
| Modal/Dialog 打开 | 缩放 + 淡入              | transform scale(0.9→1) + opacity, 200ms              |
| 按钮 hover        | 颜色加深                 | darken($color-primary, 10%)                          |
| 表格行 hover      | 背景微变                 | background: #F5F7FA, transition 150ms                |
| 统计卡 hover      | 上浮 + 阴影加深          | translateY(-2px) + box-shadow 增强, transition 200ms |
| ECharts 图表动画  | 内置动画                 | animationDuration: 800ms, easing: 'cubicOut'         |
| Loading 状态      | el-skeleton 骨架屏       | rows: 3-5, animated: true                            |
| 搜索结果出现      | 列表依次淡入             | stagger delay 50ms per item                          |

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
  background-color: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
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
