<template>
  <div class="page-container graph-page">
    <PageHeader title="区域关系图谱" subtitle="区域内企业投资、供应、竞争关系网络">
      <template #actions>
        <el-select v-model="selectedRegion" placeholder="选择区域" style="width: 160px">
          <el-option v-for="r in regionOptions" :key="r.code" :label="r.name" :value="r.code" />
        </el-select>
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
      <!-- 图例 -->
      <div class="graph-page__legend">
        <div class="legend-title">企业类型</div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #F2637B" />
          <span>龙头企业</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #1889E8" />
          <span>核心企业</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #4ECB73" />
          <span>配套企业</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #975FE5" />
          <span>投资机构</span>
        </div>
        <div class="legend-title" style="margin-top: 8px">关系类型</div>
        <div class="legend-item">
          <span class="legend-line" style="border-top: 2px solid #1889E8" />
          <span>投资</span>
        </div>
        <div class="legend-item">
          <span class="legend-line" style="border-top: 2px solid #4ECB73" />
          <span>供应</span>
        </div>
        <div class="legend-item">
          <span class="legend-line" style="border-top: 2px dashed #F2637B" />
          <span>竞争</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import GraphControls from '@/components/graph/GraphControls.vue'
import GraphNodeDetailDrawer from '@/components/graph/GraphNodeDetailDrawer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useExport } from '@/composables/useExport'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'

const { exportToImage } = useExport()

const regionOptions = [
  { code: 'yangtze', name: '长三角区域' },
  { code: 'pearl', name: '珠三角区域' },
  { code: 'beijing-tianjin', name: '京津冀区域' },
  { code: 'central', name: '中部区域' },
  { code: 'western', name: '西部区域' },
  { code: 'northeast', name: '东北区域' }
]

const regionEnterpriseMap: Record<string, { names: string[]; categories: string[] }> = {
  'yangtze': {
    names: ['上海电气', '中芯国际', '药明康德', '蔚来汽车', '拼多多', '哔哩哔哩', '韦尔股份', '澜起科技', '中微公司', '安集科技', '华熙生物', '迈瑞医疗', '汇川技术', '大华股份', '海康威视'],
    categories: ['龙头企业', '核心企业', '核心企业', '龙头企业', '配套企业', '配套企业', '核心企业', '配套企业', '配套企业', '配套企业', '核心企业', '龙头企业', '核心企业', '核心企业', '龙头企业']
  },
  'pearl': {
    names: ['华为技术', '比亚迪', '腾讯控股', '大疆创新', '立讯精密', '蓝思科技', '格力电器', '美的集团', '拓斯达', '顺丰科技', '汇顶科技', '光启技术', '瑞芯微', '优必选', '云从科技'],
    categories: ['龙头企业', '龙头企业', '龙头企业', '龙头企业', '核心企业', '配套企业', '龙头企业', '龙头企业', '配套企业', '配套企业', '核心企业', '配套企业', '核心企业', '核心企业', '核心企业']
  },
  'beijing-tianjin': {
    names: ['百度', '京东集团', '字节跳动', '小米集团', '联想集团', '北方华创', '中科曙光', '寒武纪', '地平线', '四维图新', '君正集团', '兆易创新', '金山办公', '奇安信', '旷视科技'],
    categories: ['龙头企业', '龙头企业', '龙头企业', '龙头企业', '龙头企业', '核心企业', '核心企业', '配套企业', '配套企业', '配套企业', '配套企业', '核心企业', '核心企业', '核心企业', '核心企业']
  }
}

const selectedRegion = ref('yangtze')
const relationType = ref('')
const searchKeyword = ref('')
const loading = ref(false)
const drawerVisible = ref(false)
const selectedNode = ref<GraphNodeData | null>(null)
const relatedEnterprises = ref<string[]>([])

const allNodes = ref<GraphNodeData[]>([])
const allEdges = ref<GraphEdgeData[]>([])

const filteredNodes = computed(() => {
  let nodes = allNodes.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    nodes = nodes.filter(n => n.name.toLowerCase().includes(kw))
  }
  return nodes
})

const filteredEdges = computed(() => {
  let edges = allEdges.value
  if (relationType.value) {
    edges = edges.filter(e => e.type === relationType.value)
  }
  const nodeIds = new Set(filteredNodes.value.map(n => n.id))
  return edges.filter(e => nodeIds.has(e.source as string) && nodeIds.has(e.target as string))
})

function handleNodeClick(node: GraphNodeData) {
  selectedNode.value = node
  const related = allEdges.value
    .filter(e => e.source === node.id || e.target === node.id)
    .map(e => {
      const targetId = e.source === node.id ? e.target : e.source
      const found = allNodes.value.find(n => n.id === targetId)
      return found ? found.name : targetId as string
    })
  relatedEnterprises.value = related
  drawerVisible.value = true
}

function handleNodeHover(_node: GraphNodeData | null) {}
function handleZoomIn() {}
function handleZoomOut() {}
function handleReset() {}
function handleExport() {
  exportToImage('区域关系图谱')
}

function generateRegionData(regionCode: string) {
  const regionData = regionEnterpriseMap[regionCode] || regionEnterpriseMap['yangtze']
  const nodes: GraphNodeData[] = regionData.names.map((name, i) => ({
    id: `ent-${i}`,
    name,
    category: regionData.categories[i],
    importance: regionData.categories[i] === '龙头企业' ? 90 + Math.floor(Math.random() * 10) :
                regionData.categories[i] === '核心企业' ? 70 + Math.floor(Math.random() * 20) :
                50 + Math.floor(Math.random() * 20),
    enterpriseCount: Math.floor(Math.random() * 80 + 10),
    value: regionData.categories[i] === '龙头企业' ? 95 : regionData.categories[i] === '核心企业' ? 75 : 55
  }))

  const edgeTypes = ['investment', 'supply', 'compete', 'cooperation']
  const edges: GraphEdgeData[] = []
  for (let i = 0; i < 25; i++) {
    const src = Math.floor(Math.random() * nodes.length)
    let tgt = Math.floor(Math.random() * nodes.length)
    if (src === tgt) tgt = (tgt + 1) % nodes.length
    edges.push({
      source: nodes[src].id,
      target: nodes[tgt].id,
      weight: Math.random() * 0.6 + 0.4,
      type: edgeTypes[Math.floor(Math.random() * edgeTypes.length)]
    })
  }

  allNodes.value = nodes
  allEdges.value = edges
}

watch(selectedRegion, () => {
  loading.value = true
  setTimeout(() => {
    generateRegionData(selectedRegion.value)
    loading.value = false
  }, 300)
})

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    generateRegionData(selectedRegion.value)
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

.legend-title {
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin-bottom: 4px;
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

.legend-line {
  width: 20px;
  display: inline-block;
}
</style>
