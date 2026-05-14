// 图谱相关 API
import { getMockChains, getMockChainGraph } from '@/api/mock/industry-chain'
import type { IndustryChain, ChainGraph } from '@/api/types/industry'

export function fetchChains(): Promise<IndustryChain[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChains()), 200)
  })
}

export function fetchChainGraph(code: string): Promise<ChainGraph | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockChainGraph(code)), 300)
  })
}
