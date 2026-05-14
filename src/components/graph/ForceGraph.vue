<template>
  <div ref="containerRef" class="force-graph"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'
import type * as d3types from 'd3'

const props = withDefaults(
  defineProps<{
    nodes?: GraphNodeData[]
    edges?: GraphEdgeData[]
    width?: number
    height?: number
  }>(),
  {
    nodes: () => [],
    edges: () => [],
    width: 800,
    height: 600,
  },
)

const emit = defineEmits<{
  nodeClick: [node: GraphNodeData]
  nodeHover: [node: GraphNodeData | null]
}>()

const containerRef = ref<HTMLElement | null>(null)

let simulation: d3types.Simulation<d3types.SimulationNodeDatum, undefined> | null = null
let svgSelection: unknown = null

async function render() {
  if (!containerRef.value || !props.nodes.length) return

  const d3 = await import('d3')
  const container = containerRef.value
  const width = container.clientWidth || props.width
  const height = container.clientHeight || props.height

  // Stop previous simulation
  if (simulation) {
    simulation.stop()
    simulation = null
  }

  d3.select(container).selectAll('svg').remove()

  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height)

  svgSelection = svg

  // Zoom
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })
  svg.call(zoom)

  const g = svg.append('g')

  // Deep-copy edges so D3 forceLink mutation doesn't affect props
  const edgesCopy = props.edges.map((e) => ({ ...e, source: e.source, target: e.target }))

  // Edges
  const link = g
    .append('g')
    .selectAll('line')
    .data(edgesCopy)
    .join('line')
    .attr('stroke', '#C0C4CC')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', (d: GraphEdgeData) => 1 + (d.weight || 0.5) * 3)

  // Arrow markers
  svg
    .append('defs')
    .selectAll('marker')
    .data(['arrow'])
    .join('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#C0C4CC')

  const categoryColors: Record<string, string> = {
    上游: '#36CBCB',
    中游: '#1889E8',
    下游: '#4ECB73',
    龙头企业: '#F2637B',
    核心企业: '#1889E8',
    配套企业: '#4ECB73',
    投资机构: '#975FE5',
    人工智能: '#1889E8',
    新能源: '#36CBCB',
    生物医药: '#4ECB73',
    先进制造: '#FBD437',
    新材料: '#975FE5',
  }

  // Nodes
  const node = g
    .append('g')
    .selectAll('g')
    .data(props.nodes)
    .join('g')
    .attr('cursor', 'pointer')
    .on('click', (_event: MouseEvent, d: GraphNodeData) => {
      emit('nodeClick', d)
      // Small ripple animation on click
      const nodeR = 6 + Number(d.importance || 50) / 20
      const ripple = d3
        .select(_event.currentTarget as SVGGElement)
        .append('circle')
        .attr('r', nodeR)
        .attr('fill', 'none')
        .attr('stroke', categoryColors[d.category || ''] || '#1889E8')
        .attr('stroke-width', 2)
        .attr('opacity', 0.8)
      ripple
        .transition()
        .duration(500)
        .attr('r', nodeR + 20)
        .attr('opacity', 0)
        .remove()
    })
    .on('mouseenter', (_event: MouseEvent, d: GraphNodeData) => {
      emit('nodeHover', d)
      const connectedIds = new Set<string>()
      connectedIds.add(d.id)
      props.edges.forEach((e) => {
        const srcId = typeof e.source === 'string' ? e.source : (e.source as { id: string }).id
        const tgtId = typeof e.target === 'string' ? e.target : (e.target as { id: string }).id
        if (srcId === d.id) connectedIds.add(tgtId)
        if (tgtId === d.id) connectedIds.add(srcId)
      })
      node.attr('opacity', (n: GraphNodeData) => (connectedIds.has(n.id) ? 1 : 0.2))
      link.attr('opacity', (e: GraphEdgeData) => {
        const srcId = typeof e.source === 'string' ? e.source : (e.source as { id: string }).id
        const tgtId = typeof e.target === 'string' ? e.target : (e.target as { id: string }).id
        return connectedIds.has(srcId) && connectedIds.has(tgtId) ? 1 : 0.05
      })
    })
    .on('mouseleave', () => {
      emit('nodeHover', null)
      node.attr('opacity', 1)
      link.attr('opacity', 0.6)
    })
    .call(
      d3
        .drag<SVGGElement, GraphNodeData>()
        .on(
          'start',
          (
            event: { active: boolean },
            d: GraphNodeData & { fx?: number | null; fy?: number | null },
          ) => {
            if (!event.active && simulation) simulation.alphaTarget(0.3).restart()
            d.fx = d.x as number | null
            d.fy = d.y as number | null
          },
        )
        .on(
          'drag',
          (
            event: { x: number; y: number },
            d: GraphNodeData & { fx?: number | null; fy?: number | null },
          ) => {
            d.fx = event.x
            d.fy = event.y
          },
        )
        .on(
          'end',
          (
            event: { active: boolean },
            d: GraphNodeData & { fx?: number | null; fy?: number | null },
          ) => {
            if (!event.active && simulation) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          },
        ),
    )

  // Circle
  node
    .append('circle')
    .attr('r', (d: GraphNodeData) => 6 + Number(d.importance || 50) / 20)
    .attr('fill', (d: GraphNodeData) => categoryColors[d.category || ''] || '#1889E8')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  // Label
  node
    .append('text')
    .text((d: GraphNodeData) => d.name)
    .attr('font-size', 11)
    .attr('dx', 14)
    .attr('dy', 4)
    .attr('fill', '#303133')

  // Force simulation
  simulation = d3
    .forceSimulation(props.nodes as unknown as d3types.SimulationNodeDatum[])
    .force(
      'link',
      d3
        .forceLink(
          edgesCopy as unknown as d3types.SimulationLinkDatum<d3types.SimulationNodeDatum>[],
        )
        .id((d: unknown) => (d as GraphNodeData).id)
        .distance(80),
    )
    .force('charge', d3.forceManyBody().strength(-120).distanceMax(200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30))

  simulation.on('tick', () => {
    link
      .attr('x1', (d: unknown) => (d as { source: { x: number } }).source.x)
      .attr('y1', (d: unknown) => (d as { source: { y: number } }).source.y)
      .attr('x2', (d: unknown) => (d as { target: { x: number } }).target.x)
      .attr('y2', (d: unknown) => (d as { target: { y: number } }).target.y)

    node.attr('transform', (d: unknown) => {
      const n = d as { x: number; y: number }
      return `translate(${n.x},${n.y})`
    })
  })

  simulation.on('end', () => {
    // Simulation settled — no more movement until user interacts
  })
}

onMounted(() => {
  if (props.nodes.length) render()
})

watch([() => props.nodes, () => props.edges], () => {
  render()
})

defineExpose({ render })
</script>

<style lang="scss" scoped>
.force-graph {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #fafcff;

  :deep(svg) {
    display: block;
  }
}
</style>
