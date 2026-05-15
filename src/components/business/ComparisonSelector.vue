<template>
  <div class="comparison-selector">
    <div class="comparison-selector__header">
      <span class="comparison-selector__label">对比区域：</span>
      <el-select
        v-model="selectedIds"
        multiple
        filterable
        placeholder="选择对比区域（至少2个）"
        :max-collapse-tags="3"
        collapse-tags
        collapse-tags-tooltip
        style="width: 420px"
        @change="handleChange"
      >
        <el-option
          v-for="region in regions"
          :key="region.id"
          :label="region.name"
          :value="region.id"
        />
      </el-select>
      <el-button type="primary" :disabled="selectedIds.length < 2" @click="handleCompare">
        开始对比
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
    <div v-if="selectedRegions.length" class="comparison-selector__tags">
      <span class="comparison-selector__tags-label">已选区域：</span>
      <el-tag
        v-for="region in selectedRegions"
        :key="region.id"
        closable
        :type="getTagType(region.id)"
        @close="removeRegion(region.id)"
      >
        {{ region.shortName || region.name }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { CompareRegion } from '@/api/types/benchmarking'
import { fetchCompareRegions } from '@/api/modules/benchmarkingApi'

const TAG_TYPES = ['primary', 'success', 'warning', 'danger', 'info'] as const

const emit = defineEmits<{
  compare: [regionIds: string[], regionNames: string[]]
}>()

const regions = ref<CompareRegion[]>([])
const selectedIds = ref<string[]>(['cyj', 'zsj', 'jjj'])

const selectedRegions = computed(() => {
  return regions.value.filter((r) => selectedIds.value.includes(r.id))
})

function getTagType(id: string) {
  const index = selectedIds.value.indexOf(id)
  return TAG_TYPES[index % TAG_TYPES.length]
}

function removeRegion(id: string) {
  selectedIds.value = selectedIds.value.filter((i) => i !== id)
}

function handleChange() {
  // 仅更新已选标签，不自动触发对比
}

function handleCompare() {
  if (selectedIds.value.length < 2) return
  const names = selectedRegions.value.map((r) => r.shortName || r.name)
  emit('compare', [...selectedIds.value], names)
}

function handleReset() {
  selectedIds.value = []
  emit('compare', [], [])
}

onMounted(async () => {
  regions.value = await fetchCompareRegions()
  // 默认触发一次对比
  handleCompare()
})
</script>

<style lang="scss" scoped>
.comparison-selector {
  padding: 16px 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.comparison-selector__header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.comparison-selector__label {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.comparison-selector__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid #ebeef5;
}

.comparison-selector__tags-label {
  flex-shrink: 0;
  font-size: 13px;
  color: $text-regular;
}
</style>
