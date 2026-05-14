<template>
  <div class="page-container">
    <PageHeader title="创新对标" subtitle="城市创新能力对比分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">创新能力雷达对比</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">R&D投入对比</h4>
        <BaseChart :option="rdBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">专利数量对比</h4>
        <BaseChart :option="patentBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">高新企业数量</h4>
        <BaseChart :option="highTechOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">创新指标详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="city" label="城市" min-width="120" />
        <el-table-column prop="rdRatio" label="R&D占GDP(%)" width="140" sortable />
        <el-table-column prop="rdAmount" label="R&D投入(亿元)" width="140" sortable />
        <el-table-column prop="patentCount" label="专利授权量" width="120" sortable />
        <el-table-column prop="inventionCount" label="发明专利量" width="120" sortable />
        <el-table-column prop="highTechCount" label="高新企业数" width="120" sortable />
        <el-table-column prop="innovationScore" label="创新指数" width="100" sortable>
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889e8">{{ row.innovationScore }}</span>
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

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const tableData = ref<any[]>([])
const radarOption = ref({})
const rdBarOption = ref({})
const patentBarOption = ref({})
const highTechOption = ref({})

onMounted(() => {
  const cities = ['杭州市', '宁波市', '苏州市', '南京市', '成都市', '武汉市']
  tableData.value = cities.map((city) => ({
    city,
    rdRatio: +(Math.random() * 2 + 2.5).toFixed(1),
    rdAmount: Math.floor(Math.random() * 800 + 200),
    patentCount: Math.floor(Math.random() * 50000 + 10000),
    inventionCount: Math.floor(Math.random() * 15000 + 3000),
    highTechCount: Math.floor(Math.random() * 5000 + 1000),
    innovationScore: Math.floor(Math.random() * 20 + 70),
  }))

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['本地', '对标均值'] },
    radar: {
      indicator: [
        { name: 'R&D强度', max: 100 },
        { name: '专利密度', max: 100 },
        { name: '高新企业', max: 100 },
        { name: '人才密度', max: 100 },
        { name: '成果转化', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '本地', value: [82, 78, 85, 80, 76], areaStyle: { opacity: 0.2 } },
          { name: '对标均值', value: [70, 72, 75, 68, 65], areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }

  rdBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'R&D投入(亿元)',
        type: 'bar',
        barWidth: '40%',
        data: tableData.value.map((d) => d.rdAmount),
      },
    ],
  }

  patentBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['专利授权', '发明专利'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [
      {
        name: '专利授权',
        type: 'bar',
        barWidth: '25%',
        data: tableData.value.map((d) => d.patentCount),
      },
      {
        name: '发明专利',
        type: 'bar',
        barWidth: '25%',
        data: tableData.value.map((d) => d.inventionCount),
      },
    ],
  }

  highTechOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map((d) => d.highTechCount) }],
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
