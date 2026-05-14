<template>
  <div class="page-container">
    <PageHeader title="周边搜索" subtitle="基于地理位置的周边企业搜索">
      <template #actions>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </template>
    </PageHeader>

    <div class="map-layout">
      <div class="map-area">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="15" />
      </div>
      <div class="sidebar">
        <div class="search-section">
          <SearchFilterBar
            search-placeholder="搜索周边企业"
            :filters="filters"
            @search="handleSearch"
            @filter="handleSearch"
            @reset="handleSearch"
          />
        </div>
        <div class="result-section">
          <h4 class="section-title">搜索结果 ({{ results.length }})</h4>
          <div class="result-list">
            <el-card v-for="item in results" :key="item.id" shadow="hover" class="result-card">
              <div class="result-card__header">
                <span class="result-card__name">{{ item.name }}</span>
                <span class="result-card__distance">{{ item.distance }}km</span>
              </div>
              <div class="result-card__body">
                <div class="result-card__row">
                  <span class="label">行业</span>
                  <span class="value">{{ item.industry }}</span>
                </div>
                <div class="result-card__row">
                  <span class="label">投资额</span>
                  <span class="value">{{ item.investmentAmount.toLocaleString() }}万</span>
                </div>
                <div class="result-card__row">
                  <span class="label">匹配度</span>
                  <span class="value" :style="{ color: item.matchScore >= 80 ? '#67C23A' : '#E6A23C' }">{{ item.matchScore }}%</span>
                </div>
              </div>
              <el-button type="primary" size="small" style="width: 100%; margin-top: 8px">查看详情</el-button>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import { getMockMapTargets } from '@/api/mock/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  { key: 'range', label: '搜索范围', type: 'select', options: [
    { label: '5公里', value: '5' },
    { label: '10公里', value: '10' },
    { label: '20公里', value: '20' },
    { label: '50公里', value: '50' }
  ]},
  { key: 'industry', label: '行业', type: 'select', options: [
    { label: '高端装备制造', value: '高端装备制造' },
    { label: '新材料', value: '新材料' },
    { label: '生物医药', value: '生物医药' }
  ]}
]

const results = ref<any[]>([])

function handleSearch() {
  const data = getMockMapTargets()
  results.value = data.map(d => ({
    ...d,
    distance: (Math.random() * 45 + 1).toFixed(1)
  }))
}

onMounted(() => { handleSearch() })
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.map-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
}
.map-area {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  overflow: hidden;
  height: 600px;
}
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.search-section,
.result-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 12px 0;
}
.result-list {
  max-height: 480px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.result-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.result-card__name {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.result-card__distance {
  font-size: 13px;
  color: #1889E8;
  font-weight: $font-weight-medium;
}
.result-card__row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 2px 0;
  .label { color: $text-secondary; }
  .value { color: $text-primary; }
}
</style>
