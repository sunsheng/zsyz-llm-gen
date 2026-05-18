<template>
  <div class="page-container">
    <PageHeader title="关联企业" subtitle="产业链关联企业匹配">
      <template #actions>
        <el-input v-model="searchKey" placeholder="搜索企业名称" style="width: 240px" clearable>
          <template #prefix
            ><el-icon><Search /></el-icon
          ></template>
        </el-input>
        <el-select v-model="filterSegment" placeholder="产业链环节" clearable style="width: 160px">
          <el-option v-for="s in segments" :key="s" :label="s" :value="s" />
        </el-select>
      </template>
    </PageHeader>

    <div class="table-section">
      <el-table :data="pagedData" stripe border style="width: 100%" @row-click="handleRowClick">
        <el-table-column prop="name" label="企业名称" min-width="200" />
        <el-table-column prop="segment" label="产业链环节" width="160" />
        <el-table-column prop="industry" label="所属行业" width="160" />
        <el-table-column prop="region" label="所在区域" width="120" />
        <el-table-column prop="capital" label="注册资本(万)" width="140" />
        <el-table-column prop="matchScore" label="匹配度" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.matchScore"
              :color="row.matchScore >= 80 ? '#67C23A' : '#1889E8'"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="handleDetail(row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <PaginationBar :current="currentPage" :total="filteredData.length" @change="handlePageChange" />

    <el-drawer v-model="drawerVisible" title="企业详情" size="480px">
      <template v-if="currentEnterprise">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="企业名称">{{ currentEnterprise.name }}</el-descriptions-item>
          <el-descriptions-item label="产业链环节">{{
            currentEnterprise.segment
          }}</el-descriptions-item>
          <el-descriptions-item label="所属行业">{{
            currentEnterprise.industry
          }}</el-descriptions-item>
          <el-descriptions-item label="所在区域">{{
            currentEnterprise.region
          }}</el-descriptions-item>
          <el-descriptions-item label="注册资本"
            >{{ currentEnterprise.capital }}万元</el-descriptions-item
          >
          <el-descriptions-item label="匹配度"
            >{{ currentEnterprise.matchScore }}%</el-descriptions-item
          >
          <el-descriptions-item label="联系人">{{
            currentEnterprise.contact
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            currentEnterprise.phone
          }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { fetchRelatedEnterprises } from '@/api/modules/analysisApi'
import type { RelatedEnterprise } from '@/api/types/analysis'

const segments = ref<string[]>([])
const tableData = ref<RelatedEnterprise[]>([])
const searchKey = ref('')
const filterSegment = ref('')
const currentPage = ref(1)
const pageSize = 10
const drawerVisible = ref(false)
const currentEnterprise = ref<RelatedEnterprise | null>(null)

const filteredData = computed(() => {
  return tableData.value.filter((row) => {
    const matchName = !searchKey.value || row.name.includes(searchKey.value)
    const matchSegment = !filterSegment.value || row.segment === filterSegment.value
    return matchName && matchSegment
  })
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

async function loadData() {
  const data = await fetchRelatedEnterprises()
  segments.value = data.segments
  tableData.value = data.enterprises
}

function handleRowClick(row: RelatedEnterprise) {
  handleDetail(row)
}

function handleDetail(row: RelatedEnterprise) {
  currentEnterprise.value = row
  drawerVisible.value = true
}

function handlePageChange(page: number) {
  currentPage.value = page
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.table-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
