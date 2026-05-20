<template>
  <div class="page-container">
    <PageHeader title="我的招商情报" subtitle="个性化招商情报订阅与收藏" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="region-card">
      <h4 class="region-card__title">区域概况 — 凯州新城</h4>
      <div class="region-card__grid">
        <div class="region-card__item">
          <span class="region-card__label">所属区域</span>
          <span class="region-card__value">德阳·凯州新城</span>
        </div>
        <div class="region-card__item">
          <span class="region-card__label">主导产业</span>
          <span class="region-card__value">高端装备制造、新材料、电子信息</span>
        </div>
        <div class="region-card__item">
          <span class="region-card__label">企业情报</span>
          <span class="region-card__value region-card__value--primary">32条</span>
        </div>
        <div class="region-card__item">
          <span class="region-card__label">风险预警</span>
          <span class="region-card__value region-card__value--danger">5条</span>
        </div>
      </div>
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
                <div style="display: flex; flex-wrap: wrap; gap: 4px">
                  <el-tag :type="trackTypeMap[row.trackType]" size="small">
                    {{ row.trackType }}
                  </el-tag>
                  <el-tag v-if="row.riskWarning" type="danger" size="small"> 风险预警 </el-tag>
                </div>
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
            <el-table-column
              prop="regionFeature"
              label="区域特点"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="riskWarning"
              label="风险预警"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span v-if="row.riskWarning" style="color: #f2637b">{{ row.riskWarning }}</span>
                <span v-else style="color: #4ecb73">暂无风险</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleViewTrack(row)"
                  >查看</el-button
                >
                <el-button type="danger" link size="small" @click="handleCancelTrack(row)"
                  >取消</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <PaginationBar
            :current="trackPagination.current"
            :total="trackPagination.total"
            :page-size="trackPagination.pageSize"
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
              <template #default="{ row }">
                <el-button link size="small" @click="handlePreviewReport(row)">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationBar
            :current="reportPagination.current"
            :total="reportPagination.total"
            :page-size="reportPagination.pageSize"
            @change="handleReportPageChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 追踪详情弹窗 -->
    <el-dialog v-model="trackDetailVisible" title="追踪详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="追踪目标">{{
          trackDetailData.targetName
        }}</el-descriptions-item>
        <el-descriptions-item label="追踪类型">{{
          trackDetailData.trackType
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ trackDetailData.status }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          trackDetailData.updateTime
        }}</el-descriptions-item>
        <el-descriptions-item label="区域特点">{{
          trackDetailData.regionFeature || '—'
        }}</el-descriptions-item>
        <el-descriptions-item label="风险预警">{{
          trackDetailData.riskWarning || '暂无风险'
        }}</el-descriptions-item>
        <el-descriptions-item label="进度" :span="2">
          <el-progress :percentage="trackDetailData.progress" :stroke-width="8" />
        </el-descriptions-item>
        <el-descriptions-item v-if="trackDetailData.keyEvents?.length" label="关键事件" :span="2">
          {{ trackDetailData.keyEvents?.join('、') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 报告预览弹窗 -->
    <el-dialog v-model="reportPreviewVisible" title="报告预览" width="960px">
      <template v-if="reportPreviewData">
        <el-descriptions :column="2" border size="small" style="margin-bottom: 16px">
          <el-descriptions-item label="报告标题">{{
            reportPreviewData.title
          }}</el-descriptions-item>
          <el-descriptions-item label="报告类型">{{ reportPreviewData.type }}</el-descriptions-item>
          <el-descriptions-item label="作者/部门">{{
            reportPreviewData.author
          }}</el-descriptions-item>
          <el-descriptions-item label="创建日期">{{
            reportPreviewData.createDate
          }}</el-descriptions-item>
        </el-descriptions>
        <div style="padding: 16px; line-height: 1.8; background: #f5f7fa; border-radius: 8px">
          {{ reportPreviewData.summary }}
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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

// --- 详情弹窗 ---
const trackDetailVisible = ref(false)
const trackDetailData = ref<any>({})
const reportPreviewVisible = ref(false)
const reportPreviewData = ref<any>({})

function handleViewTrack(row: any) {
  trackDetailData.value = row
  trackDetailVisible.value = true
}

function handleCancelTrack(row: any) {
  ElMessageBox.confirm('确认取消追踪该情报？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const idx = allTrackData.value.findIndex((item) => item.id === row.id)
      if (idx > -1) {
        allTrackData.value.splice(idx, 1)
      }
      applyTrackFilters()
      ElMessage.success('已取消追踪')
    })
    .catch(() => {})
}

function handlePreviewReport(row: any) {
  reportPreviewData.value = row
  reportPreviewVisible.value = true
}

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

function handleTrackPageChange(current: number, pageSize: number) {
  trackPagination.current = current
  trackPagination.pageSize = pageSize
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

function handleReportPageChange(current: number, pageSize: number) {
  reportPagination.current = current
  reportPagination.pageSize = pageSize
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
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.region-card {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.region-card__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.region-card__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.region-card__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.region-card__label {
  font-size: 13px;
  color: $text-secondary;
}
.region-card__value {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}
.region-card__value--primary {
  color: #1889e8;
}
.region-card__value--danger {
  color: #f2637b;
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
