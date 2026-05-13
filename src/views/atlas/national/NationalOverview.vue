<template>
  <div class="page-container">
    <PageHeader title="全国图谱总览" subtitle="全国重点产业链图谱概览与统计" />
    <LoadingSpinner :loading="loading" type="skeleton" :rows="6">
      <!-- 统计卡片 -->
      <div class="overview-stats">
        <StatCard
          icon="Share"
          label="产业链数量"
          :value="chains.length"
          unit="条"
          icon-color="#1889E8"
          icon-bg-color="#ECF5FF"
        />
        <StatCard
          icon="Connection"
          label="节点总数"
          :value="totalNodes"
          unit="个"
          icon-color="#36CBCB"
          icon-bg-color="#E6FFFB"
          trend="up"
          trend-value="+12%"
        />
        <StatCard
          icon="Pointer"
          label="关系总数"
          :value="totalEdges"
          unit="条"
          icon-color="#4ECB73"
          icon-bg-color="#F0F9EB"
          trend="up"
          trend-value="+8%"
        />
        <StatCard
          icon="OfficeBuilding"
          label="关联企业"
          :value="totalEnterprises"
          unit="家"
          icon-color="#975FE5"
          icon-bg-color="#F3F0FF"
          trend="up"
          trend-value="+5%"
        />
      </div>

      <!-- 产业链卡片网格 -->
      <div class="chain-grid">
        <div
          v-for="chain in chains"
          :key="chain.code"
          class="chain-card"
          @click="goToChainGraph(chain.code)"
        >
          <div class="chain-card__header">
            <h3 class="chain-card__name">{{ chain.name }}</h3>
            <el-tag size="small" type="primary">查看图谱</el-tag>
          </div>
          <p class="chain-card__desc">{{ chain.description }}</p>
          <div class="chain-card__stats">
            <div class="chain-card__stat">
              <span class="chain-card__stat-value">{{ chain.nodeCount }}</span>
              <span class="chain-card__stat-label">节点数</span>
            </div>
            <div class="chain-card__stat">
              <span class="chain-card__stat-value">{{ chain.edgeCount }}</span>
              <span class="chain-card__stat-label">关系数</span>
            </div>
          </div>
          <div class="chain-card__chain">
            <div class="chain-card__section">
              <span class="chain-card__section-label">上游</span>
              <div class="chain-card__tags">
                <el-tag v-for="item in chain.upstream" :key="item" size="small" type="info" effect="plain">{{ item }}</el-tag>
              </div>
            </div>
            <div class="chain-card__section">
              <span class="chain-card__section-label">中游</span>
              <div class="chain-card__tags">
                <el-tag v-for="item in chain.midstream" :key="item" size="small" effect="plain">{{ item }}</el-tag>
              </div>
            </div>
            <div class="chain-card__section">
              <span class="chain-card__section-label">下游</span>
              <div class="chain-card__tags">
                <el-tag v-for="item in chain.downstream" :key="item" size="small" type="success" effect="plain">{{ item }}</el-tag>
              </div>
            </div>
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
import { fetchChains } from '@/api/modules/atlasApi'
import type { IndustryChain } from '@/api/types/industry'

const router = useRouter()
const chains = ref<IndustryChain[]>([])
const loading = ref(true)

const totalNodes = computed(() => chains.value.reduce((sum, c) => sum + c.nodeCount, 0))
const totalEdges = computed(() => chains.value.reduce((sum, c) => sum + c.edgeCount, 0))
const totalEnterprises = computed(() => chains.value.reduce((sum, c) => sum + c.nodeCount * 5, 0))

function goToChainGraph(code: string) {
  router.push({ path: '/atlas/national/chain', query: { chain: code } })
}

onMounted(async () => {
  try {
    chains.value = await fetchChains()
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.overview-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.chain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chain-card {
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

.chain-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.chain-card__name {
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0;
}

.chain-card__desc {
  font-size: 13px;
  color: $text-secondary;
  margin: 0 0 16px;
  line-height: 1.5;
}

.chain-card__stats {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid $border-color-lighter;
}

.chain-card__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chain-card__stat-value {
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.chain-card__stat-label {
  font-size: 12px;
  color: $text-secondary;
}

.chain-card__chain {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chain-card__section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.chain-card__section-label {
  font-size: 12px;
  color: $text-secondary;
  flex-shrink: 0;
  width: 28px;
  line-height: 24px;
}

.chain-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
