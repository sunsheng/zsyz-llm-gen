<template>
  <div class="page-container">
    <PageHeader title="企业风险" subtitle="企业个体风险监测与预警">
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

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业风险评分分布</h4>
        <BaseChart :option="distOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险类型占比</h4>
        <BaseChart :option="typePieOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">企业风险列表</h4>
      <el-table :data="filteredData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业" width="130" />
        <el-table-column prop="riskScore" label="风险评分" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.riskScore > 70 ? '#F56C6C' : row.riskScore > 40 ? '#E6A23C' : '#67C23A', fontWeight: 600 }">
              {{ row.riskScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="riskType" label="主要风险" width="120" />
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <RiskIndicator :level="row.level" :score="row.riskScore" />
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="风险趋势" width="100">
          <template #default="{ row }">
            <TrendIndicator :direction="row.riskChange > 0 ? 'up' : 'down'" :value="Math.abs(row.riskChange) + '%'" />
          </template>
        </el-table-column>
        <el-table-column prop="alertDate" label="预警日期" width="120" />
      </el-table>
      <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import RiskIndicator from '@/components/business/RiskIndicator.vue'
import TrendIndicator from '@/components/business/TrendIndicator.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const kpiCards = [
  { key: 'total', label: '风险企业', value: 128, unit: '家', trend: 'up' as const, trendValue: '+5', icon: 'Warning', iconColor: '#F2637B', iconBgColor: '#FEF0F0' },
  { key: 'high', label: '高风险企业', value: 28, unit: '家', trend: 'up' as const, trendValue: '+3', icon: 'CircleClose', iconColor: '#F56C6C', iconBgColor: '#FEF0F0' },
  { key: 'cashflow', label: '现金流预警', value: 42, unit: '家', trend: 'down' as const, trendValue: '-2', icon: 'Money', iconColor: '#E6A23C', iconBgColor: '#FDF6EC' },
  { key: 'resolved', label: '已处置', value: 86, unit: '条', trend: 'up' as const, trendValue: '+12', icon: 'CircleCheck', iconColor: '#67C23A', iconBgColor: '#EDFAF0' }
]

const filterFields = [
  { key: 'level', label: '风险等级', type: 'select' as const, options: [
    { label: '低风险', value: 'low' },
    { label: '中风险', value: 'medium' },
    { label: '高风险', value: 'high' }
  ]},
  { key: 'type', label: '风险类型', type: 'select' as const, options: [
    { label: '现金流', value: 'cashflow' },
    { label: '法律诉讼', value: 'legal' },
    { label: '经营异常', value: 'business' }
  ]}
]

const allData = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const total = ref(0)
const distOption = ref({})
const typePieOption = ref({})

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.name.includes(keyword.value))
  }
  return data
})

onMounted(() => {
  const names = ['华创新材料科技', '东方精密制造', '博远生物医药', '天域半导体', '绿能新能源', '中科智联信息', '鼎盛环保科技', '创想数字技术', '恒达装备制造', '瑞丰新材料', '恒宇光电科技', '昌盛药业集团', '芯源集成电路', '亿能动力电池', '安泰环保设备']
  const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源']
  const riskTypes = ['现金流', '法律诉讼', '经营异常', '信用违约']
  const levels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical']

  allData.value = names.map((name, i) => ({
    name,
    industry: industries[i % industries.length],
    riskScore: Math.floor(Math.random() * 80 + 20),
    riskType: riskTypes[i % riskTypes.length],
    level: levels[i % 4],
    riskChange: Math.floor(Math.random() * 20 - 10),
    alertDate: `2025-05-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}`
  })).sort((a, b) => b.riskScore - a.riskScore)
  total.value = allData.value.length

  distOption.value = {
    color: ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B'],
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['0-20', '20-40', '40-60', '60-80', '80-100'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      barWidth: '50%',
      data: [
        { value: 15, itemStyle: { color: '#67C23A' } },
        { value: 35, itemStyle: { color: '#36CBCB' } },
        { value: 42, itemStyle: { color: '#E6A23C' } },
        { value: 28, itemStyle: { color: '#F56C6C' } },
        { value: 8, itemStyle: { color: '#C45656' } }
      ]
    }]
  }

  typePieOption.value = {
    color: ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437'],
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: [
        { name: '现金流', value: 42 },
        { name: '法律诉讼', value: 35 },
        { name: '经营异常', value: 28 },
        { name: '信用违约', value: 23 }
      ]
    }]
  }
})

function handleSearch(kw: string) { keyword.value = kw; currentPage.value = 1 }
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
