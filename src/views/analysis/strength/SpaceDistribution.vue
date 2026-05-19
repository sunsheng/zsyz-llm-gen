<template>
  <div class="page-container">
    <PageHeader title="产业空间分布" subtitle="产业区域空间布局分析" />

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域-产值关系</h4>
        <BaseChart :option="outputBarOption" height="380px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域-企业数量关系</h4>
        <BaseChart :option="enterpriseBarOption" height="380px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域产业排名</h4>
      <el-table :data="regionTable" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="70">
          <template #default="{ row }">
            <el-tag :type="row.rank <= 3 ? 'danger' : 'info'" size="small" round>{{
              row.rank
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="区域" min-width="120" />
        <el-table-column prop="output" label="产值(亿)" width="120" />
        <el-table-column prop="enterprises" label="重点企业" width="100" />
        <el-table-column prop="growth" label="增速(%)" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="综合评分" width="100">
          <template #default="{ row }">
            <el-progress
              :percentage="row.score"
              :stroke-width="6"
              :color="row.score >= 80 ? '#4ECB73' : '#1889E8'"
            />
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

const regionTable = ref([
  { rank: 1, region: '凯州新城核心区', output: 358, enterprises: 86, growth: 12.3, score: 92 },
  { rank: 2, region: '辑庆片区', output: 285, enterprises: 68, growth: 10.5, score: 85 },
  { rank: 3, region: '兴隆片区', output: 245, enterprises: 55, growth: 8.8, score: 78 },
  { rank: 4, region: '高新区', output: 198, enterprises: 48, growth: 7.6, score: 72 },
  { rank: 5, region: '经开区', output: 168, enterprises: 42, growth: 9.2, score: 68 },
  { rank: 6, region: '成巴东片区', output: 144, enterprises: 35, growth: 6.5, score: 62 },
  { rank: 7, region: '中江县', output: 125, enterprises: 28, growth: 8.1, score: 55 },
  { rank: 8, region: '德阳市区', output: 108, enterprises: 22, growth: 5.8, score: 50 },
  { rank: 9, region: '罗江区', output: 92, enterprises: 18, growth: 7.3, score: 45 },
  { rank: 10, region: '广汉市', output: 78, enterprises: 15, growth: 4.2, score: 40 },
])

const outputBarOption = ref({})
const enterpriseBarOption = ref({})

onMounted(() => {
  const regions = regionTable.value.map((r) => r.region)
  const outputs = regionTable.value.map((r) => r.output)
  const enterprises = regionTable.value.map((r) => r.enterprises)

  outputBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions, axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', name: '产值(亿)' },
    series: [
      {
        name: '产值',
        type: 'bar',
        barMaxWidth: 32,
        data: outputs,
        barWidth: '50%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}亿', fontSize: 11 },
      },
    ],
  }

  enterpriseBarOption.value = {
    color: chartColors.slice(1),
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regions, axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', name: '企业数(家)' },
    series: [
      {
        name: '重点企业',
        type: 'bar',
        barMaxWidth: 32,
        data: enterprises,
        barWidth: '50%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}家', fontSize: 11 },
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.table-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
