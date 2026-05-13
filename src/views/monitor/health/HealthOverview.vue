<template>
  <div class="page-container">
    <PageHeader title="健康度总览" subtitle="企业健康度综合评估概览">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard
        icon="CircleCheck"
        label="健康企业"
        :value="856"
        unit="家"
        trend="up"
        trendValue="+5.2%"
        iconColor="#67C23A"
        iconBgColor="#EDFAF0"
      />
      <StatCard
        icon="Warning"
        label="亚健康企业"
        :value="254"
        unit="家"
        trend="down"
        trendValue="-2.1%"
        iconColor="#E6A23C"
        iconBgColor="#FDF6EC"
      />
      <StatCard
        icon="CircleClose"
        label="不健康企业"
        :value="128"
        unit="家"
        trend="up"
        trendValue="+1.8%"
        iconColor="#F56C6C"
        iconBgColor="#FEF0F0"
      />
      <StatCard
        icon="TrendCharts"
        label="平均健康分"
        :value="76.8"
        unit="分"
        trend="up"
        trendValue="+2.3"
        iconColor="#1889E8"
        iconBgColor="#ECF5FF"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">健康度评分分布</h4>
        <BaseChart :option="scoreDistOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各维度平均得分</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">健康度排行</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="overallScore" label="综合评分" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.overallScore >= 80 ? '#67C23A' : row.overallScore >= 60 ? '#E6A23C' : '#F56C6C' }">
              {{ row.overallScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="growthScore" label="成长力" width="100" />
        <el-table-column prop="profitScore" label="盈利力" width="100" />
        <el-table-column prop="innovationScore" label="创新力" width="100" />
        <el-table-column prop="riskScore" label="风控力" width="100" />
        <el-table-column prop="socialScore" label="社会贡献" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockHealthData } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const tableData = ref<any[]>([])
const scoreDistOption = ref({})
const radarOption = ref({})

onMounted(() => {
  tableData.value = getMockHealthData(10)

  scoreDistOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['0-20', '20-40', '40-60', '60-80', '80-100'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      barWidth: '50%',
      data: [
        { value: 18, itemStyle: { color: '#F56C6C' } },
        { value: 45, itemStyle: { color: '#E6A23C' } },
        { value: 156, itemStyle: { color: '#FBD437' } },
        { value: 520, itemStyle: { color: '#36CBCB' } },
        { value: 547, itemStyle: { color: '#67C23A' } }
      ]
    }]
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '成长力', max: 100 },
        { name: '盈利力', max: 100 },
        { name: '创新力', max: 100 },
        { name: '风控力', max: 100 },
        { name: '社会贡献', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [
        { name: '平均得分', value: [75, 72, 68, 82, 70], areaStyle: { opacity: 0.2 } },
        { name: '目标值', value: [85, 80, 80, 90, 80], areaStyle: { opacity: 0.1 } }
      ]
    }]
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
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
