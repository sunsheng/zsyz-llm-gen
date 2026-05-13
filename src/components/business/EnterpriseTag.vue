<template>
  <span class="enterprise-tag" :style="tagStyle">{{ text }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ENTERPRISE_TAG_TYPES } from '@/utils/constants'

const props = withDefaults(defineProps<{
  text: string
  type?: 'industry' | 'scale' | 'status' | 'qualify'
}>(), {
  type: 'industry'
})

const tagStyle = computed(() => {
  const colors = ENTERPRISE_TAG_TYPES[props.type] || ENTERPRISE_TAG_TYPES.industry
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    borderColor: colors.color
  }
})
</script>

<style lang="scss" scoped>
.enterprise-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 3px;
  border: 1px solid;
  white-space: nowrap;
  line-height: 1.5;
}
</style>
