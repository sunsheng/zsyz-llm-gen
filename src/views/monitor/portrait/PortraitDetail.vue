<template>
  <div class="page-container">
    <PageHeader title="画像详情" subtitle="企业画像深度分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="portrait-header">
      <div class="portrait-info">
        <div class="portrait-info__left">
          <ScoreRing :value="portrait.healthScore" :size="120" />
        </div>
        <div class="portrait-info__right">
          <h3 class="portrait-info__name">{{ portrait.name }}</h3>
          <div class="portrait-info__tags">
            <EnterpriseTag v-for="tag in portrait.tags" :key="tag" :text="tag" type="industry" />
          </div>
          <div class="portrait-info__meta">
            <span>行业: {{ portrait.industry }}</span>
            <span>规模: {{ portrait.scale }}</span>
            <span>成立: {{ portrait.established }}年</span>
            <span>营收: {{ portrait.revenue.toLocaleString() }}万元</span>
            <span>员工: {{ portrait.employees }}人</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">五维评分雷达图</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">营收趋势</h4>
        <BaseChart :option="revenueTrendOption" height="320px" />
      </div>
    </div>

    <div class="detail-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">评分详情</h4>
        <div class="score-list">
          <div class="score-item">
            <span class="score-item__label">健康评分</span>
            <el-progress
              :percentage="portrait.healthScore"
              :color="portrait.healthScore >= 80 ? '#67C23A' : '#1889E8'"
              :stroke-width="12"
            />
          </div>
          <div class="score-item">
            <span class="score-item__label">创新评分</span>
            <el-progress
              :percentage="portrait.innovationScore"
              :color="portrait.innovationScore >= 80 ? '#67C23A' : '#1889E8'"
              :stroke-width="12"
            />
          </div>
          <div class="score-item">
            <span class="score-item__label">成长评分</span>
            <el-progress
              :percentage="portrait.growthScore"
              :color="portrait.growthScore >= 80 ? '#67C23A' : '#1889E8'"
              :stroke-width="12"
            />
          </div>
          <div class="score-item">
            <span class="score-item__label">风险评分</span>
            <el-progress
              :percentage="portrait.riskScore"
              :color="portrait.riskScore <= 30 ? '#67C23A' : '#F56C6C'"
              :stroke-width="12"
            />
          </div>
        </div>
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">经营数据</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="企业名称">{{ portrait.name }}</el-descriptions-item>
          <el-descriptions-item label="行业">{{ portrait.industry }}</el-descriptions-item>
          <el-descriptions-item label="规模">{{ portrait.scale }}</el-descriptions-item>
          <el-descriptions-item label="成立年份">{{ portrait.established }}年</el-descriptions-item>
          <el-descriptions-item label="营收"
            >{{ portrait.revenue.toLocaleString() }}万元</el-descriptions-item
          >
          <el-descriptions-item label="员工数">{{ portrait.employees }}人</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import EnterpriseTag from '@/components/business/EnterpriseTag.vue'
import { getMockPortraitData } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const portrait = ref<any>({})
const radarOption = ref({})
const revenueTrendOption = ref({})

onMounted(() => {
  portrait.value = getMockPortraitData('detail-1')

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '健康评分', max: 100 },
        { name: '创新评分', max: 100 },
        { name: '成长评分', max: 100 },
        { name: '风险评分', max: 100 },
        { name: '综合评分', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              portrait.value.healthScore,
              portrait.value.innovationScore,
              portrait.value.growthScore,
              portrait.value.riskScore,
              Math.floor(
                (portrait.value.healthScore +
                  portrait.value.innovationScore +
                  portrait.value.growthScore) /
                  3,
              ),
            ],
            areaStyle: { opacity: 0.2 },
          },
        ],
      },
    ],
  }

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
  revenueTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      {
        name: '营收',
        type: 'line',
        smooth: true,
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5000 + 3000)),
      },
      {
        name: '利润',
        type: 'line',
        smooth: true,
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1500 + 500)),
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.portrait-header {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.portrait-info {
  display: flex;
  gap: 24px;
  align-items: center;
}
.portrait-info__name {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}
.portrait-info__tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.portrait-info__meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: $text-secondary;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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
.score-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.score-item {
  display: flex;
  gap: 12px;
  align-items: center;
}
.score-item__label {
  flex-shrink: 0;
  width: 80px;
  font-size: 14px;
  color: $text-regular;
}
.score-item .el-progress {
  flex: 1;
}
</style>
