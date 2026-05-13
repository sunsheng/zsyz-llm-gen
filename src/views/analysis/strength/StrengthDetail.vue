<template>
  <div class="page-container">
    <PageHeader title="强弱详情" subtitle="各产业强弱项详细分析">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div v-for="item in detailCards" :key="item.name" class="chart-panel">
        <h4 class="chart-panel__title">{{ item.name }} - 强弱项分析</h4>
        <BaseChart :option="item.radarOption" height="280px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">强弱项明细</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="产业" min-width="120" />
        <el-table-column prop="strength" label="优势指数" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.strength >= 75 ? '#4ECB73' : '#F2637B', fontWeight: 'bold' }">
              {{ row.strength }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="weakness" label="弱势指数" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.weakness >= 50 ? '#F2637B' : '#4ECB73', fontWeight: 'bold' }">
              {{ row.weakness }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="趋势" width="100">
          <template #default="{ row }">
            <el-tag :type="row.trend === 'up' ? 'success' : row.trend === 'down' ? 'danger' : 'info'" size="small">
              {{ row.trend === 'up' ? '上升' : row.trend === 'down' ? '下降' : '持平' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gap" label="强弱差值" width="120">
          <template #default="{ row }">
            <span>{{ row.strength - row.weakness }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockStrengthData } from '@/api/mock/analysis'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const detailCards = ref<any[]>([])
const tableData = ref<any[]>([])

onMounted(() => {
  const data = getMockStrengthData()

  const dimensions = ['市场规模', '技术水平', '人才储备', '政策支持', '资本活跃度']

  detailCards.value = data.industries.map((industry: string, idx: number) => {
    const strengthScore = data.strengthScores[idx]
    const weaknessScore = data.weaknessScores[idx]
    const strengthValues = dimensions.map(() => Math.floor(Math.random() * 30 + strengthScore - 15))
    const weaknessValues = dimensions.map(() => Math.floor(Math.random() * 30 + weaknessScore - 15))

    return {
      name: industry,
      radarOption: {
        color: chartColors,
        tooltip: {},
        legend: { data: ['优势', '弱势'] },
        radar: {
          indicator: dimensions.map(d => ({ name: d, max: 100 })),
          shape: 'polygon',
          splitNumber: 4
        },
        series: [{
          type: 'radar',
          data: [
            { name: '优势', value: strengthValues, areaStyle: { opacity: 0.2 } },
            { name: '弱势', value: weaknessValues, areaStyle: { opacity: 0.1 } }
          ]
        }]
      }
    }
  })

  tableData.value = data.details.map((d: any) => ({
    ...d,
    gap: d.strength - d.weakness
  }))
})
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.chart-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
.chart-panel { background: $bg-card; border-radius: $radius-base; box-shadow: $shadow-card; padding: 20px; }
.chart-panel__title { font-size: 16px; font-weight: $font-weight-semibold; color: $text-primary; margin: 0 0 16px 0; }
.table-section { background: $bg-card; border-radius: $radius-base; box-shadow: $shadow-card; padding: 20px; }
</style>
