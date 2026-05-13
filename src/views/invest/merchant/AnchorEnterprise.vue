<template>
  <div class="page-container">
    <PageHeader title="锚点企业" subtitle="以商招商锚点企业分析">
      <template #actions>
        <el-button type="primary">重新分析</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="main-content">
      <div class="card-section">
        <h4 class="panel-title">锚点企业列表</h4>
        <div class="card-grid">
          <el-card v-for="item in anchors" :key="item.id" shadow="hover" class="anchor-card">
            <div class="anchor-card__header">
              <span class="anchor-card__name">{{ item.name }}</span>
              <el-tag size="small">{{ item.relationshipType }}</el-tag>
            </div>
            <div class="anchor-card__body">
              <div class="anchor-card__row">
                <span class="label">行业</span>
                <span class="value">{{ item.industry }}</span>
              </div>
              <div class="anchor-card__row">
                <span class="label">衍生企业</span>
                <span class="value">{{ item.derivedCount }}家</span>
              </div>
              <div class="anchor-card__row">
                <span class="label">招商潜力</span>
                <ScoreRing :value="item.investPotential" :size="40" :stroke-width="4" />
              </div>
            </div>
            <el-button type="primary" size="small" style="width: 100%; margin-top: 8px">查看衍生关系</el-button>
          </el-card>
        </div>
      </div>
      <div class="graph-section">
        <h4 class="panel-title">企业关系网络</h4>
        <ForceGraph
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :width="500"
          :height="400"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import { getMockAnchorEnterprises, getMockRelationGraph } from '@/api/mock/invest'

const kpiCards = ref<any[]>([])
const anchors = ref<any[]>([])
const graphData = ref<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })

onMounted(() => {
  kpiCards.value = [
    { key: 'anchorCount', label: '锚点企业', value: 8, unit: '家', trend: 'up', trendValue: '+14.3%', icon: 'Position', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
    { key: 'derivedCount', label: '衍生企业', value: 62, unit: '家', trend: 'up', trendValue: '+22.5%', icon: 'Connection', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
    { key: 'avgPotential', label: '平均潜力', value: 73, unit: '分', trend: 'up', trendValue: '+5.8%', icon: 'TrendCharts', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
    { key: 'signedCount', label: '已签约', value: 15, unit: '家', trend: 'up', trendValue: '+30.0%', icon: 'DocumentChecked', iconColor: '#FBD437', iconBgColor: '#FFF8E6' }
  ]
  anchors.value = getMockAnchorEnterprises()
  graphData.value = getMockRelationGraph()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.card-section,
.graph-section {
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
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.anchor-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.anchor-card__name {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.anchor-card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
  .label { color: $text-secondary; }
  .value { color: $text-primary; font-weight: $font-weight-medium; }
}
</style>
