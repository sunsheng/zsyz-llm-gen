<template>
  <div class="page-container graph-page">
    <PageHeader title="区域对比图谱" subtitle="两个区域产业链结构对比分析">
      <template #actions>
        <el-select v-model="regionA" placeholder="区域A" style="width: 150px">
          <el-option v-for="r in regionOptions" :key="r.code" :label="r.name" :value="r.code" />
        </el-select>
        <span class="compare-vs">VS</span>
        <el-select v-model="regionB" placeholder="区域B" style="width: 150px">
          <el-option v-for="r in regionOptions" :key="r.code" :label="r.name" :value="r.code" />
        </el-select>
        <IndustryChainSelect v-model="selectedChain" placeholder="选择产业链" />
        <el-button :icon="Download" @click="handleExport">导出对比报告</el-button>
      </template>
    </PageHeader>
    <div class="compare-body">
      <LoadingSpinner :loading="loading" type="spinner" text="对比图谱加载中...">
        <div class="compare-panels">
          <!-- 区域A -->
          <div class="compare-panel">
            <div class="compare-panel__header">
              <h3 class="compare-panel__title">{{ regionAName }}</h3>
              <div class="compare-panel__stats">
                <span>节点: <strong>{{ nodesA.length }}</strong></span>
                <span>关系: <strong>{{ edgesA.length }}</strong></span>
              </div>
            </div>
            <div class="compare-panel__graph">
              <ForceGraph
                :nodes="nodesA"
                :edges="edgesA"
                @node-click="handleNodeClickA"
              />
            </div>
          </div>
          <!-- 区域B -->
          <div class="compare-panel">
            <div class="compare-panel__header">
              <h3 class="compare-panel__title">{{ regionBName }}</h3>
              <div class="compare-panel__stats">
                <span>节点: <strong>{{ nodesB.length }}</strong></span>
                <span>关系: <strong>{{ edgesB.length }}</strong></span>
              </div>
            </div>
            <div class="compare-panel__graph">
              <ForceGraph
                :nodes="nodesB"
                :edges="edgesB"
                @node-click="handleNodeClickB"
              />
            </div>
          </div>
        </div>

        <!-- 对比统计摘要 -->
        <div class="compare-summary">
          <div class="compare-summary__card">
            <div class="compare-summary__label">产业链完整度</div>
            <div class="compare-summary__values">
              <span class="compare-summary__value compare-summary__value--a">{{ completenessA }}%</span>
              <span class="compare-summary__divider">vs</span>
              <span class="compare-summary__value compare-summary__value--b">{{ completenessB }}%</span>
            </div>
          </div>
          <div class="compare-summary__card">
            <div class="compare-summary__label">上游集中度</div>
            <div class="compare-summary__values">
              <span class="compare-summary__value compare-summary__value--a">{{ upstreamA }}%</span>
              <span class="compare-summary__divider">vs</span>
              <span class="compare-summary__value compare-summary__value--b">{{ upstreamB }}%</span>
            </div>
          </div>
          <div class="compare-summary__card">
            <div class="compare-summary__label">中游集中度</div>
            <div class="compare-summary__values">
              <span class="compare-summary__value compare-summary__value--a">{{ midstreamA }}%</span>
              <span class="compare-summary__divider">vs</span>
              <span class="compare-summary__value compare-summary__value--b">{{ midstreamB }}%</span>
            </div>
          </div>
          <div class="compare-summary__card">
            <div class="compare-summary__label">关联企业数</div>
            <div class="compare-summary__values">
              <span class="compare-summary__value compare-summary__value--a">{{ enterpriseA }}</span>
              <span class="compare-summary__divider">vs</span>
              <span class="compare-summary__value compare-summary__value--b">{{ enterpriseB }}</span>
            </div>
          </div>
        </div>
      </LoadingSpinner>
    </div>

    <GraphNodeDetailDrawer
      v-model:visible="drawerVisible"
      :node="selectedNode"
      :related-enterprises="relatedEnterprises"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import GraphNodeDetailDrawer from '@/components/graph/GraphNodeDetailDrawer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import IndustryChainSelect from '@/components/business/IndustryChainSelect.vue'
import { fetchChainGraph } from '@/api/modules/atlasApi'
import { useExport } from '@/composables/useExport'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'
import type { ChainGraph } from '@/api/types/industry'

const { exportToExcel } = useExport()

const regionOptions = [
  { code: 'yangtze', name: '长三角区域' },
  { code: 'pearl', name: '珠三角区域' },
  { code: 'beijing-tianjin', name: '京津冀区域' },
  { code: 'central', name: '中部区域' },
  { code: 'western', name: '西部区域' },
  { code: 'northeast', name: '东北区域' }
]

const regionA = ref('yangtze')
const regionB = ref('pearl')
const selectedChain = ref<string | string[]>('high-end-equipment')
const loading = ref(false)
const drawerVisible = ref(false)
const selectedNode = ref<GraphNodeData | null>(null)
const relatedEnterprises = ref<string[]>([])

const nodesA = ref<GraphNodeData[]>([])
const edgesA = ref<GraphEdgeData[]>([])
const nodesB = ref<GraphNodeData[]>([])
const edgesB = ref<GraphEdgeData[]>([])

const regionAName = computed(() => regionOptions.find(r => r.code === regionA.value)?.name || '')
const regionBName = computed(() => regionOptions.find(r => r.code === regionB.value)?.name || '')

// 对比统计
const completenessA = computed(() => Math.min(100, Math.round(nodesA.value.length / 20 * 100)))
const completenessB = computed(() => Math.min(100, Math.round(nodesB.value.length / 20 * 100)))
const upstreamA = computed(() => {
  const total = nodesA.value.length || 1
  const up = nodesA.value.filter(n => n.category === '上游').length
  return Math.round(up / total * 100)
})
const upstreamB = computed(() => {
  const total = nodesB.value.length || 1
  const up = nodesB.value.filter(n => n.category === '上游').length
  return Math.round(up / total * 100)
})
const midstreamA = computed(() => {
  const total = nodesA.value.length || 1
  const mid = nodesA.value.filter(n => n.category === '中游').length
  return Math.round(mid / total * 100)
})
const midstreamB = computed(() => {
  const total = nodesB.value.length || 1
  const mid = nodesB.value.filter(n => n.category === '中游').length
  return Math.round(mid / total * 100)
})
const enterpriseA = computed(() => nodesA.value.reduce((sum, n) => sum + ((n.enterpriseCount as number) || 0), 0))
const enterpriseB = computed(() => nodesB.value.reduce((sum, n) => sum + ((n.enterpriseCount as number) || 0), 0))

function handleNodeClickA(node: GraphNodeData) {
  selectedNode.value = { ...node, name: `[${regionAName.value}] ${node.name}` }
  relatedEnterprises.value = [`企业A-1`, `企业A-2`, `企业A-3`]
  drawerVisible.value = true
}

function handleNodeClickB(node: GraphNodeData) {
  selectedNode.value = { ...node, name: `[${regionBName.value}] ${node.name}` }
  relatedEnterprises.value = [`企业B-1`, `企业B-2`, `企业B-3`]
  drawerVisible.value = true
}

function handleExport() {
  exportToExcel('区域对比图谱')
}

async function loadCompareData() {
  const chainCode = Array.isArray(selectedChain.value) ? selectedChain.value[selectedChain.value.length - 1] : selectedChain.value
  if (!chainCode) return

  loading.value = true
  try {
    const [dataA, dataB] = await Promise.all([
      fetchChainGraph(chainCode),
      fetchChainGraph(chainCode)
    ])

    if (dataA) {
      // 区域A - 用不同随机因子模拟差异
      nodesA.value = dataA.nodes.map(n => ({
        id: `a-${n.id}`,
        name: n.name,
        category: n.category,
        importance: Math.min(100, n.importance + Math.floor(Math.random() * 10)),
        enterpriseCount: n.enterpriseCount + Math.floor(Math.random() * 10),
        value: n.importance
      }))
      edgesA.value = dataA.edges.map(e => ({
        source: `a-${e.source}`,
        target: `a-${e.target}`,
        weight: e.weight,
        type: e.type
      }))
    }

    if (dataB) {
      // 区域B - 用不同随机因子模拟差异
      nodesB.value = dataB.nodes.map(n => ({
        id: `b-${n.id}`,
        name: n.name,
        category: n.category,
        importance: Math.min(100, n.importance + Math.floor(Math.random() * 15 - 5)),
        enterpriseCount: n.enterpriseCount + Math.floor(Math.random() * 20 - 5),
        value: n.importance
      }))
      edgesB.value = dataB.edges.map(e => ({
        source: `b-${e.source}`,
        target: `b-${e.target}`,
        weight: e.weight,
        type: e.type
      }))
    }
  } finally {
    loading.value = false
  }
}

watch([regionA, regionB, selectedChain], () => {
  loadCompareData()
})

onMounted(() => {
  loadCompareData()
})
</script>

<style lang="scss" scoped>
.graph-page {
  height: calc(100vh - #{$header-height} - 40px);
}

.compare-vs {
  font-weight: $font-weight-bold;
  color: $color-primary;
  font-size: 14px;
  margin: 0 4px;
}

.compare-body {
  height: calc(100% - 60px);
}

.compare-panels {
  display: flex;
  gap: 16px;
  height: calc(100% - 100px);
}

.compare-panel {
  flex: 1;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.compare-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid $border-color-lighter;
}

.compare-panel__title {
  font-size: 15px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0;
}

.compare-panel__stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: $text-secondary;

  strong {
    color: $color-primary;
    font-weight: $font-weight-bold;
  }
}

.compare-panel__graph {
  flex: 1;
  min-height: 0;
}

.compare-summary {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.compare-summary__card {
  flex: 1;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 16px;
  text-align: center;
}

.compare-summary__label {
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 8px;
}

.compare-summary__values {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.compare-summary__value {
  font-size: 22px;
  font-weight: $font-weight-bold;

  &--a {
    color: #1889E8;
  }

  &--b {
    color: #36CBCB;
  }
}

.compare-summary__divider {
  font-size: 12px;
  color: $text-placeholder;
  font-weight: $font-weight-medium;
}
</style>
