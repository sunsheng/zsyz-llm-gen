<template>
  <div class="page-container">
    <PageHeader title="产业链关联" subtitle="企业产业链关联关系与话语权分析" />

    <div class="main-layout">
      <div class="graph-area">
        <div class="chart-panel">
          <h4 class="chart-panel__title">供应链关系图谱</h4>
          <div ref="graphContainer" class="graph-container">
            <canvas ref="graphCanvas"></canvas>
          </div>
          <div class="graph-legend">
            <span class="legend-item">
              <span class="legend-dot" style="background: #1889e8"></span>核心企业
            </span>
            <span class="legend-item">
              <span class="legend-dot" style="background: #4ecb73"></span>供应商
            </span>
            <span class="legend-item">
              <span class="legend-dot" style="background: #fbd437"></span>客户
            </span>
            <span class="legend-item">
              <span class="legend-dot" style="background: #975fe5"></span>合作方
            </span>
          </div>
        </div>
      </div>

      <div class="side-area">
        <div class="score-panel">
          <h4 class="card-title">控制力指数</h4>
          <BaseChart :option="controlGaugeOption" height="200px" />
        </div>

        <div class="relation-table">
          <h4 class="card-title">关系详情</h4>
          <el-table :data="edges" stripe border style="width: 100%" max-height="400">
            <el-table-column prop="relationType" label="关系" width="90" />
            <el-table-column label="关联企业" min-width="120">
              <template #default="{ row }">
                {{ getTargetName(row) }}
              </template>
            </el-table-column>
            <el-table-column label="订单占比(%)" width="100">
              <template #default="{ row }"> {{ getOrderShare(row) }}% </template>
            </el-table-column>
            <el-table-column label="专利引用" width="90">
              <template #default="{ row }">
                {{ getPatentCitations(row) }}
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="强度" width="70">
              <template #default="{ row }">
                <span :style="{ color: row.weight >= 60 ? '#1889e8' : '#909399' }">
                  {{ row.weight }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="control-formula">
            控制力指数 = 订单占比×0.4 + 专利引用归一化×0.3 + 供应链地位×0.3
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchChainRelationData } from '@/api/modules/monitorApi'
import type { ChainRelationData, ChainRelationNode, ChainRelationEdge } from '@/api/mock/monitor'

const nodes = ref<ChainRelationNode[]>([])
const edges = ref<ChainRelationEdge[]>([])
const controlGaugeOption = ref({})
const graphCanvas = ref<HTMLCanvasElement>()
const graphContainer = ref<HTMLDivElement>()

const categoryColors: Record<string, string> = {
  core: '#1889E8',
  supplier: '#4ECB73',
  customer: '#FBD437',
  partner: '#975FE5',
}

function getTargetName(edge: ChainRelationEdge) {
  const targetId = edge.source === 'core-1' ? edge.target : edge.source
  return nodes.value.find((n) => n.id === targetId)?.name ?? targetId
}

function getOrderShare(edge: ChainRelationEdge) {
  const targetId = edge.source === 'core-1' ? edge.target : edge.source
  return nodes.value.find((n) => n.id === targetId)?.orderShare ?? '-'
}

function getPatentCitations(edge: ChainRelationEdge) {
  const targetId = edge.source === 'core-1' ? edge.target : edge.source
  return nodes.value.find((n) => n.id === targetId)?.patentCitations ?? '-'
}

async function loadData() {
  const data = (await fetchChainRelationData()) as ChainRelationData
  nodes.value = data.nodes
  edges.value = data.edges

  controlGaugeOption.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        itemStyle: {
          color: data.coreControlIndex >= 60 ? '#1889E8' : '#FBD437',
        },
        progress: { show: true, width: 16 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 16, color: [[1, '#E8ECF1']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          fontWeight: 700,
          formatter: '{value}分',
          offsetCenter: [0, '0%'],
        },
        title: { offsetCenter: [0, '30%'], fontSize: 13, color: '#909399' },
        data: [{ value: data.coreControlIndex, name: '话语权指数' }],
      },
    ],
  }

  await nextTick()
  drawGraph()
}

function drawGraph() {
  const canvas = graphCanvas.value
  const container = graphContainer.value
  if (!canvas || !container) return

  const width = container.clientWidth
  const height = 400
  canvas.width = width * 2
  canvas.height = height * 2
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(2, 2)

  // Simple force-directed layout approximation
  const centerX = width / 2
  const centerY = height / 2
  const nodePositions = new Map<string, { x: number; y: number }>()

  // Place core at center
  nodePositions.set('core-1', { x: centerX, y: centerY })

  // Place others in circles around center
  const nonCoreNodes = nodes.value.filter((n) => n.id !== 'core-1')
  const radius = Math.min(width, height) * 0.35
  nonCoreNodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nonCoreNodes.length - Math.PI / 2
    nodePositions.set(node.id, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    })
  })

  // Draw edges
  edges.value.forEach((edge) => {
    const source = nodePositions.get(edge.source)
    const target = nodePositions.get(edge.target)
    if (!source || !target) return

    ctx.beginPath()
    ctx.moveTo(source.x, source.y)
    ctx.lineTo(target.x, target.y)
    ctx.strokeStyle = '#D0D5DD'
    ctx.lineWidth = Math.max(edge.weight / 30, 1)
    ctx.stroke()

    // Draw arrow
    const angle = Math.atan2(target.y - source.y, target.x - source.x)
    const arrowLen = 8
    const midX = (source.x + target.x) / 2
    const midY = (source.y + target.y) / 2
    ctx.beginPath()
    ctx.moveTo(midX, midY)
    ctx.lineTo(midX - arrowLen * Math.cos(angle - 0.3), midY - arrowLen * Math.sin(angle - 0.3))
    ctx.moveTo(midX, midY)
    ctx.lineTo(midX - arrowLen * Math.cos(angle + 0.3), midY - arrowLen * Math.sin(angle + 0.3))
    ctx.strokeStyle = '#909399'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Relation type label
    ctx.font = '11px sans-serif'
    ctx.fillStyle = '#909399'
    ctx.textAlign = 'center'
    ctx.fillText(edge.relationType, midX, midY - 6)
  })

  // Draw nodes
  nodes.value.forEach((node) => {
    const pos = nodePositions.get(node.id)
    if (!pos) return

    const isCore = node.category === 'core'
    const nodeRadius = isCore ? 24 : 16
    const color = categoryColors[node.category] || '#1889E8'

    // Circle
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Label
    ctx.font = isCore ? 'bold 12px sans-serif' : '11px sans-serif'
    ctx.fillStyle = '#303133'
    ctx.textAlign = 'center'
    ctx.fillText(node.name.slice(0, isCore ? 6 : 4), pos.x, pos.y + nodeRadius + 14)
  })
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
.graph-area {
  flex: 1;
  min-width: 0;
}
.side-area {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 20px;
  width: 360px;
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
.control-formula {
  padding: 10px 0 0;
  font-size: 12px;
  color: $text-secondary;
  text-align: center;
}
.graph-container {
  width: 100%;
  height: 400px;
  background: #fafbfc;
  border-radius: 8px;
}
.graph-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
}
.legend-item {
  display: flex;
  gap: 6px;
  align-items: center;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.score-panel,
.relation-table {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.card-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
