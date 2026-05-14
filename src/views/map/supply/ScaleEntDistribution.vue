<template>
  <div class="page-container map-page">
    <PageHeader title="规上企业分布" subtitle="全市各区域规上企业分布GIS展示分析">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="规上企业筛选">
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
        <div class="filter-section">
          <div class="filter-label">所属行业</div>
          <el-select
            v-model="selectedIndustry"
            placeholder="全部行业"
            clearable
            style="width: 100%"
            @change="updateMap"
          >
            <el-option
              v-for="industry in industries"
              :key="industry"
              :label="industry"
              :value="industry"
            />
          </el-select>
        </div>
        <div class="ent-stats">
          <div class="ent-stats__title">区域统计</div>
          <div v-for="stat in regionStats" :key="stat.region" class="ent-stat-row">
            <span class="ent-stat-row__label">{{ stat.region }}</span>
            <span class="ent-stat-row__value">{{ stat.count }}家</span>
          </div>
        </div>
        <div class="ent-list">
          <div class="ent-list__title">规上企业列表</div>
          <div
            v-for="ent in filteredEnterprises"
            :key="ent.id"
            class="ent-item"
            @click="handleEntClick(ent)"
          >
            <div class="ent-item__info">
              <div class="ent-item__name">{{ ent.name }}</div>
              <div class="ent-item__meta">
                <span>{{ ent.region }}</span>
                <span class="ent-item__divider">|</span>
                <span>{{ ent.industry }}</span>
              </div>
            </div>
            <div class="ent-item__value">{{ ent.output.toLocaleString() }}万</div>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <div class="map-page__stat-cards">
          <StatCard
            icon="OfficeBuilding"
            label="规上企业总数"
            :value="filteredEnterprises.length"
            unit="家"
            trend="up"
            trend-value="+15"
            icon-color="#1889E8"
            icon-bg-color="#ECF5FF"
          />
          <StatCard
            icon="TrendCharts"
            label="总产值"
            :value="totalOutput"
            unit="亿"
            trend="up"
            trend-value="+8.2%"
            icon-color="#4ECB73"
            icon-bg-color="#F0F9EB"
          />
          <StatCard
            icon="DataLine"
            label="平均增速"
            value="6.8"
            unit="%"
            trend="up"
            trend-value="+1.2"
            icon-color="#FBD437"
            icon-bg-color="#FDF6EC"
          />
          <StatCard
            icon="MapLocation"
            label="覆盖区域"
            :value="activeRegions.length"
            unit="个"
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

interface Enterprise {
  id: string
  name: string
  region: string
  industry: string
  lng: number
  lat: number
  output: number
  growth: number
  website: string
  contact: string
}

const regions = ['梧桐街道', '凤鸣街道', '崇福镇', '乌镇镇', '濮院镇', '洲泉镇', '大麻镇', '石门镇']
const industries = [
  '高端装备制造',
  '新材料',
  '电子信息',
  '生物医药',
  '新能源',
  '现代纺织',
  '时尚产业',
]

function generateEnterprises(): Enterprise[] {
  const enterprises: Enterprise[] = []
  regions.forEach((region, ri) => {
    const count = 5 + Math.floor(Math.random() * 8)
    for (let i = 0; i < count; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)]
      enterprises.push({
        id: `ent-${ri}-${i}`,
        name: `${region}${industry}${i + 1}号企业`,
        region,
        industry,
        lng: 120.2 + Math.random() * 0.8,
        lat: 30.5 + Math.random() * 0.3,
        output: Math.floor(Math.random() * 80000 + 5000),
        growth: +(Math.random() * 20 - 5).toFixed(1),
        website: `www.ent${ri}${i}.example.com`,
        contact: `0573-88${ri}8${i}8${i}8`,
      })
    }
  })
  return enterprises
}

const allEnterprises = ref<Enterprise[]>(generateEnterprises())
const selectedRegion = ref('')
const selectedIndustry = ref('')

let mapInstance: any = null
let markerLayer: any = null

const filteredEnterprises = computed(() => {
  let list = allEnterprises.value
  if (selectedRegion.value) {
    list = list.filter((e) => e.region === selectedRegion.value)
  }
  if (selectedIndustry.value) {
    list = list.filter((e) => e.industry === selectedIndustry.value)
  }
  return list
})

const totalOutput = computed(() => {
  const total = filteredEnterprises.value.reduce((s, e) => s + e.output, 0)
  return (total / 10000).toFixed(1)
})

const activeRegions = computed(() => {
  const set = new Set(filteredEnterprises.value.map((e) => e.region))
  return Array.from(set)
})

const regionStats = computed(() => {
  const map = new Map<string, number>()
  filteredEnterprises.value.forEach((e) => {
    map.set(e.region, (map.get(e.region) || 0) + 1)
  })
  return Array.from(map.entries())
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
})

const legendItems = [
  { label: '规上企业', color: '#1889E8' },
  { label: '高产值(>5亿)', color: '#F2637B' },
]

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  markerLayer = new maptalks.VectorLayer('ent-layer').addTo(map)
  updateMap()
}

async function updateMap() {
  if (!markerLayer) return
  const maptalks = await import('maptalks')
  markerLayer.clear()

  filteredEnterprises.value.forEach((e) => {
    const color = e.output > 50000 ? '#F2637B' : '#1889E8'
    const size = e.output > 50000 ? 18 : 12
    markerLayer.addGeometry(
      new maptalks.Marker([e.lng, e.lat], {
        id: e.id,
        symbol: {
          markerType: 'ellipse',
          markerFill: color,
          markerFillOpacity: 0.85,
          markerLineColor: '#fff',
          markerLineWidth: 2,
          markerWidth: size,
          markerHeight: size,
        },
      }),
    )
  })
}

function handleEntClick(ent: Enterprise) {
  if (mapInstance) {
    mapInstance.setCenter([ent.lng, ent.lat])
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
  selectedRegion.value = ''
  selectedIndustry.value = ''
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

.ent-stats {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.ent-stats__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.ent-stat-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.ent-stat-row__label {
  color: $text-secondary;
}

.ent-stat-row__value {
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.ent-list {
  max-height: calc(100vh - 560px);
  padding-top: 16px;
  margin-top: 16px;
  overflow-y: auto;
  border-top: 1px solid $border-color-lighter;
}

.ent-list__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.ent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }
}

.ent-item__info {
  flex: 1;
  min-width: 0;
}

.ent-item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.ent-item__meta {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.ent-item__divider {
  margin: 0 4px;
}

.ent-item__value {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  white-space: nowrap;
}
</style>
