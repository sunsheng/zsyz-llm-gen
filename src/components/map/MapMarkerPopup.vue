<template>
  <div class="map-marker-popup">
    <div class="map-marker-popup__header">
      <span class="map-marker-popup__name">{{ name }}</span>
      <el-tag v-if="tag" size="small" :type="tagType">{{ tag }}</el-tag>
    </div>
    <div class="map-marker-popup__body">
      <div v-for="item in metrics" :key="item.label" class="map-marker-popup__metric">
        <span class="map-marker-popup__label">{{ item.label }}</span>
        <span class="map-marker-popup__value">{{ item.value }}</span>
      </div>
    </div>
    <div class="map-marker-popup__footer">
      <el-link type="primary" :underline="false" @click="$emit('detail')">
        查看详情 &gt;
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  tag?: string
  tagType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  metrics?: { label: string; value: string }[]
}>()

withDefaults(defineProps<{
  name: string
  tag?: string
  tagType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  metrics?: { label: string; value: string }[]
}>(), {
  tag: '',
  tagType: 'primary',
  metrics: () => []
})

defineEmits<{
  detail: []
}>()
</script>

<style lang="scss" scoped>
.map-marker-popup {
  min-width: 240px;
  padding: 16px;
  background: #fff;
  border-radius: $radius-base;
  box-shadow: $shadow-dropdown;
}

.map-marker-popup__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.map-marker-popup__name {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.map-marker-popup__body {
  margin-bottom: 12px;
}

.map-marker-popup__metric {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.map-marker-popup__label {
  color: $text-secondary;
}

.map-marker-popup__value {
  color: $text-primary;
  font-weight: $font-weight-medium;
}

.map-marker-popup__footer {
  border-top: 1px solid $border-color-lighter;
  padding-top: 10px;
}
</style>
