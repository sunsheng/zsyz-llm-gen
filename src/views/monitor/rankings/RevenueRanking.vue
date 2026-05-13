<template>
  <div class="page-container">
    <PageHeader title="营收榜单" subtitle="企业营收排名TOP20">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        searchPlaceholder="搜索企业名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">营收TOP10</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">营收排名</h4>
      <el-table :data="filteredData" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="{ row }">
            <span :style="{ fontWeight: row.rank <= 3 ? 700 : 400, color: row.rank <= 3 ? '#1889E8' : '' }">
              {{ row.rank }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业" width="140" />
        <el-table-column prop="value" label="营收(万元)" width="140" sortable>
          <template #default="{ row }">
            {{ row.value.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="growth" label="增长率(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="所在城市" width="120" />
      </el-table>
      <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockRevenueRanking } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const filterFields = [
  { key: 'industry', label: '行业', type: 'select' as const, options: [
    { label: '高端装备制造', value: '1' },
    { label: '新材料', value: '2' },
    { label: '生物医药', value: '3' },
    { label: '电子信息', value: '4' }
  ]},
  { key: 'city', label: '城市', type: 'select' as const, options: [
    { label: '杭州市', value: '1' },
    { label: '宁波市', value: '2' },
    { label: '温州市', value: '3' }
  ]}
]

const allData = ref<any[]>([])
const currentPage = ref(1)
const total = ref(0)
const keyword = ref('')
const barOption = ref({})

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.name.includes(keyword.value))
  }
  return data
})

onMounted(() => {
  allData.value = getMockRevenueRanking(20)
  total.value = allData.value.length

  const top10 = allData.value.slice(0, 10)
  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: top10.map((r: any) => r.name).reverse(), inverse: false },
    series: [{ type: 'bar', barWidth: '50%', data: top10.map((r: any) => r.value).reverse() }]
  }
})

function handleSearch(kw: string) { keyword.value = kw }
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() { keyword.value = '' }
function handlePageChange(page: number) { currentPage.value = page }
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-panel {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel.full-width {
  grid-column: 1 / -1;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
