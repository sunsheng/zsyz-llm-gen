<template>
  <div class="page-container graph-page">
    <PageHeader title="技术图谱" subtitle="技术领域关联、转移与合作关系网络">
      <template #actions>
        <el-select v-model="techField" placeholder="技术领域" clearable style="width: 160px">
          <el-option label="人工智能" value="ai" />
          <el-option label="新能源技术" value="new-energy" />
          <el-option label="生物医药" value="biomedicine" />
          <el-option label="先进制造" value="manufacturing" />
          <el-option label="新材料" value="material" />
        </el-select>
        <el-select v-model="relationType" placeholder="关系类型" clearable style="width: 140px">
          <el-option label="技术转移" value="transfer" />
          <el-option label="技术合作" value="collaboration" />
          <el-option label="技术依赖" value="dependency" />
          <el-option label="技术竞争" value="competition" />
        </el-select>
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
      <!-- 技术领域图例 -->
      <div class="graph-page__legend">
        <div class="legend-title">技术领域</div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #1889E8" />
          <span>人工智能</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #36CBCB" />
          <span>新能源</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #4ECB73" />
          <span>生物医药</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #FBD437" />
          <span>先进制造</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #975FE5" />
          <span>新材料</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import GraphControls from '@/components/graph/GraphControls.vue'
import GraphNodeDetailDrawer from '@/components/graph/GraphNodeDetailDrawer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useExport } from '@/composables/useExport'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'

const { exportToImage } = useExport()

const techField = ref('')
const relationType = ref('')
const loading = ref(false)
const drawerVisible = ref(false)
const selectedNode = ref<GraphNodeData | null>(null)
const relatedEnterprises = ref<string[]>([])

// 技术节点 Mock 数据
const techNodes: GraphNodeData[] = [
  { id: 'ai-1', name: '深度学习', category: '人工智能', importance: 92, enterpriseCount: 45, value: 92 },
  { id: 'ai-2', name: '自然语言处理', category: '人工智能', importance: 88, enterpriseCount: 38, value: 88 },
  { id: 'ai-3', name: '计算机视觉', category: '人工智能', importance: 85, enterpriseCount: 42, value: 85 },
  { id: 'ai-4', name: '知识图谱', category: '人工智能', importance: 72, enterpriseCount: 25, value: 72 },
  { id: 'ai-5', name: '语音识别', category: '人工智能', importance: 78, enterpriseCount: 30, value: 78 },
  { id: 'ne-1', name: '光伏技术', category: '新能源', importance: 90, enterpriseCount: 55, value: 90 },
  { id: 'ne-2', name: '储能技术', category: '新能源', importance: 86, enterpriseCount: 40, value: 86 },
  { id: 'ne-3', name: '风电技术', category: '新能源', importance: 82, enterpriseCount: 35, value: 82 },
  { id: 'ne-4', name: '氢能技术', category: '新能源', importance: 75, enterpriseCount: 20, value: 75 },
  { id: 'bio-1', name: '基因编辑', category: '生物医药', importance: 88, enterpriseCount: 28, value: 88 },
  { id: 'bio-2', name: '免疫治疗', category: '生物医药', importance: 85, enterpriseCount: 32, value: 85 },
  { id: 'bio-3', name: '药物递送', category: '生物医药', importance: 70, enterpriseCount: 18, value: 70 },
  { id: 'mfg-1', name: '数控技术', category: '先进制造', importance: 84, enterpriseCount: 48, value: 84 },
  { id: 'mfg-2', name: '工业机器人', category: '先进制造', importance: 86, enterpriseCount: 42, value: 86 },
  { id: 'mfg-3', name: '3D打印', category: '先进制造', importance: 73, enterpriseCount: 22, value: 73 },
  { id: 'mat-1', name: '碳纤维', category: '新材料', importance: 80, enterpriseCount: 30, value: 80 },
  { id: 'mat-2', name: '石墨烯', category: '新材料', importance: 76, enterpriseCount: 18, value: 76 },
  { id: 'mat-3', name: '高温合金', category: '新材料', importance: 72, enterpriseCount: 15, value: 72 }
]

const techEdges: GraphEdgeData[] = [
  { source: 'ai-1', target: 'ai-2', weight: 0.9, type: 'dependency' },
  { source: 'ai-1', target: 'ai-3', weight: 0.85, type: 'dependency' },
  { source: 'ai-2', target: 'ai-4', weight: 0.7, type: 'collaboration' },
  { source: 'ai-3', target: 'ai-5', weight: 0.6, type: 'transfer' },
  { source: 'ai-1', target: 'mfg-2', weight: 0.75, type: 'collaboration' },
  { source: 'ai-3', target: 'mfg-1', weight: 0.65, type: 'collaboration' },
  { source: 'ne-1', target: 'ne-2', weight: 0.8, type: 'dependency' },
  { source: 'ne-3', target: 'ne-2', weight: 0.7, type: 'dependency' },
  { source: 'ne-4', target: 'ne-2', weight: 0.6, type: 'collaboration' },
  { source: 'ne-1', target: 'mat-1', weight: 0.5, type: 'dependency' },
  { source: 'bio-1', target: 'bio-2', weight: 0.85, type: 'transfer' },
  { source: 'bio-1', target: 'bio-3', weight: 0.7, type: 'collaboration' },
  { source: 'bio-2', target: 'ai-2', weight: 0.55, type: 'collaboration' },
  { source: 'mfg-1', target: 'mfg-2', weight: 0.8, type: 'dependency' },
  { source: 'mfg-2', target: 'mfg-3', weight: 0.5, type: 'collaboration' },
  { source: 'mfg-1', target: 'mat-3', weight: 0.65, type: 'dependency' },
  { source: 'mat-1', target: 'mat-2', weight: 0.6, type: 'competition' },
  { source: 'mat-1', target: 'ne-1', weight: 0.45, type: 'transfer' },
  { source: 'mat-2', target: 'ai-4', weight: 0.4, type: 'collaboration' },
  { source: 'mat-3', target: 'mfg-1', weight: 0.55, type: 'dependency' },
  { source: 'ai-4', target: 'bio-1', weight: 0.5, type: 'transfer' },
  { source: 'ne-2', target: 'mfg-3', weight: 0.35, type: 'collaboration' }
]

const fieldCategoryMap: Record<string, string> = {
  'ai': '人工智能',
  'new-energy': '新能源',
  'biomedicine': '生物医药',
  'manufacturing': '先进制造',
  'material': '新材料'
}

const allNodes = ref<GraphNodeData[]>(techNodes)
const allEdges = ref<GraphEdgeData[]>(techEdges)

const filteredNodes = computed(() => {
  if (!techField.value) return allNodes.value
  const cat = fieldCategoryMap[techField.value]
  return allNodes.value.filter(n => n.category === cat)
})

const filteredEdges = computed(() => {
  let edges = allEdges.value
  if (relationType.value) {
    edges = edges.filter(e => e.type === relationType.value)
  }
  const nodeIds = new Set(filteredNodes.value.map(n => n.id))
  return edges.filter(e => nodeIds.has(e.source as string) && nodeIds.has(e.target as string))
})

const mockEnterpriseNames = [
  '华创人工智能研究院', '中科深源科技', '远大智能机器人', '天合光能',
  '国轩高科', '药明康德', '恒瑞医药', '大族激光', '先导智能'
]

function handleNodeClick(node: GraphNodeData) {
  selectedNode.value = node
  const related = allEdges.value
    .filter(e => e.source === node.id || e.target === node.id)
    .map(e => {
      const targetId = e.source === node.id ? e.target : e.source
      const found = allNodes.value.find(n => n.id === targetId)
      return found ? found.name : targetId as string
    })
  relatedEnterprises.value = [...related, ...mockEnterpriseNames.slice(0, 3)]
  drawerVisible.value = true
}

function handleNodeHover(_node: GraphNodeData | null) {}
function handleZoomIn() {}
function handleZoomOut() {}
function handleReset() {}
function handleExport() {
  exportToImage('技术图谱')
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 200)
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
</style>
