<template>
  <div class="page-container">
    <PageHeader title="关系图谱" subtitle="企业关系网络图谱分析">
      <template #actions>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary">刷新图谱</el-button>
      </template>
    </PageHeader>

    <div class="graph-layout">
      <div class="graph-main">
        <ForceGraph
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :width="900"
          :height="550"
          @node-click="handleNodeClick"
          @node-hover="handleNodeHover"
        />
      </div>
      <div class="graph-sidebar">
        <div class="legend-section">
          <h4 class="section-title">关系类型</h4>
          <div class="legend-list">
            <div class="legend-item">
              <span class="legend-dot" style="background: #1889E8" />投资关系
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #36CBCB" />供应关系
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #4ECB73" />合作关系
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #F2637B" />竞争关系
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4 class="section-title">节点详情</h4>
          <template v-if="selectedNode">
            <div class="detail-item">
              <span class="label">企业名称</span>
              <span class="value">{{ selectedNode.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">行业</span>
              <span class="value">{{ selectedNode.category }}</span>
            </div>
            <div class="detail-item">
              <span class="label">关联度</span>
              <span class="value">{{ selectedNode.value }}</span>
            </div>
          </template>
          <el-empty v-else description="点击节点查看详情" :image-size="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import { getMockRelationGraph } from '@/api/mock/invest'

const graphData = ref<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })
const selectedNode = ref<any>(null)

function handleNodeClick(node: any) {
  selectedNode.value = node
}

function handleNodeHover(node: any) {
  if (node && !selectedNode.value) {
    selectedNode.value = node
  }
}

function handleReset() {
  selectedNode.value = null
}

onMounted(() => {
  graphData.value = getMockRelationGraph()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.graph-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
}
.graph-main {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.legend-section,
.detail-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 12px 0;
}
.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-regular;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid $border-color-lighter;
  font-size: 13px;
  .label { color: $text-secondary; }
  .value { color: $text-primary; font-weight: $font-weight-medium; }
}
</style>
