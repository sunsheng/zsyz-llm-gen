<template>
  <div class="map-layer-toggle">
    <div class="map-layer-toggle__title">图层控制</div>
    <el-checkbox-group v-model="activeLayers" @change="handleChange">
      <el-checkbox v-for="layer in layers" :key="layer.id" :label="layer.id">
        <span class="map-layer-toggle__dot" :style="{ background: layer.color || '#1889E8' }" />
        {{ layer.name }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface LayerItem {
  id: string
  name: string
  color?: string
  visible?: boolean
}

const props = withDefaults(defineProps<{
  layers?: LayerItem[]
  modelValue?: string[]
}>(), {
  layers: () => [],
  modelValue: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

const activeLayers = ref<string[]>(
  props.modelValue.length ? props.modelValue : props.layers.filter(l => l.visible !== false).map(l => l.id)
)

watch(() => props.modelValue, (val) => {
  if (val.length) activeLayers.value = val
})

function handleChange(val: string[]) {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style lang="scss" scoped>
.map-layer-toggle__title {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.map-layer-toggle__dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
</style>
