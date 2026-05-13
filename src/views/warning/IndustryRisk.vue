<template>
  <div class="page-container">
    <PageHeader title="行业风险" subtitle="行业整体风险监测与预警">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业风险评分</h4>
        <BaseChart :option="industryBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业风险趋势</h4>
        <BaseChart :option="trendOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">风险类型分布</h4>
        <BaseChart :option="typePieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业风险雷达图</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">行业风险详情</h4>
      <el-table :data="industryData" stripe border style="width: 100%">
        <el-table-column prop="name" label="行业" min-width="140" />
        <el-table-column prop="riskScore" label="风险评分" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.riskScore > 60 ? '#F56C6C' : row.riskScore > 30 ? '#E6A23C' : '#67C23A', fontWeight: 600 }">{{ row.riskScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseCount" label="风险企业数" width="120" />
        <el-table-column prop="mainRisk" label="主要风险" width="120" />
        <el-table-column prop="trend" label="趋势" width="80">
          <template #default="{ row }">
            <TrendIndicator :direction="row.riskChange > 0 ? 'up' : 'down'" :value="Math.abs(row.riskChange) + '%'" />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="风险描述" min-width="200" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import TrendIndicator from '@/components/business/TrendIndicator.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const industryData = ref<any[]>([])
const industryBarOption = ref({})
const trendOption = ref({})
const typePieOption = ref({})
const radarOption = ref({})

onMounted(() => {
  const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源', '节能环保', '数字创意', '现代服务业']
  const mainRisks = ['产能过剩', '原材料波动', '研发失败', '技术迭代', '补贴退坡', '环保合规', '数据安全', '需求萎缩']
  const descs = ['行业产能利用率持续走低，过剩产能消化压力较大', '原材料价格波动剧烈，成本控制难度增加', '新药研发周期长，失败风险较高', '技术快速迭代，存量技术面临淘汰风险', '政策补贴逐步退坡，企业盈利承压', '环保标准趋严，合规成本上升', '数据安全法规收紧，合规要求提升', '市场需求放缓，行业增长动力不足']

  industryData.value = industries.map((name, i) => ({
    name,
    riskScore: Math.floor(Math.random() * 50 + 20),
    enterpriseCount: Math.floor(Math.random() * 20 + 5),
    mainRisk: mainRisks[i],
    riskChange: Math.floor(Math.random() * 20 - 10),
    desc: descs[i]
  }))

  industryBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industries },
    yAxis: { type: 'value', max: 100 },
    series: [{
      type: 'bar',
      barWidth: '40%',
      data: industryData.value.map(d => ({
        value: d.riskScore,
        itemStyle: { color: d.riskScore > 60 ? '#F56C6C' : d.riskScore > 30 ? '#E6A23C' : '#67C23A' }
      }))
    }]
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: industries.slice(0, 4) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: industries.slice(0, 4).map(name => ({
      name,
      type: 'line',
      smooth: true,
      data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 30 + 25))
    }))
  }

  typePieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: [
        { name: '市场风险', value: 35 },
        { name: '技术风险', value: 28 },
        { name: '政策风险', value: 22 },
        { name: '供应链风险', value: 15 }
      ]
    }]
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: industries.slice(0, 3) },
    radar: {
      indicator: [
        { name: '市场风险', max: 100 },
        { name: '技术风险', max: 100 },
        { name: '政策风险', max: 100 },
        { name: '供应链风险', max: 100 },
        { name: '人才风险', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: industries.slice(0, 3).map(name => ({
        name,
        value: Array.from({ length: 5 }, () => Math.floor(Math.random() * 40 + 25)),
        areaStyle: { opacity: 0.15 }
      }))
    }]
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
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
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
