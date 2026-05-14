<template>
  <div class="page-container">
    <PageHeader title="资金流向" subtitle="产业资本流动动态">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">资本类型分布</h4>
        <BaseChart :option="typePieOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业资本流向</h4>
        <BaseChart :option="industryBarOption" height="280px" />
      </div>
    </div>

    <SearchFilterBar
      search-placeholder="请输入企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="content-card">
      <el-table :data="capitalList" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业" min-width="120" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="capitalTypeTag(row.type) as any" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额(万)" width="130">
          <template #default="{ row }">{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="investor" label="投资方" width="120" />
        <el-table-column prop="industry" label="行业" width="120" />
      </el-table>
      <PaginationBar :current="1" :total="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockCapitalList } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const filters: FilterField[] = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    options: [
      { label: '融资', value: '融资' },
      { label: '并购', value: '并购' },
      { label: '上市', value: '上市' },
      { label: '投资', value: '投资' },
    ],
  },
  {
    key: 'industry',
    label: '行业',
    type: 'select',
    options: [
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
    ],
  },
]

const kpiCards = ref<any[]>([])
const capitalList = ref<any[]>([])
const typePieOption = ref({})
const industryBarOption = ref({})

function capitalTypeTag(type: string) {
  const map: Record<string, string> = { 融资: '', 并购: 'warning', 上市: 'success', 投资: 'info' }
  return map[type] || ''
}

function handleSearch() {
  capitalList.value = getMockCapitalList(10)
}

onMounted(() => {
  kpiCards.value = [
    {
      key: 'totalAmount',
      label: '总金额',
      value: 86.5,
      unit: '亿',
      trend: 'up',
      trendValue: '+22.3%',
      icon: 'Money',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'dealCount',
      label: '交易数',
      value: 156,
      unit: '笔',
      trend: 'up',
      trendValue: '+15.8%',
      icon: 'Document',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'avgAmount',
      label: '平均金额',
      value: 5545,
      unit: '万',
      trend: 'up',
      trendValue: '+8.2%',
      icon: 'DataLine',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'financingCount',
      label: '融资事件',
      value: 68,
      unit: '笔',
      trend: 'up',
      trendValue: '+18.5%',
      icon: 'TrendCharts',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
  ]

  typePieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { name: '融资', value: 68 },
          { name: '并购', value: 32 },
          { name: '上市', value: 18 },
          { name: '投资', value: 38 },
        ],
      },
    ],
  }

  industryBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['高端装备', '新材料', '生物医药', '电子信息', '新能源'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}亿' } },
    series: [{ name: '资金量', type: 'bar', data: [28, 22, 15, 12, 9], barWidth: '40%' }],
  }

  handleSearch()
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
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
