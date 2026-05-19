<template>
  <div class="page-container">
    <PageHeader title="政策汇编" subtitle="产业相关政策法规汇总与分类整理">
      <template #actions>
        <el-button type="primary" @click="handleAdd">新增政策</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索政策名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="table-section">
      <el-table :data="pagedData" stripe border style="width: 100%">
        <el-table-column prop="title" label="政策名称" min-width="240" />
        <el-table-column prop="department" label="发布部门" width="160" />
        <el-table-column prop="level" label="政策层级" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === '国家级' ? 'danger' : 'info'" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="policyType" label="政策类型" width="160" />
        <el-table-column prop="publishDate" label="发布日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '现行' ? 'success' : 'info'" size="small">{{
              row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <a :href="row.url" target="_blank" rel="noopener noreferrer" class="policy-link"
              >查看</a
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <PaginationBar :current="currentPage" :total="filteredData.length" @change="handlePageChange" />

    <!-- 新增政策弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增政策" width="560px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="政策名称" required>
          <el-input v-model="addForm.title" placeholder="请输入政策名称" />
        </el-form-item>
        <el-form-item label="发布部门" required>
          <el-select v-model="addForm.department" style="width: 100%">
            <el-option label="国务院" value="国务院" />
            <el-option label="工信部" value="工信部" />
            <el-option label="发改委" value="发改委" />
            <el-option label="科技部" value="科技部" />
            <el-option label="财政部" value="财政部" />
            <el-option label="商务部" value="商务部" />
          </el-select>
        </el-form-item>
        <el-form-item label="政策层级" required>
          <el-radio-group v-model="addForm.level">
            <el-radio value="国家级">国家级</el-radio>
            <el-radio value="市区级">市区级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="政策类型" required>
          <el-select v-model="addForm.policyType" style="width: 100%">
            <el-option label="产业发展规划政策" value="产业发展规划政策" />
            <el-option label="产业扶持政策" value="产业扶持政策" />
            <el-option label="人才引进政策" value="人才引进政策" />
            <el-option label="住房保障政策" value="住房保障政策" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="addForm.publishDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="addForm.status">
            <el-radio value="现行">现行</el-radio>
            <el-radio value="废止">废止</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePolicy">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { fetchPolicyCompilation } from '@/api/modules/dynamicsApi'
import type { DynamicsPolicy } from '@/api/types/dynamics'

interface KpiCardData {
  key: string
  label: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'flat'
  trendValue: string
  icon: string
  iconColor: string
  iconBgColor: string
}

const filterFields = [
  {
    key: 'level',
    label: '政策层级',
    type: 'select' as const,
    options: [
      { label: '国家级', value: '国家级' },
      { label: '市区级', value: '市区级' },
    ],
  },
  {
    key: 'policyType',
    label: '政策类型',
    type: 'select' as const,
    options: [
      { label: '产业发展规划政策', value: '产业发展规划政策' },
      { label: '产业扶持政策', value: '产业扶持政策' },
      { label: '人才引进政策', value: '人才引进政策' },
      { label: '住房保障政策', value: '住房保障政策' },
    ],
  },
]

const kpiCards = ref<KpiCardData[]>([])
const allData = ref<DynamicsPolicy[]>([])
const keyword = ref('')
const levelFilter = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const pageSize = 10

const addDialogVisible = ref(false)
const addForm = reactive({
  title: '',
  department: '工信部',
  level: '国家级',
  policyType: '产业发展规划政策',
  publishDate: '',
  status: '现行',
})

const filteredData = computed(() => {
  return allData.value.filter((d) => {
    const matchName = !keyword.value || d.title.includes(keyword.value)
    const matchLevel = !levelFilter.value || d.level === levelFilter.value
    const matchType = !typeFilter.value || d.policyType === typeFilter.value
    return matchName && matchLevel && matchType
  })
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

async function loadData() {
  const data = await fetchPolicyCompilation()
  kpiCards.value = data.kpiCards as KpiCardData[]
  allData.value = data.policyList
}

function handleSearch(kw: string) {
  keyword.value = kw
  currentPage.value = 1
}

function handleFilter(filters: Record<string, unknown>) {
  levelFilter.value = (filters.level as string) || ''
  typeFilter.value = (filters.policyType as string) || ''
  currentPage.value = 1
}

function handleReset() {
  keyword.value = ''
  levelFilter.value = ''
  typeFilter.value = ''
  currentPage.value = 1
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleAdd() {
  Object.assign(addForm, {
    title: '',
    department: '工信部',
    level: '国家级',
    policyType: '产业发展规划政策',
    publishDate: new Date().toISOString().slice(0, 10),
    status: '现行',
  })
  addDialogVisible.value = true
}

function handleSavePolicy() {
  if (!addForm.title) {
    ElMessage.warning('请输入政策名称')
    return
  }
  allData.value.unshift({
    id: Date.now(),
    title: addForm.title,
    department: addForm.department,
    level: addForm.level as any,
    policyType: addForm.policyType as any,
    publishDate: addForm.publishDate || new Date().toISOString().slice(0, 10),
    status: addForm.status as any,
    url: `https://example.com/policy/${Date.now()}`,
  })
  addDialogVisible.value = false
  currentPage.value = 1
  ElMessage.success('新增成功')
}

onMounted(() => {
  loadData()
})
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
.table-section {
  padding: 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.policy-link {
  font-size: 14px;
  color: $color-primary;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
