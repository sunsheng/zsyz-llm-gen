<template>
  <div class="page-container">
    <PageHeader title="智能企业匹配引擎" subtitle="园区企业智能匹配引擎" />

    <div class="demand-panel content-card">
      <div class="demand-panel__title">企业需求输入</div>
      <div class="demand-panel__form">
        <el-select
          v-model="demandForm.industry"
          placeholder="行业类型"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="opt in demandIndustryOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-input-number
          v-model="demandForm.areaNeed"
          :min="0"
          :step="10"
          placeholder="面积需求"
          controls-position="right"
          style="width: 160px"
        />
        <span class="demand-panel__unit">m²</span>
        <el-input-number
          v-model="demandForm.employeeCount"
          :min="0"
          :step="10"
          placeholder="员工规模"
          controls-position="right"
          style="width: 160px"
        />
        <span class="demand-panel__unit">人</span>
        <el-button type="primary" @click="handleSmartMatch">智能匹配</el-button>
        <el-button @click="handleResetDemand">重置</el-button>
      </div>
    </div>

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
import { ref, reactive, computed, onMounted } from 'vue'
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

const demandIndustryOptions = [
  { label: '新一代信息技术', value: '新一代信息技术' },
  { label: '高端装备制造', value: '高端装备制造' },
  { label: '新材料', value: '新材料' },
  { label: '生物医药', value: '生物医药' },
  { label: '新能源', value: '新能源' },
  { label: '节能环保', value: '节能环保' },
]

const loading = ref(false)
const allData = ref<ParkSmartMatch[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const demandForm = reactive({
  industry: '' as string,
  areaNeed: undefined as number | undefined,
  employeeCount: undefined as number | undefined,
})
const demandActive = ref(false)
const pagination = reactive({ current: 1, total: 0, pageSize: 10 })

const filteredList = computed(() => {
  let list = allData.value
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    list = list.filter((item) => item.enterpriseName.toLowerCase().includes(keyword))
  }
  const industry = filterValues.value.industry as string
  if (industry) {
    list = list.filter((item) => item.industry === industry)
  }
  const areaNeed = filterValues.value.areaNeed as string
  if (areaNeed) {
    if (areaNeed === 'small') list = list.filter((item) => item.areaNeed < 50)
    else if (areaNeed === 'medium')
      list = list.filter((item) => item.areaNeed >= 50 && item.areaNeed <= 150)
    else if (areaNeed === 'large') list = list.filter((item) => item.areaNeed > 150)
  }
  const employeeCount = filterValues.value.employeeCount as string
  if (employeeCount) {
    if (employeeCount === 'small') list = list.filter((item) => item.employeeCount < 100)
    else if (employeeCount === 'medium')
      list = list.filter((item) => item.employeeCount >= 100 && item.employeeCount <= 300)
    else if (employeeCount === 'large') list = list.filter((item) => item.employeeCount > 300)
  }

  // 智能匹配过滤 & 排序
  if (demandActive.value) {
    if (demandForm.industry) {
      list = list.filter((item) => item.industry === demandForm.industry)
    }
    if (demandForm.areaNeed != null && demandForm.areaNeed > 0) {
      list = list.filter((item) => item.areaNeed <= demandForm.areaNeed! * 1.2)
    }
    if (demandForm.employeeCount != null && demandForm.employeeCount > 0) {
      list = list.filter((item) => item.employeeCount <= demandForm.employeeCount! * 1.2)
    }
    // 按适配度排序：matchScore 降序（匹配分已综合区位、成本、政策因素）
    list = [...list].sort((a, b) => b.matchScore - a.matchScore)
  }

  return list
})

const matchList = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return filteredList.value.slice(start, start + pagination.pageSize)
})

const filteredTotal = computed(() => filteredList.value.length)
function syncPagination() {
  pagination.total = filteredTotal.value
}

async function loadData() {
  loading.value = true
  try {
    const data = await fetchParkSmartMatches()
    allData.value = data
  } finally {
    loading.value = false
  }
}

function handleSmartMatch() {
  if (!demandForm.industry && demandForm.areaNeed == null && demandForm.employeeCount == null) {
    demandActive.value = false
  } else {
    demandActive.value = true
  }
  pagination.current = 1
  syncPagination()
}

function handleResetDemand() {
  demandForm.industry = ''
  demandForm.areaNeed = undefined
  demandForm.employeeCount = undefined
  demandActive.value = false
  pagination.current = 1
  syncPagination()
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  pagination.current = 1
  syncPagination()
}

function handleFilter(filters: Record<string, unknown>) {
  filterValues.value = { ...filters }
  pagination.current = 1
  syncPagination()
}

function handleReset() {
  searchKeyword.value = ''
  filterValues.value = {}
  pagination.current = 1
  syncPagination()
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
  syncPagination()
}

onMounted(async () => {
  await loadData()
  syncPagination()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.demand-panel {
  padding: 16px 20px;
  margin-bottom: 16px;
  background: #fff;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
}
.demand-panel__title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.demand-panel__form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demand-panel__unit {
  margin-left: -8px;
  font-size: 14px;
  color: $text-secondary;
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
