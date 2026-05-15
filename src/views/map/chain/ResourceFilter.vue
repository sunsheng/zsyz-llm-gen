<template>
  <div class="page-container map-page">
    <PageHeader title="产业资源筛选" subtitle="多维度筛选产业资源">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="资源筛选">
        <div class="filter-section">
          <div class="filter-label">所属产业</div>
          <el-select
            v-model="filters.industry"
            placeholder="全部产业"
            clearable
            style="width: 100%"
            @change="applyFilters"
          >
            <el-option v-for="item in industries" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">所属行业</div>
          <el-select
            v-model="filters.industryCategory"
            placeholder="全部行业"
            clearable
            style="width: 100%"
            @change="applyFilters"
          >
            <el-option v-for="item in industryCategories" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">企业规模（规上企业）</div>
          <el-select
            v-model="filters.scale"
            placeholder="全部规模"
            clearable
            style="width: 100%"
            @change="applyFilters"
          >
            <el-option label="大型(5000人以上)" value="large" />
            <el-option label="中型(500-5000人)" value="medium" />
            <el-option label="小型(500人以下)" value="small" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">所属区域</div>
          <el-select
            v-model="filters.region"
            placeholder="全部区域"
            clearable
            style="width: 100%"
            @change="applyFilters"
          >
            <el-option
              v-for="city in regions"
              :key="city.code"
              :label="city.name"
              :value="city.code"
            />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">所属空间</div>
          <el-select
            v-model="filters.space"
            placeholder="全部空间"
            clearable
            style="width: 100%"
            @change="applyFilters"
          >
            <el-option v-for="item in spaceOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">是否百强</div>
          <el-switch v-model="filters.top100" active-text="百强" @change="applyFilters" />
        </div>
        <div class="filter-section">
          <div class="filter-label">资源类型</div>
          <el-checkbox-group v-model="filters.types" @change="applyFilters">
            <el-checkbox label="enterprise">企业</el-checkbox>
            <el-checkbox label="park">园区</el-checkbox>
            <el-checkbox label="institution">机构</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="filter-section">
          <div class="filter-label">产值范围 (万元)</div>
          <div class="range-inputs">
            <el-input-number
              v-model="filters.minValue"
              :min="0"
              placeholder="最小值"
              controls-position="right"
              style="width: 48%"
            />
            <span class="range-sep">-</span>
            <el-input-number
              v-model="filters.maxValue"
              :min="0"
              placeholder="最大值"
              controls-position="right"
              style="width: 48%"
            />
          </div>
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="applyFilters">筛选</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
        <div class="stats-section">
          <div class="stats-row">
            <span class="stats-label">筛选结果</span>
            <span class="stats-value">{{ filteredMarkers.length }} 条</span>
          </div>
        </div>
        <div class="results-list">
          <div
            v-for="marker in filteredMarkers.slice(0, 50)"
            :key="marker.id"
            class="result-item"
            @click="handleMarkerClick(marker)"
          >
            <div class="result-item__header">
              <span class="result-item__name">{{ marker.name }}</span>
              <el-tag size="small" :type="getTypeTagType(marker.type)">{{
                getTypeLabel(marker.type)
              }}</el-tag>
            </div>
            <div class="result-item__category">{{ marker.category }}</div>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="14" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { getMockMarkers, getMockGeoFeatures } from '@/api/mock/map'
import type { MapMarker } from '@/api/types/map'

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
const industryCategories = [
  '通用设备制造',
  '专用设备制造',
  '电气机械制造',
  '化学原料制造',
  '电子元件制造',
  '医药制造',
  '软件和信息技术',
  '商务服务',
]
const spaceOptions = [
  '凯州新城核心区',
  '辑庆片区',
  '兴隆片区',
  '成巴东片区',
  '凯州科技创新产业园',
  '凯州新城高端装备产业园',
]
const regions = getMockGeoFeatures('kaizhou').map((f) => f.properties)

const allMarkers = ref<MapMarker[]>(getMockMarkers(80))
let mapInstance: any = null
let markerLayer: any = null

const filters = reactive({
  industry: '',
  industryCategory: '',
  scale: '',
  region: '',
  space: '',
  top100: false,
  types: ['enterprise', 'park', 'institution'] as string[],
  minValue: undefined as number | undefined,
  maxValue: undefined as number | undefined,
})

const legendItems = [
  { label: '企业', color: '#1889E8' },
  { label: '园区', color: '#4ECB73' },
  { label: '机构', color: '#FBD437' },
]

const filteredMarkers = computed(() => {
  let list = allMarkers.value
  if (filters.industry) {
    list = list.filter((m) => m.category === filters.industry)
  }
  if (filters.industryCategory) {
    const extra = (m: MapMarker) => (m.extra as any) || {}
    list = list.filter((m) => extra(m).industryCategory === filters.industryCategory)
  }
  if (filters.scale) {
    const extra = (m: MapMarker) => (m.extra as any) || {}
    if (filters.scale === 'large') list = list.filter((m) => extra(m).employees >= 5000)
    else if (filters.scale === 'medium')
      list = list.filter((m) => {
        const e = extra(m).employees
        return e >= 500 && e < 5000
      })
    else if (filters.scale === 'small') list = list.filter((m) => extra(m).employees < 500)
  }
  if (filters.region) {
    const regionCenter = regions.find((r) => r.code === filters.region)?.center
    if (regionCenter) {
      list = list.filter((m) => {
        const dist = Math.sqrt(
          (m.longitude - regionCenter[0]) ** 2 + (m.latitude - regionCenter[1]) ** 2,
        )
        return dist < 0.6
      })
    }
  }
  if (filters.space) {
    const extra = (m: MapMarker) => (m.extra as any) || {}
    list = list.filter((m) => extra(m).space === filters.space)
  }
  if (filters.top100) {
    const extra = (m: MapMarker) => (m.extra as any) || {}
    list = list.filter((m) => extra(m).top100 === true)
  }
  if (filters.types.length > 0 && filters.types.length < 3) {
    list = list.filter((m) => filters.types.includes(m.type))
  }
  if (filters.minValue != null) {
    list = list.filter((m) => (m.value || 0) >= filters.minValue!)
  }
  if (filters.maxValue != null) {
    list = list.filter((m) => (m.value || 0) <= filters.maxValue!)
  }
  return list
})

function getTypeLabel(type: string) {
  const map: Record<string, string> = { enterprise: '企业', park: '园区', institution: '机构' }
  return map[type] || type
}

function getTypeTagType(type: string): 'primary' | 'success' | 'warning' {
  const map: Record<string, 'primary' | 'success' | 'warning'> = {
    enterprise: 'primary',
    park: 'success',
    institution: 'warning',
  }
  return map[type] || 'primary'
}

function getMarkerColor(type: string) {
  const map: Record<string, string> = {
    enterprise: '#1889E8',
    park: '#4ECB73',
    institution: '#FBD437',
  }
  return map[type] || '#1889E8'
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  markerLayer = new maptalks.VectorLayer('markers').addTo(map)
  drawMarkers()
}

function drawMarkers() {
  if (!markerLayer) return
  import('maptalks').then((maptalks) => {
    markerLayer.clear()
    filteredMarkers.value.forEach((m) => {
      const color = getMarkerColor(m.type)
      const marker = new maptalks.Marker([m.longitude, m.latitude], {
        id: m.id,
        symbol: {
          markerType: 'ellipse',
          markerFill: color,
          markerFillOpacity: 0.8,
          markerLineColor: '#fff',
          markerLineWidth: 1.5,
          markerWidth: 12,
          markerHeight: 12,
        },
      })
      markerLayer.addGeometry(marker)
    })
  })
}

function applyFilters() {
  drawMarkers()
}

function resetFilters() {
  filters.industry = ''
  filters.industryCategory = ''
  filters.scale = ''
  filters.region = ''
  filters.space = ''
  filters.top100 = false
  filters.types = ['enterprise', 'park', 'institution']
  filters.minValue = undefined
  filters.maxValue = undefined
  drawMarkers()
}

function handleMarkerClick(marker: MapMarker) {
  if (mapInstance) {
    mapInstance.setCenter([marker.longitude, marker.latitude])
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
  mapInstance?.setCenter([104.612, 30.884])
  mapInstance?.setZoom(14)
  resetFilters()
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

.filter-section {
  margin-bottom: 16px;
}

.filter-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.range-inputs {
  display: flex;
  gap: 8px;
  align-items: center;
}

.range-sep {
  color: $text-secondary;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.stats-section {
  padding: 12px;
  margin-bottom: 12px;
  background: $bg-hover;
  border-radius: $radius-base;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stats-label {
  font-size: 13px;
  color: $text-secondary;
}

.stats-value {
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.results-list {
  max-height: calc(100vh - 600px);
  overflow-y: auto;
}

.result-item {
  padding: 10px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }
}

.result-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.result-item__name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.result-item__category {
  font-size: 12px;
  color: $text-secondary;
}
</style>
