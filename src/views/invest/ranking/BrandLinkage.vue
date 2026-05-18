<template>
  <div class="page-container">
    <PageHeader title="品牌联动与传播" subtitle="品牌联动与招商传播数据" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.label" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">活动类型分布</h4>
        <BaseChart :option="typeBarOption" height="300px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">活动趋势（月度）</h4>
        <BaseChart :option="trendLineOption" height="300px" />
      </div>
    </div>

    <div class="timeline-section">
      <h4 class="chart-panel__title">活动时间线</h4>
      <el-timeline>
        <el-timeline-item
          v-for="item in linkageList"
          :key="item.id"
          :timestamp="item.date"
          placement="top"
          :type="statusType(item.status)"
        >
          <el-card shadow="hover" class="timeline-card">
            <div class="timeline-card__header">
              <span class="timeline-card__name">{{ item.activityName }}</span>
              <el-tag :type="typeTag(item.type) as any" size="small">{{
                typeLabel(item.type)
              }}</el-tag>
            </div>
            <div class="timeline-card__body">
              <div class="timeline-card__row">
                <span class="label">合作机构</span>
                <span class="value">{{ item.partnerOrg }}</span>
              </div>
              <div class="timeline-card__row">
                <span class="label">邀请企业</span>
                <span class="value">{{ item.invitedCount }}家</span>
              </div>
              <div class="timeline-card__row">
                <span class="label">签约数</span>
                <span class="value">{{ item.signedCount }}家</span>
              </div>
              <div class="timeline-card__row">
                <span class="label">状态</span>
                <el-tag :type="statusTag(item.status) as any" size="small">{{
                  statusLabel(item.status)
                }}</el-tag>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchBrandLinkages } from '@/api/modules/investApi'
import type { BrandLinkage } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const linkageList = ref<BrandLinkage[]>([])
const kpiCards = ref<any[]>([])
const typeBarOption = ref({})
const trendLineOption = ref({})

function typeLabel(type: BrandLinkage['type']) {
  const map = { 'rank-publish': '榜单联合发布', 'city-tour': '城市巡展', forum: '产业论坛' }
  return map[type]
}

function typeTag(type: BrandLinkage['type']) {
  const map: Record<string, string> = {
    'rank-publish': '',
    'city-tour': 'success',
    forum: 'warning',
  }
  return map[type]
}

function statusLabel(status: BrandLinkage['status']) {
  const map = { planned: '计划中', ongoing: '进行中', completed: '已完成' }
  return map[status]
}

function statusTag(status: BrandLinkage['status']) {
  const map: Record<string, string> = { planned: 'info', ongoing: 'warning', completed: 'success' }
  return map[status]
}

function statusType(
  status: BrandLinkage['status'],
): '' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    planned: 'primary',
    ongoing: 'warning',
    completed: 'success',
  }
  return map[status]
}

function buildKpiCards(data: BrandLinkage[]) {
  const totalActivities = data.length
  const rankPublishCount = data.filter((d) => d.type === 'rank-publish').length
  const totalInvited = data.reduce((sum, d) => sum + d.invitedCount, 0)
  const totalSigned = data.reduce((sum, d) => sum + d.signedCount, 0)

  kpiCards.value = [
    {
      icon: 'Calendar',
      label: '活动数',
      value: totalActivities,
      unit: '场',
      trend: 'up' as const,
      trendValue: '+12%',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      icon: 'Document',
      label: '联合发布数',
      value: rankPublishCount,
      unit: '次',
      trend: 'up' as const,
      trendValue: '+8%',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      icon: 'User',
      label: '邀请企业数',
      value: totalInvited,
      unit: '家',
      trend: 'up' as const,
      trendValue: '+15%',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF1',
    },
    {
      icon: 'Checked',
      label: '签约数',
      value: totalSigned,
      unit: '家',
      trend: 'up' as const,
      trendValue: '+22%',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E1',
    },
  ]
}

function buildCharts(data: BrandLinkage[]) {
  // 活动类型分布柱状图
  const typeCount: Record<string, number> = { 'rank-publish': 0, 'city-tour': 0, forum: 0 }
  data.forEach((d) => {
    typeCount[d.type]++
  })
  typeBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['榜单联合发布', '城市巡展', '产业论坛'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: [typeCount['rank-publish'], typeCount['city-tour'], typeCount.forum],
      },
    ],
  }

  // 活动趋势折线图（月度）
  const monthMap = new Map<string, number>()
  data.forEach((d) => {
    const month = d.date.substring(0, 7)
    monthMap.set(month, (monthMap.get(month) || 0) + 1)
  })
  const months = Array.from(monthMap.keys()).sort()
  const counts = months.map((m) => monthMap.get(m) || 0)
  trendLineOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: counts,
        areaStyle: { opacity: 0.15 },
      },
    ],
  }
}

async function loadData() {
  const data = await fetchBrandLinkages(10)
  linkageList.value = data
  buildKpiCards(data)
  buildCharts(data)
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
.timeline-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.timeline-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.timeline-card__name {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.timeline-card__body {
  font-size: 13px;
}
.timeline-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
  .label {
    color: $text-secondary;
  }
  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }
}
</style>
