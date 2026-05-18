<template>
  <div class="enterprise-card" @click="$emit('click', enterprise)">
    <div class="enterprise-card__header">
      <h4 class="enterprise-card__name">{{ enterprise.name }}</h4>
      <EnterpriseTag
        v-for="tag in enterprise.tags?.slice(0, 2)"
        :key="tag"
        :text="tag"
        type="industry"
      />
    </div>
    <div class="enterprise-card__body">
      <div class="enterprise-card__row">
        <span class="enterprise-card__label">行业</span>
        <span class="enterprise-card__value">{{ enterprise.industry }}</span>
      </div>
      <div v-if="enterprise.revenue != null" class="enterprise-card__row">
        <span class="enterprise-card__label">营收</span>
        <span class="enterprise-card__value">{{ formatNumber(enterprise.revenue) }}万</span>
      </div>
      <div v-if="enterprise.growthRate != null" class="enterprise-card__row">
        <span class="enterprise-card__label">增长率</span>
        <TrendIndicator
          :direction="enterprise.growthRate >= 0 ? 'up' : 'down'"
          :value="Math.abs(enterprise.growthRate) + '%'"
        />
      </div>
      <div v-if="enterprise.riskScore != null" class="enterprise-card__row">
        <span class="enterprise-card__label">风险评分</span>
        <RiskIndicator
          :score="enterprise.riskScore"
          :level="enterprise.riskScore > 70 ? 'high' : enterprise.riskScore > 40 ? 'medium' : 'low'"
        />
      </div>
    </div>
    <div class="enterprise-card__footer">
      <span class="enterprise-card__location">{{ enterprise.city }}</span>
      <el-link type="primary" underline="never">查看详情</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import EnterpriseTag from './EnterpriseTag.vue'
import TrendIndicator from './TrendIndicator.vue'
import RiskIndicator from './RiskIndicator.vue'
import { formatNumber } from '@/utils/format'

defineProps<{
  enterprise: {
    name: string
    industry: string
    tags?: string[]
    revenue?: number
    growthRate?: number
    riskScore?: number
    city: string
  }
}>()

defineEmits<{ click: [enterprise: unknown] }>()
</script>

<style lang="scss" scoped>
.enterprise-card {
  padding: 20px;
  cursor: pointer;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.enterprise-card__header {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.enterprise-card__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
}

.enterprise-card__body {
  margin-bottom: 12px;
}

.enterprise-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}

.enterprise-card__label {
  color: $text-secondary;
}

.enterprise-card__value {
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.enterprise-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid $border-color-lighter;
}

.enterprise-card__location {
  font-size: 13px;
  color: $text-secondary;
}
</style>
