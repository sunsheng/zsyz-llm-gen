<template>
  <div v-loading="loading" class="page-container">
    <PageHeader title="园区资源全景展示" subtitle="园区产业资源全景展示" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">地理禀赋</h4>
        <BaseChart :option="geographyRadarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业基础（主导产业产值占比）</h4>
        <BaseChart :option="industryStackBarOption" height="320px" />
      </div>
    </div>

    <div class="chart-grid" style="grid-template-columns: 1fr">
      <div class="chart-panel">
        <h4 class="chart-panel__title">政策红利矩阵</h4>
        <BaseChart :option="policyHeatmapOption" height="280px" />
      </div>
    </div>

    <div class="section-title">园区详情</div>
    <div class="park-card-grid">
      <div v-for="park in parkList" :key="park.id" class="park-card">
        <div class="park-card__header">
          <span class="park-card__name">{{ park.name }}</span>
          <span class="park-card__area">{{ park.area }} 亩</span>
        </div>
        <div class="park-card__tags">
          <el-tag
            v-for="hub in park.transportHubs"
            :key="hub"
            size="small"
            type="info"
            class="park-card__tag"
          >
            {{ hub }}
          </el-tag>
        </div>
        <div class="park-card__industry">
          <span class="park-card__label">主导产业：</span>
          <span>{{ park.leadingIndustry }}</span>
          <span class="park-card__share">占比 {{ park.industryShare }}%</span>
        </div>
        <div class="park-card__policy-tags">
          <el-tag v-for="tag in park.policyTags" :key="tag" size="small" class="park-card__tag">
            {{ tag }}
          </el-tag>
        </div>
        <div class="park-card__enterprises">
          <span class="park-card__label">龙头企业：</span>
          <span>{{ park.leadingEnterprises.join('、') }}</span>
        </div>
        <div class="park-card__footer">
          <span class="park-card__available">可用面积：{{ park.availableArea }} 亩</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchParkResources } from '@/api/modules/investApi'
import type { ParkResource } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const parkList = ref<ParkResource[]>([])

const kpiCards = computed(() => {
  const list = parkList.value
  const totalArea = list.reduce((s, p) => s + p.area, 0)
  const totalAvailable = list.reduce((s, p) => s + p.availableArea, 0)
  const totalEnterprises = list.reduce((s, p) => s + p.leadingEnterprises.length, 0)
  return [
    {
      key: 'parkCount',
      icon: 'OfficeBuilding',
      label: '园区数',
      value: list.length,
      unit: '个',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'totalArea',
      icon: 'Grid',
      label: '总面积',
      value: totalArea,
      unit: '亩',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'availableArea',
      icon: 'Expand',
      label: '可用面积',
      value: totalAvailable,
      unit: '亩',
      iconColor: '#4ECB73',
      iconBgColor: '#EDF8F0',
    },
    {
      key: 'enterpriseCount',
      icon: 'UserFilled',
      label: '入驻企业数',
      value: totalEnterprises,
      unit: '家',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E1',
    },
  ]
})

// 地理禀赋雷达图
const geographyRadarOption = computed<EChartsOption>(() => {
  const list = parkList.value
  const names = list.map((p) => p.name)
  const dimensions = ['交通枢纽', '距高速', '距机场', '物流半径', '周边配套']
  return {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { data: names, bottom: 0, textStyle: { fontSize: 11 } },
    radar: {
      indicator: dimensions.map((d) => ({ name: d, max: 100 })),
      shape: 'circle' as const,
      splitNumber: 4,
      axisName: { fontSize: 11, color: '#909399' },
    },
    series: [
      {
        type: 'radar',
        data: list.map((p, i) => ({
          name: p.name,
          value: [
            p.transportHubs.length * 25,
            Math.floor(Math.random() * 30 + 60),
            Math.floor(Math.random() * 30 + 50),
            Math.floor(Math.random() * 30 + 55),
            Math.floor(Math.random() * 30 + 60),
          ],
          lineStyle: { color: chartColors[i % chartColors.length] },
          areaStyle: { color: chartColors[i % chartColors.length], opacity: 0.15 },
        })),
      },
    ],
  }
})

// 产业基础堆叠柱状图
const industryStackBarOption = computed<EChartsOption>(() => {
  const list = parkList.value
  const names = list.map((p) => p.name)
  const industrySet = new Set(list.map((p) => p.leadingIndustry))
  const industryArr = Array.from(industrySet)
  return {
    color: chartColors,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' as const } },
    legend: { data: industryArr, bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: { type: 'category' as const, data: names, axisLabel: { rotate: 15 } },
    yAxis: { type: 'value' as const, name: '产值占比(%)' },
    series: industryArr.map((ind) => ({
      name: ind,
      type: 'bar',
      stack: 'total',
      barMaxWidth: 32,
      data: list.map((p) => (p.leadingIndustry === ind ? p.industryShare : 0)),
    })),
  }
})

// 政策红利热力图
const policyHeatmapOption = computed<EChartsOption>(() => {
  const policyTypes = ['税收优惠', '人才补贴', '用地保障', '创新补贴', '金融支持']
  const list = parkList.value
  const names = list.map((p) => p.name)
  const data: [number, number, number][] = []
  list.forEach((p, yIdx) => {
    policyTypes.forEach((_t, xIdx) => {
      data.push([xIdx, yIdx, Math.floor(Math.random() * 40 + 60)])
    })
  })
  return {
    tooltip: {
      formatter: (p: any) => `${names[p.data[1]]}<br/>${policyTypes[p.data[0]]}：${p.data[2]}分`,
    },
    grid: { left: 120, right: 40, top: 10, bottom: 40 },
    xAxis: {
      type: 'category' as const,
      data: policyTypes,
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'category' as const,
      data: names,
      axisLabel: { fontSize: 11 },
    },
    visualMap: {
      min: 60,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['#e0f0ff', '#1889E8'] },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: true, fontSize: 11 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' } },
      },
    ],
  }
})

async function loadData() {
  loading.value = true
  try {
    parkList.value = await fetchParkResources()
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
.section-title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.park-card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.park-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.park-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.park-card__name {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.park-card__area {
  font-size: 14px;
  color: $text-secondary;
}
.park-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.park-card__tag {
  margin: 0;
}
.park-card__industry {
  margin-bottom: 8px;
  font-size: 14px;
  color: $text-regular;
}
.park-card__share {
  margin-left: 8px;
  color: $color-primary;
}
.park-card__policy-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.park-card__enterprises {
  margin-bottom: 12px;
  font-size: 14px;
  color: $text-regular;
}
.park-card__label {
  color: $text-secondary;
}
.park-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid $border-color-lighter;
}
.park-card__available {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}
</style>
