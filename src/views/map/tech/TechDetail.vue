<template>
  <div class="page-container map-page">
    <PageHeader title="技术链详情" subtitle="技术链创新节点详情与关联路径">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="技术链详情">
        <div class="filter-section">
          <div class="filter-label">选择技术领域</div>
          <el-select v-model="selectedField" placeholder="请选择技术领域" style="width: 100%" @change="updateDetail">
            <el-option v-for="field in techFields" :key="field" :label="field" :value="field" />
          </el-select>
        </div>
        <div class="chain-flow" v-if="selectedField">
          <div class="chain-flow__title">创新链条</div>
          <div class="chain-flow__steps">
            <div class="chain-flow__step" :class="{ 'is-active': activeStream === 'basic' }" @click="highlightStream('basic')">
              <div class="chain-flow__dot" style="background: #1889E8" />
              <span>基础研究</span>
              <span class="chain-flow__count">{{ basicCount }}</span>
            </div>
            <div class="chain-flow__arrow">→</div>
            <div class="chain-flow__step" :class="{ 'is-active': activeStream === 'applied' }" @click="highlightStream('applied')">
              <div class="chain-flow__dot" style="background: #975FE5" />
              <span>应用研究</span>
              <span class="chain-flow__count">{{ appliedCount }}</span>
            </div>
            <div class="chain-flow__arrow">→</div>
            <div class="chain-flow__step" :class="{ 'is-active': activeStream === 'transfer' }" @click="highlightStream('transfer')">
              <div class="chain-flow__dot" style="background: #4ECB73" />
              <span>成果转化</span>
              <span class="chain-flow__count">{{ transferCount }}</span>
            </div>
          </div>
        </div>
        <div class="detail-stats" v-if="selectedField">
          <div class="detail-stats__grid">
            <div class="detail-stat">
              <div class="detail-stat__value">{{ totalPatents }}</div>
              <div class="detail-stat__label">专利总数</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat__value">{{ conversionRate }}%</div>
              <div class="detail-stat__label">转化率</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat__value">{{ cooperationCount }}</div>
              <div class="detail-stat__label">合作项目</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat__value">{{ funding }}亿</div>
              <div class="detail-stat__label">研发投入</div>
            </div>
          </div>
        </div>
        <div class="node-list" v-if="selectedField">
          <div class="node-list__title">创新节点</div>
          <div
            v-for="node in filteredNodes"
            :key="node.id"
            class="node-item"
            :class="{ 'is-active': activeNodeId === node.id }"
            @click="handleNodeClick(node)"
          >
            <span class="node-item__dot" :style="{ background: getStreamColor(node.stream) }" />
            <div class="node-item__info">
              <div class="node-item__name">{{ node.name }}</div>
              <el-tag size="small" :type="getStreamTagType(node.stream)">{{ getStreamLabel(node.stream) }}</el-tag>
            </div>
            <div class="node-item__patents">{{ node.patentCount }}项</div>
          </div>
        </div>
        <div v-else class="empty-hint">
          <el-empty description="请选择一个技术领域查看详情" :image-size="80" />
        </div>
      </MapControlPanel>
      <div class="map-page__map">
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
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import MapLegend from '@/components/map/MapLegend.vue'

interface TechDetailNode {
  id: string
  name: string
  stream: 'basic' | 'applied' | 'transfer'
  lng: number
  lat: number
  patentCount: number
}

const techFields = ['人工智能', '量子计算', '生物医药', '新能源技术', '新材料技术', '集成电路', '航空航天', '智能制造']
const selectedField = ref('')
const activeNodeId = ref('')
const activeStream = ref('')

let mapInstance: any = null
let nodeLayer: any = null
let lineLayer: any = null

function generateNodes(field: string): TechDetailNode[] {
  const streams: TechDetailNode['stream'][] = ['basic', 'applied', 'transfer']
  const nodes: TechDetailNode[] = []
  const baseLng = 119 + Math.random() * 2
  const baseLat = 29 + Math.random() * 1
  let idx = 0
  streams.forEach(stream => {
    const count = 3 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      idx++
      nodes.push({
        id: `td-${field}-${idx}`,
        name: `${field}${stream === 'basic' ? '基础' : stream === 'applied' ? '应用' : '转化'}${i + 1}号`,
        stream,
        lng: baseLng + (Math.random() - 0.5) * 2.5,
        lat: baseLat + (Math.random() - 0.5) * 2,
        patentCount: Math.floor(Math.random() * 300 + 10)
      })
    }
  })
  return nodes
}

const nodesMap = new Map<string, TechDetailNode[]>()
techFields.forEach(f => nodesMap.set(f, generateNodes(f)))

const currentNodes = computed(() => {
  if (!selectedField.value) return []
  return nodesMap.get(selectedField.value) || []
})

const filteredNodes = computed(() => {
  if (!activeStream.value) return currentNodes.value
  return currentNodes.value.filter(n => n.stream === activeStream.value)
})

const basicCount = computed(() => currentNodes.value.filter(n => n.stream === 'basic').length)
const appliedCount = computed(() => currentNodes.value.filter(n => n.stream === 'applied').length)
const transferCount = computed(() => currentNodes.value.filter(n => n.stream === 'transfer').length)
const totalPatents = computed(() => currentNodes.value.reduce((s, n) => s + n.patentCount, 0))
const conversionRate = computed(() => {
  const transfer = currentNodes.value.filter(n => n.stream === 'transfer')
  const applied = currentNodes.value.filter(n => n.stream === 'applied')
  if (!applied.length) return 0
  return Math.round(transfer.length / applied.length * 100)
})
const cooperationCount = computed(() => Math.floor(Math.random() * 30 + 10))
const funding = computed(() => (Math.random() * 10 + 2).toFixed(1))

const legendItems = [
  { label: '基础研究', color: '#1889E8' },
  { label: '应用研究', color: '#975FE5' },
  { label: '成果转化', color: '#4ECB73' }
]

function getStreamColor(stream: TechDetailNode['stream']) {
  const map = { basic: '#1889E8', applied: '#975FE5', transfer: '#4ECB73' }
  return map[stream]
}

function getStreamLabel(stream: TechDetailNode['stream']) {
  const map = { basic: '基础研究', applied: '应用研究', transfer: '成果转化' }
  return map[stream]
}

function getStreamTagType(stream: TechDetailNode['stream']): 'primary' | 'success' | 'warning' {
  const map: Record<TechDetailNode['stream'], 'primary' | 'success' | 'warning'> = { basic: 'primary', applied: 'warning', transfer: 'success' }
  return map[stream]
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  lineLayer = new maptalks.VectorLayer('line-layer').addTo(map)
  nodeLayer = new maptalks.VectorLayer('node-layer').addTo(map)
}

async function updateDetail() {
  activeNodeId.value = ''
  activeStream.value = ''
  if (!nodeLayer || !lineLayer) return
  const maptalks = await import('maptalks')
  nodeLayer.clear()
  lineLayer.clear()

  if (!selectedField.value) return

  const nodes = currentNodes.value
  const basic = nodes.filter(n => n.stream === 'basic')
  const applied = nodes.filter(n => n.stream === 'applied')
  const transfer = nodes.filter(n => n.stream === 'transfer')

  // Draw connections: basic -> applied -> transfer
  const allGroups = [basic, applied, transfer]
  for (let g = 0; g < allGroups.length - 1; g++) {
    const fromGroup = allGroups[g]
    const toGroup = allGroups[g + 1]
    fromGroup.forEach(from => {
      const to = toGroup[Math.floor(Math.random() * toGroup.length)]
      if (to) {
        lineLayer.addGeometry(new maptalks.LineString(
          [[from.lng, from.lat], [to.lng, to.lat]],
          {
            symbol: {
              lineColor: '#975FE5',
              lineWidth: 2,
              lineOpacity: 0.4,
              lineDasharray: [6, 4]
            }
          }
        ))
      }
    })
  }

  // Draw nodes
  nodes.forEach(n => {
    const color = getStreamColor(n.stream)
    const size = n.stream === 'applied' ? 18 : 14
    nodeLayer.addGeometry(new maptalks.Marker([n.lng, n.lat], {
      id: n.id,
      symbol: {
        markerType: 'ellipse',
        markerFill: color,
        markerFillOpacity: 0.85,
        markerLineColor: '#fff',
        markerLineWidth: 2,
        markerWidth: size,
        markerHeight: size
      }
    }))
  })

  // Fit view
  if (nodes.length && mapInstance) {
    const lngs = nodes.map(n => n.lng)
    const lats = nodes.map(n => n.lat)
    mapInstance.setCenter([
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
      (Math.min(...lats) + Math.max(...lats)) / 2
    ])
  }
}

function highlightStream(stream: string) {
  activeStream.value = activeStream.value === stream ? '' : stream
  // Redraw with filter
  updateDetail()
}

function handleNodeClick(node: TechDetailNode) {
  activeNodeId.value = node.id
  if (mapInstance) {
    mapInstance.setCenter([node.lng, node.lat])
    mapInstance.setZoom(15)
  }
}

function handleZoomIn() { mapInstance?.zoomIn() }
function handleZoomOut() { mapInstance?.zoomOut() }
function handleReset() {
  mapInstance?.setCenter([104.612, 30.884])
  mapInstance?.setZoom(15)
  selectedField.value = ''
  activeNodeId.value = ''
  activeStream.value = ''
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

.filter-section {
  margin-bottom: 16px;
}

.filter-label {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 8px;
}

.chain-flow {
  margin-bottom: 16px;
}

.chain-flow__title {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.chain-flow__steps {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chain-flow__step {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: $radius-base;
  cursor: pointer;
  transition: background $transition-fast;
  font-size: 12px;
  color: $text-regular;

  &:hover,
  &.is-active {
    background: $color-primary-light-9;
    color: $color-primary;
  }
}

.chain-flow__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chain-flow__count {
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.chain-flow__arrow {
  color: $text-placeholder;
  font-size: 14px;
}

.detail-stats {
  margin-bottom: 16px;
}

.detail-stats__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.detail-stat {
  background: $bg-hover;
  border-radius: $radius-base;
  padding: 10px;
  text-align: center;
}

.detail-stat__value {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.detail-stat__label {
  font-size: 12px;
  color: $text-secondary;
  margin-top: 4px;
}

.node-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $border-color-lighter;
  max-height: calc(100vh - 580px);
  overflow-y: auto;
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

  &.is-active {
    background: $color-primary-light-9;
    outline: 1px solid $color-primary-light-5;
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

.node-item__patents {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  white-space: nowrap;
}

.empty-hint {
  margin-top: 40px;
}
</style>
