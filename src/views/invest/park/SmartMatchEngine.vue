<template>
  <div class="page-container">
    <PageHeader title="智能企业匹配引擎" subtitle="园区企业智能匹配引擎" />

    <SearchFilterBar
      search-placeholder="请输入企业名称关键词"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div v-loading="loading" class="content-card">
      <div v-if="matchList.length" class="match-grid">
        <div v-for="item in matchList" :key="item.id" class="match-card">
          <div class="match-card__header">
            <span class="match-card__name">{{ item.enterpriseName }}</span>
            <ScoreRing :value="item.matchScore" :size="60" :stroke-width="6" />
          </div>
          <div class="match-card__info">
            <span class="match-card__label">行业：</span>
            <span>{{ item.industry }}</span>
          </div>
          <div class="match-card__info">
            <span class="match-card__label">面积需求：</span>
            <span>{{ item.areaNeed }} 亩</span>
          </div>
          <div class="match-card__info">
            <span class="match-card__label">员工规模：</span>
            <span>{{ item.employeeCount }} 人</span>
          </div>
          <div class="match-card__parks">
            <div class="match-card__parks-label">匹配园区：</div>
            <div v-for="park in item.matchedParks" :key="park.parkId" class="match-card__park-item">
              <span class="match-card__park-name">{{ park.parkName }}</span>
              <el-tag
                :type="park.score >= 90 ? 'success' : park.score >= 80 ? 'primary' : 'warning'"
                size="small"
              >
                {{ park.score }}分
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无匹配结果" />
      <PaginationBar
        :current="pagination.current"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { fetchParkSmartMatches } from '@/api/modules/investApi'
import type { ParkSmartMatch } from '@/api/types/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'industry',
    label: '行业类型',
    type: 'select',
    options: [
      { label: '新一代信息技术', value: '新一代信息技术' },
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
      { label: '新能源', value: '新能源' },
      { label: '节能环保', value: '节能环保' },
    ],
  },
  {
    key: 'areaNeed',
    label: '面积需求',
    type: 'select',
    options: [
      { label: '50亩以下', value: 'small' },
      { label: '50-150亩', value: 'medium' },
      { label: '150亩以上', value: 'large' },
    ],
  },
  {
    key: 'employeeCount',
    label: '员工规模',
    type: 'select',
    options: [
      { label: '100人以下', value: 'small' },
      { label: '100-300人', value: 'medium' },
      { label: '300人以上', value: 'large' },
    ],
  },
]

const loading = ref(false)
const matchList = ref<ParkSmartMatch[]>([])
const pagination = reactive({ current: 1, total: 0, pageSize: 10 })

async function loadData() {
  loading.value = true
  try {
    const data = await fetchParkSmartMatches()
    pagination.total = data.length
    const start = (pagination.current - 1) * pagination.pageSize
    matchList.value = data.slice(start, start + pagination.pageSize)
  } finally {
    loading.value = false
  }
}

function handleSearch(_keyword: string) {
  pagination.current = 1
  loadData()
}

function handleFilter(_filters: Record<string, unknown>) {
  pagination.current = 1
  loadData()
}

function handleReset() {
  pagination.current = 1
  loadData()
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.match-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 16px;
}
.match-card {
  padding: 20px;
  background: #fff;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
  transition: box-shadow 200ms ease;

  &:hover {
    box-shadow: $shadow-card;
  }
}
.match-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.match-card__name {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.match-card__info {
  margin-bottom: 8px;
  font-size: 14px;
  color: $text-regular;
}
.match-card__label {
  color: $text-secondary;
}
.match-card__parks {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid $border-color-lighter;
}
.match-card__parks-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: $text-secondary;
}
.match-card__park-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: $text-regular;
}
.match-card__park-name {
  flex: 1;
}
</style>
