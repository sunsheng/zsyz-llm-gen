<template>
  <div class="page-container">
    <PageHeader title="对标管理工具" subtitle="产业对标分析与赶超路径规划" />

    <ComparisonSelector @compare="handleCompare" />

    <template v-if="benchmarkData.length">
      <!-- 对比矩阵 -->
      <div class="compare-matrix">
        <h4 class="section-title">核心维度对比矩阵</h4>
        <div class="compare-matrix__grid">
          <div v-for="item in benchmarkData" :key="item.dimension" class="compare-matrix__item">
            <div class="compare-matrix__metric-name">{{ item.dimension }}</div>
            <ComparisonBar
              :items="[
                { name: '本地', value: item.localValue },
                { name: '标杆', value: item.benchmarkValue },
              ]"
              metric-key="value"
              name-key="name"
            />
            <div class="compare-matrix__gap">
              <span class="gap-label">差距</span>
              <span
                :class="['gap-value', item.gap > 0 ? 'gap-value--negative' : 'gap-value--positive']"
              >
                {{ item.gap > 0 ? '-' : '+' }}{{ Math.abs(item.gap) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 雷达图 + 赶超路径 -->
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">多维雷达对比</h4>
          <BaseChart :option="radarOption" height="380px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">赶超路径</h4>
          <div v-if="selectedDimension" class="catch-up-path">
            <div class="catch-up-path__dimension">
              <el-tag type="primary" size="large">{{ selectedDimension }}</el-tag>
            </div>
            <el-scrollbar max-height="300px">
              <div
                v-for="item in benchmarkData"
                :key="item.dimension"
                class="catch-up-path__item"
                :class="{ 'catch-up-path__item--active': item.dimension === selectedDimension }"
                @click="selectedDimension = item.dimension"
              >
                <div class="catch-up-path__item-header">
                  <span class="catch-up-path__item-dim">{{ item.dimension }}</span>
                  <span
                    :class="[
                      'catch-up-path__item-gap',
                      item.gap > 0
                        ? 'catch-up-path__item-gap--negative'
                        : 'catch-up-path__item-gap--positive',
                    ]"
                  >
                    差距: {{ item.gap > 0 ? '-' : '+' }}{{ Math.abs(item.gap) }}
                  </span>
                </div>
                <p class="catch-up-path__item-text">{{ item.catchUpPath }}</p>
              </div>
            </el-scrollbar>
          </div>
          <el-empty v-else description="请选择维度查看赶超路径" />
        </div>
      </div>
    </template>

    <el-empty v-else description="请选择对比区域后点击开始对比" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ComparisonSelector from '@/components/business/ComparisonSelector.vue'
import ComparisonBar from '@/components/business/ComparisonBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchBenchmarkItems } from '@/api/modules/investApi'
import type { BenchmarkItem } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const benchmarkData = ref<BenchmarkItem[]>([])
const selectedDimension = ref('')
const radarOption = ref<Record<string, unknown>>({})

async function handleCompare() {
  benchmarkData.value = await fetchBenchmarkItems()
  if (benchmarkData.value.length) {
    selectedDimension.value = benchmarkData.value[0].dimension
  }
  buildRadarOption()
}

function buildRadarOption() {
  const dimensions = benchmarkData.value.map((d) => d.dimension)
  const maxValues = benchmarkData.value.map((d) => Math.max(d.localValue, d.benchmarkValue) * 1.2)

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: ['本地', '标杆'] },
    radar: {
      indicator: dimensions.map((name, i) => ({ name, max: maxValues[i] })),
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: benchmarkData.value.map((d) => d.localValue),
            name: '本地',
            areaStyle: { opacity: 0.15 },
          },
          {
            value: benchmarkData.value.map((d) => d.benchmarkValue),
            name: '标杆',
            areaStyle: { opacity: 0.15 },
          },
        ],
      },
    ],
  }
}

onMounted(() => {
  handleCompare()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.compare-matrix {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.compare-matrix__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.compare-matrix__item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.compare-matrix__metric-name {
  margin-bottom: 8px;
  font-size: 13px;
  color: $text-secondary;
}

.compare-matrix__gap {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 4px;
}

.gap-label {
  font-size: 12px;
  color: $text-secondary;
}

.gap-value {
  font-size: 13px;
  font-weight: $font-weight-medium;

  &--negative {
    color: #f2637b;
  }

  &--positive {
    color: #4ecb73;
  }
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.catch-up-path__dimension {
  margin-bottom: 12px;
}

.catch-up-path__item {
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #ebeef5;
  border-radius: $radius-base;
  transition: border-color 0.2s;

  &--active {
    background: #ecf5ff;
    border-color: $color-primary;
  }

  &:hover {
    border-color: #c0c4cc;
  }
}

.catch-up-path__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.catch-up-path__item-dim {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.catch-up-path__item-gap {
  font-size: 12px;

  &--negative {
    color: #f2637b;
  }

  &--positive {
    color: #4ecb73;
  }
}

.catch-up-path__item-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: $text-regular;
}
</style>
