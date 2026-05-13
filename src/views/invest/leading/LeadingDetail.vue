<template>
  <div class="page-container">
    <PageHeader title="龙头详情" subtitle="龙头企业详细信息">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
      </template>
    </PageHeader>

    <div class="detail-grid">
      <div class="detail-card">
        <div class="detail-header">
          <h3>{{ enterprise.name }}</h3>
          <el-tag type="primary">{{ enterprise.industry }}</el-tag>
        </div>
        <el-divider />
        <div class="detail-rows">
          <div class="detail-row">
            <span class="label">营收规模</span>
            <span class="value">{{ enterprise.revenue?.toLocaleString() }}万</span>
          </div>
          <div class="detail-row">
            <span class="label">市场份额</span>
            <span class="value">{{ enterprise.marketShare }}%</span>
          </div>
          <div class="detail-row">
            <span class="label">员工规模</span>
            <span class="value">{{ enterprise.employees?.toLocaleString() }}人</span>
          </div>
        </div>
      </div>
      <div class="score-card">
        <h4 class="panel-title">综合评分</h4>
        <div class="score-grid">
          <div class="score-item">
            <ScoreRing :value="enterprise.innovationScore || 0" :size="80" />
            <span class="score-label">创新指数</span>
          </div>
          <div class="score-item">
            <ScoreRing :value="enterprise.driveCapability || 0" :size="80" />
            <span class="score-label">带动能力</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <h4 class="panel-title">招商潜力分析</h4>
      <BaseChart :option="potentialOption" height="300px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockLeadingEnterprises } from '@/api/mock/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const route = useRoute()
const enterprise = ref<any>({})
const potentialOption = ref({})

onMounted(() => {
  const list = getMockLeadingEnterprises()
  const id = route.params.id as string
  enterprise.value = list.find(l => l.id === id) || list[0]

  potentialOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    radar: {
      indicator: [
        { name: '技术创新', max: 100 },
        { name: '市场拓展', max: 100 },
        { name: '产业链带动', max: 100 },
        { name: '人才吸引力', max: 100 },
        { name: '资金实力', max: 100 }
      ],
      shape: 'polygon'
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          enterprise.value.innovationScore || 75,
          Math.floor(Math.random() * 30 + 60),
          enterprise.value.driveCapability || 70,
          Math.floor(Math.random() * 30 + 55),
          Math.floor(Math.random() * 30 + 65)
        ],
        areaStyle: { opacity: 0.3 }
      }]
    }]
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.detail-card,
.score-card,
.chart-card {
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
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  h3 {
    font-size: 20px;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
  }
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid $border-color-lighter;
  font-size: 14px;
  .label { color: $text-secondary; }
  .value { color: $text-primary; font-weight: $font-weight-medium; }
}
.score-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  justify-items: center;
}
.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.score-label {
  font-size: 13px;
  color: $text-secondary;
}
</style>
