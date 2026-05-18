<template>
  <div class="page-container map-config-page">
    <PageHeader title="产业地图配置" subtitle="底图数据、地图操作、图层配置管理">
      <template #actions>
        <el-button type="primary" :icon="Check" @click="handleSave">保存配置</el-button>
      </template>
    </PageHeader>
    <div class="config-layout">
      <el-tabs v-model="activeTab" class="config-tabs">
        <el-tab-pane label="底图配置" name="basemap">
          <el-card shadow="never">
            <template #header>
              <span class="card-title">底图数据源</span>
            </template>
            <el-form label-width="100px">
              <el-form-item label="底图类型">
                <el-select v-model="basemapConfig.type" style="width: 100%">
                  <el-option label="天地图" value="tianditu" />
                  <el-option label="高德地图" value="amap" />
                  <el-option label="OpenStreetMap" value="osm" />
                </el-select>
              </el-form-item>
              <el-form-item label="地图密钥">
                <el-input
                  v-model="basemapConfig.apiKey"
                  placeholder="请输入底图API密钥"
                  show-password
                />
              </el-form-item>
              <el-form-item label="默认中心点">
                <div style="display: flex; gap: 8px; width: 100%">
                  <el-input v-model="basemapConfig.centerLng" placeholder="经度" />
                  <el-input v-model="basemapConfig.centerLat" placeholder="纬度" />
                </div>
              </el-form-item>
              <el-form-item label="默认缩放级别">
                <el-slider
                  v-model="basemapConfig.defaultZoom"
                  :min="1"
                  :max="18"
                  :step="1"
                  show-stops
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="兴趣点标注" name="poi">
          <el-card shadow="never">
            <template #header>
              <div style="display: flex; align-items: center; justify-content: space-between">
                <span class="card-title">产业资源兴趣点标注</span>
                <el-button type="primary" size="small" :icon="Plus" @click="addPOI"
                  >新增标注</el-button
                >
              </div>
            </template>
            <el-table :data="poiList" stripe border size="small" max-height="400">
              <el-table-column prop="name" label="标注名称" min-width="120" />
              <el-table-column prop="type" label="标注类型" width="100">
                <template #default="{ row }">
                  <el-tag size="small">{{ row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="lng" label="经度" width="100" />
              <el-table-column prop="lat" label="纬度" width="100" />
              <el-table-column prop="category" label="资源分类" width="100" />
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="editPOI(row)">编辑</el-button>
                  <el-button type="danger" link size="small" @click="deletePOI(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="图层管理" name="layer">
          <el-card shadow="never">
            <template #header>
              <div style="display: flex; align-items: center; justify-content: space-between">
                <span class="card-title">产业资源图层管理</span>
                <el-button type="primary" size="small" :icon="Plus" @click="addLayer"
                  >新增图层</el-button
                >
              </div>
            </template>
            <el-table :data="layerList" stripe border size="small" max-height="400">
              <el-table-column prop="name" label="图层名称" min-width="120" />
              <el-table-column prop="type" label="图层类型" width="100">
                <template #default="{ row }">
                  <el-tag size="small" :type="getLayerTagType(row.type)">{{ row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="dataSource" label="数据来源" width="120" />
              <el-table-column label="可见性" width="80">
                <template #default="{ row }">
                  <el-switch v-model="row.visible" size="small" />
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="更新时间" width="140" />
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="editLayer(row)"
                    >编辑</el-button
                  >
                  <el-button type="danger" link size="small" @click="deleteLayer(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- POI Edit Dialog -->
    <el-dialog
      v-model="poiDialogVisible"
      :title="poiForm.id ? '编辑标注' : '新增标注'"
      width="500px"
    >
      <el-form :model="poiForm" label-width="80px">
        <el-form-item label="标注名称">
          <el-input v-model="poiForm.name" placeholder="请输入标注名称" />
        </el-form-item>
        <el-form-item label="标注类型">
          <el-select v-model="poiForm.type" style="width: 100%">
            <el-option label="企业" value="企业" />
            <el-option label="园区" value="园区" />
            <el-option label="机构" value="机构" />
            <el-option label="配套" value="配套" />
          </el-select>
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="poiForm.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="poiForm.lat" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="资源分类">
          <el-select v-model="poiForm.category" style="width: 100%">
            <el-option label="产业集群" value="产业集群" />
            <el-option label="产业空间" value="产业空间" />
            <el-option label="规上企业" value="规上企业" />
            <el-option label="配套资源" value="配套资源" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="poiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePOI">确定</el-button>
      </template>
    </el-dialog>

    <!-- Layer Edit Dialog -->
    <el-dialog
      v-model="layerDialogVisible"
      :title="layerForm.id ? '编辑图层' : '新增图层'"
      width="500px"
    >
      <el-form :model="layerForm" label-width="80px">
        <el-form-item label="图层名称">
          <el-input v-model="layerForm.name" placeholder="请输入图层名称" />
        </el-form-item>
        <el-form-item label="图层类型">
          <el-select v-model="layerForm.type" style="width: 100%">
            <el-option label="矢量" value="矢量" />
            <el-option label="热力" value="热力" />
            <el-option label="栅格" value="栅格" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源">
          <el-input v-model="layerForm.dataSource" placeholder="请输入数据来源" />
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch v-model="layerForm.visible" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="layerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLayer">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Check, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import { fetchMapConfig } from '@/api/modules/mapApi'
import type { MapPOI, MapConfigLayer } from '@/api/types/map'

const activeTab = ref('basemap')
const loading = ref(false)

// Basemap config
const basemapConfig = reactive({
  type: 'amap',
  apiKey: '',
  centerLng: '104.612',
  centerLat: '30.88',
  defaultZoom: 14,
})

// POI management
const poiList = ref<MapPOI[]>([])

const poiDialogVisible = ref(false)
const poiForm = reactive<MapPOI>({
  id: '',
  name: '',
  type: '企业',
  lng: '',
  lat: '',
  category: '产业集群',
})

async function loadData() {
  loading.value = true
  try {
    const data = await fetchMapConfig()
    Object.assign(basemapConfig, data.basemap)
    poiList.value = data.poiList
    layerList.value = data.layerList
  } finally {
    loading.value = false
  }
}

function addPOI() {
  Object.assign(poiForm, { id: '', name: '', type: '企业', lng: '', lat: '', category: '产业集群' })
  poiDialogVisible.value = true
}

function editPOI(row: MapPOI) {
  Object.assign(poiForm, row)
  poiDialogVisible.value = true
}

async function deletePOI(row: MapPOI) {
  await ElMessageBox.confirm(`确定删除标注「${row.name}」？`, '删除确认', { type: 'warning' })
  poiList.value = poiList.value.filter((p) => p.id !== row.id)
  ElMessage.success('标注已删除')
}

function savePOI() {
  if (!poiForm.name) {
    ElMessage.warning('请输入标注名称')
    return
  }
  if (poiForm.id) {
    const idx = poiList.value.findIndex((p) => p.id === poiForm.id)
    if (idx !== -1) poiList.value[idx] = { ...poiForm }
    ElMessage.success('标注已更新')
  } else {
    poiList.value.push({ ...poiForm, id: String(Date.now()) })
    ElMessage.success('标注已添加')
  }
  poiDialogVisible.value = false
}

// Layer management
const layerList = ref<MapConfigLayer[]>([])

const layerDialogVisible = ref(false)
const layerForm = reactive<Omit<MapConfigLayer, 'updateTime'> & { updateTime: string }>({
  id: '',
  name: '',
  type: '矢量',
  dataSource: '',
  visible: true,
  updateTime: '',
})

function addLayer() {
  Object.assign(layerForm, {
    id: '',
    name: '',
    type: '矢量',
    dataSource: '',
    visible: true,
    updateTime: '',
  })
  layerDialogVisible.value = true
}

function editLayer(row: MapConfigLayer) {
  Object.assign(layerForm, row)
  layerDialogVisible.value = true
}

async function deleteLayer(row: MapConfigLayer) {
  await ElMessageBox.confirm(`确定删除图层「${row.name}」？`, '删除确认', { type: 'warning' })
  layerList.value = layerList.value.filter((l) => l.id !== row.id)
  ElMessage.success('图层已删除')
}

function saveLayer() {
  if (!layerForm.name) {
    ElMessage.warning('请输入图层名称')
    return
  }
  if (layerForm.id) {
    const idx = layerList.value.findIndex((l) => l.id === layerForm.id)
    if (idx !== -1)
      layerList.value[idx] = { ...layerForm, updateTime: new Date().toISOString().slice(0, 10) }
    ElMessage.success('图层已更新')
  } else {
    layerList.value.push({
      ...layerForm,
      id: String(Date.now()),
      updateTime: new Date().toISOString().slice(0, 10),
    })
    ElMessage.success('图层已添加')
  }
  layerDialogVisible.value = false
}

function getLayerTagType(type: string): 'primary' | 'success' | 'warning' {
  const map: Record<string, 'primary' | 'success' | 'warning'> = {
    矢量: 'primary',
    热力: 'warning',
    栅格: 'success',
  }
  return map[type] || 'primary'
}

function handleSave() {
  if (!basemapConfig.apiKey) {
    ElMessage.warning('请填写底图API密钥')
    return
  }
  ElMessage.success('配置已保存')
}
onMounted(() => {
  loadData()
})
</script>
<style lang="scss" scoped>
.config-layout {
  padding: 0 20px 20px;
}

.config-tabs {
  :deep(.el-tabs__content) {
    padding: 16px 0;
  }
}

.card-title {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
