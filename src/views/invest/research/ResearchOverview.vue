<template>
  <div class="page-container">
    <PageHeader title="科研机构总览" subtitle="科研机构招商资源概览">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">科研机构类型分布</h4>
        <BaseChart :option="typePieOption" height="300px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">专利数量排行</h4>
        <BaseChart :option="patentBarOption" height="300px" />
      </div>
    </div>

    <div class="content-card">
      <h4 class="chart-panel__title">机构列表</h4>
      <el-table :data="institutions" stripe border style="width: 100%">
        <el-table-column prop="name" label="机构名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="field" label="研究领域" width="120" />
        <el-table-column prop="patents" label="专利数" width="90" />
        <el-table-column prop="transfers" label="技术转移" width="100" />
        <el-table-column prop="cooperation" label="合作企业" width="100" />
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
import { getMockResearchInstitutions } from '@/api/mock/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const router = useRouter()
const kpiCards = ref<any[]>([])
const institutions = ref<any[]>([])
const typePieOption = ref({})
const patentBarOption = ref({})

function handleViewDetail(row: any) {
  router.push({ name: 'ResearchDetail', params: { id: row.id } })
}

onMounted(() => {
  institutions.value = getMockResearchInstitutions()
  const totalPatents = institutions.value.reduce((s, i) => s + i.patents, 0)
  const totalCooperation = institutions.value.reduce((s, i) => s + i.cooperation, 0)

  kpiCards.value = [
    { key: 'instCount', label: '科研机构', value: institutions.value.length, unit: '家', trend: 'up', trendValue: '+12.0%', icon: 'School', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
    { key: 'totalPatents', label: '专利总数', value: totalPatents, unit: '项', trend: 'up', trendValue: '+18.5%', icon: 'Document', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
    { key: 'totalCooperation', label: '合作企业', value: totalCooperation, unit: '家', trend: 'up', trendValue: '+15.3%', icon: 'Connection', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
    { key: 'transfers', label: '技术转移', value: institutions.value.reduce((s, i) => s + i.transfers, 0), unit: '项', trend: 'up', trendValue: '+22.1%', icon: 'Promotion', iconColor: '#FBD437', iconBgColor: '#FFF8E6' }
  ]

  typePieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: [
        { name: '高校', value: institutions.value.filter(i => i.type === '高校').length },
        { name: '科研院所', value: institutions.value.filter(i => i.type === '科研院所').length }
      ]
    }]
  }

  patentBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: institutions.value.map(i => i.name) },
    yAxis: { type: 'value' },
    series: [{ name: '专利数', type: 'bar', data: institutions.value.map(i => i.patents), barWidth: '40%' }]
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
