<template>
  <div class="page-container">
    <PageHeader title="基础信息筛选" subtitle="企业基础信息多维筛选" />

    <SearchFilterBar
      search-placeholder="搜索企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="main-layout">
      <div class="map-section">
        <div class="map-section__header">
          <h4 class="map-section__title">地理围栏</h4>
          <div class="map-section__actions">
            <el-button size="small" :type="isDrawing ? 'primary' : 'default'" @click="toggleDraw">
              {{ isDrawing ? '取消圈选' : '矩形圈选' }}
            </el-button>
            <el-button v-if="rectBounds" size="small" @click="clearSelection">清除选择</el-button>
          </div>
        </div>
        <div class="map-wrapper">
          <MaptalksMap :center="[104.5, 30.9]" :zoom="11" @ready="onMapReady" />
        </div>
        <div v-if="rectBounds" class="map-section__info">
          已圈选区域，筛选出 {{ filteredByRectCount }} 家企业
        </div>
      </div>

      <div class="table-section">
        <div class="content-card">
          <div class="result-bar">
            <span class="result-count">共 {{ pagination.total }} 家企业</span>
          </div>
          <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
            <el-table-column prop="name" label="企业名称" min-width="180" />
            <el-table-column prop="industry" label="行业分类" width="140">
              <template #default="{ row }">
                <el-tag size="small">{{ row.industry }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="scale" label="企业规模" width="100" />
            <el-table-column prop="revenue" label="营收(万元)" width="130" sortable>
              <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="employeeCount" label="员工数" width="100" sortable />
            <el-table-column prop="registeredCapital" label="注册资本(万元)" width="140" sortable>
              <template #default="{ row }">{{ row.registeredCapital.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="city" label="所在城市" width="100" />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagMap[row.status] || 'info'" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="tags" label="标签" min-width="160">
              <template #default="{ row }">
                <el-tag
                  v-for="tag in row.tags"
                  :key="tag"
                  size="small"
                  type="info"
                  style="margin: 2px"
                >
                  {{ tag }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <PaginationBar
            :current="pagination.current"
            :total="pagination.total"
            :page-size="pagination.pageSize"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchFilterEnterpriseList } from '@/api/modules/monitorApi'
import type { FilterEnterpriseItem } from '@/api/mock/monitor'

const statusTagMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  运营中: 'success',
  已迁出: 'warning',
  已注销: 'danger',
  休眠: 'info',
}

const filters: FilterField[] = [
  {
    key: 'industry',
    label: '行业分类',
    type: 'select',
    options: [
      { label: '清洁能源装备', value: '清洁能源装备' },
      { label: '先进材料', value: '先进材料' },
      { label: '电子信息', value: '电子信息' },
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '生物医药', value: '生物医药' },
      { label: '新能源', value: '新能源' },
      { label: '节能环保', value: '节能环保' },
      { label: '现代服务业', value: '现代服务业' },
    ],
  },
  {
    key: 'scale',
    label: '企业规模',
    type: 'select',
    options: [
      { label: '大型', value: '大型' },
      { label: '中型', value: '中型' },
      { label: '小型', value: '小型' },
      { label: '微型', value: '微型' },
    ],
  },
  {
    key: 'status',
    label: '经营状态',
    type: 'select',
    options: [
      { label: '运营中', value: '运营中' },
      { label: '已迁出', value: '已迁出' },
      { label: '已注销', value: '已注销' },
      { label: '休眠', value: '休眠' },
    ],
  },
]

const loading = ref(false)
const tableData = ref<FilterEnterpriseItem[]>([])
const allData = ref<FilterEnterpriseItem[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

const isDrawing = ref(false)
const rectBounds = ref<{ minLng: number; maxLng: number; minLat: number; maxLat: number } | null>(
  null,
)
const filteredByRectCount = ref(0)
let mapInstance: any = null
let drawTool: any = null
let drawnRect: any = null
let markerLayer: any = null

function onMapReady(map: any) {
  mapInstance = map

  const maptalks = (window as any).__maptalks_module
  if (!maptalks) {
    import('maptalks').then((mt) => {
      ;(window as any).__maptalks_module = mt
      setupMapLayers(mt)
    })
  } else {
    setupMapLayers(maptalks)
  }
}

function setupMapLayers(maptalks: any) {
  if (!mapInstance) return

  // 添加标注图层
  markerLayer = new maptalks.VectorLayer('markers').addTo(mapInstance)
  addMarkers(maptalks)
}

function addMarkers(maptalks: any) {
  if (!markerLayer) return
  markerLayer.clear()

  allData.value.forEach((item) => {
    if (item.lng && item.lat) {
      const marker = new maptalks.Marker([item.lng, item.lat], {
        symbol: {
          markerType: 'pin',
          markerFill: '#1889E8',
          markerFillOpacity: 0.8,
          markerWidth: 24,
          markerHeight: 30,
          textName: item.name.slice(0, 4),
          textSize: 10,
          textFill: '#333',
          textDy: -32,
        },
      })
      markerLayer.addGeometry(marker)
    }
  })
}

function toggleDraw() {
  if (isDrawing.value) {
    disableDraw()
    return
  }

  isDrawing.value = true
  import('maptalks').then((maptalks) => {
    if (!mapInstance) return

    drawTool = new maptalks.DrawTool({
      mode: 'Rectangle',
      symbol: {
        lineColor: '#1889E8',
        lineWidth: 2,
        polygonFill: '#1889E8',
        polygonFillOpacity: 0.15,
      },
    }).addTo(mapInstance)

    drawTool.on('drawend', (param: any) => {
      const geometry = param.geometry
      if (drawnRect) {
        drawnRect.remove()
      }
      drawnRect = geometry.addTo(markerLayer || mapInstance.getLayer('draw-layer'))

      const extent = geometry.getExtent()
      if (extent) {
        rectBounds.value = {
          minLng: extent.xmin,
          maxLng: extent.xmax,
          minLat: extent.ymin,
          maxLat: extent.ymax,
        }
        applyFilters()
      }

      disableDraw()
    })
  })
}

function disableDraw() {
  isDrawing.value = false
  if (drawTool) {
    drawTool.disable()
    drawTool = null
  }
}

function clearSelection() {
  rectBounds.value = null
  if (drawnRect) {
    drawnRect.remove()
    drawnRect = null
  }
  applyFilters()
}

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
  }
  if (filterValues.value.industry) {
    filtered = filtered.filter((item) => item.industry === filterValues.value.industry)
  }
  if (filterValues.value.scale) {
    filtered = filtered.filter((item) => item.scale === filterValues.value.scale)
  }
  if (filterValues.value.status) {
    filtered = filtered.filter((item) => item.status === filterValues.value.status)
  }

  // 地理围栏过滤
  if (rectBounds.value) {
    const b = rectBounds.value
    filtered = filtered.filter(
      (item) =>
        item.lng >= b.minLng &&
        item.lng <= b.maxLng &&
        item.lat >= b.minLat &&
        item.lat <= b.maxLat,
    )
  }

  filteredByRectCount.value = rectBounds.value ? filtered.length : 0
  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchFilterEnterpriseList(50)) as FilterEnterpriseItem[]
    allData.value = data
    applyFilters()

    // 地图标注
    import('maptalks').then((maptalks) => {
      if (markerLayer) {
        addMarkers(maptalks)
      }
    })
  } finally {
    loading.value = false
  }
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  pagination.current = 1
  applyFilters()
}

function handleFilter(filters: Record<string, unknown>) {
  filterValues.value = filters
  pagination.current = 1
  applyFilters()
}

function handleReset() {
  searchKeyword.value = ''
  filterValues.value = {}
  pagination.current = 1
  applyFilters()
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
  applyFilters()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.main-layout {
  display: flex;
  gap: 20px;
}
.map-section {
  flex-shrink: 0;
  width: 420px;
  padding: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.map-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.map-section__title {
  margin: 0;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.map-section__actions {
  display: flex;
  gap: 8px;
}
.map-wrapper {
  height: 400px;
  overflow: hidden;
  border-radius: $radius-base;
}
.map-section__info {
  margin-top: 8px;
  font-size: 13px;
  color: #1889e8;
}
.table-section {
  flex: 1;
  min-width: 0;
}
.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.result-count {
  font-size: 14px;
  color: $text-secondary;
}
</style>
