<template>
  <div class="page-container">
    <PageHeader title="健康度详情" subtitle="企业健康度维度详细分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        searchPlaceholder="搜索企业名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="detail-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">成长力分析</h4>
        <BaseChart :option="growthOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">盈利力分析</h4>
        <BaseChart :option="profitOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">创新力分析</h4>
        <BaseChart :option="innovationOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风控力分析</h4>
        <BaseChart :option="riskOption" height="280px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">企业健康度详细数据</h4>
      <el-table :data="filteredData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="overallScore" label="综合评分" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.overallScore >= 80 ? '#67C23A' : row.overallScore >= 60 ? '#E6A23C' : '#F56C6C', fontWeight: 600 }">
              {{ row.overallScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="growthScore" label="成长力" width="100" sortable />
        <el-table-column prop="profitScore" label="盈利力" width="100" sortable />
        <el-table-column prop="innovationScore" label="创新力" width="100" sortable />
        <el-table-column prop="riskScore" label="风控力" width="100" sortable />
        <el-table-column prop="socialScore" label="社会贡献" width="100" sortable />
      </el-table>
      <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockHealthData } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const filterFields = [
  { key: 'level', label: '健康等级', type: 'select' as const, options: [
    { label: '健康', value: 'healthy' },
    { label: '亚健康', value: 'sub-healthy' },
    { label: '不健康', value: 'unhealthy' }
  ]},
  { key: 'industry', label: '行业', type: 'select' as const, options: [
    { label: '高端装备制造', value: '1' },
    { label: '新材料', value: '2' },
    { label: '生物医药', value: '3' },
    { label: '电子信息', value: '4' }
  ]}
]

const allData = ref<any[]>([])
const currentPage = ref(1)
const total = ref(0)
const keyword = ref('')

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.name.includes(keyword.value))
  }
  return data
})

const growthOption = ref({})
const profitOption = ref({})
const innovationOption = ref({})
const riskOption = ref({})

onMounted(() => {
  allData.value = getMockHealthData(20)
  total.value = allData.value.length

  const names = allData.value.slice(0, 8).map((d: any) => d.name)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']

  growthOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: names.slice(0, 3) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: names.slice(0, 3).map((name: string) => ({
      name, type: 'line', smooth: true,
      data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 30 + 60))
    }))
  }

  profitOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: names },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar', barWidth: '40%',
      data: allData.value.slice(0, 8).map((d: any) => d.profitScore)
    }]
  }

  innovationOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: names },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar', barWidth: '40%',
      data: allData.value.slice(0, 8).map((d: any) => d.innovationScore)
    }]
  }

  riskOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: names },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar', barWidth: '40%',
      data: allData.value.slice(0, 8).map((d: any) => d.riskScore)
    }]
  }
})

function handleSearch(kw: string) { keyword.value = kw }
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() { keyword.value = '' }
function handlePageChange(page: number) { currentPage.value = page }
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-panel {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
