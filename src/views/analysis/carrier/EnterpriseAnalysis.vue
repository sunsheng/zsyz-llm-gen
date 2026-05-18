<template>
  <div class="page-container">
    <PageHeader title="关联企业分析" subtitle="企业属性与分布分析" />

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">注册资本 vs 企业年龄</h4>
        <BaseChart :option="scatterOption" height="380px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业成熟度分布</h4>
        <BaseChart :option="maturityPieOption" height="380px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="section-title">企业明细</h4>
      <el-table :data="enterpriseList" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="200" />
        <el-table-column prop="capital" label="注册资本(万)" width="140" />
        <el-table-column prop="age" label="企业年龄(年)" width="130" />
        <el-table-column prop="maturity" label="成熟度" width="120">
          <template #default="{ row }">
            <el-tag :type="maturityTagType(row.maturity)" size="small">{{ row.maturity }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="industry" label="所属行业" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const scatterOption = ref({})
const maturityPieOption = ref({})

const enterpriseList = ref([
  {
    name: '华芯微电子科技有限公司',
    capital: 5000,
    age: 8,
    maturity: '成长期',
    industry: '集成电路',
  },
  {
    name: '博创智能装备有限公司',
    capital: 8000,
    age: 12,
    maturity: '成熟期',
    industry: '高端装备制造',
  },
  { name: '前沿材料科技有限公司', capital: 3000, age: 5, maturity: '成长期', industry: '前沿材料' },
  { name: '数字智联科技有限公司', capital: 2000, age: 3, maturity: '初创期', industry: '数字经济' },
  {
    name: '现代服务科技有限公司',
    capital: 12000,
    age: 15,
    maturity: '成熟期',
    industry: '现代服务业',
  },
  {
    name: '精密模具制造有限公司',
    capital: 4500,
    age: 10,
    maturity: '成长期',
    industry: '高端装备制造',
  },
  { name: '时尚创意科技有限公司', capital: 6000, age: 6, maturity: '成长期', industry: '时尚产业' },
  { name: '智慧物流有限公司', capital: 3500, age: 4, maturity: '初创期', industry: '现代服务业' },
  { name: '芯源半导体有限公司', capital: 15000, age: 18, maturity: '成熟期', industry: '数字经济' },
  { name: '博远前沿材料有限公司', capital: 1000, age: 1, maturity: '初创期', industry: '前沿材料' },
])

function maturityTagType(maturity: string): 'info' | 'primary' | 'success' | 'warning' | 'danger' {
  const map: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
    初创期: 'danger',
    成长期: 'warning',
    成熟期: 'success',
  }
  return map[maturity] || 'info'
}

onMounted(() => {
  const scatterData = enterpriseList.value.map((e) => [e.age, e.capital, e.name])
  scatterOption.value = {
    color: chartColors,
    tooltip: {
      formatter: (params: any) =>
        `${params.data[2]}<br/>年龄: ${params.data[0]}年<br/>注册资本: ${params.data[1]}万`,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '企业年龄(年)', min: 0 },
    yAxis: { type: 'value', name: '注册资本(万)' },
    series: [
      {
        type: 'scatter',
        data: scatterData,
        symbolSize: (val: number[]) => Math.sqrt(val[1]) * 1.2,
        itemStyle: { opacity: 0.7 },
      },
    ],
  }

  maturityPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}家 ({d}%)' },
        data: [
          { value: 30, name: '初创期' },
          { value: 185, name: '成长期' },
          { value: 171, name: '成熟期' },
        ],
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}
.chart-panel {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.table-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.section-title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
