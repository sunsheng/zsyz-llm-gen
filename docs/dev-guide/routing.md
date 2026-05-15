# 路由配置

> [返回目录](index.md)

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
    meta: { title: '登录', requiresAuth: false },
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
            path: 'chain',
            meta: { title: '产业链地图' },
            redirect: '/map/chain/search',
            children: [
              {
                path: 'search',
                component: lazy('map/chain/ResourceSearch'),
                meta: { title: '产业资源搜索' },
              },
              {
                path: 'filter',
                component: lazy('map/chain/ResourceFilter'),
                meta: { title: '产业资源筛选' },
              },
              {
                path: 'layers',
                component: lazy('map/chain/LayerSwitch'),
                meta: { title: '产业图层切换' },
              },
              {
                path: 'space',
                component: lazy('map/chain/SpaceDistribution'),
                meta: { title: '产业空间分布' },
              },
              {
                path: 'clusters',
                component: lazy('map/chain/ClusterDistribution'),
                meta: { title: '产业集群分布' },
              },
            ],
          },
          // ... supply/, tech/ 子模块同上模式
        ],
      },
      // ... 模块二~十 按同样模式展开 (详见 PRD.md 第三章完整路由表)

      // 404
      { path: '/:pathMatch(.*)*', redirect: '/error/404' },
      { path: '/error/404', component: lazy('error/404') },
    ],
  },
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
