<template>
  <div class="page-container">
    <PageHeader title="园区详情" subtitle="产业园区详细信息">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
      </template>
    </PageHeader>

    <div class="detail-grid">
      <div class="detail-card">
        <h3>{{ park.name }}</h3>
        <el-tag style="margin-left: 8px">{{ park.industry }}</el-tag>
        <el-divider />
        <div class="detail-rows">
          <div class="detail-row">
            <span class="label">园区面积</span>
            <span class="value">{{ park.area?.toLocaleString() }}亩</span>
          </div>
          <div class="detail-row">
            <span class="label">入驻率</span>
            <span class="value" :style="{ color: (park.occupancy || 0) >= 80 ? '#67C23A' : '#E6A23C' }">{{ park.occupancy }}%</span>
          </div>
          <div class="detail-row">
            <span class="label">入驻企业</span>
            <span class="value">{{ park.enterprises }}家</span>
          </div>
          <div class="detail-row">
            <span class="label">年产值</span>
            <span class="value">{{ park.revenue?.toLocaleString() }}万</span>
          </div>
          <div class="detail-row">
            <span class="label">空置面积</span>
            <span class="value">{{ park.vacantArea?.toLocaleString() }}亩</span>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h4 class="panel-title">园区综合评估</h4>
        <BaseChart :option="radarOption" height="300px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockParks } from '@/api/mock/invest'

const route = useRoute()
const park = ref<any>({})
const radarOption = ref({})

onMounted(() => {
  const list = getMockParks()
  const id = route.params.id as string
  park.value = list.find(p => p.id === id) || list[0]

  radarOption.value = {
    color: ['#1889E8'],
    tooltip: {},
    radar: {
      indicator: [
        { name: '入驻率', max: 100 },
        { name: '企业密度', max: 100 },
        { name: '产值贡献', max: 100 },
        { name: '配套设施', max: 100 },
        { name: '招商潜力', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          park.value.occupancy || 70,
          Math.min((park.value.enterprises || 50) / 2, 100),
          Math.min((park.value.revenue || 50000) / 3000, 100),
          Math.floor(Math.random() * 30 + 60),
          Math.floor(Math.random() * 30 + 55)
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
}
.detail-card,
.chart-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  h3 {
    display: inline;
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
