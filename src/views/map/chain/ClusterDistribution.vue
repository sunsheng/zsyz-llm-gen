<template>
  <div class="page-container map-page">
    <PageHeader title="产业集群分布" subtitle="查看3+1+1主导产业集聚情况，支持切换不同产业热力图" />
    <div class="map-page__body">
      <MapControlPanel title="集群分析">
        <div class="filter-section">
          <div class="filter-label">产业类型</div>
          <el-select
            v-model="selectedIndustry"
            placeholder="全部产业"
            clearable
            style="width: 100%"
            @change="updateClusters"
          >
            <el-option v-for="item in industries" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">聚合范围</div>
          <el-slider
            v-model="clusterRadius"
            :min="1"
            :max="10"
            :step="1"
            @change="updateClusters"
          />
        </div>
        <div class="cluster-list">
          <div class="cluster-list__title">产业集群列表</div>
          <div
            v-for="cluster in filteredClusters"
            :key="cluster.id"
            class="cluster-item"
            @click="handleClusterClick(cluster)"
          >
            <div class="cluster-item__header">
              <span class="cluster-item__name">{{ cluster.name }}</span>
              <span class="cluster-item__count">{{ cluster.count }}家</span>
            </div>
            <div class="cluster-item__meta">
              <el-tag
                size="small"
                :type="
                  cluster.industry === '高端装备制造' ||
                  cluster.industry === '新材料' ||
                  cluster.industry === '电子信息'
                    ? 'danger'
                    : cluster.industry === '生物医药' || cluster.industry === '新能源'
                      ? 'warning'
                      : 'info'
                "
                >{{ cluster.industry }}</el-tag
              >
              <span class="cluster-item__region">{{ cluster.region }}</span>
            </div>
            <el-progress
              :percentage="(cluster.count / maxCount) * 100"
              :stroke-width="6"
              :color="getClusterColor(cluster.count)"
              :show-text="false"
            />
          </div>
        </div>
        <div class="stats-section">
          <div class="stats-title">集群统计</div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-item__value">{{ filteredClusters.length }}</div>
              <div class="stat-item__label">产业集群</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value">{{ totalCount }}</div>
              <div class="stat-item__label">企业总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value">{{ maxCount }}</div>
              <div class="stat-item__label">最大集群</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value">{{ avgCount }}</div>
              <div class="stat-item__label">平均企业数</div>
            </div>
          </div>
        </div>
      </MapControlPanel>
      <div v-loading="loading" class="map-page__map">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="10" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { fetchClusterDistribution } from '@/api/modules/mapApi'
import type { ClusterData } from '@/api/types/map'

const industries = [
  '高端装备制造',
  '新材料',
  '生物医药',
  '电子信息',
  '新能源',
  '节能环保',
  '数字创意',
  '现代服务业',
]

const allClusters = ref<ClusterData[]>([])
const selectedIndustry = ref('')
const clusterRadius = ref(5)
const loading = ref(false)

let mapInstance: any = null
let clusterLayer: any = null

async function loadData() {
  loading.value = true
  allClusters.value = await fetchClusterDistribution()
  loading.value = false
}

const filteredClusters = computed(() => {
  if (!selectedIndustry.value) return allClusters.value
  return allClusters.value.filter((c) => c.industry === selectedIndustry.value)
})

const maxCount = computed(() => Math.max(...filteredClusters.value.map((c) => c.count)))
const totalCount = computed(() => filteredClusters.value.reduce((s, c) => s + c.count, 0))
const avgCount = computed(() => {
  const list = filteredClusters.value
  return list.length ? Math.round(totalCount.value / list.length) : 0
})

const legendItems = [
  { label: '大型集群(>150家)', color: '#F2637B' },
  { label: '中型集群(80-150家)', color: '#FBD437' },
  { label: '小型集群(<80家)', color: '#36CBCB' },
]

function getClusterColor(count: number) {
  if (count > 150) return '#F2637B'
  if (count > 80) return '#FBD437'
  return '#36CBCB'
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  clusterLayer = new maptalks.VectorLayer('cluster-layer').addTo(map)
  updateClusters()
}

async function updateClusters() {
  if (!clusterLayer) return
  const maptalks = await import('maptalks')
  clusterLayer.clear()

  const radiusFactor = clusterRadius.value / 5

  filteredClusters.value.forEach((c) => {
    const color = getClusterColor(c.count)
    const radius = Math.max(8000, c.count * 150 * radiusFactor)

    // Cluster circle
    clusterLayer.addGeometry(
      new maptalks.Circle([c.lng, c.lat], radius, {
        symbol: {
          polygonFill: color,
          polygonOpacity: 0.3,
          lineColor: color,
          lineWidth: 2,
          lineOpacity: 0.7,
          lineDasharray: [6, 4],
        },
      }),
    )

    // Center marker
    clusterLayer.addGeometry(
      new maptalks.Marker([c.lng, c.lat], {
        symbol: {
          markerType: 'ellipse',
          markerFill: color,
          markerFillOpacity: 0.9,
          markerLineColor: '#fff',
          markerLineWidth: 2,
          markerWidth: 24,
          markerHeight: 24,
        },
      }),
    )

    // Label
    clusterLayer.addGeometry(
      new maptalks.Marker([c.lng, c.lat + 0.15], {
        symbol: {
          textName: c.name,
          textSize: 13,
          textFill: '#303133',
          textHaloFill: '#fff',
          textHaloRadius: 2,
          textWeight: 'bold',
          textDy: -20,
        },
      }),
    )

    // Count label
    clusterLayer.addGeometry(
      new maptalks.Marker([c.lng, c.lat], {
        symbol: {
          textName: `${c.count}`,
          textSize: 12,
          textFill: '#fff',
          textWeight: 'bold',
        },
      }),
    )
  })
}

function handleClusterClick(cluster: { name: string; lng: number; lat: number }) {
  if (mapInstance) {
    mapInstance.setCenter([cluster.lng, cluster.lat])
    mapInstance.setZoom(10)
  }
}

function handleZoomIn() {
  mapInstance?.zoomIn()
}
function handleZoomOut() {
  mapInstance?.zoomOut()
}
function handleReset() {
  mapInstance?.setCenter([104.612, 30.884])
  mapInstance?.setZoom(10)
  selectedIndustry.value = ''
  clusterRadius.value = 5
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  clusterLayer = null
  mapInstance = null
})
</script>

<style lang="scss" scoped>
.map-page {
  height: calc(100vh - #{$header-height} - 40px);
}

.map-page__body {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: $radius-base;
}

.map-page__map {
  position: relative;
  width: 100%;
  height: 100%;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.cluster-list {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.cluster-list__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.cluster-item {
  padding: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }
}

.cluster-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.cluster-item__name {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.cluster-item__count {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.cluster-item__meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.cluster-item__region {
  font-size: 12px;
  color: $text-secondary;
}

.stats-section {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.stats-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-item {
  padding: 10px;
  text-align: center;
  background: $bg-hover;
  border-radius: $radius-base;
}

.stat-item__value {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.stat-item__label {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}
</style>
