<template>
  <div class="page-container">
    <PageHeader title="供应链风险" subtitle="供应链断链与波动风险预警">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">供应链风险类型分布</h4>
        <BaseChart :option="typePieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">供应链风险趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">关键物料风险指数</h4>
        <BaseChart :option="materialBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">供应商集中度分析</h4>
        <BaseChart :option="supplierOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">供应链风险预警</h4>
      <el-table :data="riskData" stripe border style="width: 100%">
        <el-table-column prop="material" label="关键物料/环节" min-width="160" />
        <el-table-column prop="riskType" label="风险类型" width="120" />
        <el-table-column prop="riskScore" label="风险评分" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.riskScore > 60 ? '#F56C6C' : row.riskScore > 30 ? '#E6A23C' : '#67C23A', fontWeight: 600 }">
              {{ row.riskScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="affectedEnterprises" label="影响企业数" width="120" />
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <RiskIndicator :level="row.level" :score="row.riskScore" />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="风险描述" min-width="200" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import RiskIndicator from '@/components/business/RiskIndicator.vue'

const kpiCards = [
  { key: 'total', label: '供应链风险', value: 36, unit: '条', trend: 'up' as const, trendValue: '+5', icon: 'Connection', iconColor: '#F2637B', iconBgColor: '#FEF0F0' },
  { key: 'break', label: '断链风险', value: 8, unit: '条', trend: 'up' as const, trendValue: '+2', icon: 'SwitchButton', iconColor: '#F56C6C', iconBgColor: '#FEF0F0' },
  { key: 'price', label: '价格波动', value: 18, unit: '条', trend: 'up' as const, trendValue: '+3', icon: 'TrendCharts', iconColor: '#E6A23C', iconBgColor: '#FDF6EC' },
  { key: 'stable', label: '供应稳定', value: 92, unit: '%', trend: 'down' as const, trendValue: '-2.3%', icon: 'CircleCheck', iconColor: '#67C23A', iconBgColor: '#EDFAF0' }
]

const riskData = ref<any[]>([])
const typePieOption = ref({})
const trendOption = ref({})
const materialBarOption = ref({})
const supplierOption = ref({})

onMounted(() => {
  const materials = ['稀土材料', '锂矿资源', '芯片供应', '高端轴承', '特种钢材', '医用原料', '光学元件', '碳纤维材料']
  const riskTypes = ['断链风险', '价格波动', '质量风险', '交期延迟']
  const levels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical']
  const descs = ['上游供应企业减少，替代渠道有限', '国际市场价格持续上涨，成本压力增大', '批次质量不稳定，合格率下降', '物流受阻导致交期延长']

  riskData.value = materials.map((material, i) => ({
    material,
    riskType: riskTypes[i % riskTypes.length],
    riskScore: Math.floor(Math.random() * 60 + 20),
    affectedEnterprises: Math.floor(Math.random() * 30 + 5),
    level: levels[i % 4],
    desc: descs[i % descs.length]
  }))

  typePieOption.value = {
    color: ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437'],
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: [
        { name: '断链风险', value: 8 },
        { name: '价格波动', value: 18 },
        { name: '质量风险', value: 6 },
        { name: '交期延迟', value: 4 }
      ]
    }]
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: ['#1889E8', '#36CBCB', '#4ECB73'],
    tooltip: { trigger: 'axis' },
    legend: { data: ['断链风险', '价格波动', '总风险'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '断链风险', type: 'line', smooth: true, data: [5, 6, 7, 6, 8, 8] },
      { name: '价格波动', type: 'line', smooth: true, data: [12, 15, 14, 16, 18, 18] },
      { name: '总风险', type: 'line', smooth: true, data: [25, 28, 30, 28, 32, 36] }
    ]
  }

  materialBarOption.value = {
    color: ['#1889E8'],
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: materials.slice(0, 6) },
    yAxis: { type: 'value', max: 100 },
    series: [{
      type: 'bar',
      barWidth: '40%',
      data: riskData.value.slice(0, 6).map(d => ({
        value: d.riskScore,
        itemStyle: { color: d.riskScore > 60 ? '#F56C6C' : d.riskScore > 30 ? '#E6A23C' : '#67C23A' }
      }))
    }]
  }

  const supplierNames = ['供应商A', '供应商B', '供应商C', '供应商D', '供应商E']
  supplierOption.value = {
    color: ['#1889E8'],
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: supplierNames },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'bar',
      barWidth: '40%',
      data: [35, 28, 18, 12, 7]
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
