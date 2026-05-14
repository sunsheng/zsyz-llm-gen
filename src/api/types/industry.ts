/** 产业链数据类型 */

export interface IndustryChain {
  code: string
  name: string
  description: string
  nodeCount: number
  edgeCount: number
  upstream: string[]
  midstream: string[]
  downstream: string[]
}

export interface ChainNode {
  id: string
  name: string
  level: 'upstream' | 'midstream' | 'downstream'
  category: string
  importance: number // 0-100 重要性
  enterpriseCount: number
  children?: ChainNode[]
}

export interface ChainEdge {
  source: string
  target: string
  weight: number // 关系强度 0-1
  type: 'supply' | 'tech' | 'investment' | 'compete'
}

export interface ChainGraph {
  code: string
  name: string
  nodes: ChainNode[]
  edges: ChainEdge[]
}
