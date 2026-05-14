<template>
  <div class="page-container">
    <PageHeader title="衍生搜索" subtitle="基于锚点企业的衍生招商搜索">
      <template #actions>
        <el-button type="primary">搜索</el-button>
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
      <h4 class="panel-title">衍生企业搜索结果</h4>
      <div class="card-grid">
        <el-card v-for="item in results" :key="item.id" shadow="hover" class="result-card">
          <div class="result-card__header">
            <span class="result-card__name">{{ item.name }}</span>
            <span
              class="result-card__score"
              :style="{ color: item.matchScore >= 80 ? '#67C23A' : '#E6A23C' }"
            >
              {{ item.matchScore }}%
            </span>
          </div>
          <div class="result-card__body">
            <div class="result-card__row">
              <span class="label">行业</span>
              <span class="value">{{ item.industry }}</span>
            </div>
            <div class="result-card__row">
              <span class="label">区域</span>
              <span class="value">{{ item.region }}</span>
            </div>
            <div class="result-card__row">
              <span class="label">投资额</span>
              <span class="value">{{ item.investmentAmount.toLocaleString() }}万</span>
            </div>
          </div>
          <div class="result-card__footer">
            <el-tag v-for="tag in item.tags" :key="tag" size="small" style="margin-right: 4px">{{
              tag
            }}</el-tag>
          </div>
          <el-button type="primary" size="small" style="width: 100%; margin-top: 8px"
            >加入目标</el-button
          >
        </el-card>
      </div>
      <PaginationBar :current="1" :total="24" />
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
    key: 'relation',
    label: '关系类型',
    type: 'select',
    options: [
      { label: '供应商', value: '供应商' },
      { label: '客户', value: '客户' },
      { label: '合作伙伴', value: '合作伙伴' },
    ],
  },
]

const results = ref<any[]>([])

function handleSearch() {
  results.value = getMockTargets(8)
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
.panel-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.result-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.result-card__name {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.result-card__score {
  font-size: 16px;
  font-weight: $font-weight-bold;
}
.result-card__row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  font-size: 12px;
  .label {
    color: $text-secondary;
  }
  .value {
    color: $text-primary;
  }
}
.result-card__footer {
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid $border-color-lighter;
}
</style>
