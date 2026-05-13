<template>
  <div class="map-toolbar">
    <el-tooltip content="放大" placement="left">
      <el-button circle :icon="ZoomIn" size="small" @click="$emit('zoomIn')" />
    </el-tooltip>
    <el-tooltip content="缩小" placement="left">
      <el-button circle :icon="ZoomOut" size="small" @click="$emit('zoomOut')" />
    </el-tooltip>
    <el-tooltip content="复位" placement="left">
      <el-button circle :icon="RefreshRight" size="small" @click="$emit('reset')" />
    </el-tooltip>
    <el-tooltip content="全屏" placement="left">
      <el-button circle :icon="FullScreen" size="small" @click="$emit('fullscreen')" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ZoomIn, ZoomOut, RefreshRight, FullScreen } from '@element-plus/icons-vue'

defineEmits<{
  zoomIn: []
  zoomOut: []
  reset: []
  fullscreen: []
}>()
</script>

<style lang="scss" scoped>
.map-toolbar {
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;

  .el-button {
    background: rgba(255, 255, 255, 0.95);
    border-color: $border-color-lighter;
  }
}
</style>
