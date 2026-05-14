// 运行分析 Mock 数据工厂
import type { KpiCard, ChartData } from '@/api/types/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

export function getMockKpiCards(): KpiCard[] {
  return [
    {
      key: 'park',
      label: '园区数量',
      value: 12,
      unit: '个',
      trend: 'up',
      trendValue: '+8.3%',
      icon: 'OfficeBuilding',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'building',
      label: '楼栋数量',
      value: 156,
      unit: '栋',
      trend: 'up',
      trendValue: '+5.2%',
      icon: 'School',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'resource',
      label: '房源数量',
      value: 2340,
      unit: '套',
      trend: 'up',
      trendValue: '+12.1%',
      icon: 'House',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'area',
      label: '建筑面积',
      value: 89.6,
      unit: '万m²',
      trend: 'up',
      trendValue: '+6.7%',
      icon: 'DataLine',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'enterprise',
      label: '入驻企业',
      value: 1286,
      unit: '家',
      trend: 'up',
      trendValue: '+15.4%',
      icon: 'UserFilled',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
    {
      key: 'revenue',
      label: '年产值',
      value: 358.7,
      unit: '亿元',
      trend: 'up',
      trendValue: '+9.8%',
      icon: 'TrendCharts',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
  ]
}

function randomLineData(count = 12) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 500 + 200))
}

function randomBarData(count = 12) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 300 + 100))
}

export function getMockChartData(type: string): ChartData {
  switch (type) {
    case 'trend-line':
      return {
        type: 'line',
        title: '入驻率趋势',
        data: {
          xAxis: { data: months },
          series: [
            { name: '入驻率', data: [72, 73, 75, 76, 78, 79, 81, 82, 84, 85, 86, 88] },
            { name: '目标值', data: [75, 76, 78, 79, 80, 82, 83, 85, 86, 88, 89, 90] },
          ],
        },
      }
    case 'hot-resource-bar':
      return {
        type: 'bar',
        title: '热门房源排行',
        data: {
          xAxis: { data: ['A栋3F', 'B栋5F', 'C栋2F', 'D栋1F', 'E栋4F', 'F栋3F'] },
          series: [
            { name: '访问量', data: [320, 280, 260, 240, 220, 200] },
            { name: '成交数', data: [45, 38, 35, 30, 28, 25] },
          ],
        },
      }
    case 'status-pie':
      return {
        type: 'pie',
        title: '租售状态分布',
        data: [
          { name: '已入驻', value: 856 },
          { name: '空置', value: 234 },
          { name: '装修中', value: 120 },
          { name: '预订中', value: 76 },
        ],
      }
    case 'park-radar':
      return {
        type: 'radar',
        title: '各园区综合评分',
        data: {
          indicator: [
            { name: '入驻率', max: 100 },
            { name: '租金水平', max: 100 },
            { name: '配套设施', max: 100 },
            { name: '交通便捷', max: 100 },
            { name: '产业集聚', max: 100 },
          ],
          series: [
            { name: '园区A', value: [85, 72, 90, 78, 88] },
            { name: '园区B', value: [78, 85, 76, 90, 72] },
          ],
        },
      }
    case 'structure-pie':
      return {
        type: 'pie',
        title: '产业结构分布',
        data: [
          { name: '高端装备制造', value: 28 },
          { name: '新材料', value: 22 },
          { name: '生物医药', value: 18 },
          { name: '电子信息', value: 16 },
          { name: '新能源', value: 10 },
          { name: '其他', value: 6 },
        ],
      }
    case 'contribution-bar':
      return {
        type: 'bar',
        title: '各产业贡献度',
        data: {
          xAxis: { data: ['高端装备', '新材料', '生物医药', '电子信息', '新能源', '现代服务'] },
          series: [{ name: '产值(亿)', data: [98.5, 76.3, 62.1, 55.8, 35.4, 30.6] }],
        },
      }
    case 'growth-line':
      return {
        type: 'line',
        title: '产业增长趋势',
        data: {
          xAxis: { data: months },
          series: [
            { name: '高端装备', data: randomLineData() },
            { name: '新材料', data: randomLineData() },
            { name: '生物医药', data: randomLineData() },
          ],
        },
      }
    case 'evaluation-gauge':
      return {
        type: 'gauge',
        title: '综合评价指数',
        data: { value: 78.5, name: '综合得分' },
      }
    case 'scatter-distribution':
      return {
        type: 'scatter',
        title: '企业分布散点图',
        data: Array.from({ length: 50 }, () => [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 50 + 10,
        ]),
      }
    default:
      return {
        type: 'line',
        title: '数据趋势',
        data: {
          xAxis: { data: months },
          series: [{ name: '数值', data: randomLineData() }],
        },
      }
  }
}

// 运行分析表格 Mock 数据
export interface AnalysisTableRow {
  id: string
  name: string
  [key: string]: string | number
}

export function getMockTableData(module: string): AnalysisTableRow[] {
  const base = [
    { id: '1', name: '高端装备制造产业园', count: 156, revenue: 98.5, rate: 88.2, growth: 8.3 },
    { id: '2', name: '新材料创新园', count: 132, revenue: 76.3, rate: 85.6, growth: 12.1 },
    { id: '3', name: '生物医药产业基地', count: 98, revenue: 62.1, rate: 82.3, growth: 6.7 },
    { id: '4', name: '电子信息产业园', count: 124, revenue: 55.8, rate: 79.8, growth: 15.4 },
    { id: '5', name: '新能源科技园', count: 86, revenue: 35.4, rate: 76.5, growth: 9.8 },
    { id: '6', name: '现代服务业集聚区', count: 72, revenue: 30.6, rate: 73.2, growth: 4.5 },
    { id: '7', name: '节能环保产业园', count: 68, revenue: 28.9, rate: 71.8, growth: 7.2 },
    { id: '8', name: '数字创意产业基地', count: 54, revenue: 22.3, rate: 68.5, growth: 18.6 },
  ]
  return base.map((row) => ({ ...row, module }))
}

// 强弱分析数据
export function getMockStrengthData() {
  return {
    industries: ['高端装备', '新材料', '生物医药', '电子信息', '新能源'],
    strengthScores: [85, 78, 72, 68, 65],
    weaknessScores: [35, 42, 48, 52, 55],
    details: [
      { name: '高端装备', strength: 85, weakness: 35, trend: 'up' },
      { name: '新材料', strength: 78, weakness: 42, trend: 'up' },
      { name: '生物医药', strength: 72, weakness: 48, trend: 'flat' },
      { name: '电子信息', strength: 68, weakness: 52, trend: 'up' },
      { name: '新能源', strength: 65, weakness: 55, trend: 'down' },
    ],
  }
}
