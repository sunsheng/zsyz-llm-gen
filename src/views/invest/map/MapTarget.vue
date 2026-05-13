<template>
  <div class="page-container">
    <PageHeader title="地图选商" subtitle="基于地图的招商目标筛选">
      <template #actions>
        <el-button type="primary" @click="handleSearch">筛选目标</el-button>
      </template>
    </PageHeader>

    <div class="map-layout">
      <div class="map-area">
        <MaptalksMap :center="[120.15, 30.28]" :zoom="8" @ready="handleMapReady" />
      </div>
      <div class="sidebar">
        <div class="sidebar-section">
          <h4 class="section-title">筛选条件</h4>
          <SearchFilterBar
            search-placeholder="企业名称"
            :filters="filters"
            @search="handleSearch"
            @filter="handleSearch"
            @reset="handleSearch"
          />
        </div>
        <div class="sidebar-section">
          <h4 class="section-title">目标企业 ({{ targets.length }})</h4>
          <div class="target-list">
            <div v-for="item in targets" :key="item.id" class="target-item" @click="handleTargetClick(item)">
              <div class="target-item__header">
                <span class="target-item__name">{{ item.name }}</span>
                <span class="target-item__score" :style="{ color: item.matchScore >= 80 ? '#67C23A' : '#E6A23C' }">
                  {{ item.matchScore }}%
                </span>
              </div>
              <div class="target-item__info">
                <span>{{ item.industry }}</span>
                <el-tag size="small" :type="(item.status === '洽谈中' ? 'warning' : item.status === '已接触' ? 'info' : 'info') as any">
                  {{ item.status }}
                </el-tag>
              </div>
              <div class="target-item__amount">投资额: {{ item.investmentAmount.toLocaleString() }}万</div>
            </div>
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
  { key: 'industry', label: '行业', type: 'select', options: [
    { label: '高端装备制造', value: '高端装备制造' },
    { label: '新材料', value: '新材料' },
    { label: '生物医药', value: '生物医药' },
    { label: '电子信息', value: '电子信息' }
  ]},
  { key: 'status', label: '状态', type: 'select', options: [
    { label: '待接触', value: '待接触' },
    { label: '已接触', value: '已接触' },
    { label: '洽谈中', value: '洽谈中' }
  ]}
]

const targets = ref<any[]>([])
let mapInstance: any = null

function handleMapReady(map: any) {
  mapInstance = map
}

function handleSearch() {
  targets.value = getMockMapTargets()
}

function handleTargetClick(item: any) {
  if (mapInstance && typeof mapInstance.setCenter === 'function') {
    mapInstance.setCenter([item.lng, item.lat])
  }
}

onMounted(() => {
  handleSearch()
})
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
.sidebar-section {
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
.target-list {
  max-height: 400px;
  overflow-y: auto;
}
.target-item {
  padding: 12px;
  border-bottom: 1px solid $border-color-lighter;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: $bg-hover; }
}
.target-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.target-item__name {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.target-item__score {
  font-size: 14px;
  font-weight: $font-weight-bold;
}
.target-item__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 4px;
}
.target-item__amount {
  font-size: 12px;
  color: $text-secondary;
}
</style>
