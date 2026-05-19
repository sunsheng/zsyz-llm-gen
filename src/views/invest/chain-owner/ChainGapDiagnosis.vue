<template>
  <div class="page-container">
    <PageHeader title="产业链缺口诊断" subtitle="链主视角产业链缺口诊断" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div v-loading="loading" class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">各环节本地配套率</h4>
        <BaseChart :option="barOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">健康度分布</h4>
        <BaseChart :option="pieOption" height="360px" />
      </div>
    </div>

    <div v-loading="loading" class="content-card">
      <h4 class="content-card__title">环节健康度明细</h4>
      <el-table :data="gapData" stripe border style="width: 100%">
        <el-table-column prop="segmentName" label="环节名称" min-width="140" />
        <el-table-column prop="localRate" label="本地率" width="120">
          <template #default="{ row }"> {{ row.localRate }}% </template>
        </el-table-column>
        <el-table-column prop="importRate" label="进口率" width="120">
          <template #default="{ row }"> {{ row.importRate }}% </template>
        </el-table-column>
        <el-table-column label="是否卡脖子" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.bottleneckFlag ? 'danger' : 'success'" size="small">
              {{ row.bottleneckFlag ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="健康度" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="healthTagType(row.healthLevel) as any" size="small">
              {{ healthLabel(row.healthLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="detailVisible" title="环节详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="环节名称">{{ detailData.segmentName }}</el-descriptions-item>
        <el-descriptions-item label="本地率">{{ detailData.localRate }}</el-descriptions-item>
        <el-descriptions-item label="进口率">{{ detailData.importRate }}</el-descriptions-item>
        <el-descriptions-item label="是否卡脖子">{{
          detailData.bottleneckFlag
        }}</el-descriptions-item>
        <el-descriptions-item label="健康度">{{ detailData.healthLevel }}</el-descriptions-item>
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
import { fetchOwnerGapDiagnoses } from '@/api/modules/investApi'
import type { OwnerGapDiagnosis } from '@/api/types/invest'

const loading = ref(false)
const gapData = ref<OwnerGapDiagnosis[]>([])
const detailVisible = ref(false)
const detailData = ref<Partial<OwnerGapDiagnosis>>({})

const healthCounts = computed(() => {
  const counts = { healthy: 0, warning: 0, critical: 0 }
  gapData.value.forEach((d) => counts[d.healthLevel]++)
  return counts
})

const kpiCards = computed(() => [
  {
    key: 'healthy',
    icon: 'CircleCheck',
    label: '健康环节数',
    value: healthCounts.value.healthy,
    unit: '个',
    iconColor: '#67C23A',
    iconBgColor: '#EDFFF3',
  },
  {
    key: 'warning',
    icon: 'Warning',
    label: '预警环节数',
    value: healthCounts.value.warning,
    unit: '个',
    iconColor: '#E6A23C',
    iconBgColor: '#FFFBE6',
  },
  {
    key: 'critical',
    icon: 'CircleClose',
    label: '危急环节数',
    value: healthCounts.value.critical,
    unit: '个',
    iconColor: '#F56C6C',
    iconBgColor: '#FFF0F0',
  },
])

const barOption = computed<EChartsOption>(() => {
  const healthColorMap: Record<string, string> = {
    healthy: '#67C23A',
    warning: '#E6A23C',
    critical: '#F56C6C',
  }
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '本地配套率(%)', max: 100 },
    yAxis: {
      type: 'category',
      data: gapData.value.map((d) => d.segmentName),
      inverse: true,
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: gapData.value.map((d) => ({
          value: d.localRate,
          itemStyle: { color: healthColorMap[d.healthLevel] },
        })),
        label: { show: true, position: 'right', formatter: '{c}%' },
      },
    ],
  }
})

const pieOption = computed<EChartsOption>(() => ({
  color: ['#67C23A', '#E6A23C', '#F56C6C'],
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c}个 ({d}%)' },
      data: [
        { name: '健康', value: healthCounts.value.healthy },
        { name: '预警', value: healthCounts.value.warning },
        { name: '危急', value: healthCounts.value.critical },
      ],
    },
  ],
}))

function handleDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

function healthTagType(level: string) {
  const map: Record<string, string> = { healthy: 'success', warning: 'warning', critical: 'danger' }
  return map[level] || 'info'
}

function healthLabel(level: string) {
  const map: Record<string, string> = { healthy: '健康', warning: '预警', critical: '危急' }
  return map[level] || level
}

onMounted(async () => {
  loading.value = true
  try {
    gapData.value = await fetchOwnerGapDiagnoses()
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
