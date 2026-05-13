<template>
  <div class="page-container">
    <PageHeader title="链式匹配" subtitle="产业链上下游企业匹配分析">
      <template #actions>
        <el-button type="primary">重新匹配</el-button>
      </template>
    </PageHeader>

    <div class="main-content">
      <div class="graph-panel">
        <h4 class="panel-title">产业链关系图谱</h4>
        <ForceGraph
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :width="700"
          :height="450"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="match-panel">
        <h4 class="panel-title">匹配结果</h4>
        <el-table :data="matchResults" stripe border size="small" style="width: 100%">
          <el-table-column prop="name" label="企业名称" min-width="120" />
          <el-table-column prop="industry" label="行业" width="120" />
          <el-table-column prop="matchScore" label="匹配度" width="80">
            <template #default="{ row }">
              <span :style="{ color: row.matchScore >= 80 ? '#67C23A' : '#E6A23C', fontWeight: 600 }">
                {{ row.matchScore }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="chainPosition" label="链上位置" width="120" />
          <el-table-column label="操作" width="80">
            <template #default>
              <el-button type="primary" link size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import { getMockChainMatchData, getMockTargets } from '@/api/mock/invest'

const graphData = ref<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })
const matchResults = ref<any[]>([])

function handleNodeClick(node: any) {
  console.log('Clicked node:', node.name)
}

onMounted(() => {
  graphData.value = getMockChainMatchData()
  matchResults.value = getMockTargets(8)
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.graph-panel,
.match-panel {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.panel-title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
</style>
