<template>
  <g class="graph-node" :transform="`translate(${x},${y})`" @click="$emit('click', data)">
    <circle
      :r="radius"
      :fill="color"
      stroke="#fff"
      :stroke-width="2"
    />
    <text
      :x="radius + 6"
      y="4"
      font-size="11"
      fill="#303133"
    >{{ data.name }}</text>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GraphNodeData } from '@/composables/useForceGraph'

const props = defineProps<{
  data: GraphNodeData
  x: number
  y: number
}>()

defineEmits<{ click: [data: GraphNodeData] }>()

const categoryColors: Record<string, string> = {
  '上游': '#36CBCB',
  '中游': '#1889E8',
  '下游': '#4ECB73'
}

const radius = computed(() => 6 + Number(props.data.importance || 50) / 20)
const color = computed(() => categoryColors[props.data.category || ''] || '#1889E8')
</script>
