// Maptalks 地图生命周期封装
import { ref, onMounted, onUnmounted } from 'vue'
import type { Map } from 'maptalks'

export function useMaptalks(containerId: string, options?: Record<string, unknown>) {
  const mapInstance = ref<Map | null>(null)
  const loading = ref(true)

  async function initMap() {
    try {
      const maptalks = await import('maptalks')
      const defaultOptions = {
        center: [104.612, 30.884],
        zoom: 15,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate:
            'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
          subdomains: ['1', '2', '3', '4'],
        }),
      }
      mapInstance.value = new maptalks.Map(containerId, { ...defaultOptions, ...options })
    } catch (e) {
      console.error('Maptalks init failed:', e)
    } finally {
      loading.value = false
    }
  }

  function destroyMap() {
    mapInstance.value?.remove()
    mapInstance.value = null
  }

  onMounted(() => {
    initMap()
  })

  onUnmounted(() => {
    destroyMap()
  })

  return { mapInstance, loading, initMap, destroyMap }
}
