// D3 Force Graph 生命周期封装
import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type * as d3types from 'd3'

export interface GraphNodeData {
  id: string
  name: string
  category?: string
  value?: number
  [key: string]: unknown
}

export interface GraphEdgeData {
  source: string
  target: string
  weight?: number
  type?: string
  [key: string]: unknown
}

export function useForceGraph(containerRef: Ref<HTMLElement | null>) {
  const loading = ref(false)
  let simulation: d3types.Simulation<d3types.SimulationNodeDatum, undefined> | null = null
  let svg: d3types.Selection<SVGSVGElement, unknown, null, undefined> | null = null

  async function render(nodes: GraphNodeData[], edges: GraphEdgeData[]) {
    if (!containerRef.value) return
    loading.value = true

    try {
      const d3 = await import('d3')
      const container = containerRef.value
      const width = container.clientWidth
      const height = container.clientHeight

      // 清除旧 SVG
      d3.select(container).selectAll('svg').remove()

      svg = d3.select(container).append('svg').attr('width', width).attr('height', height)

      const simulationObj = d3
        .forceSimulation(nodes as unknown as d3types.SimulationNodeDatum[])
        .force(
          'link',
          d3
            .forceLink(
              edges as unknown as d3types.SimulationLinkDatum<d3types.SimulationNodeDatum>[],
            )
            .id((d: unknown) => (d as GraphNodeData).id),
        )
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))

      simulation = simulationObj

      const link = svg
        .append('g')
        .selectAll('line')
        .data(edges)
        .join('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 1.5)

      const node = svg
        .append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 8)
        .attr('fill', '#1889E8')
        .call(
          d3
            .drag<SVGCircleElement, GraphNodeData>()
            .on('start', () => {})
            .on('drag', () => {})
            .on('end', () => {}),
        )

      const label = svg
        .append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text((d) => d.name)
        .attr('font-size', 10)
        .attr('dx', 12)
        .attr('dy', 4)

      simulationObj.on('tick', () => {
        link
          .attr('x1', (d: unknown) => (d as { source: { x: number } }).source.x)
          .attr('y1', (d: unknown) => (d as { source: { y: number } }).source.y)
          .attr('x2', (d: unknown) => (d as { target: { x: number } }).target.x)
          .attr('y2', (d: unknown) => (d as { target: { y: number } }).target.y)

        node
          .attr('cx', (d: unknown) => (d as { x: number }).x)
          .attr('cy', (d: unknown) => (d as { y: number }).y)

        label
          .attr('x', (d: unknown) => (d as { x: number }).x)
          .attr('y', (d: unknown) => (d as { y: number }).y)
      })
    } catch (e) {
      console.error('Force graph render failed:', e)
    } finally {
      loading.value = false
    }
  }

  function destroy() {
    if (simulation) {
      simulation.stop()
    }
    simulation = null
    svg = null
  }

  onUnmounted(() => {
    destroy()
  })

  return { loading, render, destroy }
}
