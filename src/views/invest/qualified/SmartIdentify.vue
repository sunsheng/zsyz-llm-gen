<template>
  <div class="page-container">
    <PageHeader title="资质企业智能识别" subtitle="资质企业智能识别与筛选" />

    <SearchFilterBar
      search-placeholder="请输入企业名称/资质名关键词"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <!-- 结果操作栏 -->
    <div class="result-bar">
      <span class="result-bar__count"
        >共 <b>{{ filteredList.length }}</b> 家资质企业</span
      >
      <div class="result-bar__right">
        <el-select v-model="sortField" size="small" style="width: 140px" @change="applySort">
          <el-option label="默认排序" value="" />
          <el-option label="资质等级" value="level" />
        </el-select>
        <el-button-group>
          <el-button
            :type="viewMode === 'card' ? 'primary' : 'default'"
            size="small"
            @click="viewMode = 'card'"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button
            :type="viewMode === 'table' ? 'primary' : 'default'"
            size="small"
            @click="viewMode = 'table'"
          >
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 卡片视图 -->
    <div v-if="viewMode === 'card'" v-loading="loading" class="card-grid">
      <div v-for="item in pagedList" :key="item.id" class="qual-card" @click="handleView(item)">
        <div class="qual-card__header">
          <h4 class="qual-card__name">{{ item.name }}</h4>
          <el-tag :type="levelTagType(item.qualificationLevel)" size="small">
            {{ levelLabel(item.qualificationLevel) }}
          </el-tag>
        </div>
        <div class="qual-card__body">
          <div class="qual-card__row">
            <span class="qual-card__label">行业</span>
            <span class="qual-card__value">{{ item.industry }}</span>
          </div>
          <div class="qual-card__row">
            <span class="qual-card__label">资质类型</span>
            <span class="qual-card__value">{{ qualTypeLabel(item.qualificationType) }}</span>
          </div>
          <div class="qual-card__row">
            <span class="qual-card__label">资质名称</span>
            <span class="qual-card__value">{{ item.qualificationName }}</span>
          </div>
        </div>
        <div class="qual-card__footer">
          <div class="qual-card__tags">
            <EnterpriseTag
              v-for="tag in item.tags?.slice(0, 3)"
              :key="tag"
              :text="tag"
              type="qualify"
            />
          </div>
          <el-link type="primary" underline="never" @click="handleDetail(item)">查看详情</el-link>
        </div>
      </div>
    </div>

    <!-- 表格视图 -->
    <div v-else v-loading="loading" class="content-card">
      <el-table :data="pagedList" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="160" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column label="资质类型" width="100">
          <template #default="{ row }">
            {{ qualTypeLabel(row.qualificationType) }}
          </template>
        </el-table-column>
        <el-table-column prop="qualificationName" label="资质名称" min-width="140" />
        <el-table-column label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="levelTagType(row.qualificationLevel)" size="small">
              {{ levelLabel(row.qualificationLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="160">
          <template #default="{ row }">
            <EnterpriseTag
              v-for="tag in row.tags?.slice(0, 3)"
              :key="tag"
              :text="tag"
              type="qualify"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
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

    <!-- 企业详情弹窗 -->
    <el-dialog v-model="detailVisible" title="企业详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="企业名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="行业">{{ detailData.industry }}</el-descriptions-item>
        <el-descriptions-item label="所属区域">{{ detailData.region }}</el-descriptions-item>
        <el-descriptions-item label="资质类型">{{
          qualTypeLabel(detailData.qualificationType)
        }}</el-descriptions-item>
        <el-descriptions-item label="资质名称">{{
          detailData.qualificationName
        }}</el-descriptions-item>
        <el-descriptions-item label="资质等级">{{
          levelLabel(detailData.qualificationLevel)
        }}</el-descriptions-item>
        <el-descriptions-item v-if="detailData.tags?.length" label="标签" :span="2">
          {{ detailData.tags?.join('、') }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Grid, List } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import EnterpriseTag from '@/components/business/EnterpriseTag.vue'
import { fetchQualifiedEnterprisesList } from '@/api/modules/investApi'
import type { QualifiedEnterprise, QualificationType, QualificationLevel } from '@/api/types/invest'
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
  {
    key: 'qualificationLevel',
    label: '资质等级',
    type: 'select',
    options: [
      { label: '国家级', value: 'national' },
      { label: '省级', value: 'provincial' },
    ],
  },
  {
    key: 'industry',
    label: '行业',
    type: 'select',
    options: [
      { label: '电子信息', value: '电子信息' },
      { label: '装备制造', value: '装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
      { label: '新能源', value: '新能源' },
    ],
  },
]

const loading = ref(false)
const dataList = ref<QualifiedEnterprise[]>([])
const viewMode = ref<'card' | 'table'>('card')
const sortField = ref('')
const searchKeyword = ref('')
const filterValues = reactive<Record<string, unknown>>({})

const pagination = reactive({ current: 1, pageSize: 12 })

const filteredList = computed(() => {
  let list = [...dataList.value]
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) || item.qualificationName.toLowerCase().includes(kw),
    )
  }
  if (filterValues.qualificationType) {
    list = list.filter((item) => item.qualificationType === filterValues.qualificationType)
  }
  if (filterValues.qualificationLevel) {
    list = list.filter((item) => item.qualificationLevel === filterValues.qualificationLevel)
  }
  if (filterValues.industry) {
    list = list.filter((item) => item.industry === filterValues.industry)
  }
  if (sortField.value === 'level') {
    const order: Record<string, number> = { national: 0, provincial: 1 }
    list.sort((a, b) => order[a.qualificationLevel] - order[b.qualificationLevel])
  }
  return list
})

const pagedList = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return filteredList.value.slice(start, start + pagination.pageSize)
})

function qualTypeLabel(type: QualificationType) {
  const map: Record<QualificationType, string> = {
    technology: '技术',
    green: '绿色',
    quality: '质量',
  }
  return map[type] ?? type
}

function levelLabel(level: QualificationLevel) {
  const map: Record<QualificationLevel, string> = { national: '国家级', provincial: '省级' }
  return map[level] ?? level
}

function levelTagType(level: QualificationLevel) {
  return level === 'national' ? 'danger' : 'warning'
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

function applySort() {
  pagination.current = 1
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
}

const detailVisible = ref(false)
const detailData = ref<any>({})

function handleDetail(item: any) {
  detailData.value = item
  detailVisible.value = true
}

function handleView(_item: QualifiedEnterprise) {
  // 查看详情 - 由 handleDetail 处理
}

async function loadData() {
  loading.value = true
  try {
    dataList.value = await fetchQualifiedEnterprisesList(30)
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

.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.result-bar__count {
  font-size: $font-size-base;
  color: $text-secondary;

  b {
    font-weight: $font-weight-bold;
    color: $color-primary;
  }
}

.result-bar__right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 16px;
}

.qual-card {
  padding: 20px;
  cursor: pointer;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.qual-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.qual-card__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
}

.qual-card__body {
  margin-bottom: 12px;
}

.qual-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  font-size: $font-size-sm;
}

.qual-card__label {
  color: $text-secondary;
}

.qual-card__value {
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.qual-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid $border-color-lighter;
}

.qual-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
