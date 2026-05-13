<template>
  <div class="page-container">
    <PageHeader title="政策风险" subtitle="政策变动风险监测与预警">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">政策影响行业分布</h4>
        <BaseChart :option="industryBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">政策风险趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
    </div>

    <div class="timeline-section">
      <h4 class="chart-panel__title">最新政策动态</h4>
      <el-timeline>
        <el-timeline-item
          v-for="item in policyList"
          :key="item.id"
          :timestamp="item.date"
          placement="top"
          :type="item.impact === 'positive' ? 'success' : item.impact === 'negative' ? 'danger' : 'warning'"
        >
          <el-card shadow="hover">
            <div class="policy-card">
              <h4 class="policy-card__title">{{ item.title }}</h4>
              <el-tag :type="item.impact === 'positive' ? 'success' : item.impact === 'negative' ? 'danger' : 'warning'" size="small">
                {{ item.impact === 'positive' ? '利好' : item.impact === 'negative' ? '利空' : '中性' }}
              </el-tag>
              <p class="policy-card__desc">{{ item.desc }}</p>
              <div class="policy-card__tags">
                <span>影响行业: {{ item.industry }}</span>
                <span>影响企业: {{ item.affectedCount }}家</span>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  { key: 'total', label: '监测政策', value: 56, unit: '条', trend: 'up' as const, trendValue: '+8', icon: 'Document', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'negative', label: '利空政策', value: 12, unit: '条', trend: 'up' as const, trendValue: '+3', icon: 'Warning', iconColor: '#F56C6C', iconBgColor: '#FEF0F0' },
  { key: 'positive', label: '利好政策', value: 28, unit: '条', trend: 'up' as const, trendValue: '+5', icon: 'CircleCheck', iconColor: '#67C23A', iconBgColor: '#EDFAF0' },
  { key: 'affected', label: '受影响企业', value: 342, unit: '家', trend: 'up' as const, trendValue: '+26', icon: 'OfficeBuilding', iconColor: '#E6A23C', iconBgColor: '#FDF6EC' }
]

const policyList = ref<any[]>([])
const industryBarOption = ref({})
const trendOption = ref({})

onMounted(() => {
  const titles = [
    '关于加快推进高端装备制造业发展的实施意见',
    '新材料产业环保排放标准修订通知',
    '生物医药创新产品加速审批工作方案',
    '数字经济促进条例修订草案',
    '新能源补贴退坡时间表公布',
    '中小企业融资担保新政策',
    '产业园区税收优惠政策延期',
    '环保督察整改要求通知'
  ]
  const impacts: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'positive', 'positive', 'negative', 'positive', 'positive', 'negative']
  const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源', '现代服务业', '节能环保', '节能环保']

  policyList.value = titles.map((title, i) => ({
    id: `policy-${i + 1}`,
    title,
    date: `2025-05-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}`,
    impact: impacts[i],
    industry: industries[i],
    affectedCount: Math.floor(Math.random() * 80 + 20),
    desc: '该政策对相关产业企业产生重大影响，建议相关企业及时关注政策动态，调整经营策略。'
  }))

  const industryNames = ['高端装备', '新材料', '生物医药', '电子信息', '新能源', '现代服务']
  industryBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industryNames },
    yAxis: { type: 'value' },
    series: [
      { name: '利好', type: 'bar', stack: 'total', data: [15, 8, 12, 18, 6, 10], itemStyle: { color: '#67C23A' } },
      { name: '利空', type: 'bar', stack: 'total', data: [5, 12, 3, 4, 10, 2], itemStyle: { color: '#F56C6C' } }
    ]
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['利好', '利空', '中性'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '利好', type: 'line', smooth: true, data: [4, 5, 3, 6, 5, 8] },
      { name: '利空', type: 'line', smooth: true, data: [2, 1, 3, 2, 4, 2] },
      { name: '中性', type: 'line', smooth: true, data: [3, 2, 4, 3, 2, 3] }
    ]
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
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
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.timeline-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.policy-card__title {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 8px 0;
  display: inline;
  margin-right: 8px;
}
.policy-card__desc {
  font-size: 14px;
  color: $text-secondary;
  margin: 8px 0;
}
.policy-card__tags {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: $text-regular;
}
</style>
