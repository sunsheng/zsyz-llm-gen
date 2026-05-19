<template>
  <div class="map-legend" :class="{ 'is-collapsed': collapsed }">
    <div class="map-legend__header" @click="collapsed = !collapsed">
      <span>图例</span>
      <el-icon :size="14"><component :is="collapsed ? 'ArrowDown' : 'ArrowUp'" /></el-icon>
    </div>
    <div v-if="!collapsed" class="map-legend__body">
      <div v-for="item in items" :key="item.label" class="map-legend__item">
        <span class="map-legend__dot" :style="{ background: item.color }"></span>
        <span class="map-legend__label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    items?: { label: string; color: string }[]
  }>(),
  {
    items: () => [],
  },
)

const collapsed = ref(false)
</script>

<style lang="scss" scoped>
.map-legend {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.map-legend__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  cursor: pointer;
}

.map-legend__body {
  padding: 4px 12px 10px;
}

.map-legend__item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 0;
}

.map-legend__dot {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.map-legend__label {
  font-size: 12px;
  color: $text-regular;
}
</style>
