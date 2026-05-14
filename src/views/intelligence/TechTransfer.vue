<template>
  <div class="page-container">
    <PageHeader title="技术转移" subtitle="技术成果转移转化信息">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入技术名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="card-grid">
      <el-card v-for="item in techList" :key="item.id" shadow="hover" class="tech-card">
        <div class="tech-card__header">
          <h4 class="tech-card__name">{{ item.name }}</h4>
          <el-tag :type="statusTag(item.status)" size="small">{{
            statusLabel(item.status)
          }}</el-tag>
        </div>
        <div class="tech-card__body">
          <div class="tech-card__row">
            <span class="label">领域</span>
            <span class="value">{{ item.field }}</span>
          </div>
          <div class="tech-card__row">
            <span class="label">转移方式</span>
            <span class="value">{{ item.transferType }}</span>
          </div>
          <div class="tech-card__row">
            <span class="label">专利号</span>
            <span class="value">{{ item.patentNo }}</span>
          </div>
          <div class="tech-card__row">
            <span class="label">价格</span>
            <span class="value" style="font-weight: 600; color: #1889e8"
              >{{ item.price.toLocaleString() }}万</span
            >
          </div>
          <div class="tech-card__row">
            <span class="label">机构</span>
            <span class="value">{{ item.institution }}</span>
          </div>
        </div>
        <el-button type="primary" size="small" style="width: 100%; margin-top: 8px"
          >了解详情</el-button
        >
      </el-card>
    </div>
    <PaginationBar :current="1" :total="18" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockTechTransfers } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
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
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '可转让', value: 'available' },
      { label: '洽谈中', value: 'negotiating' },
      { label: '已转让', value: 'transferred' },
    ],
  },
]

const techList = ref<any[]>([])

function statusTag(status: string) {
  return status === 'available' ? 'success' : status === 'negotiating' ? 'warning' : 'info'
}

function statusLabel(status: string) {
  return status === 'available' ? '可转让' : status === 'negotiating' ? '洽谈中' : '已转让'
}

function handleSearch() {
  techList.value = getMockTechTransfers(8)
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.tech-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}
.tech-card__name {
  flex: 1;
  margin: 0;
  margin-right: 8px;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.tech-card__row {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 13px;
  .label {
    color: $text-secondary;
  }
  .value {
    color: $text-primary;
  }
}
</style>
