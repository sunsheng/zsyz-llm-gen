<template>
  <div class="score-ring" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="ringColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
        style="transition: stroke-dashoffset 0.6s ease"
      />
    </svg>
    <div class="score-ring__content">
      <span class="score-ring__value" :style="{ color: ringColor }">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: number
    size?: number
    strokeWidth?: number
    color?: string
  }>(),
  {
    value: 0,
    size: 100,
    strokeWidth: 8,
    color: '',
  },
)

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - props.value / 100))
const trackColor = '#EBEEF5'

const ringColor = computed(() => {
  if (props.color) return props.color
  if (props.value >= 80) return '#67C23A'
  if (props.value >= 60) return '#1889E8'
  if (props.value >= 40) return '#E6A23C'
  return '#F56C6C'
})
</script>

<style lang="scss" scoped>
.score-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.score-ring__content {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}

.score-ring__value {
  font-size: 22px;
  font-weight: $font-weight-bold;
}
</style>
