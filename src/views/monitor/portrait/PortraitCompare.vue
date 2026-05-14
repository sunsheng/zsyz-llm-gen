<template>
  <div class="page-container">
    <PageHeader title="画像对比" subtitle="多企业画像维度对比分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="select-section">
      <div class="chart-panel">
        <h4 class="chart-panel__title">选择对比企业</h4>
        <div class="select-row">
          <el-select
            v-model="selectedEnterprises"
            multiple
            placeholder="请选择企业（最多5家）"
            :max-collapse-tags="3"
            style="width: 600px"
          >
            <el-option
              v-for="item in enterpriseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" @click="handleCompare">开始对比</el-button>
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">多维度雷达对比</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">评分对比柱状图</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">对比详情</h4>
      <el-table :data="compareData" stripe border style="width: 100%">
        <el-table-column prop="dimension" label="维度" width="120" />
        <el-table-column
          v-for="(ent, idx) in compareEnterprises"
          :key="idx"
          :label="ent.name"
          min-width="120"
        >
          <template #default="{ row }">
            <span
              :style="{
                fontWeight: row.scores[idx] === Math.max(...row.scores) ? 700 : 400,
                color: row.scores[idx] === Math.max(...row.scores) ? '#1889E8' : '',
              }"
            >
              {{ row.scores[idx] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockPortraitData } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const enterpriseOptions = Array.from({ length: 10 }, (_, i) => {
  const p = getMockPortraitData(`opt-${i}`)
  return { label: p.name, value: p.id }
})

const selectedEnterprises = ref<string[]>(['opt-0', 'opt-1', 'opt-2'])
const compareEnterprises = ref<any[]>([])
const compareData = ref<any[]>([])
const radarOption = ref({})
const barOption = ref({})

onMounted(() => {
  handleCompare()
})

function handleCompare() {
  compareEnterprises.value = selectedEnterprises.value
    .slice(0, 5)
    .map((id) => getMockPortraitData(id))
  const dimensions = ['健康评分', '创新评分', '成长评分', '风险评分']
  const scoreKeys = ['healthScore', 'innovationScore', 'growthScore', 'riskScore'] as const

  compareData.value = dimensions.map((dimension, dIdx) => ({
    dimension,
    scores: compareEnterprises.value.map((e) => (e as any)[scoreKeys[dIdx]]),
  }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: compareEnterprises.value.map((e: any) => e.name) },
    radar: {
      indicator: dimensions.map((d) => ({ name: d, max: 100 })),
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: compareEnterprises.value.map((e: any, idx: number) => ({
          name: e.name,
          value: scoreKeys.map((k) => e[k]),
          areaStyle: { opacity: 0.15 },
          lineStyle: { color: chartColors[idx] },
          itemStyle: { color: chartColors[idx] },
        })),
      },
    ],
  }

  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: compareEnterprises.value.map((e: any) => e.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: dimensions },
    yAxis: { type: 'value', max: 100 },
    series: compareEnterprises.value.map((e: any, idx: number) => ({
      name: e.name,
      type: 'bar',
      barWidth: '15%',
      data: scoreKeys.map((k) => e[k]),
    })),
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.select-section {
  margin-bottom: 20px;
}
.select-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
