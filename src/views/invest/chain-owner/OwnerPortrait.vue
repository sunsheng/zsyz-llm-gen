<template>
  <div class="page-container">
    <PageHeader title="链主画像与需求解析" subtitle="链主企业画像与招商需求解析" />

    <div v-loading="loading" class="portrait-layout">
      <!-- 左面板 -->
      <div class="left-panel">
        <div class="panel-card">
          <h4 class="panel-card__title">链主企业选择</h4>
          <el-select
            v-model="selectedOwnerId"
            placeholder="请选择链主企业"
            filterable
            style="width: 100%"
            @change="handleOwnerChange"
          >
            <el-option
              v-for="owner in profiles"
              :key="owner.id"
              :label="owner.name"
              :value="owner.id"
            />
          </el-select>
        </div>

        <div v-if="currentOwner" class="panel-card">
          <h4 class="panel-card__title">多维标签</h4>
          <div class="dimension-list">
            <div class="dimension-item">
              <div class="dimension-item__header">
                <span class="dimension-item__label">供应链控制力</span>
                <span class="dimension-item__value">{{ currentOwner.supplyChainControl }}</span>
              </div>
              <el-progress
                :percentage="currentOwner.supplyChainControl"
                :stroke-width="10"
                :color="chartColors[0]"
              />
            </div>
            <div class="dimension-item">
              <div class="dimension-item__header">
                <span class="dimension-item__label">技术话语权</span>
                <span class="dimension-item__value">{{ currentOwner.techInfluence }}</span>
              </div>
              <el-progress
                :percentage="currentOwner.techInfluence"
                :stroke-width="10"
                :color="chartColors[1]"
              />
            </div>
            <div class="dimension-item">
              <div class="dimension-item__header">
                <span class="dimension-item__label">扩张动态</span>
                <span class="dimension-item__value">{{ currentOwner.expansionDynamic }}</span>
              </div>
              <el-progress
                :percentage="expansionPercentage"
                :stroke-width="10"
                :color="chartColors[2]"
              />
            </div>
            <div class="dimension-item">
              <div class="dimension-item__header">
                <span class="dimension-item__label">本地采购率</span>
                <span class="dimension-item__value">{{ currentOwner.localProcurementRate }}%</span>
              </div>
              <el-progress
                :percentage="currentOwner.localProcurementRate"
                :stroke-width="10"
                :color="chartColors[3]"
              />
            </div>
          </div>
        </div>

        <div v-if="currentOwner" class="panel-card">
          <h4 class="panel-card__title">关键需求</h4>
          <div class="demand-tags">
            <el-tag
              v-for="demand in currentOwner.keyDemands"
              :key="demand"
              type="warning"
              size="large"
              class="demand-tag"
            >
              {{ demand }}
            </el-tag>
          </div>
        </div>

        <div v-if="currentOwner" class="panel-card">
          <h4 class="panel-card__title">企业标签</h4>
          <div class="demand-tags">
            <EnterpriseTag v-for="tag in currentOwner.tags" :key="tag" :text="tag" type="status" />
          </div>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="right-panel">
        <div v-if="currentOwner" class="chart-grid">
          <div class="chart-panel">
            <h4 class="chart-panel__title">链主综合能力雷达图</h4>
            <BaseChart :option="radarOption" height="360px" />
          </div>
          <div class="chart-panel">
            <h4 class="chart-panel__title">上下游集中度分布</h4>
            <BaseChart :option="barOption" height="360px" />
          </div>
        </div>

        <div v-if="currentOwner" class="chart-panel">
          <h4 class="chart-panel__title">需求提取文本</h4>
          <div class="demand-text-area">
            <p v-for="(line, idx) in demandLines" :key="idx" class="demand-line">{{ line }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import EnterpriseTag from '@/components/business/EnterpriseTag.vue'
import { fetchChainOwnerProfiles } from '@/api/modules/investApi'
import type { ChainOwnerProfile } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const loading = ref(false)
const profiles = ref<ChainOwnerProfile[]>([])
const selectedOwnerId = ref('')

const currentOwner = computed(() => profiles.value.find((p) => p.id === selectedOwnerId.value))

const expansionPercentage = computed(() => {
  if (!currentOwner.value) return 0
  const map: Record<string, number> = { 积极扩张: 90, 稳健发展: 60, 战略收缩: 30 }
  return map[currentOwner.value.expansionDynamic] ?? 50
})

const demandLines = computed(() => {
  if (!currentOwner.value) return []
  const o = currentOwner.value
  return [
    `【${o.name}】作为${o.industry}行业链主企业，供应链控制力达${o.supplyChainControl}分，技术话语权${o.techInfluence}分。`,
    `当前扩张策略为"${o.expansionDynamic}"，本地采购率${o.localProcurementRate}%。`,
    `核心招商需求：${o.keyDemands.join('、')}。`,
    `建议重点围绕${o.keyDemands.slice(0, 2).join('与')}方向开展精准对接。`,
  ]
})

const radarOption = computed<EChartsOption>(() => {
  if (!currentOwner.value) return {} as EChartsOption
  const o = currentOwner.value
  return {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '供应链控制力', max: 100 },
        { name: '技术话语权', max: 100 },
        { name: '扩张动态', max: 100 },
        { name: '本地采购率', max: 100 },
        { name: '行业标准参与度', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              o.supplyChainControl,
              o.techInfluence,
              expansionPercentage.value,
              o.localProcurementRate,
              Math.floor(Math.random() * 30 + 50),
            ],
            name: o.name,
            areaStyle: { opacity: 0.2 },
            lineStyle: { width: 2 },
          },
        ],
      },
    ],
  }
})

const barOption = computed<EChartsOption>(() => {
  if (!currentOwner.value) return {} as EChartsOption
  const upstreamNames = ['原材料', '核心零部件', '基础软件']
  const downstreamNames = ['整机制造', '系统集成', '终端应用']
  return {
    color: chartColors,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['上游集中度', '下游分布'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: [...upstreamNames, ...downstreamNames] },
    yAxis: { type: 'value', name: '占比(%)' },
    series: [
      {
        name: '上游集中度',
        type: 'bar',
        barMaxWidth: 32,
        data: [
          Math.floor(Math.random() * 30 + 40),
          Math.floor(Math.random() * 25 + 30),
          Math.floor(Math.random() * 20 + 20),
          null,
          null,
          null,
        ],
      },
      {
        name: '下游分布',
        type: 'bar',
        barMaxWidth: 32,
        data: [
          null,
          null,
          null,
          Math.floor(Math.random() * 30 + 30),
          Math.floor(Math.random() * 25 + 25),
          Math.floor(Math.random() * 20 + 20),
        ],
      },
    ],
  }
})

function handleOwnerChange() {
  // 切换链主时图表会通过 computed 自动更新
}

onMounted(async () => {
  loading.value = true
  try {
    profiles.value = await fetchChainOwnerProfiles()
    if (profiles.value.length > 0) {
      selectedOwnerId.value = profiles.value[0].id
    }
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.portrait-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.left-panel {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 16px;
  width: 400px;
}

.right-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.panel-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.panel-card__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.dimension-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dimension-item__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.dimension-item__label {
  font-size: 14px;
  color: $text-secondary;
}

.dimension-item__value {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.demand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.demand-tag {
  font-size: 14px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.demand-text-area {
  padding: 16px;
  line-height: 1.8;
  background: #f5f7fa;
  border-radius: $radius-base;
}

.demand-line {
  margin: 0;
  font-size: 14px;
  color: $text-primary;
}
</style>
