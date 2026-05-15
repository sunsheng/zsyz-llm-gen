# Mock 数据架构

> [返回目录](index.md)

### 6.1 设计原则

由于暂不考虑后端接口，**所有数据来源均为静态 Mock**:

1. 每个 Mock 文件导出**工厂函数**（非静态常量），接受筛选/分页参数
2. 数据内容必须为**真实的中文业务数据**（非 lorem ipsum）
3. 支持模拟异步请求延迟（setTimeout 200-500ms）模拟网络等待
4. 数据量适中：列表接口返回 20-50 条/页，图表接口返回完整数据集

### 6.2 Mock 文件清单

| 文件                | 职责         | 核心导出函数                                                   | 数据特点                                     |
| ------------------- | ------------ | -------------------------------------------------------------- | -------------------------------------------- |
| `industry-chain.ts` | 产业链数据   | `getMockChains()`, `getMockChainGraph(code)`                   | 5 条产业链，每条 80-150 个节点 + 边          |
| `enterprises.ts`    | 企业数据     | `getMockEnterpriseList(params)`, `getMockEnterpriseDetail(id)` | 200+ 条企业记录，含工商/经营/资质字段        |
| `analysis.ts`       | 分析统计数据 | `getMockKpiCards()`, `getMockChartData(type)`                  | KPI 卡 4 个/组，图表数据按 type 返回不同结构 |
| `map.ts`            | GIS 数据     | `getMockGeoFeatures(region)`, `getMockMarkers(filters)`        | GeoJSON 边界 + 标记点坐标数组                |
| `intelligence.ts`   | 情报数据     | `getMockNewsList()`, `getMockProjectList()` 等                 | 新闻/项目/技术/资质/资本各 30-80 条          |
| `risk.ts`           | 风险数据     | `getMockRiskIndicators()`, `getMockWarningList()`              | 预警指标 + 风险事件列表                      |
| `ranking.ts`        | 榜单数据     | `getMockRankingList(type)`                                     | Top100 企业榜单，含多维评分                  |
| `report.ts`         | 报告数据     | `getMockReportTemplates()`, `getMockReportData(id)`            | 报告模板 + 已生成报告内容                    |

### 6.3 Mock 数据内容规范

**企业命名规则示例**:

- 制造型: `四川{地名}{核心产品}{公司后缀}` → "四川凯州新材料科技有限公司"
- 科技型: `{城市}{技术领域}{科技}{有限}` → "杭州智能装备科技有限公司"
- 规模词: 可加"集团"、"股份"表示大型企业

**行业名称**（覆盖 Excel 提到的主导产业）:

- 高端装备制造（汽车汽配）、前沿材料（玻纤复合材料/新能源材料/碳纤维）
- 数字经济（5G/集成电路/先进计算/智能安防）
- 时尚产业、现代服务业

**地区数据**（真实中国行政区划）:

- 省: 四川、重庆、广东、北京、上海...
- 市: 成都、德阳、绵阳、凯州新城、宜宾...

**金额单位**:

- 企业营收: 万元/亿元
- 投资: 万元
- 税收: 万元

**时间范围**: 2019-2025 年（历史数据 + 近期预测）

### 6.4 API 层对接方式

`api/request.ts` — Axios 配置:

```typescript
// baseURL: '' (相对路径，Mock 直接返回)
// 拦截器: request 注入 mock-token, response 统一错误处理
// 开发环境下: 直接返回 mock 数据（不走 HTTP）
// 生产环境预留: baseURL 可配置指向真实后端
```

`api/modules/*.ts` — 各模块 API 函数:

- 每个函数内部调用对应 mock 工厂函数
- 返回 Promise<T> 保持 async/await 调用风格
- 未来接入真实 API 时只需替换内部实现，不影响页面组件代码
