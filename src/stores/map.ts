import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const center = ref<[number, number]>([104.612, 30.884]) // 默认凯州新城
  const zoom = ref(15)
  const activeLayers = ref<string[]>([])
  const selectedMarker = ref<Record<string, unknown> | null>(null)

  function setCenter(lng: number, lat: number) {
    center.value = [lng, lat]
  }

  function setZoom(z: number) {
    zoom.value = z
  }

  function toggleLayer(layerId: string) {
    const idx = activeLayers.value.indexOf(layerId)
    if (idx > -1) {
      activeLayers.value.splice(idx, 1)
    } else {
      activeLayers.value.push(layerId)
    }
  }

  function selectMarker(marker: Record<string, unknown> | null) {
    selectedMarker.value = marker
  }

  return { center, zoom, activeLayers, selectedMarker, setCenter, setZoom, toggleLayer, selectMarker }
})
