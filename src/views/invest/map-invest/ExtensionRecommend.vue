<template>
  <div class="page-container">
    <PageHeader title="延伸方向推荐" subtitle="产业链延伸方向智能推荐" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="content-layout">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业链延伸图谱</h4>
        <div class="chart-filter">
          <el-radio-group v-model="directionType" size="small">
            <el-radio-button value="all">全部</el-radio-button>
            <el-radio-button value="upstream">上游</el-radio-button>
            <el-radio-button value="downstream">下游</el-radio-button>
          </el-radio-group>
          <el-select
            v-model="selectedFromLink"
            placeholder="选择当前环节"
            style="width: 180px"
            clearable
            size="small"
          >
            <el-option v-for="l in fromLinkOptions" :key="l" :label="l" :value="l" />
          </el-select>
          <div class="feasibility-filter">
            <span class="feasibility-label">可行性 ≥ {{ minFeasibility }}%</span>
            <el-slider
              v-model="minFeasibility"
              :max="100"
              :step="5"
              style="width: 120px"
              size="small"
            />
          </div>
        </div>
        <BaseChart :option="graphOption" height="420px" :loading="loading" />
      </div>

      <div class="detail-panel">
        <h4 class="chart-panel__title">延伸方向详情</h4>
        <div v-loading="loading" class="direction-list">
          <div v-for="(dir, idx) in filteredDirections" :key="idx" class="direction-item">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Right } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchExtensionDirections } from '@/api/modules/investApi'
import type { ExtensionDirection } from '@/api/types/invest'
import type { EChartsOption } from 'echarts'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const directions = ref<ExtensionDirection[]>([])
const selectedFromLink = ref('')
const directionType = ref<'all' | 'upstream' | 'downstream'>('all')
const minFeasibility = ref(30)

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

const kpiCards = computed(() => {
  const total = filteredDirections.value.length
  const avgAddedValue =
    total > 0
      ? (filteredDirections.value.reduce((s, d) => s + d.addedValue, 0) / total).toFixed(1)
      : '0'
  const highFeasibility = filteredDirections.value.filter((d) => d.feasibility >= 70).length

  return [
    {
      key: 'total',
      icon: 'Promotion',
      label: '可延伸方向数',
      value: total,
      unit: '个',
      trend: 'flat' as const,
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'avgAddedValue',
      icon: 'TrendCharts',
      label: '平均增值率',
      value: avgAddedValue,
      unit: '%',
      trend: 'up' as const,
      trendValue: '较高',
      iconColor: '#4ECB73',
      iconBgColor: '#E8F8EE',
    },
    {
      key: 'highFeasibility',
      icon: 'CircleCheck',
      label: '高可行性方向',
      value: highFeasibility,
      unit: '个',
      trend: 'flat' as const,
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E1',
    },
  ]
})

// 产业链环节及上中下游分类
const upstreamSegments = ['原材料加工']
const midstreamSegments = ['核心零部件', '整机制造']
const downstreamSegments = ['系统集成', '运维服务']

function getSegmentCategory(name: string): 'upstream' | 'midstream' | 'downstream' | 'extension' {
  if (upstreamSegments.includes(name)) return 'upstream'
  if (midstreamSegments.includes(name)) return 'midstream'
  if (downstreamSegments.includes(name)) return 'downstream'
  return 'extension'
}

const graphOption = computed<EChartsOption>(() => {
  const list = filteredDirections.value
  if (!list.length) {
    return {
      series: [
        {
          type: 'graph',
          data: [],
          edges: [],
        },
      ],
    }
  }

  // Collect unique nodes
  const nodeSet = new Set<string>()
  list.forEach((d) => {
    nodeSet.add(d.fromLink)
    nodeSet.add(d.toLink)
  })
  const allNodes = Array.from(nodeSet)

  // Determine layout: arrange upstream → midstream → downstream horizontally
  const categoryColors: Record<string, string> = {
    upstream: chartColors[0], // #1889E8 blue
    midstream: chartColors[2], // #4ECB73 green
    downstream: chartColors[1], // #36CBCB cyan
    extension: chartColors[3], // #FBD437 yellow
  }

  const categoryLabels: Record<string, string> = {
    upstream: '上游',
    midstream: '中游',
    downstream: '下游',
    extension: '延伸环节',
  }

  // Layout: arrange nodes in rows by category
  const categoryOrder = ['upstream', 'midstream', 'downstream', 'extension']
  const nodesByCategory: Record<string, string[]> = {
    upstream: [],
    midstream: [],
    downstream: [],
    extension: [],
  }
  allNodes.forEach((n) => {
    const cat = getSegmentCategory(n)
    nodesByCategory[cat].push(n)
  })

  // Position nodes: x by category, y by index within category
  const graphWidth = 800
  const graphHeight = 360
  const xStep = graphWidth / (categoryOrder.length + 1)
  const nodePositions: Record<string, { x: number; y: number }> = {}

  categoryOrder.forEach((cat, catIdx) => {
    const nodes = nodesByCategory[cat]
    const yStep = nodes.length > 1 ? graphHeight / (nodes.length + 1) : graphHeight / 2
    nodes.forEach((name, i) => {
      nodePositions[name] = {
        x: xStep * (catIdx + 1),
        y: yStep * (i + 1),
      }
    })
  })

  // Check which nodes are extension targets (toLink that are not in fromLink)
  const fromLinks = new Set(list.map((d) => d.fromLink))

  const seriesNodes = allNodes.map((name) => {
    const cat = getSegmentCategory(name)
    const isExtension = !fromLinks.has(name)
    const color = categoryColors[cat]

    return {
      name,
      x: nodePositions[name]?.x ?? 0,
      y: nodePositions[name]?.y ?? 0,
      symbolSize: isExtension ? 50 : 60,
      itemStyle: {
        color: isExtension ? '#fff' : color,
        borderColor: color,
        borderWidth: 2,
      },
      label: {
        show: true,
        fontSize: 12,
        color: isExtension ? color : '#fff',
        fontWeight: 'bold' as const,
      },
      category: categoryOrder.indexOf(cat),
    }
  })

  const seriesEdges = list.map((d) => {
    const _fromCat = getSegmentCategory(d.fromLink)
    const toCat = getSegmentCategory(d.toLink)
    const isExtension = !fromLinks.has(d.toLink)

    return {
      source: d.fromLink,
      target: d.toLink,
      lineStyle: {
        color: categoryColors[toCat] || '#999',
        width: 2,
        type: isExtension ? 'dashed' : 'solid',
        curveness: 0.2,
      },
      label: {
        show: true,
        formatter: `+${d.addedValue.toFixed(0)}%`,
        fontSize: 11,
        color: '#F2637B',
        fontWeight: 'bold' as const,
      },
    }
  })

  return {
    tooltip: {
      trigger: 'item',
      formatter(params: any) {
        if (params.dataType === 'edge') {
          const dir = list.find(
            (d) => d.fromLink === params.data.source && d.toLink === params.data.target,
          )
          if (dir) {
            return `<strong>${dir.fromLink} → ${dir.toLink}</strong><br/>增值率: +${dir.addedValue.toFixed(1)}%<br/>可行性: ${dir.feasibility}%`
          }
        }
        if (params.dataType === 'node') {
          const cat = getSegmentCategory(params.name)
          return `<strong>${params.name}</strong><br/>分类: ${categoryLabels[cat]}`
        }
        return ''
      },
    },
    legend: {
      data: categoryOrder.map((cat) => categoryLabels[cat]),
      bottom: 0,
      textStyle: { fontSize: 12 },
    },
    animationDuration: 800,
    animationEasing: 'cubicOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbol: 'circle',
        roam: true,
        draggable: true,
        data: seriesNodes,
        edges: seriesEdges,
        categories: categoryOrder.map((cat) => ({
          name: categoryLabels[cat],
          itemStyle: { color: categoryColors[cat] },
        })),
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 10],
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 },
        },
      },
    ],
  } as EChartsOption
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

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;
}

.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel__title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.chart-filter {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.feasibility-filter {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

.feasibility-label {
  font-size: 12px;
  color: $text-secondary;
  white-space: nowrap;
}

.detail-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.direction-list {
  max-height: 440px;
  overflow-y: auto;
}

.direction-item {
  padding: 12px;
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
