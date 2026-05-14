<template>
  <div class="page-container map-page">
    <PageHeader title="供应链总览" subtitle="供应链全局地图与关键指标概览">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="供应链控制">
        <div class="filter-section">
          <div class="filter-label">产业链</div>
          <el-select v-model="selectedChain" placeholder="全部产业链" clearable style="width: 100%" @change="updateMap">
            <el-option v-for="chain in chains" :key="chain" :label="chain" :value="chain" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">节点类型</div>
          <el-checkbox-group v-model="selectedNodeTypes" @change="updateMap">
            <el-checkbox value="supplier">供应商</el-checkbox>
            <el-checkbox value="manufacturer">制造商</el-checkbox>
            <el-checkbox value="distributor">分销商</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="supply-stats">
          <div class="supply-stats__title">供应链指标</div>
          <div v-for="stat in supplyStats" :key="stat.label" class="supply-stat-row">
            <span class="supply-stat-row__label">{{ stat.label }}</span>
            <span class="supply-stat-row__value">{{ stat.value }}</span>
          </div>
        </div>
        <div class="node-list">
          <div class="node-list__title">关键节点</div>
          <div
            v-for="node in filteredNodes"
            :key="node.id"
            class="node-item"
            @click="handleNodeClick(node)"
          >
            <span class="node-item__dot" :style="{ background: getNodeColor(node.type) }" />
            <div class="node-item__info">
              <div class="node-item__name">{{ node.name }}</div>
              <div class="node-item__chain">{{ node.chain }}</div>
            </div>
            <el-tag size="small" :type="getNodeTagType(node.type)">{{ getNodeLabel(node.type) }}</el-tag>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <div class="map-page__stat-cards">
          <StatCard icon="Connection" label="供应链条数" :value="chains.length" unit="条" trend="up" trendValue="+3" iconColor="#1889E8" iconBgColor="#ECF5FF" />
          <StatCard icon="OfficeBuilding" label="节点总数" :value="totalCount" unit="个" trend="up" trendValue="+12" iconColor="#4ECB73" iconBgColor="#F0F9EB" />
          <StatCard icon="TrendCharts" label="供应效率" value="92.5" unit="%" trend="up" trendValue="+2.3" iconColor="#FBD437" iconBgColor="#FDF6EC" />
          <StatCard icon="Warning" label="风险节点" value="7" unit="个" trend="down" trendValue="-2" iconColor="#F2637B" iconBgColor="#FEF0F0" />
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

interface SupplyNode {
  id: string
  name: string
  type: 'supplier' | 'manufacturer' | 'distributor'
  chain: string
  lng: number
  lat: number
  value: number
}

const chains = ['高端装备制造链', '新材料产业链', '生物医药产业链', '电子信息产业链', '新能源产业链']

function generateNodes(): SupplyNode[] {
  const types: SupplyNode['type'][] = ['supplier', 'manufacturer', 'distributor']
  const nodes: SupplyNode[] = []
  chains.forEach((chain, ci) => {
    const count = 8 + Math.floor(Math.random() * 6)
    for (let i = 0; i < count; i++) {
      nodes.push({
        id: `supply-${ci}-${i}`,
        name: `${chain.split('链')[0]}${types[i % 3] === 'supplier' ? '供应' : types[i % 3] === 'manufacturer' ? '制造' : '分销'}${i + 1}号`,
        type: types[i % 3],
        chain,
        lng: 118 + Math.random() * 4,
        lat: 28 + Math.random() * 4,
        value: Math.floor(Math.random() * 50000 + 1000)
      })
    }
  })
  return nodes
}

const allNodes = ref<SupplyNode[]>(generateNodes())
const selectedChain = ref('')
const selectedNodeTypes = ref<string[]>(['supplier', 'manufacturer', 'distributor'])

let mapInstance: any = null
let nodeLayer: any = null
let lineLayer: any = null

const filteredNodes = computed(() => {
  let list = allNodes.value
  if (selectedChain.value) {
    list = list.filter(n => n.chain === selectedChain.value)
  }
  if (selectedNodeTypes.value.length > 0 && selectedNodeTypes.value.length < 3) {
    list = list.filter(n => selectedNodeTypes.value.includes(n.type))
  }
  return list
})

const totalCount = computed(() => filteredNodes.value.length)

const supplyStats = computed(() => [
  { label: '供应商', value: filteredNodes.value.filter(n => n.type === 'supplier').length },
  { label: '制造商', value: filteredNodes.value.filter(n => n.type === 'manufacturer').length },
  { label: '分销商', value: filteredNodes.value.filter(n => n.type === 'distributor').length },
  { label: '平均产值', value: filteredNodes.value.length ? Math.round(filteredNodes.value.reduce((s, n) => s + n.value, 0) / filteredNodes.value.length).toLocaleString() + '万' : '0' }
])

const legendItems = [
  { label: '供应商', color: '#1889E8' },
  { label: '制造商', color: '#4ECB73' },
  { label: '分销商', color: '#FBD437' }
]

function getNodeColor(type: SupplyNode['type']) {
  const map = { supplier: '#1889E8', manufacturer: '#4ECB73', distributor: '#FBD437' }
  return map[type]
}

function getNodeLabel(type: SupplyNode['type']) {
  const map = { supplier: '供应商', manufacturer: '制造商', distributor: '分销商' }
  return map[type]
}

function getNodeTagType(type: SupplyNode['type']): 'primary' | 'success' | 'warning' {
  const map: Record<SupplyNode['type'], 'primary' | 'success' | 'warning'> = { supplier: 'primary', manufacturer: 'success', distributor: 'warning' }
  return map[type]
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  lineLayer = new maptalks.VectorLayer('line-layer', { enableAltitude: false }).addTo(map)
  nodeLayer = new maptalks.VectorLayer('node-layer').addTo(map)
  updateMap()
}

async function updateMap() {
  if (!nodeLayer || !lineLayer) return
  const maptalks = await import('maptalks')
  nodeLayer.clear()
  lineLayer.clear()

  // Draw supply lines connecting nodes in the same chain
  if (selectedChain.value || selectedChain.value === '') {
    const activeChains = selectedChain.value ? [selectedChain.value] : chains
    activeChains.forEach(chain => {
      const chainNodes = filteredNodes.value.filter(n => n.chain === chain)
      if (chainNodes.length < 2) return
      // Connect supplier -> manufacturer -> distributor in order
      for (let i = 0; i < chainNodes.length - 1; i++) {
        const from = chainNodes[i]
        const to = chainNodes[i + 1]
        lineLayer.addGeometry(new maptalks.LineString(
          [[from.lng, from.lat], [to.lng, to.lat]],
          {
            symbol: {
              lineColor: '#975FE5',
              lineWidth: 2,
              lineOpacity: 0.5,
              lineDasharray: [8, 4]
            }
          }
        ))
      }
    })
  }

  // Draw nodes
  filteredNodes.value.forEach(n => {
    const color = getNodeColor(n.type)
    nodeLayer.addGeometry(new maptalks.Marker([n.lng, n.lat], {
      id: n.id,
      symbol: {
        markerType: 'ellipse',
        markerFill: color,
        markerFillOpacity: 0.85,
        markerLineColor: '#fff',
        markerLineWidth: 2,
        markerWidth: 16,
        markerHeight: 16
      }
    }))
  })
}

function handleNodeClick(node: SupplyNode) {
  if (mapInstance) {
    mapInstance.setCenter([node.lng, node.lat])
    mapInstance.setZoom(11)
  }
}

function handleZoomIn() { mapInstance?.zoomIn() }
function handleZoomOut() { mapInstance?.zoomOut() }
function handleReset() {
  mapInstance?.setCenter([104.612, 30.884])
  mapInstance?.setZoom(15)
  selectedChain.value = ''
  selectedNodeTypes.value = ['supplier', 'manufacturer', 'distributor']
}

onUnmounted(() => {
  nodeLayer = null
  lineLayer = null
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
  border-radius: $radius-base;
  overflow: hidden;
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
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  z-index: 10;

  .stat-card {
    min-width: 180px;
  }
}

.filter-section {
  margin-bottom: 16px;
}

.filter-label {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 8px;
}

.supply-stats {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.supply-stats__title {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.supply-stat-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.supply-stat-row__label {
  color: $text-secondary;
}

.supply-stat-row__value {
  color: $text-primary;
  font-weight: $font-weight-medium;
}

.node-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.node-list__title {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: $radius-base;
  cursor: pointer;
  transition: background $transition-fast;
  margin-bottom: 4px;

  &:hover {
    background: $bg-hover;
  }
}

.node-item__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.node-item__info {
  flex: 1;
  min-width: 0;
}

.node-item__name {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-item__chain {
  font-size: 12px;
  color: $text-secondary;
}
</style>
