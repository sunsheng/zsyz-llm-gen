<template>
  <div class="page-container">
    <PageHeader title="榜单目标" subtitle="榜单企业招商目标筛选">
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
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="matchScore" label="匹配度" width="90">
          <template #default="{ row }">
            <span :style="{ color: row.matchScore >= 80 ? '#67C23A' : '#E6A23C', fontWeight: 600 }">{{ row.matchScore }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="investmentAmount" label="投资额(万)" width="120">
          <template #default="{ row }">{{ row.investmentAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 4px">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="primary" link size="small">推荐</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="1" :total="30" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockTargets } from '@/api/mock/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  { key: 'ranking', label: '榜单', type: 'select', options: [
    { label: '中国企业500强', value: '中国企业500强' },
    { label: '制造业单项冠军', value: '制造业单项冠军' },
    { label: '独角兽企业榜', value: '独角兽企业榜' }
  ]},
  { key: 'industry', label: '行业', type: 'select', options: [
    { label: '高端装备制造', value: '高端装备制造' },
    { label: '新材料', value: '新材料' },
    { label: '生物医药', value: '生物医药' }
  ]}
]

const targets = ref<any[]>([])

function handleSearch() {
  targets.value = getMockTargets(10)
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
