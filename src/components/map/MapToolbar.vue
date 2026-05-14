<template>
  <div class="map-toolbar">
    <el-tooltip content="放大" placement="left">
      <el-button circle :icon="ZoomIn" @click="$emit('zoomIn')" />
    </el-tooltip>
    <el-tooltip content="缩小" placement="left">
      <el-button circle :icon="ZoomOut" @click="$emit('zoomOut')" />
    </el-tooltip>
    <el-tooltip content="复位" placement="left">
      <el-button circle :icon="RefreshRight" @click="$emit('reset')" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ZoomIn, ZoomOut, RefreshRight } from '@element-plus/icons-vue'

defineEmits<{
  zoomIn: []
  zoomOut: []
  reset: []
}>()
</script>

<style lang="scss" scoped>
.map-toolbar {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }

  .el-button {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.95);
    border-color: $border-color-lighter;

    :deep(.el-icon) {
      font-size: 24px;
    }
  }
}
</style>
