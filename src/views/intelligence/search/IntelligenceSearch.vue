<template>
  <div class="page-container">
    <PageHeader title="招商情报搜索" subtitle="全维度招商情报智能搜索" />

    <div class="search-hero">
      <el-input
        v-model="searchKeyword"
        placeholder="输入关键词搜索全部招商情报"
        size="large"
        clearable
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <el-tabs v-model="activeTab" class="result-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="资讯" name="news" />
      <el-tab-pane label="项目" name="project" />
      <el-tab-pane label="技术" name="tech" />
      <el-tab-pane label="资质" name="qualification" />
      <el-tab-pane label="资本" name="capital" />
    </el-tabs>

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ totalCount }} 条结果</span>
      </div>
      <el-table v-loading="loading" :data="pagedData" stripe border style="width: 100%">
        <el-table-column prop="title" label="名称" min-width="220" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" show-overflow-tooltip />
        <el-table-column prop="source" label="来源/机构" width="140" show-overflow-tooltip />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="dataType" label="类型" width="90">
          <template #default="{ row }">
            <el-tag :type="tagTypeMap[row.dataType]" size="small">{{ row.dataType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar
        :current="pagination.current"
        :total="totalCount"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
      />
    </div>

    <el-dialog v-model="detailVisible" title="情报详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="名称">{{ detailData.title }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ detailData.category }}</el-descriptions-item>
        <el-descriptions-item label="来源/机构">{{ detailData.source }}</el-descriptions-item>
        <el-descriptions-item label="日期">{{ detailData.date }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detailData.dataType }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import {
  fetchNewsList,
  fetchProjectList,
  fetchTechTransfers,
  fetchQualificationChanges,
  fetchCapitalList,
} from '@/api/modules/intelligenceApi'
import type {
  IntelligenceNews,
  IntelligenceProject,
  IntelligenceTechTransfer,
  IntelligenceQualification,
  IntelligenceCapital,
} from '@/api/mock/intelligence'

interface SearchRow {
  id: string
  title: string
  category: string
  source: string
  date: string
  dataType: string
}

const tagTypeMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  资讯: 'primary',
  项目: 'success',
  技术: 'warning',
  资质: 'info',
  资本: 'danger',
}

const searchKeyword = ref('')
const activeTab = ref('all')
const loading = ref(false)
const pagination = reactive({ current: 1, pageSize: 20 })

const allRows = ref<SearchRow[]>([])
const detailVisible = ref(false)
const detailData = ref<any>({})

function handleDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

function newsToRows(data: IntelligenceNews[]): SearchRow[] {
  return data.map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    source: d.source,
    date: d.publishDate,
    dataType: '资讯',
  }))
}

function projectsToRows(data: IntelligenceProject[]): SearchRow[] {
  return data.map((d) => ({
    id: d.id,
    title: d.name,
    category: d.industry,
    source: d.source,
    date: d.createDate,
    dataType: '项目',
  }))
}

function techToRows(data: IntelligenceTechTransfer[]): SearchRow[] {
  return data.map((d) => ({
    id: d.id,
    title: d.name,
    category: d.field,
    source: d.institution,
    date: '',
    dataType: '技术',
  }))
}

function qualToRows(data: IntelligenceQualification[]): SearchRow[] {
  return data.map((d) => ({
    id: d.id,
    title: d.enterprise,
    category: d.qualType,
    source: d.industry,
    date: d.date,
    dataType: '资质',
  }))
}

function capitalToRows(data: IntelligenceCapital[]): SearchRow[] {
  return data.map((d) => ({
    id: d.id,
    title: d.enterprise,
    category: d.type,
    source: d.investor,
    date: d.date,
    dataType: '资本',
  }))
}

const filteredRows = computed(() => {
  let rows = allRows.value

  if (activeTab.value !== 'all') {
    const typeMap: Record<string, string> = {
      news: '资讯',
      project: '项目',
      tech: '技术',
      qualification: '资质',
      capital: '资本',
    }
    const target = typeMap[activeTab.value]
    if (target) rows = rows.filter((r) => r.dataType === target)
  }

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(kw) ||
        r.category.toLowerCase().includes(kw) ||
        r.source.toLowerCase().includes(kw),
    )
  }

  return rows
})

const totalCount = computed(() => filteredRows.value.length)

const pagedData = computed(() => {
  const rows = filteredRows.value
  const start = (pagination.current - 1) * pagination.pageSize
  return rows.slice(start, start + pagination.pageSize)
})

async function loadData() {
  loading.value = true
  try {
    const [news, projects, tech, qual, capital] = await Promise.all([
      fetchNewsList(30),
      fetchProjectList(20),
      fetchTechTransfers(10),
      fetchQualificationChanges(10),
      fetchCapitalList(10),
    ])
    const rows = [
      ...newsToRows(news as IntelligenceNews[]),
      ...projectsToRows(projects as IntelligenceProject[]),
      ...techToRows(tech as IntelligenceTechTransfer[]),
      ...qualToRows(qual as IntelligenceQualification[]),
      ...capitalToRows(capital as IntelligenceCapital[]),
    ]
    allRows.value = rows
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
}

function handleTabChange() {
  pagination.current = 1
}

function handlePageChange(current: number, _pageSize: number) {
  pagination.current = current
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.search-hero {
  max-width: 720px;
  margin: 0 auto 24px;
}
.search-input {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
}
.result-tabs {
  margin-bottom: 20px;
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
