<template>
  <div class="page-container">
    <PageHeader title="科研资源全景库" subtitle="科研机构资源全景展示" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各机构专利数对比</h4>
        <BaseChart :option="patentChartOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">机构类型分布</h4>
        <BaseChart :option="typeChartOption" height="320px" />
      </div>
    </div>

    <div v-loading="loading" class="content-card">
      <h4 class="chart-panel__title">机构列表</h4>
      <el-table :data="institutions" stripe border style="width: 100%">
        <el-table-column prop="name" label="机构名称" min-width="180" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]?.type || ('info' as any)" size="small">
              {{ typeTagMap[row.type]?.label || row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="patentCount" label="专利数" width="100" sortable />
        <el-table-column prop="nationalProjects" label="国家级项目" width="120" sortable />
        <el-table-column prop="academicianCount" label="院士数" width="90" sortable />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="detailVisible" title="机构详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="机构名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detailData.type }}</el-descriptions-item>
        <el-descriptions-item label="专利数">{{ detailData.patentCount }}</el-descriptions-item>
        <el-descriptions-item label="国家级项目">{{
          detailData.nationalProjects
        }}</el-descriptions-item>
        <el-descriptions-item label="院士数">{{
          detailData.academicianCount
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchResearchInstitutionsDetailed } from '@/api/modules/investApi'
import type { ResearchInstitution } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const typeTagMap: Record<string, { label: string; type: string }> = {
  university: { label: '高校', type: 'primary' },
  'key-lab': { label: '重点实验室', type: 'success' },
  'rd-institution': { label: '研发机构', type: 'warning' },
}

const loading = ref(false)
const institutions = ref<ResearchInstitution[]>([])
const detailVisible = ref(false)
const detailData = ref<Partial<ResearchInstitution>>({})

const kpiCards = computed(() => {
  const list = institutions.value
  const totalPatents = list.reduce((s, i) => s + i.patentCount, 0)
  const totalProjects = list.reduce((s, i) => s + i.nationalProjects, 0)
  const totalAcademicians = list.reduce((s, i) => s + i.academicianCount, 0)
  return [
    {
      key: 'count',
      icon: 'OfficeBuilding',
      label: '机构总数',
      value: list.length,
      unit: '家',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'patent',
      icon: 'Document',
      label: '专利总数',
      value: totalPatents,
      unit: '件',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'project',
      icon: 'Trophy',
      label: '国家级项目',
      value: totalProjects,
      unit: '项',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'academician',
      icon: 'UserFilled',
      label: '院士团队数',
      value: totalAcademicians,
      unit: '个',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const patentChartOption = computed<EChartsOption>(() => {
  const list = institutions.value.slice(0, 10)
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' as const },
    grid: { left: 20, right: 20, bottom: 20, top: 40, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: list.map((i) => i.name),
      axisLabel: { rotate: 30, fontSize: 11 },
    },
    yAxis: { type: 'value' as const, name: '专利数' },
    series: [
      {
        type: 'bar' as const,
        barMaxWidth: 32,
        data: list.map((i) => i.patentCount),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }
})

const typeChartOption = computed<EChartsOption>(() => {
  const list = institutions.value
  const typeCount: Record<string, number> = {}
  list.forEach((i) => {
    const label = typeTagMap[i.type]?.label || i.type
    typeCount[label] = (typeCount[label] || 0) + 1
  })
  const data = Object.entries(typeCount).map(([name, value]) => ({ name, value }))
  return {
    color: chartColors,
    tooltip: { trigger: 'item' as const },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie' as const,
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        label: { show: true, formatter: '{b}: {c}' },
        data,
      },
    ],
  }
})

function handleDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

async function loadData() {
  loading.value = true
  try {
    institutions.value = await fetchResearchInstitutionsDetailed()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
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
</style>
