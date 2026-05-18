<template>
  <div class="page-container">
    <PageHeader title="产业资源分布" subtitle="产业资源地理分布全景" />
    <div class="map-layout">
      <div class="map-main">
        <MaptalksMap ref="mapRef" @ready="onMapReady" />
        <MapControlPanel title="产业资源筛选">
          <div class="filter-section">
            <div class="filter-label">产业筛选</div>
            <el-select
              v-model="selectedIndustries"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="选择产业"
              style="width: 100%"
            >
              <el-option v-for="item in industryOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
          <div class="filter-section">
            <div class="filter-label">指标切换</div>
            <el-radio-group v-model="activeMetric" size="small">
              <el-radio-button value="outputValue">产值</el-radio-button>
              <el-radio-button value="enterpriseCount">企业数</el-radio-button>
              <el-radio-button value="patentDensity">专利密度</el-radio-button>
            </el-radio-group>
          </div>
          <div class="filter-section">
            <div class="filter-label">图层控制</div>
            <el-switch v-model="heatmapVisible" active-text="热力图" inactive-text="" />
          </div>
          <div class="filter-section">
            <el-input
              v-model="keyword"
              placeholder="搜索企业/区域"
              clearable
              :prefix-icon="Search"
            />
          </div>
          <div v-loading="loading" class="result-list">
            <div
              v-for="item in filteredResources"
              :key="item.industryName"
              class="result-item"
              @click="locateResource(item)"
            >
              <div class="result-item__name">{{ item.industryName }}</div>
              <div class="result-item__metrics">
                <span>{{ metricLabel }}: {{ formatMetric(item) }}</span>
              </div>
            </div>
            <el-empty
              v-if="!filteredResources.length && !loading"
              description="暂无数据"
              :image-size="60"
            />
          </div>
        </MapControlPanel>
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { fetchMapResources } from '@/api/modules/investApi'
import type { MapResourceData } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const mapRef = ref()
const loading = ref(false)
const resources = ref<MapResourceData[]>([])
const selectedIndustries = ref<string[]>([])
const activeMetric = ref<'outputValue' | 'enterpriseCount' | 'patentDensity'>('outputValue')
const heatmapVisible = ref(true)
const keyword = ref('')

let mapInstance: any = null

const industryOptions = computed(() => resources.value.map((r) => r.industryName))

const metricLabel = computed(() => {
  const map = { outputValue: '产值', enterpriseCount: '企业数', patentDensity: '专利密度' }
  return map[activeMetric.value]
})

const filteredResources = computed(() => {
  let list = resources.value
  if (selectedIndustries.value.length) {
    list = list.filter((r) => selectedIndustries.value.includes(r.industryName))
  }
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter((r) => r.industryName.toLowerCase().includes(kw))
  }
  return list
})

const legendItems = computed(() => {
  if (!filteredResources.value.length) return []
  return filteredResources.value.map((r, i) => ({
    label: r.industryName,
    color: chartColors[i % chartColors.length],
  }))
})

function formatMetric(item: MapResourceData) {
  const val = item[activeMetric.value]
  if (activeMetric.value === 'outputValue') return (val / 10000).toFixed(1) + '万'
  if (activeMetric.value === 'patentDensity') return val.toFixed(1)
  return val.toString()
}

function onMapReady(map: any) {
  mapInstance = map
  drawMarkers()
}

function drawMarkers() {
  if (!mapInstance) return
  // Clear existing layers
  try {
    const layers = (mapInstance as any).getLayers?.() || []
    layers.forEach((l: any) => l?.remove?.())
  } catch {
    // ignore
  }

  const maptalks = (window as any).maptalks || {}
  if (!maptalks.Marker) return

  filteredResources.value.forEach((r, i) => {
    const color = chartColors[i % chartColors.length]
    const marker = new maptalks.Marker(r.center, {
      properties: { name: r.industryName },
      symbol: {
        markerType: 'ellipse',
        markerFill: color,
        markerFillOpacity: 0.7,
        markerLineColor: '#fff',
        markerLineWidth: 2,
        markerWidth: Math.max(20, r.radius / 5),
        markerHeight: Math.max(20, r.radius / 5),
      },
    })

    const layer = new maptalks.VectorLayer(`resource-${i}`, [marker], { visible: true })
    ;(mapInstance as any).addLayer(layer)
  })
}

function locateResource(item: MapResourceData) {
  if (mapInstance && (mapInstance as any).setCenter) {
    ;(mapInstance as any).setCenter(item.center)
    ;(mapInstance as any).setZoom(14)
  }
}

watch([filteredResources, heatmapVisible], () => {
  drawMarkers()
})

onMounted(async () => {
  loading.value = true
  try {
    resources.value = await fetchMapResources()
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.map-layout {
  height: calc(100vh - 160px);
}

.map-main {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-regular;
}

.result-list {
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid $border-color-lighter;

  &:hover {
    background: $bg-hover;
  }

  &:last-child {
    border-bottom: none;
  }
}

.result-item__name {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.result-item__metrics {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}
</style>
