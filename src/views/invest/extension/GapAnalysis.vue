<template>
  <div class="page-container">
    <PageHeader title="缺链分析" subtitle="产业链缺口识别与分析">
      <template #actions>
        <el-button type="primary">重新分析</el-button>
      </template>
    </PageHeader>

    <div class="main-content">
      <div class="graph-panel">
        <h4 class="panel-title">产业链缺口图谱</h4>
        <ForceGraph
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :width="700"
          :height="500"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="gap-panel">
        <h4 class="panel-title">缺口列表</h4>
        <div class="gap-list">
          <el-card v-for="gap in gapList" :key="gap.id" shadow="hover" class="gap-card">
            <div class="gap-card__header">
              <span class="gap-card__name">{{ gap.chainName }}</span>
              <el-tag
                :type="
                  gap.severity === '高' ? 'danger' : gap.severity === '中' ? 'warning' : 'info'
                "
                size="small"
              >
                {{ gap.severity }}缺口
              </el-tag>
            </div>
            <div class="gap-card__body">
              <div class="gap-card__row">
                <span class="label">缺失环节</span>
                <div>
                  <el-tag
                    v-for="link in gap.missingLinks"
                    :key="link"
                    size="small"
                    type="danger"
                    style="margin: 2px"
                    >{{ link }}</el-tag
                  >
                </div>
              </div>
              <div class="gap-card__row">
                <span class="label">待补目标</span>
                <span class="value">{{ gap.targetCount }}家</span>
              </div>
              <div class="gap-card__row">
                <span class="label">补全率</span>
                <el-progress
                  :percentage="gap.fillRate"
                  :color="gap.fillRate >= 60 ? '#67C23A' : '#E6A23C'"
                  :stroke-width="10"
                  style="flex: 1"
                />
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import { getMockGapAnalysis, getMockChainMatchData } from '@/api/mock/invest'

const gapList = ref<any[]>([])
const graphData = ref<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })

function handleNodeClick(node: any) {
  console.log('Clicked:', node.name)
}

onMounted(() => {
  gapList.value = getMockGapAnalysis()
  graphData.value = getMockChainMatchData()
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
.gap-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.panel-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.gap-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
}
.gap-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.gap-card__name {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.gap-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  .label {
    color: $text-secondary;
  }
  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }
}
</style>
