<template>
  <div class="page-container map-page">
    <PageHeader title="配套资源分布" subtitle="全市各区域产业配套资源GIS展示">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="配套资源筛选">
        <div class="filter-section">
          <div class="filter-label">资源类型</div>
          <el-checkbox-group v-model="selectedTypes" @change="updateMap">
            <el-checkbox value="education">教育机构</el-checkbox>
            <el-checkbox value="medical">医疗机构</el-checkbox>
            <el-checkbox value="bank">银行分支</el-checkbox>
            <el-checkbox value="government">政府机构</el-checkbox>
            <el-checkbox value="transport">交通站点</el-checkbox>
            <el-checkbox value="hotel">餐饮酒店</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="filter-section">
          <div class="filter-label">所属区域</div>
          <el-select
            v-model="selectedRegion"
            placeholder="全部区域"
            clearable
            style="width: 100%"
            @change="updateMap"
          >
            <el-option v-for="region in regions" :key="region" :label="region" :value="region" />
          </el-select>
        </div>
        <div class="resource-stats">
          <div class="resource-stats__title">资源统计</div>
          <div class="resource-stats__grid">
            <div v-for="stat in typeStats" :key="stat.type" class="resource-stat">
              <div class="resource-stat__value">{{ stat.count }}</div>
              <div class="resource-stat__label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        <div class="resource-list">
          <div class="resource-list__title">配套资源列表</div>
          <div
            v-for="res in filteredResources"
            :key="res.id"
            class="resource-item"
            @click="handleResourceClick(res)"
          >
            <span class="resource-item__dot" :style="{ background: getTypeColor(res.type) }"></span>
            <div class="resource-item__info">
              <div class="resource-item__name">{{ res.name }}</div>
              <div class="resource-item__meta">{{ res.region }} · {{ getTypeLabel(res.type) }}</div>
            </div>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <div class="map-page__stat-cards">
          <StatCard
            icon="School"
            label="教育机构"
            :value="typeStats.find((s) => s.type === 'education')?.count || 0"
            unit="所"
            icon-color="#1889E8"
            icon-bg-color="#ECF5FF"
          />
          <StatCard
            icon="FirstAidKit"
            label="医疗机构"
            :value="typeStats.find((s) => s.type === 'medical')?.count || 0"
            unit="家"
            icon-color="#4ECB73"
            icon-bg-color="#F0F9EB"
          />
          <StatCard
            icon="OfficeBuilding"
            label="银行分支"
            :value="typeStats.find((s) => s.type === 'bank')?.count || 0"
            unit="个"
            icon-color="#FBD437"
            icon-bg-color="#FDF6EC"
          />
          <StatCard
            icon="Location"
            label="资源总数"
            :value="filteredResources.length"
            unit="处"
            trend="up"
            trend-value="+5"
            icon-color="#975FE5"
            icon-bg-color="#F3F0FF"
          />
        </div>
        <MaptalksMap :center="[120.5, 30.6]" :zoom="11" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import MapLegend from '@/components/map/MapLegend.vue'

type ResourceType = 'education' | 'medical' | 'bank' | 'government' | 'transport' | 'hotel'

interface Resource {
  id: string
  name: string
  type: ResourceType
  region: string
  lng: number
  lat: number
}

const regions = ['梧桐街道', '凤鸣街道', '崇福镇', '乌镇镇', '濮院镇', '洲泉镇', '大麻镇', '石门镇']

const typeLabels: Record<ResourceType, string> = {
  education: '教育机构',
  medical: '医疗机构',
  bank: '银行分支',
  government: '政府机构',
  transport: '交通站点',
  hotel: '餐饮酒店',
}

const typeColors: Record<ResourceType, string> = {
  education: '#1889E8',
  medical: '#4ECB73',
  bank: '#FBD437',
  government: '#F2637B',
  transport: '#975FE5',
  hotel: '#36CBCB',
}

function generateResources(): Resource[] {
  const types: ResourceType[] = ['education', 'medical', 'bank', 'government', 'transport', 'hotel']
  const resources: Resource[] = []
  regions.forEach((region, ri) => {
    types.forEach((type, ti) => {
      const count = 2 + Math.floor(Math.random() * 4)
      for (let i = 0; i < count; i++) {
        resources.push({
          id: `res-${ri}-${ti}-${i}`,
          name: `${region}${typeLabels[type]}${i + 1}号`,
          type,
          region,
          lng: 120.2 + Math.random() * 0.8,
          lat: 30.5 + Math.random() * 0.3,
        })
      }
    })
  })
  return resources
}

const allResources = ref<Resource[]>(generateResources())
const selectedTypes = ref<string[]>([
  'education',
  'medical',
  'bank',
  'government',
  'transport',
  'hotel',
])
const selectedRegion = ref('')

let mapInstance: any = null
let markerLayer: any = null

const filteredResources = computed(() => {
  let list = allResources.value
  if (selectedTypes.value.length > 0 && selectedTypes.value.length < 6) {
    list = list.filter((r) => selectedTypes.value.includes(r.type))
  }
  if (selectedRegion.value) {
    list = list.filter((r) => r.region === selectedRegion.value)
  }
  return list
})

const typeStats = computed(() => {
  const types: ResourceType[] = ['education', 'medical', 'bank', 'government', 'transport', 'hotel']
  return types.map((type) => ({
    type,
    label: typeLabels[type],
    count: filteredResources.value.filter((r) => r.type === type).length,
  }))
})

const legendItems = computed(() => {
  const types: ResourceType[] = ['education', 'medical', 'bank', 'government', 'transport', 'hotel']
  return types
    .filter((t) => selectedTypes.value.includes(t))
    .map((t) => ({ label: typeLabels[t], color: typeColors[t] }))
})

function getTypeColor(type: ResourceType) {
  return typeColors[type]
}

function getTypeLabel(type: ResourceType) {
  return typeLabels[type]
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  markerLayer = new maptalks.VectorLayer('resource-layer').addTo(map)
  updateMap()
}

async function updateMap() {
  if (!markerLayer) return
  const maptalks = await import('maptalks')
  markerLayer.clear()

  filteredResources.value.forEach((r) => {
    const color = typeColors[r.type]
    markerLayer.addGeometry(
      new maptalks.Marker([r.lng, r.lat], {
        id: r.id,
        symbol: {
          markerType: 'ellipse',
          markerFill: color,
          markerFillOpacity: 0.85,
          markerLineColor: '#fff',
          markerLineWidth: 2,
          markerWidth: 12,
          markerHeight: 12,
        },
      }),
    )
  })
}

function handleResourceClick(res: Resource) {
  if (mapInstance) {
    mapInstance.setCenter([res.lng, res.lat])
    mapInstance.setZoom(14)
  }
}

function handleZoomIn() {
  mapInstance?.zoomIn()
}
function handleZoomOut() {
  mapInstance?.zoomOut()
}
function handleReset() {
  mapInstance?.setCenter([120.5, 30.6])
  mapInstance?.setZoom(11)
  selectedTypes.value = ['education', 'medical', 'bank', 'government', 'transport', 'hotel']
  selectedRegion.value = ''
}

onUnmounted(() => {
  markerLayer = null
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

.map-page__stat-cards {
  position: absolute;
  top: 16px;
  left: 50%;
  z-index: 10;
  display: flex;
  gap: 16px;
  transform: translateX(-50%);

  .stat-card {
    min-width: 180px;
  }
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

.resource-stats {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.resource-stats__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.resource-stats__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.resource-stat {
  padding: 10px;
  text-align: center;
  background: $bg-hover;
  border-radius: $radius-base;
}

.resource-stat__value {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.resource-stat__label {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.resource-list {
  max-height: calc(100vh - 580px);
  padding-top: 16px;
  margin-top: 16px;
  overflow-y: auto;
  border-top: 1px solid $border-color-lighter;
}

.resource-list__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.resource-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }
}

.resource-item__dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.resource-item__info {
  flex: 1;
  min-width: 0;
}

.resource-item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.resource-item__meta {
  font-size: 12px;
  color: $text-secondary;
}
</style>
