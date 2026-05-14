<template>
  <div class="page-container">
    <PageHeader title="投资事件" subtitle="产业投资事件动态">
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

    <div class="event-timeline">
      <el-timeline>
        <el-timeline-item
          v-for="item in eventList"
          :key="item.id"
          :timestamp="item.date"
          placement="top"
          :type="eventTypeColor(item.type) as any"
        >
          <el-card shadow="hover" class="event-card">
            <div class="event-card__header">
              <h4 class="event-card__title">{{ item.title }}</h4>
              <el-tag :type="eventTypeTag(item.type) as any" size="small">{{ item.type }}</el-tag>
            </div>
            <div class="event-card__body">
              <div class="event-card__row">
                <span class="label">企业</span>
                <span class="value">{{ item.enterprise }}</span>
              </div>
              <div class="event-card__row">
                <span class="label">金额</span>
                <span class="value" style="font-weight: 600; color: #1889e8"
                  >{{ item.amount.toLocaleString() }}万</span
                >
              </div>
              <div class="event-card__row">
                <span class="label">行业</span>
                <span class="value">{{ item.industry }}</span>
              </div>
            </div>
            <p class="event-card__desc">{{ item.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <PaginationBar :current="1" :total="20" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockInvestEvents } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    options: [
      { label: '融资', value: '融资' },
      { label: '并购', value: '并购' },
      { label: '上市', value: '上市' },
      { label: '投资', value: '投资' },
    ],
  },
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
]

const eventList = ref<any[]>([])

function eventTypeTag(type: string) {
  const map: Record<string, string> = { 融资: '', 并购: 'warning', 上市: 'success', 投资: 'info' }
  return map[type] || ''
}

function eventTypeColor(type: string) {
  const map: Record<string, string> = {
    融资: 'primary',
    并购: 'warning',
    上市: 'success',
    投资: '',
  }
  return map[type] || ''
}

function handleSearch() {
  eventList.value = getMockInvestEvents(8)
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.event-timeline {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.event-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.event-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.event-card__row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  font-size: 13px;
  .label {
    color: $text-secondary;
  }
  .value {
    color: $text-primary;
  }
}
.event-card__desc {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: $text-regular;
}
</style>
