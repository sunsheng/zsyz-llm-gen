<template>
  <div class="page-container">
    <PageHeader title="对比维度" subtitle="多维度园区对比分析" />

    <el-tabs v-model="activeDimension" type="border-card">
      <el-tab-pane v-for="dim in dimensions" :key="dim.key" :label="dim.label" :name="dim.key">
        <el-table :data="dim.tableData" stripe border style="width: 100%">
          <el-table-column prop="indicator" label="指标" min-width="200" fixed />
          <el-table-column v-for="park in compareParks" :key="park" :label="park" width="160">
            <template #default="{ row }">
              <span :class="{ 'highlight-max': row[park + '_isMax'] }">{{ row[park] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { fetchComparisonDimensions } from '@/api/modules/analysisApi'
import type { ComparisonDimensionData } from '@/api/types/analysis'

const activeDimension = ref('basic')
const compareParks = ref<string[]>([])
const rawDimensions = ref<ComparisonDimensionData[]>([])

const dimensions = computed(() => {
  return rawDimensions.value.map((dim) => ({
    ...dim,
    tableData: dim.tableData.map((row: Record<string, string>) => {
      const numericValues = compareParks.value
        .map((park) => ({ park, num: parseFloat(row[park]) }))
        .filter((v) => !isNaN(v.num))
      const maxPark =
        numericValues.length > 1 ? numericValues.reduce((a, b) => (a.num > b.num ? a : b)).park : ''
      const enhancedRow: Record<string, any> = { ...row }
      compareParks.value.forEach((park) => {
        enhancedRow[park + '_isMax'] = park === maxPark
      })
      return enhancedRow
    }),
  }))
})

async function loadData() {
  const data = await fetchComparisonDimensions()
  compareParks.value = data.compareParks
  rawDimensions.value = data.dimensions
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.highlight-max {
  font-weight: $font-weight-bold;
  color: $color-primary;
}
</style>
