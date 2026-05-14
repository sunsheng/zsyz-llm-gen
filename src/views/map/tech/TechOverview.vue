<template>
  <div class="page-container map-page">
    <PageHeader title="技术链总览" subtitle="技术创新链全局地图与关键指标概览">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="技术链控制">
        <div class="filter-section">
          <div class="filter-label">技术领域</div>
          <el-select
            v-model="selectedField"
            placeholder="全部领域"
            clearable
            style="width: 100%"
            @change="updateMap"
          >
            <el-option v-for="field in techFields" :key="field" :label="field" :value="field" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">节点类型</div>
          <el-checkbox-group v-model="selectedTypes" @change="updateMap">
            <el-checkbox value="rd">研发机构</el-checkbox>
            <el-checkbox value="lab">重点实验室</el-checkbox>
            <el-checkbox value="patent">专利集群</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="tech-stats">
          <div class="tech-stats__title">技术指标</div>
          <div class="tech-stats__grid">
            <div class="tech-stat">
              <div class="tech-stat__value">{{ rdCount }}</div>
              <div class="tech-stat__label">研发机构</div>
            </div>
            <div class="tech-stat">
              <div class="tech-stat__value">{{ labCount }}</div>
              <div class="tech-stat__label">重点实验室</div>
            </div>
            <div class="tech-stat">
              <div class="tech-stat__value">{{ patentCount }}</div>
              <div class="tech-stat__label">专利集群</div>
            </div>
            <div class="tech-stat">
              <div class="tech-stat__value">{{ totalPatents }}</div>
              <div class="tech-stat__label">专利总数</div>
            </div>
          </div>
        </div>
        <div class="tech-list">
          <div class="tech-list__title">技术节点</div>
          <div
            v-for="node in filteredNodes"
            :key="node.id"
            class="tech-item"
            @click="handleNodeClick(node)"
          >
            <span class="tech-item__dot" :style="{ background: getNodeColor(node.type) }"></span>
            <div class="tech-item__info">
              <div class="tech-item__name">{{ node.name }}</div>
              <div class="tech-item__field">{{ node.field }}</div>
            </div>
            <div class="tech-item__patent">{{ node.patentCount }}项</div>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <div class="map-page__stat-cards">
          <StatCard
            icon="Cpu"
            label="技术领域"
            :value="techFields.length"
            unit="个"
            trend="up"
            trend-value="+2"
            icon-color="#975FE5"
            icon-bg-color="#F3F0FF"
          />
          <StatCard
            icon="School"
            label="研发机构"
            :value="rdCount"
            unit="家"
            trend="up"
            trend-value="+5"
            icon-color="#1889E8"
            icon-bg-color="#ECF5FF"
          />
          <StatCard
            icon="Medal"
            label="专利总数"
            :value="totalPatents"
            unit="项"
            trend="up"
            trend-value="+120"
            icon-color="#4ECB73"
            icon-bg-color="#F0F9EB"
          />
          <StatCard
            icon="TrendCharts"
            label="技术转化率"
            value="78.6"
            unit="%"
            trend="up"
            trend-value="+3.2"
            icon-color="#FBD437"
            icon-bg-color="#FDF6EC"
          />
        </div>
        <MaptalksMap :center="[104.612, 30.884]" :zoom="15" @ready="onMapReady" />
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

interface TechNode {
  id: string
  name: string
  type: 'rd' | 'lab' | 'patent'
  field: string
  lng: number
  lat: number
  patentCount: number
}

const techFields = [
  '人工智能',
  '量子计算',
  '生物医药',
  '新能源技术',
  '新材料技术',
  '集成电路',
  '航空航天',
  '智能制造',
]

function generateTechNodes(): TechNode[] {
  const types: TechNode['type'][] = ['rd', 'lab', 'patent']
  const nodes: TechNode[] = []
  techFields.forEach((field, fi) => {
    const count = 4 + Math.floor(Math.random() * 5)
    for (let i = 0; i < count; i++) {
      nodes.push({
        id: `tech-${fi}-${i}`,
        name: `${field}${types[i % 3] === 'rd' ? '研究院' : types[i % 3] === 'lab' ? '实验室' : '专利群'}${i + 1}`,
        type: types[i % 3],
        field,
        lng: 118 + Math.random() * 4,
        lat: 28 + Math.random() * 4,
        patentCount: Math.floor(Math.random() * 500 + 10),
      })
    }
  })
  return nodes
}

const allNodes = ref<TechNode[]>(generateTechNodes())
const selectedField = ref('')
const selectedTypes = ref<string[]>(['rd', 'lab', 'patent'])

let mapInstance: any = null
let nodeLayer: any = null

const filteredNodes = computed(() => {
  let list = allNodes.value
  if (selectedField.value) {
    list = list.filter((n) => n.field === selectedField.value)
  }
  if (selectedTypes.value.length > 0 && selectedTypes.value.length < 3) {
    list = list.filter((n) => selectedTypes.value.includes(n.type))
  }
  return list
})

const rdCount = computed(() => filteredNodes.value.filter((n) => n.type === 'rd').length)
const labCount = computed(() => filteredNodes.value.filter((n) => n.type === 'lab').length)
const patentCount = computed(() => filteredNodes.value.filter((n) => n.type === 'patent').length)
const totalPatents = computed(() => filteredNodes.value.reduce((s, n) => s + n.patentCount, 0))

const legendItems = [
  { label: '研发机构', color: '#1889E8' },
  { label: '重点实验室', color: '#975FE5' },
  { label: '专利集群', color: '#4ECB73' },
]

function getNodeColor(type: TechNode['type']) {
  const map = { rd: '#1889E8', lab: '#975FE5', patent: '#4ECB73' }
  return map[type]
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  nodeLayer = new maptalks.VectorLayer('tech-layer').addTo(map)
  updateMap()
}

async function updateMap() {
  if (!nodeLayer) return
  const maptalks = await import('maptalks')
  nodeLayer.clear()

  filteredNodes.value.forEach((n) => {
    const color = getNodeColor(n.type)
    const size = n.type === 'lab' ? 18 : 14
    nodeLayer.addGeometry(
      new maptalks.Marker([n.lng, n.lat], {
        id: n.id,
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

  // Draw connections between same-field nodes
  if (selectedField.value) {
    const fieldNodes = filteredNodes.value
    for (let i = 0; i < fieldNodes.length - 1; i++) {
      nodeLayer.addGeometry(
        new maptalks.LineString(
          [
            [fieldNodes[i].lng, fieldNodes[i].lat],
            [fieldNodes[i + 1].lng, fieldNodes[i + 1].lat],
          ],
          {
            symbol: {
              lineColor: '#975FE5',
              lineWidth: 1.5,
              lineOpacity: 0.4,
              lineDasharray: [6, 4],
            },
          },
        ),
      )
    }
  }
}

function handleNodeClick(node: TechNode) {
  if (mapInstance) {
    mapInstance.setCenter([node.lng, node.lat])
    mapInstance.setZoom(15)
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
  mapInstance?.setZoom(15)
  selectedField.value = ''
  selectedTypes.value = ['rd', 'lab', 'patent']
}

onUnmounted(() => {
  nodeLayer = null
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

.tech-stats {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.tech-stats__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.tech-stats__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.tech-stat {
  padding: 10px;
  text-align: center;
  background: $bg-hover;
  border-radius: $radius-base;
}

.tech-stat__value {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.tech-stat__label {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.tech-list {
  max-height: calc(100vh - 550px);
  padding-top: 16px;
  margin-top: 16px;
  overflow-y: auto;
  border-top: 1px solid $border-color-lighter;
}

.tech-list__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.tech-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }
}

.tech-item__dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tech-item__info {
  flex: 1;
  min-width: 0;
}

.tech-item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.tech-item__field {
  font-size: 12px;
  color: $text-secondary;
}

.tech-item__patent {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  white-space: nowrap;
}
</style>
