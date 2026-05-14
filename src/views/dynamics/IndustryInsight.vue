<template>
  <div class="page-container">
    <PageHeader title="产业洞察" subtitle="深度产业分析与趋势洞察">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索洞察主题"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业热度趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">关注领域分布</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
    </div>

    <div class="insight-list">
      <el-card v-for="item in filteredData" :key="item.id" shadow="hover" class="insight-card">
        <div class="insight-card__header">
          <el-tag type="info" size="small">{{ item.category }}</el-tag>
          <el-tag :type="item.level === 'deep' ? 'danger' : 'warning'" size="small">
            {{ item.level === 'deep' ? '深度' : '专题' }}
          </el-tag>
          <span class="insight-card__date">{{ item.date }}</span>
        </div>
        <h4 class="insight-card__title">{{ item.title }}</h4>
        <p class="insight-card__summary">{{ item.summary }}</p>
        <div class="insight-card__footer">
          <span class="insight-card__author">{{ item.author }}</span>
          <el-link type="primary" :underline="false">阅读全文</el-link>
        </div>
      </el-card>
    </div>

    <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
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
    key: 'category',
    label: '行业',
    type: 'select' as const,
    options: [
      { label: '高端装备制造', value: '1' },
      { label: '新材料', value: '2' },
      { label: '生物医药', value: '3' },
      { label: '电子信息', value: '4' },
    ],
  },
  {
    key: 'level',
    label: '类型',
    type: 'select' as const,
    options: [
      { label: '深度分析', value: 'deep' },
      { label: '专题研究', value: 'topic' },
    ],
  },
]

const allData = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const total = ref(0)
const trendOption = ref({})
const pieOption = ref({})

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.title.includes(keyword.value))
  }
  return data
})

onMounted(() => {
  const insights = [
    {
      title: '2025年高端装备制造产业发展趋势深度分析',
      category: '高端装备制造',
      level: 'deep',
      author: '产业研究院',
      summary:
        '从全球竞争格局、技术创新方向、市场需求变化三个维度，深入分析高端装备制造产业未来发展趋势及投资机遇。',
    },
    {
      title: '新材料产业链安全评估专题报告',
      category: '新材料',
      level: 'topic',
      author: '战略研究中心',
      summary: '聚焦关键原材料供应安全，评估产业链薄弱环节，提出保障策略建议。',
    },
    {
      title: '生物医药创新药出海路径洞察',
      category: '生物医药',
      level: 'deep',
      author: '医药产业组',
      summary: '分析中国创新药出海的成功案例与挑战，梳理合规路径与市场选择策略。',
    },
    {
      title: '半导体国产替代进展与机遇专题',
      category: '电子信息',
      level: 'topic',
      author: '技术分析部',
      summary: '追踪半导体国产替代最新进展，评估各环节突破情况及市场机遇。',
    },
    {
      title: '新能源技术路线演进深度分析',
      category: '新能源',
      level: 'deep',
      author: '能源研究院',
      summary: '从储能、氢能、光伏等维度分析新能源技术路线演进方向及产业化前景。',
    },
    {
      title: '数字经济赋能制造业转型路径研究',
      category: '数字创意',
      level: 'topic',
      author: '数字化转型中心',
      summary: '研究数字技术在制造业全流程的应用路径，分析转型成效与典型模式。',
    },
    {
      title: '节能环保产业"双碳"目标下的新机遇',
      category: '节能环保',
      level: 'deep',
      author: '绿色发展部',
      summary: '分析"双碳"目标对节能环保产业的驱动效应，识别高增长细分领域。',
    },
    {
      title: '长三角产业协同发展专题研究',
      category: '现代服务业',
      level: 'topic',
      author: '区域经济组',
      summary: '研究长三角产业协同现状与问题，提出深化协作的政策建议。',
    },
  ]

  allData.value = insights.map((item, i) => ({
    id: `insight-${i + 1}`,
    ...item,
    date: `2025-05-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}`,
  }))
  total.value = allData.value.length

  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高端装备', '生物医药', '电子信息', '新能源'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '高端装备', type: 'line', smooth: true, data: [82, 85, 88, 90, 92, 95] },
      { name: '生物医药', type: 'line', smooth: true, data: [75, 78, 80, 82, 85, 88] },
      { name: '电子信息', type: 'line', smooth: true, data: [90, 88, 92, 95, 93, 96] },
      { name: '新能源', type: 'line', smooth: true, data: [70, 75, 78, 82, 85, 88] },
    ],
  }

  pieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { name: '高端装备', value: 28 },
          { name: '生物医药', value: 22 },
          { name: '电子信息', value: 20 },
          { name: '新能源', value: 15 },
          { name: '新材料', value: 10 },
          { name: '其他', value: 5 },
        ],
      },
    ],
  }
})

function handleSearch(kw: string) {
  keyword.value = kw
  currentPage.value = 1
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
.insight-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.insight-card {
  &.el-card {
    border-radius: $radius-base;
  }
}
.insight-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.insight-card__date {
  margin-left: auto;
  font-size: 12px;
  color: $text-secondary;
}
.insight-card__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  cursor: pointer;
  &:hover {
    color: $color-primary;
  }
}
.insight-card__summary {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.5;
  color: $text-secondary;
}
.insight-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.insight-card__author {
  font-size: 13px;
  color: $text-regular;
}
</style>
