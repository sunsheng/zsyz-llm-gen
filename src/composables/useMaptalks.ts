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
        center: [120.15, 30.28],
        zoom: 8,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd']
        })
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
