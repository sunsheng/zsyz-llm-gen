<template>
  <div class="page-container">
    <PageHeader title="SWOT分析" subtitle="区域发展SWOT战略分析">
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

    <div class="swot-grid">
      <div class="swot-card swot-card--strengths">
        <h4 class="swot-card__title">优势 (Strengths)</h4>
        <ul class="swot-card__list">
          <li v-for="item in strengths" :key="item">- {{ item }}</li>
        </ul>
      </div>
      <div class="swot-card swot-card--weaknesses">
        <h4 class="swot-card__title">劣势 (Weaknesses)</h4>
        <ul class="swot-card__list">
          <li v-for="item in weaknesses" :key="item">- {{ item }}</li>
        </ul>
      </div>
      <div class="swot-card swot-card--opportunities">
        <h4 class="swot-card__title">机会 (Opportunities)</h4>
        <ul class="swot-card__list">
          <li v-for="item in opportunities" :key="item">- {{ item }}</li>
        </ul>
      </div>
      <div class="swot-card swot-card--threats">
        <h4 class="swot-card__title">威胁 (Threats)</h4>
        <ul class="swot-card__list">
          <li v-for="item in threats" :key="item">- {{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">SWOT量化评估</h4>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">关键因素权重分析</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">战略建议</h4>
      <el-table :data="strategyData" stripe border style="width: 100%">
        <el-table-column prop="strategy" label="战略方向" width="120" />
        <el-table-column prop="type" label="组合类型" width="120">
          <template #default="{ row }">
            <el-tag
              :type="
                (row.type === 'SO'
                  ? 'success'
                  : row.type === 'WO'
                    ? 'warning'
                    : row.type === 'ST'
                      ? ''
                      : 'danger') as any
              "
              size="small"
              >{{ row.type }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="description" label="战略描述" min-width="300" />
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.priority === '高' ? 'danger' : row.priority === '中' ? 'warning' : 'info'"
              size="small"
              >{{ row.priority }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const filterFields = [
  {
    key: 'industry',
    label: '产业',
    type: 'select' as const,
    options: [
      { label: '高端装备制造', value: '1' },
      { label: '新材料', value: '2' },
      { label: '生物医药', value: '3' },
    ],
  },
]

const strengths = ref([
  '长三角核心区位优势，交通便利',
  '数字经济产业基础雄厚',
  '高校科研资源丰富，人才供给充足',
  '营商环境位居全国前列',
  '产业链配套完善，集聚效应显著',
])
const weaknesses = ref([
  '土地资源紧张，用地成本偏高',
  '传统制造业转型压力较大',
  '高端人才流失风险',
  '部分产业同质化竞争严重',
  '中小微企业融资难问题突出',
])
const opportunities = ref([
  '国家长三角一体化战略机遇',
  '新兴技术产业爆发式增长',
  '全球产业链重构带来新机会',
  '双碳目标推动绿色产业发展',
  '数字经济发展政策持续加码',
])
const threats = ref([
  '周边城市招商竞争加剧',
  '国际贸易环境不确定性',
  '产业技术迭代加速风险',
  '环保约束趋严增加成本',
  '人口红利减弱劳动力成本上升',
])

const strategyData = ref([
  {
    strategy: 'SO战略',
    type: 'SO',
    description: '发挥区位和数字产业优势，抢抓长三角一体化机遇，加快数字经济和高端装备制造招商',
    priority: '高',
  },
  {
    strategy: 'SO战略',
    type: 'SO',
    description: '利用人才优势，承接新兴技术产业转移，打造创新高地',
    priority: '高',
  },
  {
    strategy: 'WO战略',
    type: 'WO',
    description: '通过城市更新和低效用地再开发缓解土地约束，引进高附加值产业',
    priority: '中',
  },
  {
    strategy: 'WO战略',
    type: 'WO',
    description: '借助政策机遇推动传统制造业数字化转型，降低转型成本',
    priority: '中',
  },
  {
    strategy: 'ST战略',
    type: 'ST',
    description: '强化差异化招商策略，聚焦细分领域打造特色产业集群',
    priority: '高',
  },
  {
    strategy: 'ST战略',
    type: 'ST',
    description: '构建产业技术联盟，降低技术迭代带来的风险',
    priority: '中',
  },
  {
    strategy: 'WT战略',
    type: 'WT',
    description: '优化中小企业扶持政策，缓解融资难题，防范产业空心化',
    priority: '中',
  },
  {
    strategy: 'WT战略',
    type: 'WT',
    description: '加强环保技术与产业融合，将环保约束转化为绿色产业机遇',
    priority: '低',
  },
])

const radarOption = ref({})
const barOption = ref({})

onMounted(() => {
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['优势', '劣势', '机会', '威胁'] },
    radar: {
      indicator: [
        { name: '区位条件', max: 100 },
        { name: '产业基础', max: 100 },
        { name: '人才资源', max: 100 },
        { name: '政策环境', max: 100 },
        { name: '市场潜力', max: 100 },
        { name: '创新能力', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { name: '优势', value: [90, 85, 88, 82, 86, 80], areaStyle: { opacity: 0.15 } },
          { name: '劣势', value: [45, 50, 55, 40, 48, 52], areaStyle: { opacity: 0.1 } },
          { name: '机会', value: [85, 88, 82, 90, 86, 84], areaStyle: { opacity: 0.15 } },
          { name: '威胁', value: [60, 65, 58, 55, 62, 68], areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }

  const factors = ['区位优势', '产业集聚', '人才供给', '政策扶持', '市场空间', '创新驱动']
  barOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['影响力', '紧迫性'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: factors },
    yAxis: { type: 'value', max: 100 },
    series: [
      { name: '影响力', type: 'bar', barWidth: '25%', data: [88, 85, 82, 78, 75, 80] },
      { name: '紧迫性', type: 'bar', barWidth: '25%', data: [72, 78, 68, 85, 70, 75] },
    ],
  }
})

function handleSearch(_kw: string) {}
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() {}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.swot-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.swot-card {
  padding: 20px;
  background: $bg-card;
  border-left: 4px solid;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.swot-card--strengths {
  border-left-color: #67c23a;
}
.swot-card--weaknesses {
  border-left-color: #f56c6c;
}
.swot-card--opportunities {
  border-left-color: #1889e8;
}
.swot-card--threats {
  border-left-color: #e6a23c;
}
.swot-card__title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.swot-card__list {
  padding-left: 16px;
  margin: 0;
  font-size: 14px;
  line-height: 2;
  color: $text-regular;
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
