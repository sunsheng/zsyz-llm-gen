<template>
  <div class="page-container">
    <PageHeader title="链主匹配" subtitle="产业链链主适配匹配分析">
      <template #actions>
        <el-button type="primary">重新匹配</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="content-card">
      <h4 class="panel-title">链主匹配结果</h4>
      <div class="match-grid">
        <el-card v-for="item in owners" :key="item.id" shadow="hover" class="match-card">
          <div class="match-card__header">
            <span class="match-card__chain">{{ item.chainName }}</span>
            <ScoreRing :value="item.matchScore" :size="48" :stroke-width="5" />
          </div>
          <div class="match-card__body">
            <div class="match-card__row">
              <span class="label">链主企业</span>
              <span class="value">{{ item.ownerName }}</span>
            </div>
            <div class="match-card__row">
              <span class="label">带动指数</span>
              <span class="value">{{ item.driveIndex }}</span>
            </div>
            <div class="match-card__row">
              <span class="label">影响力范围</span>
              <span class="value">{{ item.influenceRange }}%</span>
            </div>
            <div class="match-card__row">
              <span class="label">合作企业</span>
              <span class="value">{{ item.cooperationCount }}家</span>
            </div>
            <div class="match-card__row">
              <span class="label">营收规模</span>
              <span class="value">{{ item.revenue?.toLocaleString() }}万</span>
            </div>
          </div>
          <el-button type="primary" size="small" style="width: 100%; margin-top: 8px">查看详情</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { getMockChainOwners } from '@/api/mock/invest'

const kpiCards = ref<any[]>([])
const owners = ref<any[]>([])

onMounted(() => {
  owners.value = getMockChainOwners()
  kpiCards.value = [
    { key: 'chainCount', label: '产业链数', value: owners.value.length, unit: '条', trend: 'up', trendValue: '+10.0%', icon: 'Share', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
    { key: 'matchedCount', label: '已匹配', value: owners.value.filter(o => o.matchScore >= 70).length, unit: '条', trend: 'up', trendValue: '+20.0%', icon: 'CircleCheck', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
    { key: 'avgDrive', label: '平均带动', value: Math.floor(owners.value.reduce((s, o) => s + o.driveIndex, 0) / owners.value.length), unit: '分', trend: 'up', trendValue: '+8.5%', icon: 'TrendCharts', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
    { key: 'avgInfluence', label: '平均影响力', value: Math.floor(owners.value.reduce((s, o) => s + o.influenceRange, 0) / owners.value.length), unit: '%', trend: 'up', trendValue: '+5.2%', icon: 'Aim', iconColor: '#FBD437', iconBgColor: '#FFF8E6' }
  ]
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
.content-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.panel-title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.match-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.match-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.match-card__chain {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.match-card__row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
  .label { color: $text-secondary; }
  .value { color: $text-primary; font-weight: $font-weight-medium; }
}
</style>
