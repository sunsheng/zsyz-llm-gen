# 页面清单与路由设计

> [返回目录](index.md)

## 三、页面清单与路由设计

### 3.1 路由命名规范

| 层级     | 路径模式                    | 示例                            |
| -------- | --------------------------- | ------------------------------- |
| 一级模块 | `/{module}`                 | `/map`, `/atlas`                |
| 二级模块 | `/{module}/{sub}`           | `/map/chain`, `/atlas/national` |
| 三级功能 | `/{module}/{sub}/{feature}` | `/map/chain/search`             |

特殊路由:

- `/login` — 登录页
- `/` — 重定向到默认首页
- `/:pathMatch(.*)*` — 404 兜底

### 3.2 完整路由表

#### 公共路由

| 路径     | 名称  | 页面标题 | 组件                  |
| -------- | ----- | -------- | --------------------- |
| `/login` | Login | 登录     | views/login/index.vue |

#### 模块一：产业地图 (9 页)

| 路径                     | 二级模块   | 三级功能     | 组件路径                                          |
| ------------------------ | ---------- | ------------ | ------------------------------------------------- |
| `/map/chain/search`      | 产业链地图 | 产业资源搜索 | views/map/chain/ResourceSearch.vue                |
| `/map/chain/filter`      | 产业链地图 | 产业资源筛选 | views/map/chain/ResourceFilter.vue                |
| `/map/chain/layers`      | 产业链地图 | 产业图层切换 | views/map/chain/LayerSwitch.vue                   |
| `/map/chain/space`       | 产业链地图 | 产业空间分布 | views/map/chain/SpaceDistribution.vue             |
| `/map/chain/clusters`    | 产业链地图 | 产业集群分布 | views/map/chain/ClusterDistribution.vue           |
| `/map/supply/enterprise` | 供应链地图 | 规上企业分布 | views/map/supply/ScaleEntDistribution.vue         |
| `/map/supply/resources`  | 供应链地图 | 配套资源分布 | views/map/support/SupportResourceDistribution.vue |
| `/map/tech/operate`      | 技术链地图 | 产业地图操作 | views/map/tech/MapOperation.vue                   |
| `/map/tech/config`       | 技术链地图 | 产业地图配置 | views/map/tech/MapConfig.vue                      |

#### 模块二：产业图谱 (8 页)

| 路径                          | 二级模块 | 三级功能           | 组件路径                             |
| ----------------------------- | -------- | ------------------ | ------------------------------------ |
| `/atlas/national/build`       | 全国图谱 | 产业链图谱构建     | views/atlas/national/Build.vue       |
| `/atlas/national/enterprises` | 全国图谱 | 产业链关联企业     | views/atlas/national/Enterprises.vue |
| `/atlas/national/key-nodes`   | 全国图谱 | 产业链关键环节识别 | views/atlas/national/KeyNodes.vue    |
| `/atlas/national/manage`      | 全国图谱 | 产业链图谱管理     | views/atlas/national/Manage.vue      |
| `/atlas/regional/build`       | 区域图谱 | 产业链图谱构建     | views/atlas/regional/Build.vue       |
| `/atlas/regional/enterprises` | 区域图谱 | 产业链关联企业     | views/atlas/regional/Enterprises.vue |
| `/atlas/regional/key-nodes`   | 区域图谱 | 产业链关键环节识别 | views/atlas/regional/KeyNodes.vue    |
| `/atlas/regional/manage`      | 区域图谱 | 产业链图谱管理     | views/atlas/regional/Manage.vue      |

#### 模块三：运行分析 (22 页)

| 路径                                          | 二级模块       | 三级功能           |
| --------------------------------------------- | -------------- | ------------------ |
| `/analysis/overview/investment-data`          | 产业总览       | 招商数据概览       |
| `/analysis/overview/space-data`               | 产业总览       | 载体空间数据       |
| `/analysis/overview/channel-data`             | 产业总览       | 渠道空间数据       |
| `/analysis/overview/manage-data`              | 产业总览       | 招商管理数据       |
| `/analysis/layout/related`                    | 企业布局       | 关联企业           |
| `/analysis/layout/leading`                    | 企业布局       | 龙头企业           |
| `/analysis/evaluation/profitability`          | 产业链整体评价 | 盈利能力           |
| `/analysis/evaluation/capital-valuation`      | 产业链整体评价 | 资本估值指数       |
| `/analysis/evaluation/investment-expansion`   | 产业链整体评价 | 投资扩张指数       |
| `/analysis/evaluation/pricing-power-price`    | 产业链整体评价 | 议价能力指数(价格) |
| `/analysis/evaluation/pricing-power-capacity` | 产业链整体评价 | 议价能力指数(产能) |
| `/analysis/carrier/scale-forecast`            | 产业链载体分析 | 产业规模及预测     |
| `/analysis/carrier/enterprise-analysis`       | 产业链载体分析 | 关联企业分析       |
| `/analysis/carrier/hotspots`                  | 产业链载体分析 | 投资热点分析       |
| `/analysis/strength/structure`                | 产业链强弱分析 | 产业结构分析       |
| `/analysis/strength/space-distribution`       | 产业链强弱分析 | 产业空间分布       |
| `/analysis/report/data-collection`            | 产业运行报告   | 数据采集与整合     |
| `/analysis/report/visualization`              | 产业运行报告   | 数据分析与可视化   |
| `/analysis/report/templates`                  | 产业运行报告   | 报告模板           |
| `/analysis/comparison/analysis`               | 园区对比报告   | 报告分析           |
| `/analysis/comparison/dimensions`             | 园区对比报告   | 对比维度           |
| `/analysis/comparison/metrics`                | 园区对比报告   | 对比指标           |
| `/analysis/ent-report/data-collection`        | 企业运行报告   | 数据采集与整合     |
| `/analysis/ent-report/indicators`             | 企业运行报告   | 运行指标体系       |
| `/analysis/ent-report/generate`               | 企业运行报告   | 报告生成与输出     |

#### 模块四：产业动态 (4 页)

| 路径                           | 二级模块     | 三级功能             |
| ------------------------------ | ------------ | -------------------- |
| `/dynamics/news/collect`       | 产业新闻热点 | 产业新闻热点采集     |
| `/dynamics/news/analysis`      | 产业新闻热点 | 产业新闻热点智能分析 |
| `/dynamics/policy/compilation` | 产业政策规划 | 政策汇编             |
| `/dynamics/policy/monitoring`  | 产业政策规划 | 政策实施监测         |

#### 模块五：区域对标 (8 页)

| 路径                                        | 二级模块     | 三级功能     |
| ------------------------------------------- | ------------ | ------------ |
| `/benchmarking/comparison/scale`            | 产业对比分析 | 产业规模     |
| `/benchmarking/comparison/structure`        | 产业对比分析 | 产业结构     |
| `/benchmarking/comparison/economic-benefit` | 产业对比分析 | 经济效益     |
| `/benchmarking/comparison/innovation`       | 产业对比分析 | 创新能力     |
| `/benchmarking/comparison/talent`           | 产业对比分析 | 人才资源     |
| `/benchmarking/proportion/global`           | 产业占比分析 | 全局产业分布 |
| `/benchmarking/proportion/heatmap`          | 产业占比分析 | 地图热力图   |
| `/benchmarking/proportion/dashboard`        | 产业占比分析 | 动态数据看板 |

#### 模块六：风险预警 (6 页)

| 路径                             | 二级模块     | 三级功能     |
| -------------------------------- | ------------ | ------------ |
| `/warning/dev/indicators`        | 产业发展预警 | 核心监测指标 |
| `/warning/dev/threshold`         | 产业发展预警 | 动态阈值设定 |
| `/warning/dev/model`             | 产业发展预警 | 预警分析模型 |
| `/warning/relocation/indicators` | 企业外迁预警 | 预警指标体系 |
| `/warning/relocation/signals`    | 企业外迁预警 | 间接风险信号 |
| `/warning/relocation/model`      | 企业外迁预警 | 风险评分模型 |

#### 模块七：区域地图 (3 页)

| 路径                                             | 二级模块 | 三级功能     |
| ------------------------------------------------ | -------- | ------------ |
| `/regional-map/ranking/indicator-system`         | 园区榜单 | 榜单指标体系 |
| `/regional-map/ranking/enterprise-comprehensive` | 园区榜单 | 企业综合榜   |
| `/regional-map/ranking/chain-synergy`            | 园区榜单 | 产业链协同榜 |

#### 模块八：精准招商 (39 页)

| 路径                                  | 二级模块     | 三级功能           |
| ------------------------------------- | ------------ | ------------------ |
| `/invest/chain/structure`             | 产业链招商   | 产业链结构         |
| `/invest/chain/key-nodes`             | 产业链招商   | 关键节点           |
| `/invest/chain/competitiveness`       | 产业链招商   | 竞争力评估         |
| `/invest/chain/target-recommend`      | 产业链招商   | 目标企业智能推荐   |
| `/invest/map/resource-distribution`   | 产业地图招商 | 产业资源分布       |
| `/invest/map/space-atlas`             | 产业地图招商 | 产业链空间图谱     |
| `/invest/map/advantage-links`         | 产业地图招商 | 优势环节识别       |
| `/invest/map/extension-recommend`     | 产业地图招商 | 延伸方向推荐       |
| `/invest/extension/benchmark-tool`    | 强延补链招商 | 对标管理工具       |
| `/invest/extension/gap-diagnosis`     | 强延补链招商 | 缺口智能诊断       |
| `/invest/extension/target-library`    | 强延补链招商 | 补链目标库         |
| `/invest/relation/atlas`              | 关系链招商   | 关系图谱           |
| `/invest/relation/radiation`          | 关系链招商   | 链主企业辐射力分析 |
| `/invest/relation/secondary-relation` | 关系链招商   | 二级关联招商       |
| `/invest/merchant/drive-profile`      | 以商招商     | 带动能力画像       |
| `/invest/merchant/ecosystem-mining`   | 以商招商     | 生态网络挖掘       |
| `/invest/merchant/incentive-policy`   | 以商招商     | 招商激励政策       |
| `/invest/listed/vertical-list`        | 名企榜单招商 | 垂直榜单           |
| `/invest/listed/specialty-list`       | 名企榜单招商 | 特色榜单           |
| `/invest/listed/empowerment-tool`     | 名企榜单招商 | 榜单赋能招商工具   |
| `/invest/listed/brand-linkage`        | 名企榜单招商 | 品牌联动与传播     |
| `/invest/leading/identify-assess`     | 龙头骨干招商 | 识别与评估         |
| `/invest/leading/strategy-generate`   | 龙头骨干招商 | 精准招商策略生成   |
| `/invest/leading/ecosystem-synergy`   | 龙头骨干招商 | 生态构建与协同     |
| `/invest/qualified/smart-identify`    | 资质企业招商 | 智能识别           |
| `/invest/qualified/demand-profile`    | 资质企业招商 | 需求画像           |
| `/invest/qualified/resource-match`    | 资质企业招商 | 资源智能匹配       |
| `/invest/fund/fund-guide`             | 投行基金招商 | 产业基金引导       |
| `/invest/fund/project-manage`         | 投行基金招商 | 项目库管理         |
| `/invest/fund/capital-connect`        | 投行基金招商 | 资本对接           |
| `/invest/research/panorama`           | 科研机构招商 | 科研资源全景库     |
| `/invest/research/tech-transfer`      | 科研机构招商 | 技术转化潜力评估   |
| `/invest/research/talent-sharing`     | 科研机构招商 | 人才流动与共享机制 |
| `/invest/owner/profile-parse`         | 链主适配招商 | 链主画像与需求解析 |
| `/invest/owner/gap-diagnosis`         | 链主适配招商 | 产业链缺口诊断     |
| `/invest/owner/enterprise-match`      | 链主适配招商 | 适配企业智能匹配   |
| `/invest/park/resource-panorama`      | 园区招商     | 园区资源全景展示   |
| `/invest/park/smart-match`            | 园区招商     | 智能企业匹配引擎   |
| `/invest/park/chain-synergy`          | 园区招商     | 产业链协同招商     |

#### 模块九：招商情报 (9 页)

| 路径                                | 二级模块     | 三级功能       |
| ----------------------------------- | ------------ | -------------- |
| `/intelligence/news`                | 资讯招商情报 | 资讯列表与详情 |
| `/intelligence/projects`            | 项目招商情报 | 项目列表与详情 |
| `/intelligence/technology`          | 技术招商情报 | 技术列表与详情 |
| `/intelligence/qualifications`      | 资质招商情报 | 资质列表与详情 |
| `/intelligence/capital`             | 资本招商情报 | 资本列表与详情 |
| `/intelligence/risk-monitor`        | 招商风险监测 | 风险列表与详情 |
| `/intelligence/risk-classification` | 招商风险监测 | 风险分类体系   |
| `/intelligence/search`              | 招商情报搜索 | 全文检索       |
| `/intelligence/my-intelligence`     | 我的招商情报 | 收藏/订阅/历史 |

#### 模块十：企业监测 (17 页)

| 路径                                      | 二级模块       | 三级功能         |
| ----------------------------------------- | -------------- | ---------------- |
| `/monitor/overview/basic-info`            | 企业总览       | 基础信息总览     |
| `/monitor/overview/economic-contribution` | 企业总览       | 经济贡献分析     |
| `/monitor/overview/dynamic-ranking`       | 企业总览       | 动态排名         |
| `/monitor/health/dashboard`               | 经营健康度监测 | 关键指标看板     |
| `/monitor/health/chain-collaboration`     | 经营健康度监测 | 产业链协同监测   |
| `/monitor/health/sustainability`          | 经营健康度监测 | 可持续发展监测   |
| `/monitor/rankings/integration`           | 企业榜单       | 多源榜单动态整合 |
| `/monitor/rankings/volatility-warning`    | 企业榜单       | 榜单波动预警体系 |
| `/monitor/filter/basic-info-filter`       | 企业筛选器     | 基础信息筛选     |
| `/monitor/filter/qualification-filter`    | 企业筛选器     | 经营资质筛选     |
| `/monitor/filter/chain-relation-filter`   | 企业筛选器     | 产业链关联筛选   |
| `/monitor/filter/risk-compliance-filter`  | 企业筛选器     | 风险合规筛选     |
| `/monitor/portrait/health-index`          | 企业画像       | 企业健康指数     |
| `/monitor/portrait/multi-dimensional`     | 企业画像       | 多维度画像       |
| `/monitor/portrait/chain-relation`        | 企业画像       | 产业链关联       |
| `/monitor/evaluation/five-dimensional`    | 企业综合评价   | 五维评价模型     |

**叶子路由总计: ~140 条**
