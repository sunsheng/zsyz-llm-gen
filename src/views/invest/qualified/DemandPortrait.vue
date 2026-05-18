<template>
  <div class="page-container">
    <PageHeader title="资质企业需求画像" subtitle="资质企业投资需求画像分析" />

    <div v-loading="loading" class="portrait-layout">
      <!-- 左面板：企业选择 + 基本信息 + 需求类型 -->
      <div class="portrait-left">
        <div class="panel">
          <h4 class="panel__title">企业选择</h4>
          <el-select
            v-model="selectedId"
            placeholder="请选择资质企业"
            filterable
            style="width: 100%"
            @change="handleSelect"
          >
            <el-option
              v-for="item in profileList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>

        <template v-if="currentProfile">
          <div class="panel">
            <h4 class="panel__title">基本信息</h4>
            <div class="info-list">
              <div class="info-row">
                <span class="info-row__label">企业名称</span>
                <span class="info-row__value">{{ currentProfile.name }}</span>
              </div>
              <div class="info-row">
                <span class="info-row__label">需求类型</span>
                <el-tag :type="demandTagType(currentProfile.demandType)" size="small">
                  {{ demandLabel(currentProfile.demandType) }}
                </el-tag>
              </div>
              <div class="info-row">
                <span class="info-row__label">匹配度</span>
                <span class="info-row__value score">{{ currentProfile.matchScore }}%</span>
              </div>
            </div>
          </div>

          <div class="panel">
            <h4 class="panel__title">需求类型</h4>
            <div class="demand-tags">
              <span
                v-for="dt in demandTypes"
                :key="dt.value"
                class="demand-tag"
                :class="{ 'demand-tag--active': currentProfile.demandType === dt.value }"
              >
                {{ dt.label }}
              </span>
            </div>
          </div>

          <div class="panel">
            <h4 class="panel__title">核心诉求</h4>
            <p class="core-demand">{{ currentProfile.coreDemand }}</p>
          </div>
        </template>
      </div>

      <!-- 右侧：需求详情 + 匹配资源 -->
      <div class="portrait-right">
        <template v-if="currentProfile">
          <div class="panel">
            <h4 class="panel__title">需求详情</h4>
            <div class="demand-detail">
              <div class="demand-detail__item">
                <span class="demand-detail__label">核心诉求</span>
                <p class="demand-detail__text">{{ currentProfile.coreDemand }}</p>
              </div>
              <div class="demand-detail__item">
                <span class="demand-detail__label">所需资源</span>
                <div class="resource-list">
                  <div
                    v-for="(res, idx) in currentProfile.requiredResources"
                    :key="idx"
                    class="resource-chip"
                  >
                    {{ res }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel">
            <h4 class="panel__title">匹配资源推荐</h4>
            <div class="match-list">
              <div v-for="(res, idx) in matchedResources" :key="idx" class="match-item">
                <div class="match-item__header">
                  <span class="match-item__name">{{ res.name }}</span>
                  <ScoreRing :value="res.score" :size="48" :stroke-width="5" />
                </div>
                <p class="match-item__desc">{{ res.desc }}</p>
              </div>
            </div>
          </div>
        </template>

        <el-empty v-else description="请先选择企业查看需求画像" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { fetchDemandProfiles } from '@/api/modules/investApi'
import type { DemandProfile } from '@/api/types/invest'

const loading = ref(false)
const profileList = ref<DemandProfile[]>([])
const selectedId = ref('')

const demandTypes = [
  { label: '研发型', value: 'research' as const },
  { label: '生产型', value: 'production' as const },
  { label: '市场型', value: 'market' as const },
]

const currentProfile = computed(
  () => profileList.value.find((p) => p.id === selectedId.value) ?? null,
)

const matchedResources = computed(() => {
  if (!currentProfile.value) return []
  const profile = currentProfile.value
  return profile.requiredResources.map((res, i) => ({
    name: res,
    score: Math.max(60, profile.matchScore - i * 5),
    desc: `针对${profile.coreDemand}，提供${res}支持，助力企业快速落地`,
  }))
})

function demandLabel(type: string) {
  const map: Record<string, string> = { research: '研发型', production: '生产型', market: '市场型' }
  return map[type] ?? type
}

function demandTagType(type: string) {
  const map: Record<string, string> = {
    research: 'primary',
    production: 'success',
    market: 'warning',
  }
  return (map[type] ?? 'info') as 'primary' | 'success' | 'warning' | 'info'
}

function handleSelect() {
  // 切换企业时重置右侧内容
}

async function loadData() {
  loading.value = true
  try {
    profileList.value = await fetchDemandProfiles(10)
    if (profileList.value.length > 0) {
      selectedId.value = profileList.value[0].id
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.portrait-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.portrait-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.portrait-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.panel__title {
  margin: 0 0 16px;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-row__label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.info-row__value {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $text-primary;

  &.score {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }
}

.demand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.demand-tag {
  padding: 4px 12px;
  font-size: $font-size-xs;
  color: $text-secondary;
  background: $bg-hover;
  border-radius: $radius-base;

  &--active {
    color: #fff;
    background: $color-primary;
  }
}

.core-demand {
  margin: 0;
  font-size: $font-size-base;
  line-height: 1.6;
  color: $text-regular;
}

.demand-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demand-detail__label {
  display: block;
  margin-bottom: 8px;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.demand-detail__text {
  margin: 0;
  font-size: $font-size-base;
  line-height: 1.6;
  color: $text-primary;
}

.resource-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resource-chip {
  padding: 4px 12px;
  font-size: $font-size-xs;
  color: $color-primary;
  background: $color-primary-light-9;
  border: 1px solid $color-primary-light-5;
  border-radius: $radius-base;
}

.match-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.match-item {
  padding: 16px;
  background: $bg-hover;
  border-radius: $radius-base;
}

.match-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.match-item__name {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.match-item__desc {
  margin: 0;
  font-size: $font-size-sm;
  line-height: 1.5;
  color: $text-secondary;
}
</style>
