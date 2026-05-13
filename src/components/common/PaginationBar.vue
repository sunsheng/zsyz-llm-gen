<template>
  <div class="pagination-bar">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSizeModel"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="handleChange"
      @current-change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  current: number
  total: number
  pageSize?: number
}>(), {
  pageSize: 20
})

const emit = defineEmits<{
  change: [current: number, pageSize: number]
}>()

const currentPage = computed({
  get: () => props.current,
  set: (val) => emit('change', val, pageSizeModel.value)
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('change', 1, val)
})

function handleChange() {
  emit('change', currentPage.value, pageSizeModel.value)
}
</script>

<style lang="scss" scoped>
.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
