<template>
  <div class="map-control-panel" :class="{ 'is-collapsed': collapsed }">
    <div class="map-control-panel__header">
      <span v-if="!collapsed" class="map-control-panel__title">{{ title }}</span>
      <el-icon class="map-control-panel__toggle" @click="collapsed = !collapsed">
        <component :is="collapsed ? 'DArrowRight' : 'DArrowLeft'" />
      </el-icon>
    </div>
    <div v-if="!collapsed" class="map-control-panel__body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '控制面板',
  },
)

const collapsed = ref(false)
</script>

<style lang="scss" scoped>
.map-control-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  width: 360px;
  max-height: calc(100% - 32px);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  border-radius: $radius-base;
  box-shadow: $shadow-dropdown;
  backdrop-filter: blur(10px);
  transition: width 0.3s ease;

  &.is-collapsed {
    width: 44px;
  }
}

.map-control-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid $border-color-lighter;
}

.map-control-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.map-control-panel__toggle {
  font-size: 16px;
  color: $text-secondary;
  cursor: pointer;
  &:hover {
    color: $color-primary;
  }
}

.map-control-panel__body {
  max-height: calc(100vh - 200px);
  padding: 16px;
  overflow-y: auto;
}
</style>
