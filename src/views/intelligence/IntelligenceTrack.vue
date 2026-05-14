<template>
  <div class="page-container">
    <PageHeader title="情报追踪" subtitle="招商目标情报追踪管理">
      <template #actions>
        <el-button type="primary">新增追踪</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入目标名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="track-list">
      <el-card v-for="item in trackList" :key="item.id" shadow="hover" class="track-card">
        <div class="track-card__header">
          <div>
            <span class="track-card__name">{{ item.targetName }}</span>
            <el-tag size="small" style="margin-left: 8px">{{ item.trackType }}</el-tag>
          </div>
          <el-tag :type="statusTag(item.status) as any" size="small">{{ item.status }}</el-tag>
        </div>
        <div class="track-card__progress">
          <span class="track-card__progress-label">追踪进度</span>
          <el-progress :percentage="item.progress" :stroke-width="12" style="flex: 1" />
        </div>
        <div class="track-card__events">
          <span class="track-card__events-label">关键事件:</span>
          <el-tag
            v-for="evt in item.keyEvents"
            :key="evt"
            size="small"
            type="info"
            style="margin-left: 4px"
            >{{ evt }}</el-tag
          >
        </div>
        <div class="track-card__footer">
          <span class="track-card__update">更新: {{ item.updateTime }}</span>
          <div>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">更新</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <PaginationBar :current="1" :total="15" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockTrackList } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'trackType',
    label: '追踪类型',
    type: 'select',
    options: [
      { label: '企业动态', value: '企业动态' },
      { label: '投资意向', value: '投资意向' },
      { label: '政策变化', value: '政策变化' },
      { label: '竞争情报', value: '竞争情报' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '进行中', value: '进行中' },
      { label: '已完成', value: '已完成' },
      { label: '已搁置', value: '已搁置' },
    ],
  },
]

const trackList = ref<any[]>([])

function statusTag(status: string) {
  return status === '进行中' ? '' : status === '已完成' ? 'success' : 'info'
}

function handleSearch() {
  trackList.value = getMockTrackList(6)
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.track-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.track-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.track-card__name {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.track-card__progress {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}
.track-card__progress-label {
  font-size: 13px;
  color: $text-secondary;
  white-space: nowrap;
}
.track-card__events {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  margin-bottom: 10px;
}
.track-card__events-label {
  font-size: 12px;
  color: $text-secondary;
}
.track-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid $border-color-lighter;
}
.track-card__update {
  font-size: 12px;
  color: $text-secondary;
}
</style>
