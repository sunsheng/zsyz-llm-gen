<template>
  <div class="page-container">
    <PageHeader title="产业链结构" subtitle="产业链上下游结构分析">
      <template #actions>
        <IndustryChainSelect v-model="selectedChain" placeholder="选择产业链" />
      </template>
    </PageHeader>

    <div v-loading="loading" class="graph-layout">
      <div class="graph-main">
        <ForceGraph
          :nodes="graphNodes"
          :edges="graphEdges"
          :height="560"
          @node-click="handleNodeClick"
          @node-hover="handleNodeHover"
        />
      </div>
      <div class="graph-sidebar">
        <div class="detail-section">
          <h4 class="section-title">环节详情</h4>
          <template v-if="selectedNode">
            <div class="detail-row">
              <span class="detail-label">环节名称</span>
              <span class="detail-value">{{ selectedNode.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">类型</span>
              <el-tag :type="nodeTypeTagMap[selectedNode.nodeType] as any" size="small">
                {{ nodeTypeLabelMap[selectedNode.nodeType] }}
              </el-tag>
            </div>
            <div class="detail-row">
              <span class="detail-label">所属环节</span>
              <el-tag size="small" effect="plain">{{ selectedNode.category }}</el-tag>
            </div>
            <div class="detail-row">
              <span class="detail-label">本地企业数</span>
              <span class="detail-value">{{ selectedNode.enterpriseCount }} 家</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">配套率</span>
              <el-progress
                :percentage="selectedNode.localRate"
                :stroke-width="12"
                :color="
                  selectedNode.localRate >= 60
                    ? '#67C23A'
                    : selectedNode.localRate >= 40
                      ? '#E6A23C'
                      : '#F56C6C'
                "
              />
            </div>
            <div class="detail-row">
              <span class="detail-label">重要性</span>
              <span class="detail-value">{{ selectedNode.importance }}</span>
            </div>
            <div v-if="selectedNode.enterpriseCount > 0" class="enterprise-list">
              <h5 class="enterprise-list__title">相关企业</h5>
              <div class="enterprise-list__items">
                <el-tag
                  v-for="(ent, idx) in mockEnterprises(selectedNode.enterpriseCount)"
                  :key="idx"
                  size="small"
                  effect="plain"
                  class="enterprise-list__tag"
                >
                  {{ ent }}
                </el-tag>
              </div>
            </div>
          </template>
          <el-empty v-else description="点击节点查看详情" :image-size="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import IndustryChainSelect from '@/components/business/IndustryChainSelect.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import { fetchChainStructure } from '@/api/modules/investApi'
import type { ChainStructureData, ChainSegment } from '@/api/types/invest'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'

const loading = ref(false)
const selectedChain = ref<string | string[]>('')
const chainData = ref<ChainStructureData | null>(null)
const selectedNode = ref<(ChainSegment & { category?: string }) | null>(null)

const nodeTypeLabelMap: Record<string, string> = {
  bottleneck: '卡脖子',
  'high-value': '高附加值',
  'policy-sensitive': '政策敏感',
  standard: '标准',
}
const nodeTypeTagMap: Record<string, string> = {
  bottleneck: 'danger',
  'high-value': 'warning',
  'policy-sensitive': '',
  standard: 'info',
}

const enterpriseNames = [
  '华锐科技',
  '中联智造',
  '鼎盛新材',
  '恒瑞装备',
  '天合集成',
  '博通半导体',
  '联创光电',
  '瑞声科技',
  '信维通信',
  '长盈精密',
]

function mockEnterprises(count: number) {
  return enterpriseNames.slice(0, Math.min(count, enterpriseNames.length))
}

const categoryMap: Record<string, string> = {
  upstream: '上游',
  midstream: '中游',
  downstream: '下游',
}

const graphNodes = computed<GraphNodeData[]>(() => {
  if (!chainData.value) return []
  const nodes: GraphNodeData[] = []
  const sections: { key: 'upstream' | 'midstream' | 'downstream'; segments: ChainSegment[] }[] = [
    { key: 'upstream', segments: chainData.value.upstream },
    { key: 'midstream', segments: chainData.value.midstream },
    { key: 'downstream', segments: chainData.value.downstream },
  ]
  for (const section of sections) {
    for (const seg of section.segments) {
      nodes.push({
        id: seg.id,
        name: seg.name,
        category: categoryMap[section.key],
        importance: seg.importance,
        ...seg,
      })
    }
  }
  return nodes
})

const graphEdges = computed<GraphEdgeData[]>(() => {
  if (!chainData.value) return []
  const edges: GraphEdgeData[] = []
  const sections = [chainData.value.upstream, chainData.value.midstream, chainData.value.downstream]
  // upstream -> midstream
  for (const up of sections[0]) {
    for (const mid of sections[1]) {
      edges.push({ source: up.id, target: mid.id, weight: 0.6 })
    }
  }
  // midstream -> downstream
  for (const mid of sections[1]) {
    for (const down of sections[2]) {
      edges.push({ source: mid.id, target: down.id, weight: 0.6 })
    }
  }
  return edges
})

function handleNodeClick(node: GraphNodeData) {
  const seg = node as unknown as ChainSegment & { category?: string }
  selectedNode.value = seg
}

function handleNodeHover(_node: GraphNodeData | null) {
  // hover highlighting is handled by ForceGraph internally
}

async function loadData() {
  loading.value = true
  try {
    chainData.value = await fetchChainStructure()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.graph-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
}

.graph-main {
  overflow: hidden;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.graph-sidebar {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.section-title {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid $border-color-lighter;

  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  font-size: 13px;
  color: $text-secondary;
}

.detail-value {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.enterprise-list {
  margin-top: 16px;
}

.enterprise-list__title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.enterprise-list__items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.enterprise-list__tag {
  cursor: pointer;
}
</style>
