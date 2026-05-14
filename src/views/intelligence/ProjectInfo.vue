<template>
  <div class="page-container">
    <PageHeader title="项目信息" subtitle="招商项目动态跟踪">
      <template #actions>
        <el-button type="primary">新增项目</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入项目名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="content-card">
      <el-table :data="projectList" stripe border style="width: 100%">
        <el-table-column prop="name" label="项目名称" min-width="200" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="investmentAmount" label="投资额(万)" width="130">
          <template #default="{ row }">{{ row.investmentAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="stage" label="阶段" width="80">
          <template #default="{ row }">
            <el-tag :type="stageTag(row.stage) as any" size="small">{{ row.stage }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="contactPerson" label="联系人" width="90" />
        <el-table-column prop="createDate" label="创建日期" width="120" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">跟进</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="1" :total="25" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockProjectList } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'industry',
    label: '行业',
    type: 'select',
    options: [
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
    ],
  },
  {
    key: 'stage',
    label: '阶段',
    type: 'select',
    options: [
      { label: '意向', value: '意向' },
      { label: '对接', value: '对接' },
      { label: '谈判', value: '谈判' },
      { label: '签约', value: '签约' },
      { label: '落地', value: '落地' },
    ],
  },
]

const projectList = ref<any[]>([])

function stageTag(stage: string) {
  const map: Record<string, string> = {
    意向: 'info',
    对接: '',
    谈判: 'warning',
    签约: 'success',
    落地: 'success',
  }
  return map[stage] || ''
}

function handleSearch() {
  projectList.value = getMockProjectList(10)
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
