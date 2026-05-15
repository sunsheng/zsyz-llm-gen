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
            :value="avgGrowth"
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
        <MaptalksMap :center="[104.612, 30.884]" :zoom="14" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="legendItems" />
      </div>
    </div>

    <!-- Enterprise Detail Dialog -->
    <el-dialog v-model="detailVisible" :title="detailData?.name" width="560px">
      <template v-if="detailData">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="企业名称">{{ detailData.name }}</el-descriptions-item>
          <el-descriptions-item label="所属行业">{{ detailData.industry }}</el-descriptions-item>
          <el-descriptions-item label="所属区域">{{ detailData.region }}</el-descriptions-item>
          <el-descriptions-item label="企业地址">{{ detailData.address }}</el-descriptions-item>
          <el-descriptions-item label="产值">
            {{ detailData.output.toLocaleString() }} 万元
          </el-descriptions-item>
          <el-descriptions-item label="增速">
            <span :style="{ color: detailData.growth >= 0 ? '#4ECB73' : '#F2637B' }">
              {{ detailData.growth >= 0 ? '+' : '' }}{{ detailData.growth }}%
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ detailData.contact }}</el-descriptions-item>
          <el-descriptions-item label="企业网站">
            <el-link type="primary" :underline="false">{{ detailData.website }}</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="地理位置">
            经度 {{ detailData.lng.toFixed(3) }}，纬度 {{ detailData.lat.toFixed(3) }}
          </el-descriptions-item>
          <el-descriptions-item label="经营信息">
            {{ detailData.businessInfo }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="ent-detail-image">
          <el-image :src="detailData.image" fit="cover" class="ent-detail-image__img">
            <template #error>
              <div class="ent-detail-image__placeholder">企业图片</div>
            </template>
          </el-image>
        </div>
      </template>
    </el-dialog>
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
  address: string
  image: string
  businessInfo: string
}

const regions = ['辑庆片区', '兴隆片区', '成巴东片区', '凯州新城核心区', '中江县', '德阳市']
const industries = [
  '高端装备制造',
  '新材料',
  '电子信息',
  '生物医药',
  '新能源',
  '节能环保',
  '数字创意',
]

// 各区域中心坐标，用于生成企业分布点
const regionCenters: Record<string, [number, number]> = {
  辑庆片区: [104.623, 30.92],
  兴隆片区: [104.595, 30.871],
  成巴东片区: [104.65, 30.86],
  凯州新城核心区: [104.612, 30.884],
  中江县: [104.803, 30.885],
  德阳市: [104.398, 31.127],
}

const enterpriseNamePool = [
  '东方电机',
  '国机重装',
  '宏华石油',
  '华庆机械',
  '长虹佳华',
  '天域半导体',
  '芯源集成',
  '博远生物',
  '昌盛药业',
  '绿能科技',
  '华创新材',
  '瑞丰新材',
  '中科智联',
  '鼎盛环保',
  '创想数字',
  '恒达装备',
  '铭远精密',
  '亿能动力',
  '安泰环保',
  '智汇信息',
  '云帆数据',
  '盛达新材',
  '恒宇光电',
  '宏图半导体',
  '金辉科技',
]

function generateEnterprises(): Enterprise[] {
  const addressPool = [
    '凯州新城智能制造产业园A栋',
    '辑庆镇工业集中区3号路',
    '兴隆镇科技创新园B区',
    '成巴东产业新城5号楼',
    '中江县工业发展区8号',
    '德阳经济技术开发区2号路',
  ]
  const businessPool = [
    '主要从事高端装备研发与制造，年产能超5000台套',
    '专注于新材料研发生产，产品覆盖西南地区',
    '电子信息产品制造，拥有自主知识产权30余项',
    '生物医药研发与生产，通过GMP认证',
    '新能源装备制造，年产值持续增长',
    '节能环保设备研发，服务于成渝地区',
    '数字创意产业服务，拥有专业团队200余人',
  ]
  const enterprises: Enterprise[] = []
  regions.forEach((region, ri) => {
    const count = 5 + Math.floor(Math.random() * 8)
    const center = regionCenters[region]
    for (let i = 0; i < count; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)]
      enterprises.push({
        id: `ent-${ri}-${i}`,
        name: `${enterpriseNamePool[(ri * 5 + i) % enterpriseNamePool.length]}${region === '德阳市' ? '(德阳)' : '(凯州)'}`,
        region,
        industry,
        lng: center[0] + (Math.random() - 0.5) * 0.06,
        lat: center[1] + (Math.random() - 0.5) * 0.04,
        output: Math.floor(Math.random() * 80000 + 5000),
        growth: +(Math.random() * 20 - 5).toFixed(1),
        website: `www.ent${ri}${i}.example.com`,
        contact: `0838-7${ri}8${i}8${i}8`,
        address: addressPool[ri] + `${i + 1}号`,
        image: `https://via.placeholder.com/400x200?text=${encodeURIComponent(industry)}`,
        businessInfo: businessPool[Math.floor(Math.random() * businessPool.length)],
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
const detailVisible = ref(false)
const detailData = ref<Enterprise | null>(null)

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

const avgGrowth = computed(() => {
  const list = filteredEnterprises.value
  return list.length ? (list.reduce((s, e) => s + e.growth, 0) / list.length).toFixed(1) : '0'
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
  detailData.value = ent
  detailVisible.value = true
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

.ent-detail-image {
  margin-top: 16px;
}

.ent-detail-image__img {
  width: 100%;
  height: 160px;
  border-radius: $radius-base;
}

.ent-detail-image__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 160px;
  font-size: 14px;
  color: $text-secondary;
  background: $bg-hover;
  border-radius: $radius-base;
}
</style>
