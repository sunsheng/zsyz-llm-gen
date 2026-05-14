<template>
  <div class="page-container">
    <PageHeader title="资源匹配" subtitle="招商资源与需求智能匹配">
      <template #actions>
        <el-button type="primary">开始匹配</el-button>
      </template>
    </PageHeader>

    <div class="map-layout">
      <div class="map-area">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="15" />
      </div>
      <div class="sidebar">
        <div class="detail-section">
          <h4 class="section-title">匹配详情</h4>
          <div class="match-summary">
            <div class="match-item">
              <span class="match-item__label">匹配企业</span>
              <span class="match-item__value">{{ matchData.totalMatches }}家</span>
            </div>
            <div class="match-item">
              <span class="match-item__label">高匹配度</span>
              <span class="match-item__value" style="color: #67c23a"
                >{{ matchData.highMatches }}家</span
              >
            </div>
            <div class="match-item">
              <span class="match-item__label">匹配率</span>
              <span class="match-item__value" style="color: #1889e8"
                >{{ matchData.matchRate }}%</span
              >
            </div>
          </div>
          <el-divider />
          <div class="match-list">
            <div v-for="item in matchDetails" :key="item.id" class="match-detail-item">
              <div class="match-detail-item__header">
                <span class="name">{{ item.name }}</span>
                <ScoreRing :value="item.matchScore" :size="40" :stroke-width="4" />
              </div>
              <div class="match-detail-item__body">
                <el-tag size="small">{{ item.industry }}</el-tag>
                <span class="amount">{{ item.investmentAmount.toLocaleString() }}万</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { getMockMapTargets } from '@/api/mock/invest'

const matchData = reactive({ totalMatches: 0, highMatches: 0, matchRate: 0 })
const matchDetails = ref<any[]>([])

onMounted(() => {
  const data = getMockMapTargets()
  matchDetails.value = data
  matchData.totalMatches = data.length
  matchData.highMatches = data.filter((d) => d.matchScore >= 80).length
  matchData.matchRate = Math.floor((matchData.highMatches / matchData.totalMatches) * 100)
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.map-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
}
.map-area {
  height: 600px;
  overflow: hidden;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.detail-section {
  padding: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.match-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.match-item {
  padding: 8px;
  text-align: center;
  background: $bg-hover;
  border-radius: $radius-base;
}
.match-item__label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: $text-secondary;
}
.match-item__value {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}
.match-list {
  max-height: 400px;
  overflow-y: auto;
}
.match-detail-item {
  padding: 10px 0;
  border-bottom: 1px solid $border-color-lighter;
}
.match-detail-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  .name {
    font-size: 14px;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}
.match-detail-item__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .amount {
    font-size: 13px;
    color: $text-primary;
  }
}
</style>
