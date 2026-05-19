<template>
  <div class="page-container">
    <PageHeader title="招商风险监测" subtitle="招商全流程风险监测预警" />

    <SearchFilterBar
      search-placeholder="搜索风险项目"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险类别分布</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
    </div>

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 条风险记录</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="targetName" label="风险项目" min-width="180" show-overflow-tooltip />
        <el-table-column prop="trackType" label="风险类别" width="110">
          <template #default="{ row }">
            <el-tag :type="riskCategoryMap[row.trackType]" size="small">
              {{ row.trackType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="120" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">查看</el-button>
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

    <el-dialog v-model="detailVisible" title="风险详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="风险项目">{{ detailData.targetName }}</el-descriptions-item>
        <el-descriptions-item label="风险类别">{{ detailData.trackType }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detailData.status }}</el-descriptions-item>
        <el-descriptions-item label="进度">{{ detailData.progress }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchTrackList } from '@/api/modules/intelligenceApi'
import type { IntelligenceTrackItem } from '@/api/mock/intelligence'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const riskCategoryMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  企业动态: 'danger',
  投资意向: 'warning',
  政策变化: 'primary',
  竞争情报: 'info',
}

const statusMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  进行中: 'warning',
  已完成: 'success',
  已搁置: 'info',
}

const filters: FilterField[] = [
  {
    key: 'trackType',
    label: '风险类别',
    type: 'select',
    options: [
      { label: '企业动态', value: '企业动态' },
      { label: '投资意向', value: '投资意向' },
      { label: '政策变化', value: '政策变化' },
      { label: '竞争情报', value: '竞争情报' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '进行中', value: '进行中' },
      { label: '已完成', value: '已完成' },
      { label: '已搁置', value: '已搁置' },
    ],
  },
]

const loading = ref(false)
const tableData = ref<IntelligenceTrackItem[]>([])
const allData = ref<IntelligenceTrackItem[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })
const detailVisible = ref(false)
const detailData = ref<any>({})

function handleDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

const kpiCards = computed(() => {
  const data = allData.value
  const policyCount = data.filter((d) => d.trackType === '政策变化').length
  const marketCount = data.filter((d) => d.trackType === '竞争情报').length
  const enterpriseCount = data.filter((d) => d.trackType === '企业动态').length
  const contractCount = data.filter((d) => d.trackType === '投资意向').length
  return [
    {
      key: 'policy',
      icon: 'Document',
      label: '政策风险',
      value: policyCount,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+3',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
    {
      key: 'market',
      icon: 'TrendCharts',
      label: '市场风险',
      value: marketCount,
      unit: '条',
      trend: 'flat' as const,
      trendValue: '持平',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'enterprise',
      icon: 'OfficeBuilding',
      label: '企业风险',
      value: enterpriseCount,
      unit: '条',
      trend: 'down' as const,
      trendValue: '-2',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'contract',
      icon: 'Tickets',
      label: '履约风险',
      value: contractCount,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+1',
      iconColor: '#4ECB73',
      iconBgColor: '#EBF9F0',
    },
  ]
})

const trendOption = ref({})

const pieOption = ref({})

function initCharts() {
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['政策风险', '市场风险', '企业风险', '履约风险'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '政策风险',
        type: 'line',
        smooth: true,
        data: [12, 15, 8, 18, 10, 14],
      },
      {
        name: '市场风险',
        type: 'line',
        smooth: true,
        data: [8, 10, 12, 9, 15, 11],
      },
      {
        name: '企业风险',
        type: 'line',
        smooth: true,
        data: [20, 18, 15, 22, 16, 12],
      },
      {
        name: '履约风险',
        type: 'line',
        smooth: true,
        data: [5, 8, 6, 10, 7, 9],
      },
    ],
  }

  pieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 14, name: '政策风险' },
          { value: 11, name: '市场风险' },
          { value: 12, name: '企业风险' },
          { value: 9, name: '履约风险' },
        ],
      },
    ],
  }
}

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.targetName.toLowerCase().includes(kw))
  }

  if (filterValues.value.trackType) {
    filtered = filtered.filter((item) => item.trackType === filterValues.value.trackType)
  }
  if (filterValues.value.status) {
    filtered = filtered.filter((item) => item.status === filterValues.value.status)
  }

  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchTrackList(20)) as IntelligenceTrackItem[]
    allData.value = data
    applyFilters()
  } finally {
    loading.value = false
  }
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  pagination.current = 1
  applyFilters()
}

function handleFilter(filters: Record<string, unknown>) {
  filterValues.value = filters
  pagination.current = 1
  applyFilters()
}

function handleReset() {
  searchKeyword.value = ''
  filterValues.value = {}
  pagination.current = 1
  applyFilters()
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
  applyFilters()
}

onMounted(() => {
  initCharts()
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
