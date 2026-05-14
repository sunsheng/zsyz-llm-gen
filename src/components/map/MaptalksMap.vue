<template>
  <div :id="mapId" ref="mapContainer" class="maptalks-map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
  }>(),
  {
    center: () => [104.612, 30.884],
    zoom: 15,
    minZoom: 4,
    maxZoom: 18,
  },
)

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
        urlTemplate:
          'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        attribution: '&copy; 高德地图',
      }),
      attribution: { content: '' },
    })

    map.on('click', (e: unknown) => emit('click', e))
    mapInstance = map
    emit('ready', map)
  } catch (e) {
    console.error('Maptalks init failed:', e)
  }
})

watch(
  () => props.center,
  (val) => {
    if (
      mapInstance &&
      typeof (mapInstance as { setCenter: (c: number[]) => void }).setCenter === 'function'
    ) {
      ;(mapInstance as { setCenter: (c: number[]) => void }).setCenter(val)
    }
  },
)

watch(
  () => props.zoom,
  (val) => {
    if (
      mapInstance &&
      typeof (mapInstance as { setZoom: (z: number) => void }).setZoom === 'function'
    ) {
      ;(mapInstance as { setZoom: (z: number) => void }).setZoom(val)
    }
  },
)

onUnmounted(() => {
  if (mapInstance && typeof (mapInstance as { remove: () => void }).remove === 'function') {
    ;(mapInstance as { remove: () => void }).remove()
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
