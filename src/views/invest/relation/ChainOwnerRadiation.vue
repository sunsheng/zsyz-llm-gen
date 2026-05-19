<template>
  <div class="page-container">
    <PageHeader title="链主企业辐射力分析" subtitle="链主企业产业辐射力评估" />

    <div class="portrait-layout">
      <!-- 左面板: 链主企业选择 + 信息卡 -->
      <div class="portrait-left">
        <div class="selector-section">
          <h4 class="section-title">链主企业</h4>
          <el-select
            v-model="selectedId"
            placeholder="请选择链主企业"
            style="width: 100%"
            @change="handleSelectChange"
          >
            <el-option
              v-for="item in radiationList"
              :key="item.enterpriseName"
              :label="item.enterpriseName"
              :value="item.enterpriseName"
            />
          </el-select>
        </div>

        <template v-if="currentRadiation">
          <div class="info-card">
            <h4 class="section-title">基本信息</h4>
            <div class="info-item">
              <span class="label">企业名称</span>
              <span class="value">{{ currentRadiation.enterpriseName }}</span>
            </div>
            <div class="info-item">
              <span class="label">订单占比</span>
              <span class="value highlight">{{ currentRadiation.orderShare }}%</span>
            </div>
            <div class="info-item">
              <span class="label">扩张趋势</span>
              <el-tag :type="trendTag(currentRadiation.expansionTrend) as any" size="small">
                {{ trendLabel(currentRadiation.expansionTrend) }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">外迁风险</span>
              <el-tag :type="riskTag(currentRadiation.relocationRisk) as any" size="small">
                {{ currentRadiation.relocationRisk }}%
              </el-tag>
            </div>
          </div>

          <div class="influence-section">
            <h4 class="section-title">辐射力指数</h4>
            <div class="gauge-wrapper">
              <BaseChart :option="gaugeOption" height="200px" />
            </div>
          </div>
        </template>
        <el-empty v-else description="请选择链主企业" :image-size="80" />
      </div>

      <!-- 右面板 -->
      <div v-loading="loading" class="portrait-right">
        <template v-if="currentRadiation">
          <div class="stat-cards">
            <StatCard
              icon="PieChart"
              label="订单占比"
              :value="currentRadiation.orderShare"
              unit="%"
              trend="up"
              trend-value="较上年+3%"
              icon-color="#1889E8"
              icon-bg-color="#ECF5FF"
            />
            <StatCard
              icon="Connection"
              label="上下游企业数"
              :value="currentRadiation.upstreamCount + currentRadiation.downstreamCount"
              unit="家"
              :trend="currentRadiation.expansionTrend === 'expanding' ? 'up' : 'down'"
              :trend-value="currentRadiation.expansionTrend === 'expanding' ? '持续增长' : '需关注'"
              icon-color="#36CBCB"
              icon-bg-color="#E6F9F9"
            />
            <StatCard
              icon="TrendCharts"
              label="扩张趋势"
              :value="trendLabel(currentRadiation.expansionTrend)"
              :trend="currentRadiation.expansionTrend === 'expanding' ? 'up' : 'down'"
              :trend-value="
                currentRadiation.expansionTrend === 'expanding' ? '正向扩张' : '收缩风险'
              "
              icon-color="#4ECB73"
              icon-bg-color="#EEFBF2"
            />
            <StatCard
              icon="Warning"
              label="外迁风险"
              :value="currentRadiation.relocationRisk"
              unit="%"
              :trend="currentRadiation.relocationRisk > 30 ? 'up' : 'down'"
              :trend-value="currentRadiation.relocationRisk > 30 ? '风险较高' : '风险可控'"
              icon-color="#F2637B"
              icon-bg-color="#FEF0F2"
            />
          </div>

          <!-- 上下游企业分布 -->
          <div class="chart-row">
            <div class="chart-panel">
              <h4 class="chart-panel__title">上下游企业分布</h4>
              <BaseChart :option="barOption" height="280px" />
            </div>
            <div class="chart-panel">
              <h4 class="chart-panel__title">辐射范围分析</h4>
              <BaseChart :option="radarOption" height="280px" />
            </div>
          </div>

          <!-- 关联企业表格 -->
          <div class="table-section">
            <h4 class="chart-panel__title">关联企业列表</h4>
            <el-table :data="relatedTableData" stripe border style="width: 100%">
              <el-table-column prop="name" label="企业名称" min-width="160" />
              <el-table-column prop="relation" label="关系" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.relation === '上游' ? 'primary' : 'success'" size="small">
                    {{ row.relation }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="dependency" label="依赖度" width="140">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.dependency"
                    :stroke-width="8"
                    :color="row.dependency > 70 ? '#F2637B' : '#1889E8'"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="handleDetail(row)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <el-empty v-else description="请先选择链主企业" :image-size="80" />
      </div>
    </div>

    <el-dialog v-model="detailVisible" title="企业详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="企业名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="关系">{{ detailData.relation }}</el-descriptions-item>
        <el-descriptions-item label="依赖度">{{ detailData.dependency }}</el-descriptions-item>
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
import { fetchChainOwnerRadiations } from '@/api/modules/investApi'
import type { ChainOwnerRadiation } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const radiationList = ref<ChainOwnerRadiation[]>([])
const selectedId = ref('')
const detailVisible = ref(false)
const detailData = ref<Record<string, any>>({})

const currentRadiation = computed(() =>
  radiationList.value.find((r) => r.enterpriseName === selectedId.value),
)

function trendLabel(trend: ChainOwnerRadiation['expansionTrend']): string {
  return trend === 'expanding' ? '扩张中' : trend === 'stable' ? '稳定' : '收缩'
}

function trendTag(trend: ChainOwnerRadiation['expansionTrend']): string {
  return trend === 'expanding' ? 'success' : trend === 'stable' ? '' : 'danger'
}

function riskTag(risk: number): string {
  return risk > 30 ? 'danger' : risk > 15 ? 'warning' : 'success'
}

// Gauge option for radiation index
const gaugeOption = computed<EChartsOption>(() => {
  const r = currentRadiation.value
  if (!r) return {} as EChartsOption
  const score = r.influenceRadius
  return {
    series: [
      {
        type: 'gauge' as const,
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 16,
            color: [
              [0.4, '#F2637B'],
              [0.7, '#E6A23C'],
              [1, '#67C23A'],
            ],
          },
        },
        pointer: { width: 4 },
        axisTick: { length: 6, lineStyle: { color: 'auto' } },
        splitLine: { length: 12, lineStyle: { color: 'auto', width: 2 } },
        axisLabel: { fontSize: 11, color: '#999', distance: 16 },
        detail: {
          formatter: '{value}',
          fontSize: 24,
          fontWeight: 'bold',
          offsetCenter: [0, '60%'],
          color: 'inherit',
        },
        data: [{ value: score, name: '辐射力指数' }],
        title: { offsetCenter: [0, '80%'], fontSize: 13, color: '#909399' },
      },
    ],
  }
})

// Bar chart for upstream/downstream distribution
const barOption = computed<EChartsOption>(() => {
  const r = currentRadiation.value
  if (!r) return {} as EChartsOption
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' as const },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category' as const, data: ['上游企业', '下游企业'] },
    yAxis: { type: 'value' as const },
    series: [
      {
        type: 'bar' as const,
        barMaxWidth: 48,
        data: [
          { value: r.upstreamCount, itemStyle: { color: '#1889E8' } },
          { value: r.downstreamCount, itemStyle: { color: '#4ECB73' } },
        ],
        label: { show: true, position: 'top', formatter: '{c}家' },
      },
    ],
  }
})

// Radar chart for radiation scope
const radarOption = computed<EChartsOption>(() => {
  const r = currentRadiation.value
  if (!r) return {} as EChartsOption
  return {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '订单占比', max: 50 },
        { name: '上游控制', max: 30 },
        { name: '下游辐射', max: 40 },
        { name: '扩张动能', max: 100 },
        { name: '稳定性', max: 100 },
      ],
      radius: '65%',
    },
    series: [
      {
        type: 'radar' as const,
        data: [
          {
            value: [
              r.orderShare,
              r.upstreamCount,
              r.downstreamCount,
              r.expansionTrend === 'expanding' ? 85 : r.expansionTrend === 'stable' ? 55 : 25,
              100 - r.relocationRisk,
            ],
            name: r.enterpriseName,
            areaStyle: { color: 'rgba(24,137,232,0.15)' },
            lineStyle: { color: '#1889E8' },
            itemStyle: { color: '#1889E8' },
          },
        ],
      },
    ],
  }
})

// Mock related enterprise table
const relatedTableData = computed(() => {
  const r = currentRadiation.value
  if (!r) return []
  const upstream = Array.from({ length: Math.min(r.upstreamCount, 5) }, (_, i) => ({
    name: `${r.enterpriseName}-上游供应商${i + 1}`,
    relation: '上游',
    dependency: Math.floor(Math.random() * 40 + 40),
  }))
  const downstream = Array.from({ length: Math.min(r.downstreamCount, 5) }, (_, i) => ({
    name: `${r.enterpriseName}-下游客户${i + 1}`,
    relation: '下游',
    dependency: Math.floor(Math.random() * 40 + 30),
  }))
  return [...upstream, ...downstream]
})

function handleDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

function handleSelectChange() {
  // Reactive via computed
}

async function loadData() {
  loading.value = true
  try {
    radiationList.value = await fetchChainOwnerRadiations(8)
    if (radiationList.value.length && !selectedId.value) {
      selectedId.value = radiationList.value[0].enterpriseName
    }
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

.portrait-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
}

.portrait-left {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.portrait-right {
  overflow: auto;
}

.selector-section {
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.info-card {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid $border-color-lighter;

  .label {
    color: $text-secondary;
  }

  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }

  .value.highlight {
    font-size: 16px;
    color: #1889e8;
  }
}

.influence-section {
  .gauge-wrapper {
    display: flex;
    justify-content: center;
  }
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-row {
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
