<template>
  <div class="page-container">
    <PageHeader title="动态排名" subtitle="按纳税/就业/研发投入生成企业榜单">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="rank-tabs">
      <el-radio-group v-model="sortBy" @change="handleSortChange">
        <el-radio-button value="tax">纳税排名</el-radio-button>
        <el-radio-button value="employment">就业排名</el-radio-button>
        <el-radio-button value="rd">研发投入排名</el-radio-button>
      </el-radio-group>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">{{ rankTitle }} Top10</h4>
        <BaseChart :option="barOption" height="400px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">{{ rankTitle }}行业分布</h4>
        <BaseChart :option="industryPieOption" height="400px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">{{ rankTitle }}完整榜单</h4>
      <el-table :data="rankingData" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="{ row }">
            <span :class="['rank-badge', row.rank <= 3 ? 'rank-badge--top' : '']">
              {{ row.rank }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业" width="140">
          <template #default="{ row }">
            <el-tag size="small">{{ row.industry }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="纳税额(万元)" width="140" sortable>
          <template #default="{ row }">{{ row.taxAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="employeeCount" label="就业人数" width="120" sortable>
          <template #default="{ row }">{{ row.employeeCount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="rdInvestment" label="研发投入(万元)" width="150" sortable>
          <template #default="{ row }">{{ row.rdInvestment.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="rdRatio" label="研发占比" width="110" sortable>
          <template #default="{ row }">{{ row.rdRatio }}%</template>
        </el-table-column>
        <el-table-column prop="growth" label="增长率(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="所在城市" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockDynamicRanking } from '@/api/mock/monitor'
import type { DynamicRankingItem } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const sortBy = ref<'tax' | 'employment' | 'rd'>('tax')
const rankingData = ref<DynamicRankingItem[]>([])
const barOption = ref({})
const industryPieOption = ref({})

const rankTitle = computed(() => {
  const map: Record<string, string> = { tax: '纳税', employment: '就业', rd: '研发投入' }
  return map[sortBy.value]
})

function handleSortChange() {
  loadRankingData()
}

function loadRankingData() {
  rankingData.value = getMockDynamicRanking(20, sortBy.value)
  updateCharts()
}

function updateCharts() {
  const top10 = rankingData.value.slice(0, 10)
  const valueKey =
    sortBy.value === 'tax'
      ? 'taxAmount'
      : sortBy.value === 'employment'
        ? 'employeeCount'
        : 'rdInvestment'
  const unitMap: Record<string, string> = { tax: '万元', employment: '人', rd: '万元' }

  barOption.value = {
    color: chartColors,
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0]
        return `${p.name}<br/>${p.value.toLocaleString()} ${unitMap[sortBy.value]}`
      },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: top10.map((r) => r.name),
      inverse: true,
      axisLabel: { width: 140, overflow: 'truncate' },
    },
    series: [
      {
        type: 'bar',
        barWidth: '50%',
        data: top10.map((r, i) => ({
          value: (r as any)[valueKey],
          itemStyle: { color: i < 3 ? '#1889E8' : '#36CBCB' },
        })),
      },
    ],
  }

  // 按行业分组统计
  const industryMap: Record<string, number> = {}
  rankingData.value.forEach((item) => {
    industryMap[item.industry] = (industryMap[item.industry] || 0) + 1
  })
  industryPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: Object.entries(industryMap).map(([name, value]) => ({ name, value })),
      },
    ],
  }
}

onMounted(() => {
  loadRankingData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.rank-tabs {
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
.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 13px;
  font-weight: 700;
  color: #606266;
  background: #f0f2f5;
  border-radius: 50%;
}
.rank-badge--top {
  color: #fff;
  background: #1889e8;
}
</style>
