<template>
  <div class="page-container">
    <PageHeader title="关系图谱" subtitle="企业关系网络图谱分析">
      <template #actions>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="loadData">刷新图谱</el-button>
      </template>
    </PageHeader>

    <!-- 关系类型筛选 + 节点搜索 -->
    <div class="filter-bar">
      <div class="filter-bar__types">
        <span class="filter-bar__label">关系类型：</span>
        <el-checkbox-group v-model="selectedTypes" @change="handleTypeChange">
          <el-checkbox
            v-for="item in relationTypeOptions"
            :key="item.value"
            :value="item.value"
            :border="false"
          >
            <span class="type-dot" :style="{ background: item.color }"></span>
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="filter-bar__search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索企业名称"
          clearable
          :prefix-icon="Search"
          @input="handleSearch"
          @clear="handleSearch"
        />
      </div>
    </div>

    <div class="graph-layout">
      <div v-loading="loading" class="graph-main">
        <ForceGraph
          :nodes="filteredNodes"
          :edges="filteredEdges"
          :width="900"
          :height="550"
          @node-click="handleNodeClick"
          @node-hover="handleNodeHover"
        />
      </div>
      <div class="graph-sidebar">
        <!-- 图例 -->
        <div class="sidebar-section">
          <h4 class="section-title">关系类型</h4>
          <div class="legend-list">
            <div v-for="item in relationTypeOptions" :key="item.value" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }"></span>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>

        <!-- 节点详情 -->
        <div class="sidebar-section">
          <h4 class="section-title">节点详情</h4>
          <template v-if="selectedNode">
            <div class="detail-item">
              <span class="label">企业名称</span>
              <span class="value">{{ selectedNode.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">类型</span>
              <span class="value">{{ selectedNode.type === 'enterprise' ? '企业' : '机构' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">行业</span>
              <span class="value">{{ selectedNode.industry }}</span>
            </div>
            <div class="detail-item">
              <span class="label">关联数</span>
              <span class="value">{{ selectedNode.relationCount }}</span>
            </div>
            <div class="detail-item">
              <span class="label">影响力评分</span>
              <span class="value">{{ selectedNode.influenceScore }}</span>
            </div>
          </template>
          <el-empty v-else description="点击节点查看详情" :image-size="60" />
        </div>

        <!-- 关联企业列表 -->
        <div v-if="selectedNode" class="sidebar-section">
          <h4 class="section-title">关联企业</h4>
          <div class="related-list">
            <div
              v-for="item in relatedNodes"
              :key="item.node.id"
              class="related-item"
              @click="handleNodeClick(item.node)"
            >
              <span class="related-item__name">{{ item.node.name }}</span>
              <span class="related-item__type" :style="{ color: getRelationColor(item.edgeType) }">
                {{ relationTypeLabels[item.edgeType] }}
              </span>
            </div>
            <el-empty v-if="!relatedNodes.length" description="暂无关联企业" :image-size="40" />
          </div>
        </div>

        <!-- 影响力评分条 -->
        <div v-if="selectedNode" class="sidebar-section">
          <h4 class="section-title">影响力评分</h4>
          <div class="influence-bar">
            <div class="influence-bar__track">
              <div
                class="influence-bar__fill"
                :style="{
                  width: selectedNode.influenceScore + '%',
                  background: getInfluenceColor(selectedNode.influenceScore),
                }"
              ></div>
            </div>
            <span class="influence-bar__value">{{ selectedNode.influenceScore }}分</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import { fetchRelationGraphData } from '@/api/modules/investApi'
import type { RelationNode, RelationEdge, RelationType } from '@/api/types/invest'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'

const relationTypeLabels: Record<RelationType, string> = {
  supply: '供应',
  investment: '投资',
  cooperation: '合作',
  competition: '竞争',
  talent: '人才',
}

const relationTypeOptions: { value: RelationType; label: string; color: string }[] = [
  { value: 'supply', label: '供应', color: '#36CBCB' },
  { value: 'investment', label: '投资', color: '#1889E8' },
  { value: 'cooperation', label: '合作', color: '#4ECB73' },
  { value: 'competition', label: '竞争', color: '#F2637B' },
  { value: 'talent', label: '人才', color: '#975FE5' },
]

const relationColorMap: Record<RelationType, string> = {
  supply: '#36CBCB',
  investment: '#1889E8',
  cooperation: '#4ECB73',
  competition: '#F2637B',
  talent: '#975FE5',
}

function getRelationColor(type: RelationType): string {
  return relationColorMap[type] || '#C0C4CC'
}

function getInfluenceColor(score: number): string {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#1889E8'
  if (score >= 40) return '#E6A23C'
  return '#F56C6C'
}

const loading = ref(false)
const allNodes = ref<RelationNode[]>([])
const allEdges = ref<RelationEdge[]>([])
const selectedTypes = ref<RelationType[]>([
  'supply',
  'investment',
  'cooperation',
  'competition',
  'talent',
])
const searchKeyword = ref('')
const selectedNode = ref<RelationNode | null>(null)

// Convert RelationNode/Edge to GraphNodeData/GraphEdgeData for ForceGraph
const graphNodes = computed<GraphNodeData[]>(() =>
  allNodes.value.map((n) => ({
    id: n.id,
    name: n.name,
    category: n.industry,
    value: n.relationCount,
    importance: n.influenceScore,
  })),
)

const graphEdges = computed<GraphEdgeData[]>(() =>
  allEdges.value.map((e) => ({
    source: e.source,
    target: e.target,
    weight: e.weight,
    type: e.type,
  })),
)

// Filter by selected relation types and search keyword
const filteredNodes = computed<GraphNodeData[]>(() => {
  const connectedNodeIds = new Set<string>()
  allEdges.value.forEach((e) => {
    if (selectedTypes.value.includes(e.type)) {
      connectedNodeIds.add(e.source)
      connectedNodeIds.add(e.target)
    }
  })

  let nodes = graphNodes.value.filter((n) => connectedNodeIds.has(n.id))

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    nodes = nodes.filter((n) => n.name.toLowerCase().includes(kw))
  }

  return nodes
})

const filteredEdges = computed<GraphEdgeData[]>(() => {
  const nodeIds = new Set(filteredNodes.value.map((n) => n.id))
  return graphEdges.value.filter(
    (e) =>
      selectedTypes.value.includes(e.type as RelationType) &&
      nodeIds.has(e.source as string) &&
      nodeIds.has(e.target as string),
  )
})

// Related nodes for selected node
const relatedNodes = computed(() => {
  if (!selectedNode.value) return []
  const nodeId = selectedNode.value.id
  const results: { node: RelationNode; edgeType: RelationType }[] = []

  allEdges.value.forEach((e) => {
    if (e.source === nodeId) {
      const target = allNodes.value.find((n) => n.id === e.target)
      if (target) results.push({ node: target, edgeType: e.type })
    } else if (e.target === nodeId) {
      const source = allNodes.value.find((n) => n.id === e.source)
      if (source) results.push({ node: source, edgeType: e.type })
    }
  })

  return results
})

function handleNodeClick(node: { id: string }) {
  const found = allNodes.value.find((n) => n.id === node.id)
  selectedNode.value = found || null
}

function handleNodeHover(node: { id: string } | null) {
  if (node && !selectedNode.value) {
    const found = allNodes.value.find((n) => n.id === node.id)
    selectedNode.value = found || null
  }
}

function handleTypeChange() {
  // Filtering is reactive via computed properties
}

function handleSearch() {
  // Filtering is reactive via computed properties
}

function handleReset() {
  selectedNode.value = null
  selectedTypes.value = ['supply', 'investment', 'cooperation', 'competition', 'talent']
  searchKeyword.value = ''
}

async function loadData() {
  loading.value = true
  try {
    const data = await fetchRelationGraphData()
    allNodes.value = data.nodes
    allEdges.value = data.edges
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
.page-container {
  padding: 20px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.filter-bar__search {
  width: 240px;

  .el-input {
    width: 100%;
  }
}

.type-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 4px;
  border-radius: 50%;
}

.graph-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
}

.graph-main {
  overflow: hidden;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.graph-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-section {
  padding: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: $text-regular;
}

.legend-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid $border-color-lighter;

  .label {
    color: $text-secondary;
  }

  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
}

.related-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background 0.2s;

  &:hover {
    background: color.adjust($bg-card, $lightness: -3%);
  }
}

.related-item__name {
  font-size: 13px;
  color: $text-primary;
}

.related-item__type {
  font-size: 12px;
  font-weight: $font-weight-medium;
}
</style>
