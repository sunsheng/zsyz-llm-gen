<template>
  <div class="page-container">
    <PageHeader title="目标筛选" subtitle="精准招商目标企业筛选">
      <template #actions>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <el-table :data="targets" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="160" />
        <el-table-column prop="industry" label="所属行业" width="140" />
        <el-table-column prop="region" label="所在区域" width="120" />
        <el-table-column prop="chainPosition" label="链上位置" width="140" />
        <el-table-column prop="matchScore" label="匹配度" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.matchScore >= 80 ? '#67C23A' : row.matchScore >= 60 ? '#E6A23C' : '#F56C6C', fontWeight: 600 }">
              {{ row.matchScore }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="investmentAmount" label="投资额(万)" width="120">
          <template #default="{ row }">
            {{ row.investmentAmount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status) as any" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" min-width="180">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 4px">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="primary" link size="small">跟进</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="pagination.current" :total="pagination.total" @change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockTargets } from '@/api/mock/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  { key: 'industry', label: '行业', type: 'select', options: [
    { label: '高端装备制造', value: '高端装备制造' },
    { label: '新材料', value: '新材料' },
    { label: '生物医药', value: '生物医药' },
    { label: '电子信息', value: '电子信息' },
    { label: '新能源', value: '新能源' }
  ]},
  { key: 'region', label: '区域', type: 'select', options: [
    { label: '北京市', value: '北京市' },
    { label: '上海市', value: '上海市' },
    { label: '深圳市', value: '深圳市' },
    { label: '广州市', value: '广州市' }
  ]},
  { key: 'status', label: '状态', type: 'select', options: [
    { label: '待接触', value: '待接触' },
    { label: '已接触', value: '已接触' },
    { label: '洽谈中', value: '洽谈中' },
    { label: '已签约', value: '已签约' }
  ]}
]

const targets = ref<any[]>([])
const pagination = reactive({ current: 1, total: 0 })

function statusTagType(status: string) {
  const map: Record<string, string> = { '待接触': 'info', '已接触': '', '洽谈中': 'warning', '已签约': 'success' }
  return map[status] || ''
}

function handleSearch() {
  targets.value = getMockTargets(12)
  pagination.total = 48
}

function handleFilter() {
  handleSearch()
}

function handleReset() {
  pagination.current = 1
  handleSearch()
}

function handlePageChange(page: number) {
  pagination.current = page
  handleSearch()
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.content-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
