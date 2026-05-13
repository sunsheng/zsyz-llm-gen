<template>
  <div class="page-container">
    <PageHeader title="链主详情" subtitle="产业链链主企业详细信息">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
      </template>
    </PageHeader>

    <div class="detail-grid">
      <div class="detail-card">
        <h3>{{ owner.ownerName }}</h3>
        <el-tag style="margin-left: 8px">{{ owner.chainName }}</el-tag>
        <el-divider />
        <div class="detail-rows">
          <div class="detail-row">
            <span class="label">匹配度</span>
            <span class="value" :style="{ color: owner.matchScore >= 80 ? '#67C23A' : '#E6A23C' }">{{ owner.matchScore }}%</span>
          </div>
          <div class="detail-row">
            <span class="label">带动指数</span>
            <span class="value">{{ owner.driveIndex }}</span>
          </div>
          <div class="detail-row">
            <span class="label">影响力范围</span>
            <span class="value">{{ owner.influenceRange }}%</span>
          </div>
          <div class="detail-row">
            <span class="label">合作企业</span>
            <span class="value">{{ owner.cooperationCount }}家</span>
          </div>
          <div class="detail-row">
            <span class="label">营收规模</span>
            <span class="value">{{ owner.revenue?.toLocaleString() }}万</span>
          </div>
        </div>
      </div>
      <div class="score-card">
        <h4 class="panel-title">适配评分</h4>
        <div class="score-grid">
          <div class="score-item">
            <ScoreRing :value="owner.matchScore || 0" :size="90" />
            <span class="score-label">匹配度</span>
          </div>
          <div class="score-item">
            <ScoreRing :value="owner.driveIndex || 0" :size="90" />
            <span class="score-label">带动能力</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { getMockChainOwners } from '@/api/mock/invest'

const route = useRoute()
const owner = ref<any>({})

onMounted(() => {
  const list = getMockChainOwners()
  const id = route.params.id as string
  owner.value = list.find(o => o.id === id) || list[0]
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.detail-card,
.score-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  h3 {
    display: inline;
    font-size: 20px;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
  }
}
.panel-title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid $border-color-lighter;
  font-size: 14px;
  .label { color: $text-secondary; }
  .value { color: $text-primary; font-weight: $font-weight-medium; }
}
.score-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  justify-items: center;
}
.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.score-label {
  font-size: 13px;
  color: $text-secondary;
}
</style>
