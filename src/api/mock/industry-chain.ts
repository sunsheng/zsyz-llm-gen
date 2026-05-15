// 产业链 Mock 数据工厂
import type { IndustryChain, ChainGraph } from '@/api/types/industry'

const chainList: IndustryChain[] = [
  {
    code: 'high-end-equipment',
    name: '高端装备制造',
    description: '涵盖汽车汽配等高端装备制造产业链',
    nodeCount: 28,
    edgeCount: 42,
    upstream: ['原材料供应', '核心零部件', '基础材料加工'],
    midstream: ['整机制造', '系统集成', '关键部件生产'],
    downstream: ['应用服务', '运维保障', '技术支持'],
  },
  {
    code: 'frontier-material',
    name: '前沿材料',
    description: '涵盖玻纤及复合材料、新能源材料、碳纤维及复合材料等前沿材料产业链',
    nodeCount: 24,
    edgeCount: 36,
    upstream: ['矿产开采', '基础化工', '原料制备'],
    midstream: ['材料加工', '合成制备', '性能改性'],
    downstream: ['应用制造', '产品检测', '市场销售'],
  },
  {
    code: 'digital-economy',
    name: '数字经济',
    description: '涵盖5G、集成电路、先进计算、智能安防等数字经济产业链',
    nodeCount: 30,
    edgeCount: 48,
    upstream: ['芯片设计', '晶圆制造', '封装测试'],
    midstream: ['模组组装', '系统集成', '软件开发'],
    downstream: ['终端产品', '运维服务', '数据服务'],
  },
  {
    code: 'fashion',
    name: '时尚产业',
    description: '涵盖服装、家居等时尚产业链',
    nodeCount: 20,
    edgeCount: 28,
    upstream: ['面料研发', '原料供应', '设计创意'],
    midstream: ['生产制造', '品牌运营', '质量控制'],
    downstream: ['渠道销售', '售后服务', '市场推广'],
  },
  {
    code: 'modern-service',
    name: '现代服务业',
    description: '涵盖金融服务、现代物流、信息技术服务等现代服务业产业链',
    nodeCount: 22,
    edgeCount: 33,
    upstream: ['人才培养', '技术研发', '基础设施'],
    midstream: ['专业服务', '平台运营', '资源整合'],
    downstream: ['终端客户', '增值服务', '反馈优化'],
  },
]

export function getMockChains(): IndustryChain[] {
  return chainList
}

export function getMockChainGraph(code: string): ChainGraph | null {
  const chain = chainList.find((c) => c.code === code)
  if (!chain) return null

  const upstreamNames = ['原材料供应', '核心零部件', '基础材料加工', '技术支撑', '设备供应']
  const midstreamNames = [
    '整机制造',
    '系统集成',
    '关键部件生产',
    '工艺优化',
    '质量控制',
    '组装测试',
  ]
  const downstreamNames = ['应用服务', '运维保障', '技术支持', '市场推广', '售后服务']

  const nodes = [
    ...upstreamNames.map((name, i) => ({
      id: `up-${i}`,
      name,
      level: 'upstream' as const,
      category: '上游',
      importance: Math.floor(Math.random() * 40 + 60),
      enterpriseCount: Math.floor(Math.random() * 50 + 10),
    })),
    ...midstreamNames.map((name, i) => ({
      id: `mid-${i}`,
      name,
      level: 'midstream' as const,
      category: '中游',
      importance: Math.floor(Math.random() * 30 + 70),
      enterpriseCount: Math.floor(Math.random() * 80 + 20),
    })),
    ...downstreamNames.map((name, i) => ({
      id: `down-${i}`,
      name,
      level: 'downstream' as const,
      category: '下游',
      importance: Math.floor(Math.random() * 20 + 50),
      enterpriseCount: Math.floor(Math.random() * 60 + 15),
    })),
  ]

  const edges: {
    source: string
    target: string
    weight: number
    type: 'supply' | 'tech' | 'investment' | 'compete'
  }[] = []
  // 上游→中游
  for (let i = 0; i < upstreamNames.length; i++) {
    const targetIdx = Math.floor(Math.random() * midstreamNames.length)
    edges.push({
      source: `up-${i}`,
      target: `mid-${targetIdx}`,
      weight: Math.random() * 0.5 + 0.5,
      type: 'supply',
    })
  }
  // 中游→下游
  for (let i = 0; i < midstreamNames.length; i++) {
    const targetIdx = Math.floor(Math.random() * downstreamNames.length)
    edges.push({
      source: `mid-${i}`,
      target: `down-${targetIdx}`,
      weight: Math.random() * 0.4 + 0.6,
      type: 'supply',
    })
  }
  // 技术关联
  for (let i = 0; i < 5; i++) {
    const s = Math.floor(Math.random() * nodes.length)
    const t = Math.floor(Math.random() * nodes.length)
    if (s !== t) {
      edges.push({
        source: nodes[s].id,
        target: nodes[t].id,
        weight: Math.random() * 0.3 + 0.2,
        type: 'tech',
      })
    }
  }

  return { code, name: chain.name, nodes, edges }
}
