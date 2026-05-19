<template>
  <div class="page-container">
    <PageHeader title="资源智能匹配" subtitle="资质企业资源智能匹配推荐" />

    <SearchFilterBar
      search-placeholder="请输入企业名称关键词"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div v-loading="loading" class="content-card">
      <el-table :data="filteredList" stripe border style="width: 100%">
        <el-table-column prop="enterpriseName" label="企业名称" min-width="160" />
        <el-table-column label="资质类型" width="100">
          <template #default="{ row }">
            <el-tag :type="qualTagType(row.qualificationType)" size="small">
              {{ qualTypeLabel(row.qualificationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="匹配资源" min-width="200">
          <template #default="{ row }">
            <div class="resource-tags">
              <el-tag
                v-for="res in row.matchResources"
                :key="res"
                size="small"
                type="info"
                effect="plain"
              >
                {{ res }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="匹配度" width="120" sortable :sort-method="sortByScore">
          <template #default="{ row }">
            <div class="match-score">
              <el-progress
                :percentage="row.matchScore"
                :stroke-width="8"
                :color="scoreColor(row.matchScore)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInfo" label="联系方式" width="150" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleContact(row)">
              联系
            </el-button>
            <el-button type="primary" link size="small" @click="handleDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <PaginationBar
      :current="pagination.current"
      :total="filteredList.length"
      :page-size="pagination.pageSize"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { fetchResourceMatches } from '@/api/modules/investApi'
import type { ResourceMatch, QualificationType } from '@/api/types/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'qualificationType',
    label: '资质类型',
    type: 'select',
    options: [
      { label: '技术资质', value: 'technology' },
      { label: '绿色资质', value: 'green' },
      { label: '质量资质', value: 'quality' },
    ],
  },
]

const loading = ref(false)
const dataList = ref<ResourceMatch[]>([])
const searchKeyword = ref('')
const filterValues = reactive<Record<string, unknown>>({})
const pagination = reactive({ current: 1, pageSize: 10 })

const filteredList = computed(() => {
  let list = [...dataList.value]
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter((item) => item.enterpriseName.toLowerCase().includes(kw))
  }
  if (filterValues.qualificationType) {
    list = list.filter((item) => item.qualificationType === filterValues.qualificationType)
  }
  return list
})

function qualTypeLabel(type: QualificationType) {
  const map: Record<QualificationType, string> = {
    technology: '技术',
    green: '绿色',
    quality: '质量',
  }
  return map[type] ?? type
}

function qualTagType(type: QualificationType) {
  const map: Record<QualificationType, string> = {
    technology: 'primary',
    green: 'success',
    quality: 'warning',
  }
  return (map[type] ?? 'info') as 'primary' | 'success' | 'warning' | 'info'
}

function scoreColor(score: number) {
  if (score >= 85) return '#67C23A'
  if (score >= 70) return '#1889E8'
  return '#E6A23C'
}

function sortByScore(a: ResourceMatch, b: ResourceMatch) {
  return a.matchScore - b.matchScore
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  pagination.current = 1
}

function handleFilter(filters: Record<string, unknown>) {
  Object.assign(filterValues, filters)
  pagination.current = 1
}

function handleReset() {
  searchKeyword.value = ''
  Object.keys(filterValues).forEach((k) => (filterValues[k] = undefined))
  pagination.current = 1
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
}

function handleContact(_row: ResourceMatch) {
  // 联系企业 - 预留
}

function handleDetail(_row: ResourceMatch) {
  // 查看详情 - 预留
}

async function loadData() {
  loading.value = true
  try {
    dataList.value = await fetchResourceMatches(20)
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

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.match-score {
  width: 100%;
}
</style>
