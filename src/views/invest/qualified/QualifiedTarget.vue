<template>
  <div class="page-container">
    <PageHeader title="资质企业目标" subtitle="资质企业招商目标筛选">
      <template #actions>
        <el-button type="primary">批量推荐</el-button>
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
      <el-table :data="targets" stripe border style="width: 100%">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="qualification" label="资质类型" width="160" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="validDate" label="有效期至" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '有效' ? 'success' : row.status === '即将到期' ? 'warning' : 'danger'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="primary" link size="small">推荐</el-button>
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
import { getMockQualifiedList } from '@/api/mock/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  { key: 'qualType', label: '资质类型', type: 'select', options: [
    { label: '高新技术企业', value: '高新技术企业' },
    { label: '专精特新', value: '专精特新' },
    { label: '科技型中小企业', value: '科技型中小企业' }
  ]},
  { key: 'status', label: '状态', type: 'select', options: [
    { label: '有效', value: '有效' },
    { label: '即将到期', value: '即将到期' },
    { label: '已过期', value: '已过期' }
  ]}
]

const targets = ref<any[]>([])

function handleSearch() {
  targets.value = getMockQualifiedList('高新技术企业')
}

onMounted(() => { handleSearch() })
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
