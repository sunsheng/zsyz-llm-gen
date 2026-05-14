<template>
  <div class="page-container">
    <PageHeader title="龙头总览" subtitle="龙头企业带动能力分析">
      <template #actions>
        <el-button type="primary">刷新数据</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">龙头企业营收排行</h4>
        <BaseChart :option="revenueBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">带动能力雷达图</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="content-card">
      <h4 class="chart-panel__title">龙头企业列表</h4>
      <el-table :data="leadingList" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="120" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="revenue" label="营收(万)" width="120">
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="marketShare" label="市场份额(%)" width="110">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889e8">{{ row.marketShare }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="innovationScore" label="创新指数" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.innovationScore >= 80 ? '#67C23A' : '#E6A23C' }">{{
              row.innovationScore
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="driveCapability" label="带动能力" width="100">
          <template #default="{ row }">{{ row.driveCapability }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)"
              >详情</el-button
            >
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
import { getMockLeadingEnterprises } from '@/api/mock/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const router = useRouter()
const kpiCards = ref<any[]>([])
const leadingList = ref<any[]>([])
const revenueBarOption = ref({})
const radarOption = ref({})

function handleViewDetail(row: any) {
  router.push({ name: 'LeadingDetail', params: { id: row.id } })
}

onMounted(() => {
  kpiCards.value = [
    {
      key: 'leadingCount',
      label: '龙头企业',
      value: 6,
      unit: '家',
      trend: 'up',
      trendValue: '+20.0%',
      icon: 'Trophy',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'totalRevenue',
      label: '总营收',
      value: 86.5,
      unit: '亿',
      trend: 'up',
      trendValue: '+12.3%',
      icon: 'Money',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'avgDrive',
      label: '平均带动',
      value: 76,
      unit: '分',
      trend: 'up',
      trendValue: '+8.5%',
      icon: 'Promotion',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'avgInnovation',
      label: '创新指数',
      value: 82,
      unit: '分',
      trend: 'up',
      trendValue: '+6.2%',
      icon: 'Star',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
  ]

  leadingList.value = getMockLeadingEnterprises()
  const names = leadingList.value.map((l) => l.name)
  const revenues = leadingList.value.map((l) => l.revenue)

  revenueBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: names, axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}万' } },
    series: [{ type: 'bar', data: revenues, barWidth: '40%' }],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: names.slice(0, 3) },
    radar: {
      indicator: [
        { name: '营收规模', max: 100 },
        { name: '市场份额', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '带动能力', max: 100 },
        { name: '人才规模', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: leadingList.value.slice(0, 3).map((l) => ({
          name: l.name,
          value: [
            Math.min(l.revenue / 2500, 100),
            l.marketShare * 3,
            l.innovationScore,
            l.driveCapability,
            Math.min(l.employees / 100, 100),
          ],
          areaStyle: { opacity: 0.2 },
        })),
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
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
