<template>
  <div class="page-container graph-page">
    <PageHeader title="产业链图谱构建" subtitle="凯州新城产业链上下游关系与节点详情">
      <template #actions>
        <el-select v-model="selectedRegion" placeholder="选择区域" style="width: 160px">
          <el-option v-for="r in regionOptions" :key="r.code" :label="r.name" :value="r.code" />
        </el-select>
        <IndustryChainSelect v-model="selectedChain" placeholder="选择产业链" />
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </template>
    </PageHeader>
    <div class="graph-page__body">
      <LoadingSpinner :loading="loading" type="spinner" text="图谱加载中...">
        <ForceGraph
          ref="forceGraphRef"
          :nodes="graphNodes"
          :edges="graphEdges"
          @node-click="handleNodeClick"
          @node-hover="handleNodeHover"
        />
      </LoadingSpinner>
      <GraphControls @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
      <GraphNodeDetailDrawer
        v-model:visible="drawerVisible"
        :node="selectedNode"
        :related-enterprises="relatedEnterprises"
      />
      <!-- 图例 -->
      <div class="graph-page__legend">
        <div class="legend-title">产业链层级</div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #36cbcb"></span>
          <span>上游</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #1889e8"></span>
          <span>中游</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #4ecb73"></span>
          <span>下游</span>
        </div>
        <div class="legend-title" style="margin-top: 8px">区域</div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #fbd437"></span>
          <span>{{ currentRegionName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import GraphControls from '@/components/graph/GraphControls.vue'
import GraphNodeDetailDrawer from '@/components/graph/GraphNodeDetailDrawer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import IndustryChainSelect from '@/components/business/IndustryChainSelect.vue'
import { fetchChainGraph } from '@/api/modules/atlasApi'
import { useExport } from '@/composables/useExport'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'
import type { ChainGraph } from '@/api/types/industry'

const route = useRoute()
const { exportToImage } = useExport()

const regionOptions = [
  { code: 'kaizhou', name: '凯州新城' },
  { code: 'chengyu', name: '成渝区域' },
  { code: 'pearl', name: '珠三角区域' },
  { code: 'beijing-tianjin', name: '京津冀区域' },
]

const selectedRegion = ref('kaizhou')
const selectedChain = ref<string | string[]>('')
const loading = ref(false)
const graphNodes = ref<GraphNodeData[]>([])
const graphEdges = ref<GraphEdgeData[]>([])
const drawerVisible = ref(false)
const selectedNode = ref<GraphNodeData | null>(null)
const relatedEnterprises = ref<string[]>([])
const forceGraphRef = ref<InstanceType<typeof ForceGraph> | null>(null)

const currentRegionName = computed(() => {
  const found = regionOptions.find((r) => r.code === selectedRegion.value)
  return found ? found.name : ''
})

const mockEnterpriseNames = [
  '华创科技(凯州)',
  '中科新材料(凯州)',
  '盛通精密仪器',
  '恒信电子科技',
  '瑞达材料科技',
  '鼎盛工业自动化',
  '安捷供应链',
  '创维光电技术',
]

function handleNodeClick(node: GraphNodeData) {
  selectedNode.value = node
  relatedEnterprises.value = mockEnterpriseNames.slice(0, (node.enterpriseCount as number) || 4)
  drawerVisible.value = true
}

function handleNodeHover(_node: GraphNodeData | null) {}
function handleZoomIn() {
  forceGraphRef.value?.zoomIn()
}
function handleZoomOut() {
  forceGraphRef.value?.zoomOut()
}
function handleReset() {
  forceGraphRef.value?.resetZoom()
}

function handleExport() {
  exportToImage('区域产业链图谱构建')
}

async function loadGraph(chainCode: string) {
  if (!chainCode) return
  loading.value = true
  try {
    const data: ChainGraph | null = await fetchChainGraph(chainCode)
    if (data) {
      graphNodes.value = data.nodes.map((n) => ({
        id: n.id,
        name: `[${currentRegionName.value}] ${n.name}`,
        category: n.category,
        importance: n.importance,
        enterpriseCount: n.enterpriseCount,
        value: n.importance,
      }))
      graphEdges.value = data.edges.map((e) => ({
        source: e.source,
        target: e.target,
        weight: e.weight,
        type: e.type,
      }))
    }
  } finally {
    loading.value = false
  }
}

watch([selectedChain], (val) => {
  const code = Array.isArray(val) ? val[val.length - 1] : val
  if (code) loadGraph(code as string)
})

onMounted(() => {
  const region = route.query.region as string
  if (region) selectedRegion.value = region
  selectedChain.value = 'high-end-equipment'
  loadGraph('high-end-equipment')
})
</script>

<style lang="scss" scoped>
.graph-page {
  height: calc(100vh - #{$header-height} - 40px);
}

.graph-page__body {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.graph-page__legend {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  font-size: 12px;
  color: $text-regular;
  background: rgba(255, 255, 255, 0.9);
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.legend-title {
  margin-bottom: 4px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.legend-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.legend-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: $radius-round;
}
</style>
