<template>
  <div class="page-container">
    <PageHeader title="区域排名" subtitle="对标城市综合实力排名">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索城市名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">综合评分排名</h4>
        <BaseChart :option="rankBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">分维度雷达排名</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域综合排名</h4>
      <el-table :data="filteredData" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="{ row }">
            <span
              :style="{
                fontWeight: row.rank <= 3 ? 700 : 400,
                color:
                  row.rank === 1
                    ? '#FBD437'
                    : row.rank === 2
                      ? '#C0C4CC'
                      : row.rank === 3
                        ? '#CD853F'
                        : '',
              }"
            >
              {{ row.rank }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" min-width="120" />
        <el-table-column prop="economyScore" label="经济实力" width="100" sortable />
        <el-table-column prop="industryScore" label="产业水平" width="100" sortable />
        <el-table-column prop="innovationScore" label="创新能力" width="100" sortable />
        <el-table-column prop="investScore" label="招商环境" width="100" sortable />
        <el-table-column prop="talentScore" label="人才密度" width="100" sortable />
        <el-table-column prop="totalScore" label="综合评分" width="100" sortable>
          <template #default="{ row }">
            <span style="font-weight: 700; color: #1889e8">{{ row.totalScore }}</span>
          </template>
        </el-table-column>
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

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const filterFields = [
  {
    key: 'dimension',
    label: '排序维度',
    type: 'select' as const,
    options: [
      { label: '综合评分', value: 'total' },
      { label: '经济实力', value: 'economy' },
      { label: '产业水平', value: 'industry' },
      { label: '创新能力', value: 'innovation' },
    ],
  },
]

const allData = ref<any[]>([])
const currentPage = ref(1)
const total = ref(0)
const keyword = ref('')
const rankBarOption = ref({})
const radarOption = ref({})

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.city.includes(keyword.value))
  }
  return data
})

onMounted(() => {
  const cities = [
    '杭州市',
    '宁波市',
    '苏州市',
    '南京市',
    '成都市',
    '武汉市',
    '长沙市',
    '合肥市',
    '青岛市',
    '郑州市',
    '西安市',
    '重庆市',
  ]
  allData.value = cities
    .map((city) => ({
      city,
      economyScore: Math.floor(Math.random() * 20 + 70),
      industryScore: Math.floor(Math.random() * 25 + 65),
      innovationScore: Math.floor(Math.random() * 20 + 68),
      investScore: Math.floor(Math.random() * 20 + 66),
      talentScore: Math.floor(Math.random() * 25 + 60),
    }))
    .map((d) => ({
      ...d,
      totalScore: Math.floor(
        (d.economyScore + d.industryScore + d.innovationScore + d.investScore + d.talentScore) / 5,
      ),
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((item, i) => ({ ...item, rank: i + 1 }))
  total.value = allData.value.length

  const top8 = allData.value.slice(0, 8)
  rankBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', max: 100 },
    yAxis: { type: 'category', data: top8.map((d) => d.city).reverse() },
    series: [{ type: 'bar', barWidth: '50%', data: top8.map((d) => d.totalScore).reverse() }],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: top8.slice(0, 3).map((d) => d.city) },
    radar: {
      indicator: [
        { name: '经济实力', max: 100 },
        { name: '产业水平', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '招商环境', max: 100 },
        { name: '人才密度', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: top8.slice(0, 3).map((d) => ({
          name: d.city,
          value: [d.economyScore, d.industryScore, d.innovationScore, d.investScore, d.talentScore],
          areaStyle: { opacity: 0.2 },
        })),
      },
    ],
  }
})

function handleSearch(kw: string) {
  keyword.value = kw
}
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() {
  keyword.value = ''
}
function handlePageChange(page: number) {
  currentPage.value = page
}
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
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
