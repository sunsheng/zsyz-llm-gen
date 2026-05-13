<template>
  <div ref="mapContainer" class="maptalks-map" :id="mapId" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
}>(), {
  center: () => [120.15, 30.28],
  zoom: 8,
  minZoom: 4,
  maxZoom: 18
})

const emit = defineEmits<{
  ready: [map: unknown]
  click: [event: unknown]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const mapId = `maptalks-${Math.random().toString(36).slice(2, 8)}`
let mapInstance: unknown = null

onMounted(async () => {
  try {
    const maptalks = await import('maptalks')
    const map = new maptalks.Map(mapId, {
      center: props.center,
      zoom: props.zoom,
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }),
      attribution: { content: '' }
    })

    map.on('click', (e: unknown) => emit('click', e))
    mapInstance = map
    emit('ready', map)
  } catch (e) {
    console.error('Maptalks init failed:', e)
  }
})

watch(() => props.center, (val) => {
  if (mapInstance && typeof (mapInstance as { setCenter: (c: number[]) => void }).setCenter === 'function') {
    (mapInstance as { setCenter: (c: number[]) => void }).setCenter(val)
  }
})

watch(() => props.zoom, (val) => {
  if (mapInstance && typeof (mapInstance as { setZoom: (z: number) => void }).setZoom === 'function') {
    (mapInstance as { setZoom: (z: number) => void }).setZoom(val)
  }
})

onUnmounted(() => {
  if (mapInstance && typeof (mapInstance as { remove: () => void }).remove === 'function') {
    (mapInstance as { remove: () => void }).remove()
  }
  mapInstance = null
})

defineExpose({ mapInstance })
</script>

<style lang="scss" scoped>
.maptalks-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
