<template>
  <div class="page-container">
    <PageHeader title="基金详情" subtitle="投行基金详细信息">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
      </template>
    </PageHeader>

    <div class="detail-grid">
      <div class="detail-card">
        <h3>{{ fund.name }}</h3>
        <el-divider />
        <div class="detail-rows">
          <div class="detail-row">
            <span class="label">重点方向</span>
            <span class="value">{{ fund.focus }}</span>
          </div>
          <div class="detail-row">
            <span class="label">基金规模</span>
            <span class="value">{{ fund.scale?.toLocaleString() }}万</span>
          </div>
          <div class="detail-row">
            <span class="label">已投资金</span>
            <span class="value">{{ fund.invested?.toLocaleString() }}万</span>
          </div>
          <div class="detail-row">
            <span class="label">投资项目</span>
            <span class="value">{{ fund.projects }}个</span>
          </div>
          <div class="detail-row">
            <span class="label">回报率</span>
            <span class="value" style="color: #67C23A">{{ fund.roi }}%</span>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h4 class="panel-title">投资进度</h4>
        <BaseChart :option="gaugeOption" height="260px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockFunds } from '@/api/mock/invest'

const route = useRoute()
const fund = ref<any>({})
const gaugeOption = ref({})

onMounted(() => {
  const funds = getMockFunds()
  const id = route.params.id as string
  fund.value = funds.find(f => f.id === id) || funds[0]

  const investRate = fund.value.invested / fund.value.scale * 100
  gaugeOption.value = {
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      detail: { formatter: '{value}%' },
      data: [{ value: Math.min(investRate, 100).toFixed(1), name: '投资进度' }],
      axisLine: { lineStyle: { width: 20 } }
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
}
.detail-card,
.chart-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  h3 {
    font-size: 20px;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
  }
}
.panel-title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
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
</style>
