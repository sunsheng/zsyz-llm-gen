<template>
  <div class="page-container">
    <PageHeader title="人才流动" subtitle="产业核心人才流动监控">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入人才姓名"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="talent-list">
      <el-card v-for="item in talentList" :key="item.id" shadow="hover" class="talent-card">
        <div class="talent-card__header">
          <div>
            <span class="talent-card__name">{{ item.name }}</span>
            <span class="talent-card__title">{{ item.title }}</span>
          </div>
          <el-tag :type="levelTag(item.level) as any" size="small">{{ item.level }}</el-tag>
        </div>
        <div class="talent-card__flow">
          <span class="talent-card__from">{{ item.fromCompany }}</span>
          <el-icon :size="16" color="#1889E8"><Right /></el-icon>
          <span class="talent-card__to">{{ item.toCompany }}</span>
        </div>
        <div class="talent-card__footer">
          <span class="talent-card__field">{{ item.field }}</span>
          <span class="talent-card__date">{{ item.moveDate }}</span>
        </div>
      </el-card>
    </div>
    <PaginationBar :current="1" :total="18" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Right } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockTalentList } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'level',
    label: '层级',
    type: 'select',
    options: [
      { label: '高管', value: '高管' },
      { label: '技术骨干', value: '技术骨干' },
      { label: '核心研发', value: '核心研发' },
    ],
  },
  {
    key: 'field',
    label: '领域',
    type: 'select',
    options: [
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
    ],
  },
]

const talentList = ref<any[]>([])

function levelTag(level: string) {
  return level === '高管' ? 'danger' : level === '技术骨干' ? 'warning' : ''
}

function handleSearch() {
  talentList.value = getMockTalentList(8)
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.talent-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.talent-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.talent-card__name {
  margin-right: 8px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.talent-card__title {
  font-size: 12px;
  color: $text-secondary;
}
.talent-card__flow {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}
.talent-card__from {
  font-weight: $font-weight-medium;
  color: $text-primary;
}
.talent-card__to {
  font-weight: $font-weight-medium;
  color: #1889e8;
}
.talent-card__footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $text-secondary;
}
</style>
