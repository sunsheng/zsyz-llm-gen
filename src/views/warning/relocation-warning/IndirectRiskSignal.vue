<template>
  <div class="page-container">
    <PageHeader title="间接风险信号" subtitle="企业外迁间接风险信号监测与识别">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险信号趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">信号类型分布</h4>
        <BaseChart :option="typeOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">间接风险信号明细</h4>
      <el-table :data="signalData" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业名称" min-width="180" />
        <el-table-column prop="signalType" label="信号类型" width="140">
          <template #default="{ row }">
            <el-tag
              :type="
                row.signalType === '资产变动'
                  ? 'warning'
                  : row.signalType === '人员变动'
                    ? 'danger'
                    : 'info'
              "
              size="small"
            >
              {{ row.signalType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="signal" label="风险信号" min-width="200" />
        <el-table-column prop="strength" label="信号强度" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.strength"
              :color="row.strength >= 80 ? '#F2637B' : row.strength >= 50 ? '#E6A23C' : '#4ECB73'"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发现时间" width="160" />
      </el-table>
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
  {
    key: 'signals',
    label: '风险信号',
    value: 86,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+12',
    icon: 'Warning',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'highStrength',
    label: '高强度信号',
    value: 18,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+3',
    icon: 'Bell',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'confirmed',
    label: '已确认信号',
    value: 52,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+8',
    icon: 'CircleCheck',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'falseAlarm',
    label: '误报率',
    value: 8.5,
    unit: '%',
    trend: 'down' as const,
    trendValue: '-2.1%',
    icon: 'CircleClose',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const trendOption = ref({})
const typeOption = ref({})

const signalData = ref([
  {
    enterprise: '华创新材料科技',
    signalType: '资产变动',
    signal: '核心专利批量转让至外地关联公司',
    strength: 85,
    time: '2025-05-14 09:30',
  },
  {
    enterprise: '东方精密制造',
    signalType: '人员变动',
    signal: '高管团队连续3人离职',
    strength: 78,
    time: '2025-05-13 16:20',
  },
  {
    enterprise: '博远生物医药',
    signalType: '运营变动',
    signal: '生产基地设备逐步搬迁',
    strength: 72,
    time: '2025-05-12 11:00',
  },
  {
    enterprise: '天域半导体',
    signalType: '资产变动',
    signal: '本地不动产挂牌出售',
    strength: 68,
    time: '2025-05-11 14:30',
  },
  {
    enterprise: '绿能新能源',
    signalType: '运营变动',
    signal: '供应商合同转移至外地',
    strength: 55,
    time: '2025-05-10 10:15',
  },
  {
    enterprise: '中科智联信息',
    signalType: '人员变动',
    signal: '研发团队缩减本地编制',
    strength: 62,
    time: '2025-05-09 15:45',
  },
])

onMounted(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['高强度', '中强度', '低强度'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '高强度', type: 'line', smooth: true, data: [12, 15, 14, 16, 18, 18] },
      { name: '中强度', type: 'line', smooth: true, data: [28, 32, 30, 35, 33, 32] },
      { name: '低强度', type: 'line', smooth: true, data: [35, 38, 40, 36, 38, 36] },
    ],
  }

  typeOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}条' },
        data: [
          { name: '资产变动', value: 28 },
          { name: '人员变动', value: 22 },
          { name: '运营变动', value: 20 },
          { name: '财务变动', value: 16 },
        ],
      },
    ],
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
