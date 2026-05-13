<template>
  <div class="page-container">
    <PageHeader title="区域图谱总览" subtitle="各区域产业链图谱概览与统计">
      <template #actions>
        <el-select v-model="selectedRegion" placeholder="选择区域" clearable style="width: 160px">
          <el-option v-for="r in regions" :key="r.code" :label="r.name" :value="r.code" />
        </el-select>
      </template>
    </PageHeader>
    <LoadingSpinner :loading="loading" type="skeleton" :rows="6">
      <!-- 区域统计概览 -->
      <div class="overview-stats">
        <StatCard
          icon="MapLocation"
          label="覆盖区域"
          :value="regions.length"
          unit="个"
          icon-color="#1889E8"
          icon-bg-color="#ECF5FF"
        />
        <StatCard
          icon="Share"
          label="区域产业链"
          :value="totalChains"
          unit="条"
          icon-color="#36CBCB"
          icon-bg-color="#E6FFFB"
          trend="up"
          trend-value="+6%"
        />
        <StatCard
          icon="Connection"
          label="节点总数"
          :value="totalNodes"
          unit="个"
          icon-color="#4ECB73"
          icon-bg-color="#F0F9EB"
        />
        <StatCard
          icon="OfficeBuilding"
          label="关联企业"
          :value="totalEnterprises"
          unit="家"
          icon-color="#975FE5"
          icon-bg-color="#F3F0FF"
          trend="up"
          trend-value="+9%"
        />
      </div>

      <!-- 区域卡片网格 -->
      <div class="region-grid">
        <div
          v-for="region in filteredRegions"
          :key="region.code"
          class="region-card"
          @click="goToRegionChain(region.code)"
        >
          <div class="region-card__header">
            <div class="region-card__title">
              <h3 class="region-card__name">{{ region.name }}</h3>
              <el-tag :type="region.level === '重点' ? 'danger' : region.level === '核心' ? 'warning' : 'info'" size="small">
                {{ region.level }}
              </el-tag>
            </div>
          </div>
          <div class="region-card__stats">
            <div class="region-card__stat">
              <span class="region-card__stat-value">{{ region.chainCount }}</span>
              <span class="region-card__stat-label">产业链</span>
            </div>
            <div class="region-card__stat">
              <span class="region-card__stat-value">{{ region.nodeCount }}</span>
              <span class="region-card__stat-label">节点数</span>
            </div>
            <div class="region-card__stat">
              <span class="region-card__stat-value">{{ region.enterpriseCount }}</span>
              <span class="region-card__stat-label">企业数</span>
            </div>
          </div>
          <div class="region-card__chains">
            <span class="region-card__chains-label">重点产业链：</span>
            <div class="region-card__tags">
              <el-tag v-for="chain in region.topChains" :key="chain" size="small" effect="plain">{{ chain }}</el-tag>
            </div>
          </div>
          <div class="region-card__footer">
            <el-button type="primary" link>查看区域图谱 →</el-button>
          </div>
        </div>
      </div>
    </LoadingSpinner>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const selectedRegion = ref('')
const loading = ref(true)

interface RegionData {
  code: string
  name: string
  level: string
  chainCount: number
  nodeCount: number
  enterpriseCount: number
  topChains: string[]
}

const regions = ref<RegionData[]>([
  { code: 'yangtze', name: '长三角区域', level: '核心', chainCount: 12, nodeCount: 320, enterpriseCount: 1580, topChains: ['电子信息', '高端装备', '生物医药', '新材料'] },
  { code: 'pearl', name: '珠三角区域', level: '核心', chainCount: 10, nodeCount: 280, enterpriseCount: 1320, topChains: ['电子信息', '智能家电', '新能源', '先进制造'] },
  { code: 'beijing-tianjin', name: '京津冀区域', level: '重点', chainCount: 9, nodeCount: 240, enterpriseCount: 980, topChains: ['数字经济', '生物医药', '高端装备', '新能源'] },
  { code: 'central', name: '中部区域', level: '重点', chainCount: 8, nodeCount: 200, enterpriseCount: 860, topChains: ['先进制造', '新材料', '新能源', '食品加工'] },
  { code: 'western', name: '西部区域', level: '发展', chainCount: 6, nodeCount: 150, enterpriseCount: 620, topChains: ['新能源', '新材料', '生物医药'] },
  { code: 'northeast', name: '东北区域', level: '发展', chainCount: 5, nodeCount: 120, enterpriseCount: 480, topChains: ['高端装备', '新材料', '农产品加工'] }
])

const filteredRegions = computed(() => {
  if (!selectedRegion.value) return regions.value
  return regions.value.filter(r => r.code === selectedRegion.value)
})

const totalChains = computed(() => regions.value.reduce((sum, r) => sum + r.chainCount, 0))
const totalNodes = computed(() => regions.value.reduce((sum, r) => sum + r.nodeCount, 0))
const totalEnterprises = computed(() => regions.value.reduce((sum, r) => sum + r.enterpriseCount, 0))

function goToRegionChain(code: string) {
  router.push({ path: '/atlas/regional/chain', query: { region: code } })
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 200)
})
</script>

<style lang="scss" scoped>
.overview-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.region-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }
}

.region-card__header {
  margin-bottom: 16px;
}

.region-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.region-card__name {
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0;
}

.region-card__stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid $border-color-lighter;
}

.region-card__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.region-card__stat-value {
  font-size: 22px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.region-card__stat-label {
  font-size: 12px;
  color: $text-secondary;
}

.region-card__chains {
  margin-bottom: 12px;
}

.region-card__chains-label {
  font-size: 12px;
  color: $text-secondary;
}

.region-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.region-card__footer {
  text-align: right;
}
</style>
