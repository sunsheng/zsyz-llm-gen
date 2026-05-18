<template>
  <div class="page-container">
    <PageHeader title="企业健康指数" subtitle="企业综合健康指数评估" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">健康等级分布</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">健康评分区间</h4>
        <BaseChart :option="barOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">企业健康指标明细</h4>
      <el-table v-loading="loading" :data="enterpriseList" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业" width="140">
          <template #default="{ row }">
            <el-tag size="small">{{ row.industry }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="healthScore" label="健康评分" width="120" sortable>
          <template #default="{ row }">
            <el-tag :type="levelTagMap[row.level]" size="small">
              {{ row.healthScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="健康等级" width="110">
          <template #default="{ row }">
            <span :style="{ color: levelColorMap[row.level], fontWeight: 600 }">
              {{ row.level }}
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
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchHealthIndexData } from '@/api/modules/monitorApi'
import type { HealthIndexData } from '@/api/mock/monitor'
import type { MonitorKpi } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const levelTagMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  优秀: 'success',
  良好: 'primary',
  预警: 'warning',
  高危: 'danger',
}
const levelColorMap: Record<string, string> = {
  优秀: '#4ECB73',
  良好: '#1889E8',
  预警: '#FBD437',
  高危: '#F2637B',
}

const loading = ref(false)
const kpiCards = ref<MonitorKpi[]>([])
const enterpriseList = ref<HealthIndexData['enterpriseList']>([])
const pieOption = ref({})
const barOption = ref({})

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchHealthIndexData()) as HealthIndexData
    enterpriseList.value = data.enterpriseList

    const total = data.levelDistribution.reduce((s, d) => s + d.count, 0)
    kpiCards.value = data.levelDistribution.map((d) => ({
      key: d.level,
      label: `${d.level}企业`,
      value: d.count,
      unit: '家',
      trend: d.level === '高危' || d.level === '预警' ? 'up' : 'up',
      trendValue: `${((d.count / total) * 100).toFixed(1)}%`,
      icon:
        d.level === '优秀'
          ? 'CircleCheck'
          : d.level === '良好'
            ? 'Select'
            : d.level === '预警'
              ? 'Warning'
              : 'CircleClose',
      iconColor: d.color,
      iconBgColor: d.color + '20',
    }))

    pieOption.value = {
      color: data.levelDistribution.map((d) => d.color),
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, formatter: '{b}: {c}家 ({d}%)' },
          data: data.levelDistribution.map((d) => ({ name: d.level, value: d.count })),
        },
      ],
    }

    // 按分数段统计
    const scoreRanges = [
      { range: '90-100', min: 90, max: 100 },
      { range: '80-89', min: 80, max: 89 },
      { range: '70-79', min: 70, max: 79 },
      { range: '60-69', min: 60, max: 69 },
      { range: '<60', min: 0, max: 59 },
    ]
    barOption.value = {
      color: chartColors,
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: scoreRanges.map((r) => r.range) },
      yAxis: { type: 'value', name: '企业数(家)' },
      series: [
        {
          type: 'bar',
          barMaxWidth: 48,
          data: scoreRanges.map((r) => ({
            value: data.enterpriseList.filter(
              (e) => e.healthScore >= r.min && e.healthScore <= r.max,
            ).length,
            itemStyle: {
              color:
                r.min >= 90
                  ? '#4ECB73'
                  : r.min >= 80
                    ? '#1889E8'
                    : r.min >= 70
                      ? '#36CBCB'
                      : r.min >= 60
                        ? '#FBD437'
                        : '#F2637B',
            },
          })),
        },
      ],
    }
  } finally {
    loading.value = false
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
</style>
