<template>
  <div class="page-container">
    <PageHeader title="生态构建与协同" subtitle="龙头企业生态构建与产业协同" />

    <!-- StatCard×3 -->
    <div class="stat-cards">
      <StatCard
        icon="Connection"
        label="缺口环节数"
        :value="statData.gapCount"
        unit="个"
        trend="down"
        trend-value="较上月减少2"
        icon-color="#F2637B"
        icon-bg-color="#FEF0F0"
      />
      <StatCard
        icon="OfficeBuilding"
        label="推荐企业数"
        :value="statData.recommendCount"
        unit="家"
        trend="up"
        trend-value="较上月增加5"
        icon-color="#36CBCB"
        icon-bg-color="#E6F7F7"
      />
      <StatCard
        icon="TrendCharts"
        label="集群潜力指数"
        :value="statData.clusterIndex"
        trend="up"
        trend-value="较上月提升3.2"
        icon-color="#1889E8"
        icon-bg-color="#ECF5FF"
      />
    </div>

    <!-- 产业链缺口热力图 -->
    <div v-loading="loading" class="chart-panel">
      <h4 class="chart-panel__title">产业链缺口热力图</h4>
      <BaseChart :option="gapHeatmapOption" height="360px" />
    </div>

    <!-- 补链企业推荐表格 -->
    <div class="table-panel">
      <h4 class="chart-panel__title">补链企业推荐</h4>
      <el-table :data="recommendTableData" stripe style="width: 100%">
        <el-table-column prop="segment" label="缺口环节" min-width="120" />
        <el-table-column prop="gapLevel" label="缺口程度" width="100">
          <template #default="{ row }">
            <el-tag :type="gapLevelTag(row.gapLevel)" size="small">{{
              gapLevelLabel(row.gapLevel)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enterprise" label="推荐企业" min-width="160" />
        <el-table-column prop="industry" label="所属行业" width="130" />
        <el-table-column prop="matchScore" label="匹配度" width="90">
          <template #default="{ row }">
            <span
              :style="{
                color:
                  row.matchScore >= 85 ? '#4ECB73' : row.matchScore >= 70 ? '#FBD437' : '#F2637B',
              }"
            >
              {{ row.matchScore }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchEcoSynergyItems } from '@/api/modules/investApi'
import type { EcoSynergyItem, Priority } from '@/api/types/invest'

const loading = ref(false)
const items = ref<EcoSynergyItem[]>([])

const statData = reactive({
  gapCount: 0,
  recommendCount: 0,
  clusterIndex: 0,
})

// 缺口热力图: 横向柱状图，颜色表示缺口程度
const gapHeatmapOption = computed<EChartsOption>(() => {
  const names = items.value.map((i) => i.chainGap)
  const synergyData = items.value.map((i) => i.synergyScore)
  const clusterData = items.value.map((i) => i.clusterPotential)
  // 缺口程度 = 100 - 协同度
  const gapData = items.value.map((i) => 100 - i.synergyScore)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: { data: ['缺口程度', '协同度', '集群潜力'] },
    grid: { left: 100, right: 30, top: 40, bottom: 30 },
    xAxis: { type: 'value', max: 100 },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        name: '缺口程度',
        type: 'bar',
        barMaxWidth: 24,
        data: gapData.map((val, idx) => ({
          value: val,
          itemStyle: {
            color: val >= 30 ? '#F2637B' : val >= 15 ? '#FBD437' : '#C0C4CC',
          },
        })),
      },
      {
        name: '协同度',
        type: 'bar',
        barMaxWidth: 24,
        data: synergyData,
        itemStyle: { color: '#1889E8' },
      },
      {
        name: '集群潜力',
        type: 'bar',
        barMaxWidth: 24,
        data: clusterData,
        itemStyle: { color: '#36CBCB' },
      },
    ],
  }
})

// 补链企业推荐表格数据
interface RecommendRow {
  segment: string
  gapLevel: Priority
  enterprise: string
  industry: string
  matchScore: number
}

const recommendTableData = computed<RecommendRow[]>(() => {
  const rows: RecommendRow[] = []
  const industries = ['高端装备制造', '前沿新材料', '数字经济', '新能源', '生物医药']
  items.value.forEach((item) => {
    const gapLevel: Priority =
      item.synergyScore < 70 ? 'urgent' : item.synergyScore < 85 ? 'important' : 'normal'
    item.recommendedEnterprises.forEach((ent, idx) => {
      rows.push({
        segment: item.chainGap,
        gapLevel,
        enterprise: ent,
        industry: industries[idx % industries.length],
        matchScore: Math.floor(Math.random() * 25 + 75),
      })
    })
  })
  return rows
})

function gapLevelLabel(level: Priority) {
  const map: Record<Priority, string> = { urgent: '紧急', important: '重要', normal: '一般' }
  return map[level] || level
}

function gapLevelTag(level: Priority) {
  const map: Record<Priority, string> = { urgent: 'danger', important: 'warning', normal: 'info' }
  return map[level] as 'danger' | 'warning' | 'info'
}

async function loadData() {
  loading.value = true
  try {
    items.value = await fetchEcoSynergyItems()
    // 计算统计数据
    statData.gapCount = items.value.length
    const allRecommended = items.value.flatMap((i) => i.recommendedEnterprises)
    statData.recommendCount = new Set(allRecommended).size
    const avgCluster = items.value.length
      ? Math.round(
          (items.value.reduce((s, i) => s + i.clusterPotential, 0) / items.value.length) * 10,
        ) / 10
      : 0
    statData.clusterIndex = avgCluster
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-panel {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.table-panel {
  padding: 20px;
  margin-bottom: 20px;
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
