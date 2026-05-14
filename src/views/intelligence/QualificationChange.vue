<template>
  <div class="page-container">
    <PageHeader title="资质变动" subtitle="企业资质认定变动监控">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="content-card">
      <el-table :data="qualList" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业名称" min-width="120" />
        <el-table-column prop="qualType" label="资质类型" width="160" />
        <el-table-column prop="changeType" label="变动类型" width="100">
          <template #default="{ row }">
            <el-tag :type="changeTag(row.changeType) as any" size="small">{{
              row.changeType
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="变动日期" width="120" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="detail" label="详情" min-width="160" />
        <el-table-column label="操作" width="100">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="1" :total="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockQualificationChanges } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'qualType',
    label: '资质类型',
    type: 'select',
    options: [
      { label: '高新技术企业', value: '高新技术企业' },
      { label: '专精特新', value: '专精特新' },
      { label: '科技型中小企业', value: '科技型中小企业' },
    ],
  },
  {
    key: 'changeType',
    label: '变动类型',
    type: 'select',
    options: [
      { label: '新增', value: '新增' },
      { label: '升级', value: '升级' },
      { label: '到期', value: '到期' },
      { label: '撤销', value: '撤销' },
    ],
  },
]

const qualList = ref<any[]>([])

function changeTag(type: string) {
  const map: Record<string, string> = { 新增: 'success', 升级: '', 到期: 'warning', 撤销: 'danger' }
  return map[type] || ''
}

function handleSearch() {
  qualList.value = getMockQualificationChanges(10)
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
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
