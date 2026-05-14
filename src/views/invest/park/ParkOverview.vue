<template>
  <div class="page-container">
    <PageHeader title="园区总览" subtitle="产业园区招商资源概览">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">园区入驻率对比</h4>
        <BaseChart :option="occupancyBarOption" height="300px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">园区产值排行</h4>
        <BaseChart :option="revenueBarOption" height="300px" />
      </div>
    </div>

    <div class="content-card">
      <h4 class="chart-panel__title">园区列表</h4>
      <el-table :data="parks" stripe border style="width: 100%">
        <el-table-column prop="name" label="园区名称" min-width="160" />
        <el-table-column prop="industry" label="主导产业" width="120" />
        <el-table-column prop="area" label="面积(亩)" width="100">
          <template #default="{ row }">{{ row.area.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="occupancy" label="入驻率(%)" width="110">
          <template #default="{ row }">
            <span
              :style="{
                color:
                  row.occupancy >= 80 ? '#67C23A' : row.occupancy >= 60 ? '#E6A23C' : '#F56C6C',
              }"
              >{{ row.occupancy }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="enterprises" label="企业数" width="90" />
        <el-table-column prop="vacantArea" label="空置面积(亩)" width="120">
          <template #default="{ row }">{{ row.vacantArea.toLocaleString() }}</template>
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
import { getMockParks } from '@/api/mock/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const router = useRouter()
const kpiCards = ref<any[]>([])
const parks = ref<any[]>([])
const occupancyBarOption = ref({})
const revenueBarOption = ref({})

function handleViewDetail(row: any) {
  router.push({ name: 'ParkDetail', params: { id: row.id } })
}

onMounted(() => {
  parks.value = getMockParks()
  const totalArea = parks.value.reduce((s, p) => s + p.area, 0)
  const totalEnterprises = parks.value.reduce((s, p) => s + p.enterprises, 0)
  const avgOccupancy = Math.floor(
    parks.value.reduce((s, p) => s + p.occupancy, 0) / parks.value.length,
  )

  kpiCards.value = [
    {
      key: 'parkCount',
      label: '园区数量',
      value: parks.value.length,
      unit: '个',
      trend: 'up',
      trendValue: '+12.0%',
      icon: 'OfficeBuilding',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'totalArea',
      label: '总面积',
      value: totalArea.toLocaleString(),
      unit: '亩',
      trend: 'up',
      trendValue: '+8.5%',
      icon: 'Grid',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'avgOccupancy',
      label: '平均入驻率',
      value: avgOccupancy,
      unit: '%',
      trend: 'up',
      trendValue: '+5.3%',
      icon: 'DataLine',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'totalEnterprises',
      label: '入驻企业',
      value: totalEnterprises,
      unit: '家',
      trend: 'up',
      trendValue: '+15.2%',
      icon: 'UserFilled',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
  ]

  occupancyBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: parks.value.map((p) => p.name) },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '入驻率', type: 'bar', data: parks.value.map((p) => p.occupancy), barWidth: '40%' },
    ],
  }

  revenueBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: parks.value.map((p) => p.name) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}万' } },
    series: [
      { name: '产值', type: 'bar', data: parks.value.map((p) => p.revenue), barWidth: '40%' },
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
