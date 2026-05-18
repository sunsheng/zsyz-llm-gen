<template>
  <div class="page-container">
    <PageHeader title="优势环节识别" subtitle="区域产业优势环节识别分析" />
    <div class="map-layout">
      <div class="map-main">
        <MaptalksMap ref="mapRef" @ready="onMapReady" />
        <MapControlPanel title="优势环节筛选">
          <div class="filter-section">
            <div class="filter-label">指标权重调节</div>
            <div class="slider-group">
              <div class="slider-item">
                <span class="slider-item__label">产值占比</span>
                <el-slider
                  v-model="weights.outputShare"
                  :max="100"
                  :step="5"
                  show-input-size="small"
                />
              </div>
              <div class="slider-item">
                <span class="slider-item__label">专利密度</span>
                <el-slider
                  v-model="weights.patentDensity"
                  :max="100"
                  :step="5"
                  show-input-size="small"
                />
              </div>
              <div class="slider-item">
                <span class="slider-item__label">市场份额</span>
                <el-slider
                  v-model="weights.marketShare"
                  :max="100"
                  :step="5"
                  show-input-size="small"
                />
              </div>
            </div>
          </div>
          <div class="filter-section">
            <div class="filter-label">优势阈值</div>
            <el-slider v-model="threshold" :max="100" :step="5" show-input-size="small" />
            <div class="threshold-hint">综合得分 ≥ {{ threshold }} 显示为优势环节</div>
          </div>
          <div class="filter-section">
            <el-input
              v-model="keyword"
              placeholder="搜索环节名称"
              clearable
              :prefix-icon="Search"
            />
          </div>
          <div v-loading="loading" class="link-list">
            <div
              v-for="link in filteredLinks"
              :key="link.linkName"
              class="link-item"
              :class="{ 'link-item--advantage': link.compositeScore >= threshold }"
              @click="locateLink(link)"
            >
              <div class="link-item__name">{{ link.linkName }}</div>
              <div class="link-item__score">
                综合得分:
                <span class="link-item__score-value">{{ link.compositeScore.toFixed(1) }}</span>
              </div>
              <div class="link-item__details">
                <span>产值: {{ link.outputShare.toFixed(1) }}%</span>
                <span>专利: {{ link.patentDensity.toFixed(1) }}</span>
                <span>市场: {{ link.marketShare.toFixed(1) }}%</span>
              </div>
            </div>
            <el-empty
              v-if="!filteredLinks.length && !loading"
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
import { fetchAdvantageLinks } from '@/api/modules/investApi'
import type { AdvantageLink } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const mapRef = ref()
const loading = ref(false)
const links = ref<AdvantageLink[]>([])
const weights = ref({ outputShare: 40, patentDensity: 30, marketShare: 30 })
const threshold = ref(60)
const keyword = ref('')

let mapInstance: any = null

const filteredLinks = computed(() => {
  let list = links.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter((l) => l.linkName.toLowerCase().includes(kw))
  }
  return list
})

const legendItems = computed(() => [
  { label: '优势环节 (≥阈值)', color: '#4ECB73' },
  { label: '一般环节 (<阈值)', color: '#909399' },
])

function locateLink(link: AdvantageLink) {
  if (!mapInstance) return
  // Pan to center as a visual indicator
  const center = (mapInstance as any).getCenter?.()
  if (center) {
    ;(mapInstance as any).animateTo(
      { center: [center.x + 0.01, center.y + 0.005] },
      { duration: 500 },
    )
  }
}

function onMapReady(map: any) {
  mapInstance = map
  drawMarkers()
}

function drawMarkers() {
  if (!mapInstance) return
  try {
    const layers = (mapInstance as any).getLayers?.() || []
    layers.forEach((l: any) => l?.remove?.())
  } catch {
    // ignore
  }

  const maptalks = (window as any).maptalks || {}
  if (!maptalks.Marker || !maptalks.VectorLayer) return

  const center = (mapInstance as any).getCenter?.()
  if (!center) return

  const markers = filteredLinks.value.map((link, i) => {
    const isAdvantage = link.compositeScore >= threshold.value
    const color = isAdvantage ? '#4ECB73' : '#909399'
    // Spread markers around map center for visual display
    const offsetX = ((i % 3) - 1) * 0.02
    const offsetY = (Math.floor(i / 3) - 1) * 0.015

    return new maptalks.Marker([center.x + offsetX, center.y + offsetY], {
      properties: { name: link.linkName, score: link.compositeScore },
      symbol: {
        markerType: 'pin',
        markerFill: color,
        markerWidth: 30,
        markerHeight: 40,
        textName: link.linkName,
        textSize: 12,
        textFill: '#303133',
        textDy: -44,
        textHaloFill: '#fff',
        textHaloRadius: 2,
      },
    })
  })

  if (markers.length) {
    const layer = new maptalks.VectorLayer('advantage-markers', markers)
    ;(mapInstance as any).addLayer(layer)
  }
}

watch([filteredLinks, threshold], () => {
  drawMarkers()
})

onMounted(async () => {
  loading.value = true
  try {
    links.value = await fetchAdvantageLinks()
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

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.slider-item__label {
  flex-shrink: 0;
  width: 70px;
  font-size: 12px;
  color: $text-secondary;
}

.slider-item :deep(.el-slider) {
  flex: 1;
}

.threshold-hint {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.link-list {
  max-height: 300px;
  overflow-y: auto;
}

.link-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid $border-color-lighter;
  border-left: 3px solid transparent;

  &:hover {
    background: $bg-hover;
  }

  &:last-child {
    border-bottom: none;
  }
}

.link-item--advantage {
  background: rgba(78, 203, 115, 0.04);
  border-left-color: #4ecb73;
}

.link-item__name {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.link-item__score {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.link-item__score-value {
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.link-item__details {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  font-size: 11px;
  color: $text-placeholder;
}
</style>
