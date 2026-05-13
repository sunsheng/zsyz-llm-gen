<template>
  <div class="page-container graph-page">
    <PageHeader title="产业链图谱" subtitle="产业链上下游关系与节点详情">
      <template #actions>
        <IndustryChainSelect v-model="selectedChain" placeholder="请选择产业链" />
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </template>
    </PageHeader>
    <div class="graph-page__body">
      <LoadingSpinner :loading="loading" type="spinner" text="图谱加载中...">
        <ForceGraph
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
        <div class="legend-item">
          <span class="legend-dot" style="background: #36CBCB" />
          <span>上游</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #1889E8" />
          <span>中游</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #4ECB73" />
          <span>下游</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
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

const selectedChain = ref<string | string[]>('')
const loading = ref(false)
const graphNodes = ref<GraphNodeData[]>([])
const graphEdges = ref<GraphEdgeData[]>([])
const drawerVisible = ref(false)
const selectedNode = ref<GraphNodeData | null>(null)
const relatedEnterprises = ref<string[]>([])

const mockEnterpriseNames = [
  '华创科技有限公司', '中科新材料集团', '远大智能装备', '恒信电子科技',
  '东方生物制药', '天成新能源', '盛通精密仪器', '博远信息技术',
  '瑞达材料科技', '宏图智能制造', '安捷供应链', '金诺环保科技',
  '创维光电技术', '翔宇半导体', '鼎盛工业自动化', '国泰创新材料'
]

function handleNodeClick(node: GraphNodeData) {
  selectedNode.value = node
  relatedEnterprises.value = mockEnterpriseNames.slice(0, (node.enterpriseCount as number) || 5)
  drawerVisible.value = true
}

function handleNodeHover(_node: GraphNodeData | null) {
  // 可扩展: tooltip 等
}

function handleZoomIn() {}
function handleZoomOut() {}
function handleReset() {}

function handleExport() {
  exportToImage('产业链图谱')
}

async function loadGraph(code: string) {
  if (!code) return
  loading.value = true
  try {
    const data: ChainGraph | null = await fetchChainGraph(code)
    if (data) {
      graphNodes.value = data.nodes.map(n => ({
        id: n.id,
        name: n.name,
        category: n.category,
        importance: n.importance,
        enterpriseCount: n.enterpriseCount,
        value: n.importance
      }))
      graphEdges.value = data.edges.map(e => ({
        source: e.source,
        target: e.target,
        weight: e.weight,
        type: e.type
      }))
    }
  } finally {
    loading.value = false
  }
}

watch(selectedChain, (val) => {
  const code = Array.isArray(val) ? val[val.length - 1] : val
  if (code) loadGraph(code)
})

onMounted(() => {
  const chainCode = route.query.chain as string
  if (chainCode) {
    selectedChain.value = chainCode
    loadGraph(chainCode)
  } else {
    selectedChain.value = 'high-end-equipment'
    loadGraph('high-end-equipment')
  }
})
</script>

<style lang="scss" scoped>
.graph-page {
  height: calc(100vh - #{$header-height} - 40px);
}

.graph-page__body {
  position: relative;
  height: 100%;
  background: #fff;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  overflow: hidden;
}

.graph-page__legend {
  position: absolute;
  right: 16px;
  top: 16px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: $radius-base;
  padding: 12px 16px;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: $text-regular;
  z-index: 10;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: $radius-round;
  flex-shrink: 0;
}
</style>
