<template>
  <div class="page-container graph-page">
    <PageHeader title="企业关系图谱" subtitle="企业间投资、供应、竞争关系网络">
      <template #actions>
        <el-select v-model="relationType" placeholder="关系类型" clearable style="width: 140px">
          <el-option label="投资关系" value="investment" />
          <el-option label="供应关系" value="supply" />
          <el-option label="竞争关系" value="compete" />
          <el-option label="合作关系" value="cooperation" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索企业"
          clearable
          style="width: 180px"
          :prefix-icon="Search"
        />
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </template>
    </PageHeader>
    <div class="graph-page__body">
      <LoadingSpinner :loading="loading" type="spinner" text="图谱加载中...">
        <ForceGraph
          :nodes="filteredNodes"
          :edges="filteredEdges"
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
      <!-- 关系类型图例 -->
      <div class="graph-page__legend">
        <div class="legend-title">关系类型</div>
        <div class="legend-item">
          <span class="legend-line" style="border-top: 2px solid #1889e8"></span>
          <span>投资关系</span>
        </div>
        <div class="legend-item">
          <span class="legend-line" style="border-top: 2px solid #4ecb73"></span>
          <span>供应关系</span>
        </div>
        <div class="legend-item">
          <span class="legend-line" style="border-top: 2px dashed #f2637b"></span>
          <span>竞争关系</span>
        </div>
        <div class="legend-item">
          <span class="legend-line" style="border-top: 2px solid #975fe5"></span>
          <span>合作关系</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import GraphControls from '@/components/graph/GraphControls.vue'
import GraphNodeDetailDrawer from '@/components/graph/GraphNodeDetailDrawer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useExport } from '@/composables/useExport'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'

const { exportToImage } = useExport()

const relationType = ref('')
const searchKeyword = ref('')
const loading = ref(false)
const drawerVisible = ref(false)
const selectedNode = ref<GraphNodeData | null>(null)
const relatedEnterprises = ref<string[]>([])

// 企业关系 Mock 数据
const enterpriseNames = [
  '华创科技集团',
  '中科新材料',
  '远大智能装备',
  '恒信电子科技',
  '东方生物制药',
  '天成新能源',
  '盛通精密仪器',
  '博远信息技术',
  '瑞达材料科技',
  '宏图智能制造',
  '安捷供应链',
  '金诺环保科技',
  '创维光电技术',
  '翔宇半导体',
  '鼎盛工业自动化',
  '国泰创新材料',
  '华鑫投资控股',
  '科创资本',
  '联创电子',
  '新元科技',
]

const categories = ['龙头企业', '核心企业', '配套企业', '投资机构']

const allNodes = ref<GraphNodeData[]>([])
const allEdges = ref<GraphEdgeData[]>([])

const filteredNodes = computed(() => {
  let nodes = allNodes.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    nodes = nodes.filter((n) => n.name.toLowerCase().includes(kw))
  }
  return nodes
})

const filteredEdges = computed(() => {
  let edges = allEdges.value
  if (relationType.value) {
    edges = edges.filter((e) => e.type === relationType.value)
  }
  // 只保留过滤后节点间的边
  const nodeIds = new Set(filteredNodes.value.map((n) => n.id))
  return edges.filter((e) => {
    const srcId = typeof e.source === 'string' ? e.source : (e.source as { id: string }).id
    const tgtId = typeof e.target === 'string' ? e.target : (e.target as { id: string }).id
    return nodeIds.has(srcId) && nodeIds.has(tgtId)
  })
})

function handleNodeClick(node: GraphNodeData) {
  selectedNode.value = node
  const related = allEdges.value
    .filter((e) => {
      const srcId = typeof e.source === 'string' ? e.source : (e.source as { id: string }).id
      const tgtId = typeof e.target === 'string' ? e.target : (e.target as { id: string }).id
      return srcId === node.id || tgtId === node.id
    })
    .map((e) => {
      const srcId = typeof e.source === 'string' ? e.source : (e.source as { id: string }).id
      const tgtId = typeof e.target === 'string' ? e.target : (e.target as { id: string }).id
      const targetId = srcId === node.id ? tgtId : srcId
      const found = allNodes.value.find((n) => n.id === targetId)
      return found ? found.name : targetId
    })
  drawerVisible.value = true
}

function handleNodeHover(_node: GraphNodeData | null) {}

function handleZoomIn() {}
function handleZoomOut() {}
function handleReset() {}
function handleExport() {
  exportToImage('企业关系图谱')
}

function generateMockData() {
  const nodes: GraphNodeData[] = enterpriseNames.map((name, i) => ({
    id: `ent-${i}`,
    name,
    category: categories[i % categories.length],
    importance: Math.floor(Math.random() * 50 + 50),
    enterpriseCount: Math.floor(Math.random() * 100 + 10),
    value: Math.floor(Math.random() * 50 + 50),
  }))

  const edgeTypes = ['investment', 'supply', 'compete', 'cooperation']
  const edges: GraphEdgeData[] = []

  // 生成关系边
  for (let i = 0; i < 30; i++) {
    const src = Math.floor(Math.random() * nodes.length)
    let tgt = Math.floor(Math.random() * nodes.length)
    if (src === tgt) tgt = (tgt + 1) % nodes.length
    edges.push({
      source: nodes[src].id,
      target: nodes[tgt].id,
      weight: Math.random() * 0.6 + 0.4,
      type: edgeTypes[Math.floor(Math.random() * edgeTypes.length)],
    })
  }

  allNodes.value = nodes
  allEdges.value = edges
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    generateMockData()
    loading.value = false
  }, 300)
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

.legend-line {
  display: inline-block;
  width: 20px;
}
</style>
