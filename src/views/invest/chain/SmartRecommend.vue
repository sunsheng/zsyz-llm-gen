<template>
  <div class="page-container">
    <PageHeader title="目标企业智能推荐" subtitle="基于产业链分析的目标企业智能推荐">
      <template #actions>
        <el-button type="primary">生成推荐</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">推荐匹配度分布</h4>
        <BaseChart :option="matchDistOption" height="300px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业推荐占比</h4>
        <BaseChart :option="industryPieOption" height="300px" />
      </div>
    </div>

    <div class="recommend-list">
      <h4 class="chart-panel__title">推荐企业</h4>
      <div class="card-grid">
        <el-card v-for="item in recommendList" :key="item.id" shadow="hover" class="recommend-card">
          <div class="recommend-card__header">
            <span class="recommend-card__name">{{ item.targetName }}</span>
            <el-tag :type="priorityTag(item.priority)" size="small">{{ item.priority }}优先</el-tag>
          </div>
          <div class="recommend-card__body">
            <div class="recommend-card__row">
              <span class="label">匹配链</span>
              <span class="value">{{ item.chainName }}</span>
            </div>
            <div class="recommend-card__row">
              <span class="label">匹配度</span>
              <ScoreRing :value="item.matchScore" :size="48" :stroke-width="5" />
            </div>
            <div class="recommend-card__row">
              <span class="label">预计投资</span>
              <span class="value">{{ item.estimatedInvestment.toLocaleString() }}万</span>
            </div>
          </div>
          <div class="recommend-card__reasons">
            <div v-for="(r, idx) in item.reasons" :key="idx" class="reason-item">
              <el-icon :size="12" color="#1889E8"><CircleCheckFilled /></el-icon>
              <span>{{ r }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { getMockChainKpiCards, getMockRecommendResults } from '@/api/mock/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const kpiCards = ref<any[]>([])
const recommendList = ref<any[]>([])
const matchDistOption = ref({})
const industryPieOption = ref({})

function priorityTag(p: string) {
  return p === '高' ? 'danger' : p === '中' ? 'warning' : 'info'
}

onMounted(() => {
  kpiCards.value = getMockChainKpiCards()
  recommendList.value = getMockRecommendResults(8)

  matchDistOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['60-65%', '65-70%', '70-75%', '75-80%', '80-85%', '85-90%', '90-95%'],
    },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barMaxWidth: 32, data: [5, 8, 15, 22, 18, 12, 6], barWidth: '40%' }],
  }

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
        data: [
          { name: '高端装备制造', value: 28 },
          { name: '新材料', value: 22 },
          { name: '生物医药', value: 18 },
          { name: '电子信息', value: 16 },
          { name: '新能源', value: 10 },
          { name: '其他', value: 6 },
        ],
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
.recommend-list {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.recommend-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.recommend-card__name {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.recommend-card__body {
  margin-bottom: 8px;
}
.recommend-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
  .label {
    color: $text-secondary;
  }
  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }
}
.recommend-card__reasons {
  padding-top: 8px;
  border-top: 1px solid $border-color-lighter;
}
.reason-item {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 2px 0;
  font-size: 12px;
  color: $text-regular;
}
</style>
