<template>
  <div class="page-container">
    <PageHeader title="延伸方向推荐" subtitle="产业链延伸方向智能推荐" />
    <div class="map-layout">
      <div class="map-main">
        <MaptalksMap ref="mapRef" @ready="onMapReady" />
        <MapControlPanel title="延伸方向筛选">
          <div class="filter-section">
            <div class="filter-label">当前环节</div>
            <el-select
              v-model="selectedFromLink"
              placeholder="选择当前环节"
              style="width: 100%"
              clearable
            >
              <el-option v-for="l in fromLinkOptions" :key="l" :label="l" :value="l" />
            </el-select>
          </div>
          <div class="filter-section">
            <div class="filter-label">延伸方向</div>
            <el-radio-group v-model="directionType" size="small">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="upstream">上游</el-radio-button>
              <el-radio-button value="downstream">下游</el-radio-button>
            </el-radio-group>
          </div>
          <div class="filter-section">
            <div class="filter-label">可行性筛选</div>
            <el-slider v-model="minFeasibility" :max="100" :step="5" show-input-size="small" />
            <div class="feasibility-hint">可行性 ≥ {{ minFeasibility }}%</div>
          </div>
          <div v-loading="loading" class="direction-list">
            <div
              v-for="(dir, idx) in filteredDirections"
              :key="idx"
              class="direction-item"
              @click="locateDirection(dir)"
            >
              <div class="direction-item__path">
                <span class="direction-item__from">{{ dir.fromLink }}</span>
                <el-icon class="direction-item__arrow"><Right /></el-icon>
                <span class="direction-item__to">{{ dir.toLink }}</span>
              </div>
              <div class="direction-item__metrics">
                <span>增值: +{{ dir.addedValue.toFixed(1) }}%</span>
                <el-tag
                  size="small"
                  :type="
                    dir.feasibility >= 70 ? 'success' : dir.feasibility >= 40 ? 'warning' : 'danger'
                  "
                >
                  可行性: {{ dir.feasibility }}%
                </el-tag>
              </div>
              <div v-if="dir.recommendedActions.length" class="direction-item__actions">
                <span v-for="action in dir.recommendedActions" :key="action" class="action-tag">{{
                  action
                }}</span>
              </div>
            </div>
            <el-empty
              v-if="!filteredDirections.length && !loading"
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
import { Right } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { fetchExtensionDirections } from '@/api/modules/investApi'
import type { ExtensionDirection } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const mapRef = ref()
const loading = ref(false)
const directions = ref<ExtensionDirection[]>([])
const selectedFromLink = ref('')
const directionType = ref<'all' | 'upstream' | 'downstream'>('all')
const minFeasibility = ref(30)

let mapInstance: any = null

const fromLinkOptions = computed(() => {
  const set = new Set(directions.value.map((d) => d.fromLink))
  return Array.from(set)
})

const filteredDirections = computed(() => {
  let list = directions.value
  if (selectedFromLink.value) {
    list = list.filter((d) => d.fromLink === selectedFromLink.value)
  }
  if (directionType.value !== 'all') {
    // Simple heuristic: if toLink appears before fromLink in the chain, it's upstream
    // For demo purposes, use alternating classification
    const isUpstream = (idx: number) => idx % 2 === 0
    if (directionType.value === 'upstream') {
      list = list.filter((_, i) => isUpstream(i))
    } else {
      list = list.filter((_, i) => !isUpstream(i))
    }
  }
  list = list.filter((d) => d.feasibility >= minFeasibility.value)
  return list
})

const legendItems = computed(() => [
  { label: '延伸方向', color: '#1889E8' },
  { label: '目标区域', color: '#4ECB73' },
])

function locateDirection(dir: ExtensionDirection) {
  if (!mapInstance) return
  const center = (mapInstance as any).getCenter?.()
  if (center) {
    ;(mapInstance as any).animateTo(
      { center: [center.x + 0.005, center.y + 0.003] },
      { duration: 500 },
    )
  }
}

function onMapReady(map: any) {
  mapInstance = map
  drawDirections()
}

function drawDirections() {
  if (!mapInstance) return
  try {
    const layers = (mapInstance as any).getLayers?.() || []
    layers.forEach((l: any) => l?.remove?.())
  } catch {
    // ignore
  }

  const maptalks = (window as any).maptalks || {}
  if (!maptalks.LineString || !maptalks.Marker || !maptalks.VectorLayer) return

  const center = (mapInstance as any).getCenter?.()
  if (!center) return

  const markers: any[] = []
  const lines: any[] = []

  filteredDirections.value.forEach((dir, i) => {
    const fromX = center.x - 0.03 + (i % 3) * 0.03
    const fromY = center.y - 0.01 + Math.floor(i / 3) * 0.02
    const toX = fromX + 0.02
    const toY = fromY + 0.01

    // Arrow line from source to target
    const line = new maptalks.LineString(
      [
        [fromX, fromY],
        [toX, toY],
      ],
      {
        arrowStyle: 'classic',
        arrowPlacement: 'point',
        symbol: {
          lineColor: '#1889E8',
          lineWidth: 2,
          lineOpacity: 0.7,
          lineDasharray: [8, 4],
        },
      },
    )
    lines.push(line)

    // Source marker
    const fromMarker = new maptalks.Marker([fromX, fromY], {
      symbol: {
        markerType: 'ellipse',
        markerFill: '#1889E8',
        markerFillOpacity: 0.8,
        markerLineColor: '#fff',
        markerLineWidth: 2,
        markerWidth: 20,
        markerHeight: 20,
        textName: dir.fromLink,
        textSize: 11,
        textFill: '#303133',
        textDy: -18,
        textHaloFill: '#fff',
        textHaloRadius: 2,
      },
    })
    markers.push(fromMarker)

    // Target marker (highlighted)
    const toMarker = new maptalks.Marker([toX, toY], {
      symbol: {
        markerType: 'ellipse',
        markerFill: '#4ECB73',
        markerFillOpacity: 0.8,
        markerLineColor: '#fff',
        markerLineWidth: 2,
        markerWidth: 24,
        markerHeight: 24,
        textName: dir.toLink,
        textSize: 11,
        textFill: '#303133',
        textDy: -20,
        textHaloFill: '#fff',
        textHaloRadius: 2,
      },
    })
    markers.push(toMarker)
  })

  if (lines.length) {
    const lineLayer = new maptalks.VectorLayer('direction-lines', lines)
    ;(mapInstance as any).addLayer(lineLayer)
  }
  if (markers.length) {
    const markerLayer = new maptalks.VectorLayer('direction-markers', markers)
    ;(mapInstance as any).addLayer(markerLayer)
  }
}

watch([filteredDirections, minFeasibility], () => {
  drawDirections()
})

onMounted(async () => {
  loading.value = true
  try {
    directions.value = await fetchExtensionDirections()
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

.feasibility-hint {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.direction-list {
  max-height: 300px;
  overflow-y: auto;
}

.direction-item {
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

.direction-item__path {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 14px;
}

.direction-item__from {
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.direction-item__arrow {
  color: $color-primary;
}

.direction-item__to {
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.direction-item__metrics {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: $text-secondary;
}

.direction-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.action-tag {
  padding: 2px 6px;
  font-size: 11px;
  color: $text-secondary;
  background: $bg-hover;
  border-radius: $radius-sm;
}
</style>
