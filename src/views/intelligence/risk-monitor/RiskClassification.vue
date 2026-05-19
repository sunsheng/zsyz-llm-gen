<template>
  <div class="page-container">
    <PageHeader title="风险分类体系" subtitle="招商风险分类与分级体系" />

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险类别分布</h4>
        <BaseChart :option="categoryPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险等级分布</h4>
        <BaseChart :option="levelBarOption" height="320px" />
      </div>
    </div>

    <div class="content-card">
      <h4 class="section-title">风险分类详情</h4>
      <el-table :data="classificationData" stripe border style="width: 100%">
        <el-table-column prop="category" label="风险类别" width="120">
          <template #default="{ row }">
            <el-tag :type="categoryTagMap[row.category]" size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="levelTagMap[row.level]" size="small" effect="dark">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="260" show-overflow-tooltip />
        <el-table-column prop="indicators" label="监测指标" min-width="200" show-overflow-tooltip />
        <el-table-column prop="warningCount" label="预警数" width="90" align="center">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #f2637b">{{ row.warningCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const categoryTagMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  政策风险: 'danger',
  市场风险: 'warning',
  企业风险: 'primary',
  履约风险: 'success',
}

const levelTagMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  高: 'danger',
  中: 'warning',
  低: 'info',
}

const classificationData = ref([
  {
    category: '政策风险',
    level: '高',
    description: '产业限制政策变动，如"双高"行业限批、补贴退坡',
    indicators: '政策发布频次、限制条款数、补贴退坡比例',
    warningCount: 8,
  },
  {
    category: '政策风险',
    level: '中',
    description: '区域优惠政策到期，招商引资政策调整',
    indicators: '政策到期时间、优惠覆盖面、调整幅度',
    warningCount: 5,
  },
  {
    category: '市场风险',
    level: '高',
    description: '行业周期波动，如光伏产能过剩、技术替代威胁',
    indicators: '产能利用率、价格指数、技术替代率',
    warningCount: 6,
  },
  {
    category: '市场风险',
    level: '中',
    description: '市场需求下滑，竞争加剧导致利润压缩',
    indicators: '订单增速、毛利率变化、市场集中度',
    warningCount: 4,
  },
  {
    category: '企业风险',
    level: '高',
    description: '经营异常，连续3个月纳税下降30%以上',
    indicators: '纳税增长率、经营现金流、应收账款周转率',
    warningCount: 7,
  },
  {
    category: '企业风险',
    level: '中',
    description: '信用评级下调，核心管理层变动',
    indicators: '信用评分变动、管理层变动率、诉讼数量',
    warningCount: 3,
  },
  {
    category: '履约风险',
    level: '高',
    description: '投资进度延迟，厂房建设滞后6个月以上',
    indicators: '建设进度偏差率、资金到位率、节点达标率',
    warningCount: 4,
  },
  {
    category: '履约风险',
    level: '低',
    description: '配套承诺未兑现，如链主未完成本地采购量',
    indicators: '本地采购完成率、配套项目进度、承诺兑现率',
    warningCount: 2,
  },
])

const categoryPieOption = ref({})
const levelBarOption = ref({})

function initCharts() {
  categoryPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 13, name: '政策风险' },
          { value: 10, name: '市场风险' },
          { value: 10, name: '企业风险' },
          { value: 6, name: '履约风险' },
        ],
      },
    ],
  }

  levelBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高风险', '中风险', '低风险'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['政策风险', '市场风险', '企业风险', '履约风险'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '高风险',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        data: [8, 6, 7, 4],
        itemStyle: { color: '#F2637B' },
      },
      {
        name: '中风险',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        data: [5, 4, 3, 0],
        itemStyle: { color: '#FBD437' },
      },
      {
        name: '低风险',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        data: [0, 0, 0, 2],
        itemStyle: { color: '#36CBCB' },
      },
    ],
  }
}

onMounted(() => {
  initCharts()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
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
.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
