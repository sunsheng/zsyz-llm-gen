<template>
  <div class="graph-controls">
    <el-button-group>
      <el-tooltip content="放大" placement="top">
        <el-button :icon="ZoomIn" size="small" @click="$emit('zoomIn')" />
      </el-tooltip>
      <el-tooltip content="缩小" placement="top">
        <el-button :icon="ZoomOut" size="small" @click="$emit('zoomOut')" />
      </el-tooltip>
      <el-tooltip content="复位" placement="top">
        <el-button :icon="RefreshRight" size="small" @click="$emit('reset')" />
      </el-tooltip>
    </el-button-group>
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
.graph-controls {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 10;
}
</style>
