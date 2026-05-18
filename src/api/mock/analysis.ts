// 运行分析 Mock 数据工厂
import type { KpiCard, ChartData } from '@/api/types/analysis'

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

// 对比维度数据
export function getMockComparisonDimensions(): import('@/api/types/analysis').ComparisonDimensionsData {
  return {
    compareParks: ['科技园', '产业园', '创新园'],
    dimensions: [
      {
        key: 'basic',
        label: '基础信息',
        tableData: [
          { indicator: '占地面积(万㎡)', 科技园: '52.8', 产业园: '68.5', 创新园: '35.2' },
          { indicator: '建筑面积(万㎡)', 科技园: '85.6', 产业园: '112.3', 创新园: '58.2' },
          { indicator: '入驻企业数', 科技园: '86', 产业园: '68', 创新园: '55' },
          { indicator: '员工总数', 科技园: '12580', 产业园: '8920', 创新园: '6580' },
          { indicator: '园区等级', 科技园: '国家级', 产业园: '省级', 创新园: '省级' },
        ],
      },
      {
        key: 'industry',
        label: '产业发展',
        tableData: [
          { indicator: '主导产业', 科技园: '数字经济', 产业园: '高端装备制造', 创新园: '前沿材料' },
          { indicator: '产值(亿)', 科技园: '358', 产业园: '285', 创新园: '245' },
          { indicator: '产值增速(%)', 科技园: '12.3', 产业园: '10.5', 创新园: '8.8' },
          { indicator: '产业链完整度', 科技园: '92%', 产业园: '85%', 创新园: '78%' },
          { indicator: '重点企业数', 科技园: '28', 产业园: '22', 创新园: '18' },
        ],
      },
      {
        key: 'benefit',
        label: '经济效益',
        tableData: [
          { indicator: '税收收入(亿)', 科技园: '18.5', 产业园: '15.2', 创新园: '12.8' },
          { indicator: '利润总额(亿)', 科技园: '22.3', 产业园: '18.7', 创新园: '15.6' },
          { indicator: '利润率(%)', 科技园: '8.5', 产业园: '7.2', 创新园: '6.8' },
          { indicator: '劳动生产率(万/人)', 科技园: '42.5', 产业园: '38.2', 创新园: '35.8' },
          { indicator: '入驻率(%)', 科技园: '92', 产业园: '85', 创新园: '78' },
        ],
      },
      {
        key: 'innovation',
        label: '创新能力',
        tableData: [
          { indicator: '研发投入(亿)', 科技园: '28.5', 产业园: '22.3', 创新园: '18.6' },
          { indicator: '专利数量', 科技园: '568', 产业园: '425', 创新园: '358' },
          { indicator: '高新技术企业数', 科技园: '42', 产业园: '35', 创新园: '28' },
          { indicator: '研发人员占比(%)', 科技园: '25.6', 产业园: '22.1', 创新园: '20.8' },
          { indicator: '产学研合作项目', 科技园: '18', 产业园: '12', 创新园: '15' },
        ],
      },
      {
        key: 'talent',
        label: '人才资源',
        tableData: [
          { indicator: '博士人数', 科技园: '385', 产业园: '268', 创新园: '312' },
          { indicator: '硕士人数', 科技园: '1850', 产业园: '1420', 创新园: '1280' },
          { indicator: '高层次人才数', 科技园: '86', 产业园: '62', 创新园: '75' },
          { indicator: '人才流动率(%)', 科技园: '8.5', 产业园: '6.2', 创新园: '7.8' },
          { indicator: '人才公寓(套)', 科技园: '520', 产业园: '380', 创新园: '280' },
        ],
      },
      {
        key: 'environment',
        label: '营商环境',
        tableData: [
          { indicator: '政策支持力度', 科技园: 'A级', 产业园: 'B级', 创新园: 'B级' },
          { indicator: '政务服务效率', 科技园: '95分', 产业园: '88分', 创新园: '82分' },
          { indicator: '基础设施评分', 科技园: '92', 产业园: '85', 创新园: '78' },
          { indicator: '金融服务网点', 科技园: '12', 产业园: '8', 创新园: '6' },
          { indicator: '生活配套评分', 科技园: '88', 产业园: '75', 创新园: '72' },
        ],
      },
    ],
  }
}

// 企业运行报告-数据采集
export function getMockEntReportDataCollection(): import('@/api/types/analysis').DataCollectionData {
  return {
    dataSources: [
      {
        name: '企业填报',
        icon: 'Document',
        color: '#1889E8',
        status: '正常',
        count: '8,562条',
        frequency: '每日',
        lastUpdate: '2024-12-15 09:30',
        completion: 92,
      },
      {
        name: '政府部门',
        icon: 'DataLine',
        color: '#4ECB73',
        status: '正常',
        count: '5,230条',
        frequency: '每周',
        lastUpdate: '2024-12-14 18:00',
        completion: 85,
      },
      {
        name: '互联网公开',
        icon: 'Monitor',
        color: '#FBD437',
        status: '延迟',
        count: '18,350条',
        frequency: '实时',
        lastUpdate: '2024-12-15 06:15',
        completion: 68,
      },
      {
        name: '第三方数据',
        icon: 'Connection',
        color: '#975FE5',
        status: '正常',
        count: '12,860条',
        frequency: '每日',
        lastUpdate: '2024-12-15 07:45',
        completion: 78,
      },
    ],
    integrationTasks: [
      {
        name: '企业基础数据整合',
        source: '企业填报 + 政府部门',
        status: '已完成',
        progress: 100,
        records: 8562,
        updateTime: '2024-12-15 09:00',
      },
      {
        name: '财务数据对齐',
        source: '企业填报 + 第三方数据',
        status: '进行中',
        progress: 82,
        records: 6845,
        updateTime: '2024-12-15 08:45',
      },
      {
        name: '创新能力评估数据',
        source: '全部来源',
        status: '进行中',
        progress: 55,
        records: 4280,
        updateTime: '2024-12-14 22:30',
      },
      {
        name: '风险预警数据整合',
        source: '政府部门 + 第三方数据',
        status: '进行中',
        progress: 42,
        records: 3160,
        updateTime: '2024-12-14 20:00',
      },
      {
        name: 'ESG数据计算',
        source: '互联网公开 + 第三方数据',
        status: '待开始',
        progress: 0,
        records: 0,
        updateTime: '-',
      },
    ],
  }
}

// 运行分析报告-数据采集
export function getMockReportDataCollection(): import('@/api/types/analysis').DataCollectionData {
  return {
    dataSources: [
      {
        name: '企业填报',
        icon: 'Document',
        color: '#1889E8',
        status: '正常',
        count: '12,586条',
        frequency: '每日',
        lastUpdate: '2024-12-15 08:30',
        completion: 95,
      },
      {
        name: '政府部门',
        icon: 'DataLine',
        color: '#4ECB73',
        status: '正常',
        count: '8,432条',
        frequency: '每周',
        lastUpdate: '2024-12-14 18:00',
        completion: 88,
      },
      {
        name: '互联网公开',
        icon: 'Monitor',
        color: '#FBD437',
        status: '延迟',
        count: '25,120条',
        frequency: '实时',
        lastUpdate: '2024-12-15 06:15',
        completion: 72,
      },
    ],
    integrationTasks: [
      {
        name: '企业基础数据整合',
        source: '企业填报 + 政府部门',
        status: '已完成',
        progress: 100,
        records: 12586,
        updateTime: '2024-12-15 09:00',
      },
      {
        name: '财务数据对齐',
        source: '企业填报 + 互联网公开',
        status: '进行中',
        progress: 78,
        records: 8234,
        updateTime: '2024-12-15 08:45',
      },
      {
        name: '产业链关系映射',
        source: '政府部门 + 互联网公开',
        status: '进行中',
        progress: 62,
        records: 5620,
        updateTime: '2024-12-14 22:30',
      },
      {
        name: '区域经济数据整合',
        source: '全部来源',
        status: '进行中',
        progress: 45,
        records: 3280,
        updateTime: '2024-12-14 20:00',
      },
      {
        name: '创新能力指标计算',
        source: '企业填报 + 政府部门',
        status: '待开始',
        progress: 0,
        records: 0,
        updateTime: '-',
      },
    ],
  }
}

// 关联企业
export function getMockRelatedEnterprises(): import('@/api/types/analysis').RelatedEnterprisesData {
  return {
    segments: ['上游原材料', '中游制造', '下游应用', '研发设计', '物流配送', '技术服务'],
    enterprises: [
      {
        id: 1,
        name: '华芯微电子科技有限公司',
        segment: '中游制造',
        industry: '集成电路',
        region: '浦东新区',
        capital: 5000,
        matchScore: 92,
        contact: '张明',
        phone: '138-0000-1001',
      },
      {
        id: 2,
        name: '博创智能装备有限公司',
        segment: '中游制造',
        industry: '智能装备',
        region: '松江区',
        capital: 8000,
        matchScore: 88,
        contact: '李华',
        phone: '138-0000-1002',
      },
      {
        id: 3,
        name: '前沿材料科技有限公司',
        segment: '上游原材料',
        industry: '高端装备制造',
        region: '闵行区',
        capital: 3000,
        matchScore: 85,
        contact: '王强',
        phone: '138-0000-1003',
      },
      {
        id: 4,
        name: '云智信息技术有限公司',
        segment: '技术服务',
        industry: '软件服务',
        region: '徐汇区',
        capital: 2000,
        matchScore: 82,
        contact: '赵敏',
        phone: '138-0000-1004',
      },
      {
        id: 5,
        name: '数字智联科技有限公司',
        segment: '下游应用',
        industry: '数字经济',
        region: '嘉定区',
        capital: 12000,
        matchScore: 78,
        contact: '陈波',
        phone: '138-0000-1005',
      },
      {
        id: 6,
        name: '精密模具制造有限公司',
        segment: '研发设计',
        industry: '精密制造',
        region: '宝山区',
        capital: 4500,
        matchScore: 75,
        contact: '刘洋',
        phone: '138-0000-1006',
      },
      {
        id: 7,
        name: '时尚创意科技有限公司',
        segment: '研发设计',
        industry: '时尚产业',
        region: '张江',
        capital: 6000,
        matchScore: 72,
        contact: '周芳',
        phone: '138-0000-1007',
      },
      {
        id: 8,
        name: '智慧物流有限公司',
        segment: '物流配送',
        industry: '现代物流',
        region: '青浦区',
        capital: 3500,
        matchScore: 68,
        contact: '吴刚',
        phone: '138-0000-1008',
      },
      {
        id: 9,
        name: '绿能环保科技有限公司',
        segment: '上游原材料',
        industry: '新能源',
        region: '奉贤区',
        capital: 5500,
        matchScore: 65,
        contact: '孙丽',
        phone: '138-0000-1009',
      },
      {
        id: 10,
        name: '中科集成电路有限公司',
        segment: '中游制造',
        industry: '集成电路',
        region: '浦东新区',
        capital: 15000,
        matchScore: 95,
        contact: '马伟',
        phone: '138-0000-1010',
      },
      {
        id: 11,
        name: '宏达新材料有限公司',
        segment: '上游原材料',
        industry: '新材料',
        region: '金山区',
        capital: 4200,
        matchScore: 70,
        contact: '黄涛',
        phone: '138-0000-1011',
      },
      {
        id: 12,
        name: '远航数据服务有限公司',
        segment: '技术服务',
        industry: '数据服务',
        region: '杨浦区',
        capital: 1800,
        matchScore: 60,
        contact: '林静',
        phone: '138-0000-1012',
      },
    ],
  }
}

// 报告模板
export function getMockReportTemplates(): import('@/api/types/analysis').ReportTemplatesData {
  return {
    templates: [
      {
        id: 1,
        name: '月度运行分析报告',
        description: '月度产业运行数据汇总分析，包含产值、增速、结构等核心指标',
        cycle: '月度',
        indicators: 28,
        color: '#1889E8',
        indicatorList: ['产值', '增速', '产业结构', '利润率', '入驻率', '企业数'],
        structure: [
          {
            label: '一、总体运行概况',
            children: [{ label: '1.1 产值与增速' }, { label: '1.2 入驻与空置' }],
          },
          {
            label: '二、产业结构分析',
            children: [{ label: '2.1 二级产业占比' }, { label: '2.2 重点企业表现' }],
          },
          { label: '三、问题与建议' },
        ],
      },
      {
        id: 2,
        name: '季度运行分析报告',
        description: '季度深度分析报告，增加趋势对比与预测分析',
        cycle: '季度',
        indicators: 42,
        color: '#36CBCB',
        indicatorList: ['季度产值', '同比增速', '环比增速', '预测值', '置信区间'],
        structure: [
          {
            label: '一、季度运行总览',
            children: [{ label: '1.1 核心指标' }, { label: '1.2 环比分析' }],
          },
          { label: '二、深度分析', children: [{ label: '2.1 产业链' }, { label: '2.2 区域对比' }] },
          { label: '三、趋势预测' },
        ],
      },
      {
        id: 3,
        name: '年度运行分析报告',
        description: '年度综合分析报告，全面回顾与展望',
        cycle: '年度',
        indicators: 65,
        color: '#4ECB73',
        indicatorList: ['年度产值', '增长趋势', '投资规模', '创新能力', '人才资源'],
        structure: [
          {
            label: '一、年度总览',
            children: [{ label: '1.1 核心指标' }, { label: '1.2 年度对比' }],
          },
          {
            label: '二、多维度分析',
            children: [{ label: '2.1 产业' }, { label: '2.2 区域' }, { label: '2.3 企业' }],
          },
          { label: '三、下年度展望' },
        ],
      },
      {
        id: 4,
        name: '专项分析报告',
        description: '针对特定产业或区域的专项深度分析',
        cycle: '按需',
        indicators: 35,
        color: '#F2637B',
        indicatorList: ['专项指标', '对标分析', 'SWOT分析', '政策建议'],
        structure: [
          { label: '一、专项背景' },
          { label: '二、数据深度分析', children: [{ label: '2.1 现状' }, { label: '2.2 问题' }] },
          { label: '三、对策建议' },
        ],
      },
    ],
  }
}

// 企业运行报告-企业列表
export function getMockEntReportEnterprises(): import('@/api/types/analysis').EntReportGenerateData {
  return {
    enterprises: [
      { id: 1, name: '华芯微电子科技有限公司', industry: '集成电路' },
      { id: 2, name: '博创智能装备有限公司', industry: '智能装备' },
      { id: 3, name: '前沿材料科技有限公司', industry: '前沿材料' },
      { id: 4, name: '数字智联科技有限公司', industry: '数字经济' },
      { id: 5, name: '现代服务科技有限公司', industry: '现代服务' },
    ],
  }
}
