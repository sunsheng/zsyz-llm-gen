<template>
  <div class="stat-card" :class="[`stat-card--${trend}`]" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div class="stat-card__icon" :style="{ backgroundColor: iconBgColor }">
      <el-icon :size="20" :color="iconColor"><component :is="icon" /></el-icon>
    </div>
    <div class="stat-card__content">
      <div class="stat-card__label">{{ label }}</div>
      <div class="stat-card__value">{{ displayValue }}</div>
      <div v-if="trend !== 'flat'" class="stat-card__trend">
        <el-icon :size="12">
          <Top v-if="trend === 'up'" />
          <Bottom v-else-if="trend === 'down'" />
        </el-icon>
        <span>{{ trendValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Top, Bottom } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<{
  icon: string
  label: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
  iconColor?: string
  iconBgColor?: string
}>(), {
  trend: 'flat',
  unit: '',
  iconColor: '#1889E8',
  iconBgColor: '#ECF5FF'
})

const hovered = ref(false)

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString() + props.unit
  }
  return props.value + props.unit
})
</script>

<style lang="scss" scoped>
.stat-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: $radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card__content {
  flex: 1;
  min-width: 0;
}

.stat-card__label {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 8px;
}

.stat-card__value {
  font-size: 28px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  line-height: 1.2;
}

.stat-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  margin-top: 4px;
}

.stat-card--up .stat-card__trend {
  color: $color-success;
}

.stat-card--down .stat-card__trend {
  color: $color-danger;
}
</style>
