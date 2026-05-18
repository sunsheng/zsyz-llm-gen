<template>
  <div class="page-container">
    <PageHeader title="我的招商情报" subtitle="个性化招商情报订阅与收藏" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <el-tabs v-model="activeTab" class="content-tabs">
      <el-tab-pane label="情报追踪" name="track">
        <div class="content-card">
          <SearchFilterBar
            search-placeholder="搜索追踪目标"
            :filters="trackFilters"
            @search="handleTrackSearch"
            @filter="handleTrackFilter"
            @reset="handleTrackReset"
          />
          <div class="result-bar">
            <span class="result-count">共 {{ trackPagination.total }} 条追踪</span>
          </div>
          <el-table v-loading="trackLoading" :data="trackData" stripe border style="width: 100%">
            <el-table-column
              prop="targetName"
              label="追踪目标"
              min-width="140"
              show-overflow-tooltip
            />
            <el-table-column prop="trackType" label="追踪类型" width="110">
              <template #default="{ row }">
                <el-tag :type="trackTypeMap[row.trackType]" size="small">
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
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button type="primary" link size="small">查看</el-button>
                <el-button type="danger" link size="small">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationBar
            :current="trackPagination.current"
            :total="trackPagination.total"
            @change="handleTrackPageChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="情报报告" name="report">
        <div class="content-card">
          <SearchFilterBar
            search-placeholder="搜索报告标题"
            :filters="reportFilters"
            @search="handleReportSearch"
            @filter="handleReportFilter"
            @reset="handleReportReset"
          />
          <div class="result-bar">
            <span class="result-count">共 {{ reportPagination.total }} 份报告</span>
          </div>
          <el-table v-loading="reportLoading" :data="reportData" stripe border style="width: 100%">
            <el-table-column prop="title" label="报告标题" min-width="220" show-overflow-tooltip />
            <el-table-column prop="type" label="报告类型" width="110">
              <template #default="{ row }">
                <el-tag :type="reportTypeMap[row.type]" size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者/部门" width="110" />
            <el-table-column prop="createDate" label="创建日期" width="120" />
            <el-table-column prop="downloadCount" label="下载次数" width="100" align="center">
              <template #default="{ row }">
                <span style="color: #1889e8">{{ row.downloadCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button type="primary" link size="small">下载</el-button>
                <el-button link size="small">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationBar
            :current="reportPagination.current"
            :total="reportPagination.total"
            @change="handleReportPageChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import StatCard from '@/components/common/StatCard.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchTrackList, fetchReportList } from '@/api/modules/intelligenceApi'
import type { IntelligenceTrackItem, IntelligenceReportItem } from '@/api/mock/intelligence'

type TagType = 'info' | 'primary' | 'success' | 'warning' | 'danger'

const trackTypeMap: Record<string, TagType> = {
  企业动态: 'danger',
  投资意向: 'warning',
  政策变化: 'primary',
  竞争情报: 'info',
}

const statusMap: Record<string, TagType> = {
  进行中: 'warning',
  已完成: 'success',
  已搁置: 'info',
}

const reportTypeMap: Record<string, TagType> = {
  行业分析: 'primary',
  区域报告: 'success',
  政策解读: 'warning',
  投资建议: 'danger',
}

const activeTab = ref('track')

// --- 情报追踪 ---
const trackLoading = ref(false)
const trackData = ref<IntelligenceTrackItem[]>([])
const allTrackData = ref<IntelligenceTrackItem[]>([])
const trackSearchKeyword = ref('')
const trackFilterValues = ref<Record<string, unknown>>({})
const trackPagination = reactive({ current: 1, total: 0, pageSize: 20 })

const trackFilters: FilterField[] = [
  {
    key: 'trackType',
    label: '追踪类型',
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

// --- 情报报告 ---
const reportLoading = ref(false)
const reportData = ref<IntelligenceReportItem[]>([])
const allReportData = ref<IntelligenceReportItem[]>([])
const reportSearchKeyword = ref('')
const reportFilterValues = ref<Record<string, unknown>>({})
const reportPagination = reactive({ current: 1, total: 0, pageSize: 20 })

const reportFilters: FilterField[] = [
  {
    key: 'type',
    label: '报告类型',
    type: 'select',
    options: [
      { label: '行业分析', value: '行业分析' },
      { label: '区域报告', value: '区域报告' },
      { label: '政策解读', value: '政策解读' },
      { label: '投资建议', value: '投资建议' },
    ],
  },
]

// --- KPI ---
const kpiCards = computed(() => {
  const trackItems = allTrackData.value
  const tracking = trackItems.filter((d) => d.status === '进行中').length
  const completed = trackItems.filter((d) => d.status === '已完成').length
  const reportCount = allReportData.value.length
  return [
    {
      key: 'tracking',
      icon: 'Aim',
      label: '追踪中',
      value: tracking,
      unit: '条',
      trend: 'up' as const,
      trendValue: '+2',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'completed',
      icon: 'CircleCheck',
      label: '已完成',
      value: completed,
      unit: '条',
      trend: 'flat' as const,
      trendValue: '持平',
      iconColor: '#4ECB73',
      iconBgColor: '#EBF9F0',
    },
    {
      key: 'reports',
      icon: 'Document',
      label: '情报报告',
      value: reportCount,
      unit: '份',
      trend: 'up' as const,
      trendValue: '+1',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'subscriptions',
      icon: 'Bell',
      label: '订阅数',
      value: 8,
      unit: '个',
      trend: 'flat' as const,
      trendValue: '持平',
      iconColor: '#975FE5',
      iconBgColor: '#F3EEFF',
    },
  ]
})

// --- 追踪筛选逻辑 ---
function applyTrackFilters() {
  let filtered = [...allTrackData.value]
  if (trackSearchKeyword.value) {
    const kw = trackSearchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.targetName.toLowerCase().includes(kw))
  }
  if (trackFilterValues.value.trackType) {
    filtered = filtered.filter((item) => item.trackType === trackFilterValues.value.trackType)
  }
  if (trackFilterValues.value.status) {
    filtered = filtered.filter((item) => item.status === trackFilterValues.value.status)
  }
  trackPagination.total = filtered.length
  const start = (trackPagination.current - 1) * trackPagination.pageSize
  trackData.value = filtered.slice(start, start + trackPagination.pageSize)
}

function handleTrackSearch(keyword: string) {
  trackSearchKeyword.value = keyword
  trackPagination.current = 1
  applyTrackFilters()
}

function handleTrackFilter(filters: Record<string, unknown>) {
  trackFilterValues.value = filters
  trackPagination.current = 1
  applyTrackFilters()
}

function handleTrackReset() {
  trackSearchKeyword.value = ''
  trackFilterValues.value = {}
  trackPagination.current = 1
  applyTrackFilters()
}

function handleTrackPageChange(page: number) {
  trackPagination.current = page
  applyTrackFilters()
}

// --- 报告筛选逻辑 ---
function applyReportFilters() {
  let filtered = [...allReportData.value]
  if (reportSearchKeyword.value) {
    const kw = reportSearchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.title.toLowerCase().includes(kw))
  }
  if (reportFilterValues.value.type) {
    filtered = filtered.filter((item) => item.type === reportFilterValues.value.type)
  }
  reportPagination.total = filtered.length
  const start = (reportPagination.current - 1) * reportPagination.pageSize
  reportData.value = filtered.slice(start, start + reportPagination.pageSize)
}

function handleReportSearch(keyword: string) {
  reportSearchKeyword.value = keyword
  reportPagination.current = 1
  applyReportFilters()
}

function handleReportFilter(filters: Record<string, unknown>) {
  reportFilterValues.value = filters
  reportPagination.current = 1
  applyReportFilters()
}

function handleReportReset() {
  reportSearchKeyword.value = ''
  reportFilterValues.value = {}
  reportPagination.current = 1
  applyReportFilters()
}

function handleReportPageChange(page: number) {
  reportPagination.current = page
  applyReportFilters()
}

// --- 数据加载 ---
async function loadData() {
  trackLoading.value = true
  reportLoading.value = true
  try {
    const [tracks, reports] = await Promise.all([fetchTrackList(20), fetchReportList(10)])
    allTrackData.value = tracks as IntelligenceTrackItem[]
    allReportData.value = reports as IntelligenceReportItem[]
    applyTrackFilters()
    applyReportFilters()
  } finally {
    trackLoading.value = false
    reportLoading.value = false
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
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.content-tabs {
  :deep(.el-tabs__content) {
    padding: 0;
  }
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
