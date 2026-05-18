<template>
  <div class="page-container">
    <PageHeader title="可持续发展监测" subtitle="绿色生产合规性与绿电使用追踪" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">碳排放趋势</h4>
        <BaseChart :option="carbonTrendOption" height="300px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">合规率雷达图</h4>
        <BaseChart :option="radarOption" height="300px" />
      </div>
    </div>

    <div class="table-section">
      <div class="table-header">
        <h4 class="chart-panel__title">未达标企业清单</h4>
        <el-tag type="danger" size="small">{{ nonCompliantList.length }} 家未达标</el-tag>
      </div>
      <el-table v-loading="loading" :data="nonCompliantList" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="reason" label="不合规原因" min-width="200" />
        <el-table-column prop="level" label="风险等级" width="120">
          <template #default="{ row }">
            <el-tag :type="row.level === 'danger' ? 'danger' : 'warning'" size="small">
              {{ row.level === 'danger' ? '严重' : '警告' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchSustainabilityKpi, fetchSustainabilityData } from '@/api/modules/monitorApi'
import type { SustainabilityKpi, SustainabilityData } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const kpiCards = ref<SustainabilityKpi[]>([])
const nonCompliantList = ref<{ name: string; reason: string; level: 'warning' | 'danger' }[]>([])
const carbonTrendOption = ref({})
const radarOption = ref({})

async function loadData() {
  loading.value = true
  try {
    const [kpi, data] = await Promise.all([
      fetchSustainabilityKpi() as Promise<SustainabilityKpi[]>,
      fetchSustainabilityData() as Promise<SustainabilityData>,
    ])
    kpiCards.value = kpi
    nonCompliantList.value = data.nonCompliantList
    updateCharts(data)
  } finally {
    loading.value = false
  }
}

function updateCharts(data: SustainabilityData) {
  carbonTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.carbonTrend.map((t) => t.month) },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value} 吨/万元' },
    },
    series: [
      {
        name: '单位产值碳排放',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.15 },
        data: data.carbonTrend.map((t) => t.value),
      },
    ],
  }

  radarOption.value = {
    color: chartColors,
    radar: {
      indicator: data.complianceRadar.map((d) => ({
        name: d.dimension,
        max: 100,
      })),
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data.complianceRadar.map((d) => d.value),
            name: '合规率',
            areaStyle: { opacity: 0.15 },
          },
        ],
      },
    ],
  }
}

onMounted(() => {
  loadData()
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
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
