<template>
  <div class="page-container">
    <PageHeader title="基础信息总览" subtitle="企业基础档案、行业分类与股权结构">
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
        <h4 class="chart-panel__title">行业分类分布</h4>
        <BaseChart :option="industryPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">股权结构（本地/外资占比）</h4>
        <BaseChart :option="equityBarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <div class="table-header">
        <h4 class="chart-panel__title">企业基础档案</h4>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索企业名称"
          style="width: 240px"
          clearable
          :prefix-icon="Search"
        />
      </div>
      <el-table :data="filteredTableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180">
          <template #default="{ row }">
            <span>{{ row.name }}</span>
            <el-tag v-if="row.isChainOwner" type="warning" size="small" style="margin-left: 6px">
              链主
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registeredDate" label="注册时间" width="120" />
        <el-table-column prop="industry" label="行业分类" width="140">
          <template #default="{ row }">
            <el-tag size="small">{{ row.industry }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="股权结构" width="200">
          <template #default="{ row }">
            <div class="equity-bar-wrapper">
              <div class="equity-bar">
                <div
                  class="equity-bar__local"
                  :style="{ width: row.localShareholderRatio + '%' }"
                ></div>
                <div
                  class="equity-bar__foreign"
                  :style="{ width: row.foreignShareholderRatio + '%' }"
                ></div>
              </div>
              <span class="equity-label">本地{{ row.localShareholderRatio }}%</span>
              <span class="equity-label">外资{{ row.foreignShareholderRatio }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="subsidiaries" label="控股子公司" min-width="200">
          <template #default="{ row }">
            <template v-if="row.subsidiaries.length">
              <el-tag
                v-for="sub in row.subsidiaries"
                :key="sub"
                size="small"
                type="info"
                style="margin: 2px"
              >
                {{ sub }}
              </el-tag>
            </template>
            <span v-else style="color: #909399">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="registeredCapital" label="注册资本(万元)" width="130" />
        <el-table-column prop="legalPerson" label="法人" width="90" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import {
  getMockOverviewKpi,
  getMockEnterpriseBasicList,
  getMockEnterpriseDistribution,
} from '@/api/mock/monitor'
import type { MonitorKpi, EnterpriseBasicInfo } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref<MonitorKpi[]>([])
const tableData = ref<EnterpriseBasicInfo[]>([])
const searchKeyword = ref('')
const industryPieOption = ref({})
const equityBarOption = ref({})

const filteredTableData = computed(() => {
  if (!searchKeyword.value) return tableData.value
  return tableData.value.filter((item) => item.name.includes(searchKeyword.value))
})

onMounted(() => {
  kpiCards.value = getMockOverviewKpi()
  tableData.value = getMockEnterpriseBasicList(20)

  const distData = getMockEnterpriseDistribution()
  industryPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: distData,
      },
    ],
  }

  const enterprises = tableData.value.slice(0, 10)
  equityBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['本地占比', '外资占比'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: enterprises.map((e) => e.name),
      inverse: true,
      axisLabel: { width: 120, overflow: 'truncate' },
    },
    series: [
      {
        name: '本地占比',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'equity',
        data: enterprises.map((e) => e.localShareholderRatio),
      },
      {
        name: '外资占比',
        type: 'bar',
        barMaxWidth: 32,
        stack: 'equity',
        data: enterprises.map((e) => e.foreignShareholderRatio),
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
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.equity-bar-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}
.equity-bar {
  display: flex;
  width: 100px;
  height: 10px;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 5px;
}
.equity-bar__local {
  height: 100%;
  background: #1889e8;
}
.equity-bar__foreign {
  height: 100%;
  background: #fbd437;
}
.equity-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}
</style>
