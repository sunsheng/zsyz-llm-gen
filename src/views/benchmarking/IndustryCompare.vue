<template>
  <div class="page-container">
    <PageHeader title="产业对标" subtitle="城市产业结构与竞争力对比">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业结构对比</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">主导产业产值对比</h4>
        <BaseChart :option="industryBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业集群评分</h4>
        <BaseChart :option="clusterBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业集中度对比</h4>
        <BaseChart :option="concentrationOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">产业对标详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="city" label="城市" min-width="120" />
        <el-table-column prop="dominantIndustry" label="主导产业" width="140" />
        <el-table-column prop="clusterScore" label="集群评分" width="100" sortable />
        <el-table-column prop="concentration" label="集中度(%)" width="110" sortable />
        <el-table-column prop="outputValue" label="产值(亿元)" width="120" sortable />
        <el-table-column prop="growth" label="增速(%)" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }"
              >{{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseCount" label="规上企业数" width="120" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const tableData = ref<any[]>([])
const radarOption = ref({})
const industryBarOption = ref({})
const clusterBarOption = ref({})
const concentrationOption = ref({})

onMounted(() => {
  const cities = ['杭州市', '宁波市', '苏州市', '南京市', '成都市', '武汉市']
  const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源']

  tableData.value = cities.map((city) => ({
    city,
    dominantIndustry: industries[Math.floor(Math.random() * industries.length)],
    clusterScore: Math.floor(Math.random() * 20 + 70),
    concentration: +(Math.random() * 20 + 30).toFixed(1),
    outputValue: Math.floor(Math.random() * 5000 + 1000),
    growth: +(Math.random() * 20 + 2).toFixed(1),
    enterpriseCount: Math.floor(Math.random() * 500 + 100),
  }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['本地', '对标城市A', '对标城市B'] },
    radar: {
      indicator: industries.map((name) => ({ name, max: 100 })),
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '本地', value: [85, 78, 82, 90, 72], areaStyle: { opacity: 0.2 } },
          { name: '对标城市A', value: [80, 82, 76, 85, 78], areaStyle: { opacity: 0.1 } },
          { name: '对标城市B', value: [75, 70, 80, 78, 82], areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }

  industryBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: cities.slice(0, 3) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries },
    yAxis: { type: 'value' },
    series: cities.slice(0, 3).map((city, idx) => ({
      name: city,
      type: 'bar',
      barWidth: '18%',
      data: industries.map(() => Math.floor(Math.random() * 2000 + 500)),
    })),
  }

  clusterBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value', max: 100 },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map((d) => d.clusterScore) }],
  }

  concentrationOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map((d) => d.concentration) }],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
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
