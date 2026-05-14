<template>
  <div class="page-container">
    <PageHeader title="区域详情" subtitle="区域产业发展深度分析">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
        <el-button type="primary">导出报告</el-button>
      </template>
    </PageHeader>

    <div class="detail-header">
      <div class="detail-header__info">
        <h3 class="detail-header__name">{{ regionName }}</h3>
        <p class="detail-header__desc">{{ regionDesc }}</p>
      </div>
      <div class="detail-header__tags">
        <el-tag v-for="tag in regionTags" :key="tag" effect="plain" size="large">{{ tag }}</el-tag>
      </div>
    </div>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">经济指标趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业结构分布</h4>
        <BaseChart :option="industryPieOption" height="320px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">五维能力评估</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业规模分布</h4>
        <BaseChart :option="scaleBarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">重点企业</h4>
      <el-table :data="enterpriseData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="所属行业" width="140" />
        <el-table-column prop="revenue" label="营收(亿元)" width="120" sortable />
        <el-table-column prop="employees" label="员工数" width="100" sortable />
        <el-table-column prop="growth" label="增长率(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="企业等级" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.level === '龙头' ? 'danger' : row.level === '骨干' ? 'warning' : 'info'"
              size="small"
            >
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const route = useRoute()
const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const regionName = ref('杭州市')
const regionDesc = ref('浙江省省会，长三角南翼中心城市，数字经济第一城')
const regionTags = ref(['数字经济', '先进制造', '生物医药', '新材料'])

const kpiCards = ref<any[]>([])
const enterpriseData = ref<any[]>([])
const trendOption = ref({})
const industryPieOption = ref({})
const radarOption = ref({})
const scaleBarOption = ref({})

onMounted(() => {
  const name = (route.query.name as string) || '杭州市'
  regionName.value = name

  kpiCards.value = [
    {
      key: 'gdp',
      label: 'GDP',
      value: 18753,
      unit: '亿元',
      trend: 'up' as const,
      trendValue: '+7.2%',
      icon: 'TrendCharts',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'enterprises',
      label: '规上企业',
      value: 3256,
      unit: '家',
      trend: 'up' as const,
      trendValue: '+128',
      icon: 'OfficeBuilding',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'patent',
      label: '有效专利',
      value: 18200,
      unit: '件',
      trend: 'up' as const,
      trendValue: '+15.6%',
      icon: 'Document',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'invest',
      label: '实际引资',
      value: 580,
      unit: '亿元',
      trend: 'up' as const,
      trendValue: '+8.3%',
      icon: 'Money',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
  ]

  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['GDP增速', '工业增加值', '投资增速'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'GDP增速',
        type: 'line',
        smooth: true,
        data: [6.2, 6.5, 7.1, 7.3, 7.0, 6.8, 7.2, 7.5, 7.1, 6.9, 7.3, 7.2],
      },
      {
        name: '工业增加值',
        type: 'line',
        smooth: true,
        data: [5.8, 6.1, 6.5, 6.8, 6.3, 6.0, 6.4, 6.9, 6.5, 6.2, 6.7, 6.5],
      },
      {
        name: '投资增速',
        type: 'line',
        smooth: true,
        data: [8.1, 8.5, 9.2, 8.8, 8.3, 7.9, 8.6, 9.0, 8.4, 8.1, 8.7, 8.3],
      },
    ],
  }

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
        data: [
          { value: 38, name: '数字经济' },
          { value: 22, name: '先进制造' },
          { value: 15, name: '生物医药' },
          { value: 12, name: '新材料' },
          { value: 8, name: '现代服务' },
          { value: 5, name: '其他' },
        ],
      },
    ],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '经济实力', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '产业集聚', max: 100 },
        { name: '人才密度', max: 100 },
        { name: '营商环境', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            name: regionName.value,
            value: [92, 88, 85, 90, 87],
            areaStyle: { opacity: 0.2 },
          },
        ],
      },
    ],
  }

  scaleBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['大型企业', '中型企业', '小型企业', '微型企业'] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        barWidth: '45%',
        data: [186, 523, 1580, 967],
        itemStyle: {
          color: (params: any) => chartColors[params.dataIndex],
        },
      },
    ],
  }

  const industries = ['数字经济', '先进制造', '生物医药', '新材料', '现代服务']
  const levels = ['龙头', '骨干', '一般']
  enterpriseData.value = Array.from({ length: 10 }, (_, i) => ({
    name: `${regionName.value}${['科技', '数字', '智能', '创新', '新兴', '高科', '精密', '前沿', '未来', '芯谷'][i]}有限公司`,
    industry: industries[i % industries.length],
    revenue: +(Math.random() * 200 + 10).toFixed(1),
    employees: Math.floor(Math.random() * 5000 + 100),
    growth: +(Math.random() * 30 - 5).toFixed(1),
    level: levels[i < 2 ? 0 : i < 5 ? 1 : 2],
  }))
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.detail-header__name {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.detail-header__desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
}
.detail-header__tags {
  display: flex;
  gap: 8px;
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
</style>
