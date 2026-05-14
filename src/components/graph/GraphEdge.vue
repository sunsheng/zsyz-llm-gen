<template>
  <line
    class="graph-edge"
    :x1="x1"
    :y1="y1"
    :x2="x2"
    :y2="y2"
    :stroke="color"
    :stroke-opacity="opacity"
    :stroke-width="width"
    marker-end="url(#arrow)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    x1: number
    y1: number
    x2: number
    y2: number
    weight?: number
    type?: string
  }>(),
  {
    weight: 0.5,
    type: 'supply',
  },
)

const typeColors: Record<string, string> = {
  supply: '#C0C4CC',
  tech: '#36CBCB',
  investment: '#FBD437',
  compete: '#F2637B',
}

const width = computed(() => 1 + props.weight * 3)
const color = computed(() => typeColors[props.type] || '#C0C4CC')
const opacity = computed(() => 0.4 + props.weight * 0.5)
</script>
