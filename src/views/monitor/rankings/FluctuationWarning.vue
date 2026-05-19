<template>
  <div class="page-container">
    <PageHeader title="榜单波动预警体系" subtitle="企业排名异常波动检测与预警" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">排名对比散点图</h4>
        <BaseChart :option="scatterOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">波动趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
    </div>

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 条预警记录</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="horizontalFluctuation" label="横向波动(位)" width="130" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.horizontalFluctuation >= 20 ? '#F2637B' : '#303133' }">
              {{ row.horizontalFluctuation }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="verticalFluctuation" label="纵向波动(位)" width="130" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.verticalFluctuation >= 15 ? '#F2637B' : '#303133' }">
              {{ row.verticalFluctuation }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="rankChange" label="排名变动" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.rankChange >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.rankChange >= 0 ? '+' : '' }}{{ row.rankChange }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="warningLevel" label="预警等级" width="110">
          <template #default="{ row }">
            <el-tag :type="levelTagMap[row.warningLevel]" size="small">
              {{ levelLabelMap[row.warningLevel] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="预警原因" min-width="220" />
        <el-table-column prop="industry" label="行业" width="120">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.industry }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar
        :current="pagination.current"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { fetchFluctuationWarningList } from '@/api/modules/monitorApi'
import type { FluctuationWarningItem } from '@/api/mock/monitor'
import type { MonitorKpi } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const levelTagMap: Record<string, 'info' | 'warning' | 'danger'> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
}
const levelLabelMap: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '严重',
}

const loading = ref(false)
const kpiCards = ref<MonitorKpi[]>([])
const allData = ref<FluctuationWarningItem[]>([])
const tableData = ref<FluctuationWarningItem[]>([])
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })
const scatterOption = ref({})
const trendOption = ref({})

function applyPagination() {
  pagination.total = allData.value.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = allData.value.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchFluctuationWarningList(30)) as FluctuationWarningItem[]
    allData.value = data
    applyPagination()

    const criticalCount = data.filter((d) => d.warningLevel === 'critical').length
    const highCount = data.filter((d) => d.warningLevel === 'high').length
    const avgHFluc = +(data.reduce((s, d) => s + d.horizontalFluctuation, 0) / data.length).toFixed(
      1,
    )
    const avgVFluc = +(data.reduce((s, d) => s + d.verticalFluctuation, 0) / data.length).toFixed(1)

    kpiCards.value = [
      {
        key: 'critical',
        label: '严重预警',
        value: criticalCount,
        unit: '条',
        trend: criticalCount > 3 ? 'up' : 'down',
        trendValue: criticalCount > 0 ? '需立即处理' : '无严重预警',
        icon: 'CircleClose',
        iconColor: '#F2637B',
        iconBgColor: '#FEF0F0',
      },
      {
        key: 'high',
        label: '高级预警',
        value: highCount,
        unit: '条',
        trend: 'up',
        trendValue: '需关注',
        icon: 'Warning',
        iconColor: '#FBD437',
        iconBgColor: '#FFF8E6',
      },
      {
        key: 'avg-h',
        label: '平均横向波动',
        value: avgHFluc,
        unit: '位',
        trend: avgHFluc > 20 ? 'up' : 'down',
        trendValue: avgHFluc > 20 ? '偏大' : '正常',
        icon: 'Sort',
        iconColor: '#1889E8',
        iconBgColor: '#ECF5FF',
      },
      {
        key: 'avg-v',
        label: '平均纵向波动',
        value: avgVFluc,
        unit: '位',
        trend: avgVFluc > 15 ? 'up' : 'down',
        trendValue: avgVFluc > 15 ? '偏大' : '正常',
        icon: 'Sort',
        iconColor: '#36CBCB',
        iconBgColor: '#E6F7F7',
      },
    ]

    updateCharts(data)
  } finally {
    loading.value = false
  }
}

function updateCharts(data: FluctuationWarningItem[]) {
  scatterOption.value = {
    color: chartColors,
    tooltip: {
      formatter: (params: any) => {
        const d = params.data
        return `${d[3]}<br/>横向波动: ${d[0]}位<br/>纵向波动: ${d[1]}位`
      },
    },
    xAxis: { name: '横向波动(位)', type: 'value' },
    yAxis: { name: '纵向波动(位)', type: 'value' },
    series: [
      {
        type: 'scatter',
        symbolSize: (val: number[]) => Math.max(val[2] * 3, 8),
        data: data.map((d) => {
          const levelMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 }
          return [d.horizontalFluctuation, d.verticalFluctuation, levelMap[d.warningLevel], d.name]
        }),
        itemStyle: {
          color: (params: any) => {
            const level = data[params.dataIndex]?.warningLevel
            const colorMap: Record<string, string> = {
              low: '#36CBCB',
              medium: '#FBD437',
              high: '#F2637B',
              critical: '#975FE5',
            }
            return colorMap[level] || '#1889E8'
          },
        },
      },
    ],
  }

  // 按预警等级分组统计趋势
  const levelCounts: Record<string, number[]> = { low: [], medium: [], high: [], critical: [] }
  data.forEach((d) => {
    if (levelCounts[d.warningLevel]) levelCounts[d.warningLevel].push(d.horizontalFluctuation)
  })

  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['低级', '中级', '高级', '严重'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.slice(0, 10).map((d) => d.name.slice(0, 6)),
    },
    yAxis: { type: 'value', name: '波动值(位)' },
    series: [
      {
        name: '横向波动',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'fluctuation',
        data: data.slice(0, 10).map((d) => d.horizontalFluctuation),
      },
      {
        name: '纵向波动',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'fluctuation',
        data: data.slice(0, 10).map((d) => d.verticalFluctuation),
      },
    ],
  }
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
  applyPagination()
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
.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.result-count {
  font-size: 14px;
  color: $text-secondary;
}
</style>
