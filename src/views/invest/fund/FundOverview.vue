<template>
  <div class="page-container">
    <PageHeader title="基金总览" subtitle="投行基金招商资源概览">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">基金规模分布</h4>
        <BaseChart :option="scaleBarOption" height="300px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">投资回报率对比</h4>
        <BaseChart :option="roiBarOption" height="300px" />
      </div>
    </div>

    <div class="content-card">
      <h4 class="chart-panel__title">基金列表</h4>
      <el-table :data="funds" stripe border style="width: 100%">
        <el-table-column prop="name" label="基金名称" min-width="160" />
        <el-table-column prop="focus" label="重点方向" width="120" />
        <el-table-column prop="scale" label="规模(万)" width="130">
          <template #default="{ row }">{{ row.scale.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="invested" label="已投(万)" width="130">
          <template #default="{ row }">{{ row.invested.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="projects" label="项目数" width="90" />
        <el-table-column prop="roi" label="回报率(%)" width="100">
          <template #default="{ row }">
            <span style="color: #67C23A; font-weight: 600">{{ row.roi }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockFunds } from '@/api/mock/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const router = useRouter()
const kpiCards = ref<any[]>([])
const funds = ref<any[]>([])
const scaleBarOption = ref({})
const roiBarOption = ref({})

function handleViewDetail(row: any) {
  router.push({ name: 'FundDetail', params: { id: row.id } })
}

onMounted(() => {
  funds.value = getMockFunds()
  const totalScale = funds.value.reduce((s, f) => s + f.scale, 0)
  const totalInvested = funds.value.reduce((s, f) => s + f.invested, 0)

  kpiCards.value = [
    { key: 'fundCount', label: '基金数量', value: funds.value.length, unit: '只', trend: 'up', trendValue: '+16.7%', icon: 'Wallet', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
    { key: 'totalScale', label: '总规模', value: (totalScale / 10000).toFixed(1), unit: '亿', trend: 'up', trendValue: '+22.3%', icon: 'Money', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
    { key: 'totalInvested', label: '已投资金', value: (totalInvested / 10000).toFixed(1), unit: '亿', trend: 'up', trendValue: '+18.5%', icon: 'TrendCharts', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
    { key: 'avgRoi', label: '平均回报率', value: (funds.value.reduce((s, f) => s + parseFloat(f.roi), 0) / funds.value.length).toFixed(1), unit: '%', trend: 'up', trendValue: '+3.2%', icon: 'DataLine', iconColor: '#FBD437', iconBgColor: '#FFF8E6' }
  ]

  scaleBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: funds.value.map(f => f.name) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}万' } },
    series: [
      { name: '总规模', type: 'bar', data: funds.value.map(f => f.scale) },
      { name: '已投', type: 'bar', data: funds.value.map(f => f.invested) }
    ]
  }

  roiBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: funds.value.map(f => f.name) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{ name: '回报率', type: 'bar', data: funds.value.map(f => parseFloat(f.roi)), barWidth: '40%' }]
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
.content-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
