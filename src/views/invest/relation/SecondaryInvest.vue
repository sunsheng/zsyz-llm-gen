<template>
  <div class="page-container">
    <PageHeader title="二级关联招商" subtitle="二级关联企业招商推荐" />

    <SearchFilterBar
      search-placeholder="搜索企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div v-loading="loading" class="content-card">
      <el-table :data="pagedData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="160" />
        <el-table-column prop="industry" label="行业" width="140" />
        <el-table-column prop="relationPath" label="关系路径" min-width="200" />
        <el-table-column prop="relationType" label="关系类型" width="100">
          <template #default="{ row }">
            <el-tag :type="relationTagType(row.relationType) as any" size="small">
              {{ row.relationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="matchScore" label="匹配度" width="140">
          <template #default="{ row }">
            <el-progress
              :percentage="row.matchScore"
              :stroke-width="8"
              :color="
                row.matchScore >= 85 ? '#67C23A' : row.matchScore >= 70 ? '#1889E8' : '#E6A23C'
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="contactStatus" label="联系状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.contactStatus) as any" size="small">
              {{ statusLabel(row.contactStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="success" link size="small" @click="handleContact(row)">联系</el-button>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchSecondaryRelations } from '@/api/modules/investApi'
import type { SecondaryRelation, InvestStatus } from '@/api/types/invest'

const loading = ref(false)
const allData = ref<SecondaryRelation[]>([])
const filteredData = ref<SecondaryRelation[]>([])
const searchKeyword = ref('')
const filterValues = reactive<Record<string, any>>({})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const filters: FilterField[] = [
  {
    key: 'relationType',
    label: '关系类型',
    type: 'select',
    options: [
      { label: '供应', value: '供应' },
      { label: '投资', value: '投资' },
      { label: '合作', value: '合作' },
      { label: '竞争', value: '竞争' },
      { label: '人才', value: '人才' },
    ],
  },
  {
    key: 'matchScore',
    label: '匹配度',
    type: 'select',
    options: [
      { label: '90分以上', value: '90' },
      { label: '80-90分', value: '80' },
      { label: '70-80分', value: '70' },
    ],
  },
  {
    key: 'contactStatus',
    label: '联系状态',
    type: 'select',
    options: [
      { label: '目标锁定', value: 'targeting' },
      { label: '初步联系', value: 'contacting' },
      { label: '深度洽谈', value: 'negotiating' },
      { label: '已签约', value: 'signed' },
      { label: '已流失', value: 'lost' },
    ],
  },
]

const pagedData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function relationTagType(type: string): '' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    供应: 'primary',
    投资: 'success',
    合作: '',
    竞争: 'danger',
    人才: 'warning',
  }
  return map[type] || ''
}

function statusLabel(status: InvestStatus): string {
  const map: Record<InvestStatus, string> = {
    targeting: '目标锁定',
    contacting: '初步联系',
    negotiating: '深度洽谈',
    signed: '已签约',
    lost: '已流失',
  }
  return map[status] || status
}

function statusTagType(
  status: InvestStatus,
): '' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<InvestStatus, '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    targeting: 'info',
    contacting: '',
    negotiating: 'warning',
    signed: 'success',
    lost: 'danger',
  }
  return map[status] || ''
}

function applyFilters() {
  let result = [...allData.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    result = result.filter((item) => item.name.toLowerCase().includes(kw))
  }

  if (filterValues.relationType) {
    result = result.filter((item) => item.relationType === filterValues.relationType)
  }

  if (filterValues.matchScore) {
    const minScore = Number(filterValues.matchScore)
    result = result.filter((item) => item.matchScore >= minScore)
  }

  if (filterValues.contactStatus) {
    result = result.filter((item) => item.contactStatus === filterValues.contactStatus)
  }

  filteredData.value = result
  pagination.total = result.length
  pagination.current = 1
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  applyFilters()
}

function handleFilter(filters: Record<string, unknown>) {
  Object.assign(filterValues, filters)
  applyFilters()
}

function handleReset() {
  searchKeyword.value = ''
  Object.keys(filterValues).forEach((key) => {
    filterValues[key] = undefined
  })
  applyFilters()
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
}

function handleView(row: SecondaryRelation) {
  ElMessage.info(`查看企业: ${row.name}`)
}

function handleContact(row: SecondaryRelation) {
  ElMessage.success(`已发起联系: ${row.name}`)
}

async function loadData() {
  loading.value = true
  try {
    allData.value = await fetchSecondaryRelations(30)
    applyFilters()
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

.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
