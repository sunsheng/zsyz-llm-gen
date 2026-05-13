// 产业链 Mock 数据工厂
import type { IndustryChain, ChainGraph } from '@/api/types/industry'

const chainList: IndustryChain[] = [
  {
    code: 'high-end-equipment',
    name: '高端装备制造',
    description: '涵盖智能制造、数控机床、工业机器人等高端装备制造产业链',
    nodeCount: 28,
    edgeCount: 42,
    upstream: ['原材料供应', '核心零部件', '基础材料加工'],
    midstream: ['整机制造', '系统集成', '关键部件生产'],
    downstream: ['应用服务', '运维保障', '技术支持']
  },
  {
    code: 'new-material',
    name: '新材料',
    description: '涵盖先进钢铁材料、高性能复合材料、前沿新材料等',
    nodeCount: 24,
    edgeCount: 36,
    upstream: ['矿产开采', '基础化工', '原料制备'],
    midstream: ['材料加工', '合成制备', '性能改性'],
    downstream: ['应用制造', '产品检测', '市场销售']
  },
  {
    code: 'biomedicine',
    name: '生物医药',
    description: '涵盖创新药研发、医疗器械、生物技术服务等',
    nodeCount: 22,
    edgeCount: 33,
    upstream: ['原料药生产', '试剂耗材', '实验设备'],
    midstream: ['药物研发', '临床测试', '生产制造'],
    downstream: ['流通销售', '医疗服务', '健康管理']
  },
  {
    code: 'electronics',
    name: '电子信息',
    description: '涵盖集成电路、通信设备、智能终端等电子信息产业链',
    nodeCount: 30,
    edgeCount: 48,
    upstream: ['芯片设计', '晶圆制造', '封装测试'],
    midstream: ['模组组装', '系统集成', '软件开发'],
    downstream: ['终端产品', '运维服务', '数据服务']
  },
  {
    code: 'new-energy',
    name: '新能源',
    description: '涵盖光伏、风电、储能、氢能等新能源产业链',
    nodeCount: 26,
    edgeCount: 40,
    upstream: ['硅料生产', '零部件制造', '原材料加工'],
    midstream: ['电池制造', '组件生产', '系统集成'],
    downstream: ['电站运营', '电网接入', '运维服务']
  }
]

export function getMockChains(): IndustryChain[] {
  return chainList
}

export function getMockChainGraph(code: string): ChainGraph | null {
  const chain = chainList.find(c => c.code === code)
  if (!chain) return null

  const upstreamNames = ['原材料供应', '核心零部件', '基础材料加工', '技术支撑', '设备供应']
  const midstreamNames = ['整机制造', '系统集成', '关键部件生产', '工艺优化', '质量控制', '组装测试']
  const downstreamNames = ['应用服务', '运维保障', '技术支持', '市场推广', '售后服务']

  const nodes = [
    ...upstreamNames.map((name, i) => ({
      id: `up-${i}`,
      name,
      level: 'upstream' as const,
      category: '上游',
      importance: Math.floor(Math.random() * 40 + 60),
      enterpriseCount: Math.floor(Math.random() * 50 + 10)
    })),
    ...midstreamNames.map((name, i) => ({
      id: `mid-${i}`,
      name,
      level: 'midstream' as const,
      category: '中游',
      importance: Math.floor(Math.random() * 30 + 70),
      enterpriseCount: Math.floor(Math.random() * 80 + 20)
    })),
    ...downstreamNames.map((name, i) => ({
      id: `down-${i}`,
      name,
      level: 'downstream' as const,
      category: '下游',
      importance: Math.floor(Math.random() * 20 + 50),
      enterpriseCount: Math.floor(Math.random() * 60 + 15)
    }))
  ]

  const edges: { source: string; target: string; weight: number; type: 'supply' | 'tech' | 'investment' | 'compete' }[] = []
  // 上游→中游
  for (let i = 0; i < upstreamNames.length; i++) {
    const targetIdx = Math.floor(Math.random() * midstreamNames.length)
    edges.push({ source: `up-${i}`, target: `mid-${targetIdx}`, weight: Math.random() * 0.5 + 0.5, type: 'supply' })
  }
  // 中游→下游
  for (let i = 0; i < midstreamNames.length; i++) {
    const targetIdx = Math.floor(Math.random() * downstreamNames.length)
    edges.push({ source: `mid-${i}`, target: `down-${targetIdx}`, weight: Math.random() * 0.4 + 0.6, type: 'supply' })
  }
  // 技术关联
  for (let i = 0; i < 5; i++) {
    const s = Math.floor(Math.random() * nodes.length)
    const t = Math.floor(Math.random() * nodes.length)
    if (s !== t) {
      edges.push({ source: nodes[s].id, target: nodes[t].id, weight: Math.random() * 0.3 + 0.2, type: 'tech' })
    }
  }

  return { code, name: chain.name, nodes, edges }
}
