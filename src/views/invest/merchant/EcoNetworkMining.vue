<template>
  <div class="page-container">
    <PageHeader title="生态网络挖掘" subtitle="企业生态网络关系挖掘" />

    <div class="toolbar-bar">
      <span class="bar-label">链主企业</span>
      <el-select
        v-model="selectedOwner"
        placeholder="选择链主企业"
        filterable
        @change="handleOwnerChange"
      >
        <el-option
          v-for="item in ecoNetworkNodes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button @click="graphRef?.resetZoom()">重置</el-button>
    </div>

    <div class="graph-layout">
      <div class="graph-main">
        <ForceGraph :nodes="graphNodes" :edges="graphEdges" @node-click="handleNodeClick" />
      </div>
      <div class="graph-sidebar">
        <h4 class="sidebar-title">图例</h4>
        <div class="legend-list">
          <div v-for="item in legendItems" :key="item.type" class="legend-item">
            <span class="legend-dot" :style="{ background: item.color }"></span>
            <span class="legend-label">{{ item.label }}</span>
          </div>
        </div>

        <template v-if="selectedNode">
          <h4 class="sidebar-title">节点详情</h4>
          <div class="node-detail">
            <div class="detail-row">
              <span class="detail-label">企业名称</span>
              <span class="detail-value">{{ selectedNode.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">类型</span>
              <el-tag size="small">{{ nodeTypeLabel }}</el-tag>
            </div>
            <div class="detail-row">
              <span class="detail-label">关系</span>
              <span class="detail-value">{{ selectedNode.relation }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">投资潜力</span>
              <ScoreRing :value="selectedNode.investmentPotential" :size="56" :stroke-width="5" />
            </div>
          </div>
        </template>
        <el-empty v-else description="点击节点查看详情" />
      </div>
    </div>

    <div class="target-section">
      <h4 class="section-title">潜在招商目标清单</h4>
      <el-table v-loading="loading" :data="ecoNetworkNodes" stripe border>
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="typeTagMap[row.type] || ('info' as any)">{{
              typeLabelMap[row.type] || row.type
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="relation" label="关系" min-width="140" />
        <el-table-column prop="investmentPotential" label="投资潜力" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.investmentPotential"
              :stroke-width="6"
              :text-inside="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleFollowUp(row)"
              >跟进</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="followVisible" title="跟进记录" width="840px">
      <el-descriptions :column="2" border style="margin-bottom: 16px">
        <el-descriptions-item label="企业名称">{{ followData.name }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ followData.type }}</el-descriptions-item>
        <el-descriptions-item label="关系">{{ followData.relation }}</el-descriptions-item>
        <el-descriptions-item label="投资潜力">{{
          followData.investmentPotential
        }}</el-descriptions-item>
      </el-descriptions>
      <el-form :model="followForm" label-width="80px">
        <el-form-item label="跟进状态">
          <el-select v-model="followForm.status" placeholder="请选择跟进状态">
            <el-option label="初次接触" value="初次接触" />
            <el-option label="深入沟通" value="深入沟通" />
            <el-option label="实地考察" value="实地考察" />
            <el-option label="签约洽谈" value="签约洽谈" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="followForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="followVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFollowSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import ForceGraph from '@/components/graph/ForceGraph.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { fetchEcoNetworkNodes } from '@/api/modules/investApi'
import type { EcoNetworkNode } from '@/api/types/invest'
import type { GraphNodeData, GraphEdgeData } from '@/composables/useForceGraph'

const loading = ref(false)
const ecoNetworkNodes = ref<EcoNetworkNode[]>([])
const selectedOwner = ref('')
const selectedNode = ref<EcoNetworkNode | null>(null)
const graphRef = ref<InstanceType<typeof ForceGraph> | null>(null)
const followVisible = ref(false)
const followData = ref<Partial<EcoNetworkNode>>({})
const followForm = reactive({ status: '', remark: '' })

const typeColorMap: Record<string, string> = {
  supplier: '#36CBCB',
  customer: '#1889E8',
  investee: '#975FE5',
  'talent-related': '#FBD437',
}

const typeLabelMap: Record<string, string> = {
  supplier: '供应商',
  customer: '客户',
  investee: '投资对象',
  'talent-related': '人才关联',
}

const typeTagMap: Record<string, '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  supplier: '',
  customer: 'success',
  investee: 'warning',
  'talent-related': 'info',
}

const nodeTypeLabel = computed(() => {
  if (!selectedNode.value) return ''
  return typeLabelMap[selectedNode.value.type] || selectedNode.value.type
})

const legendItems = computed(() => [
  { type: 'supplier', color: typeColorMap['supplier'], label: '供应商' },
  { type: 'customer', color: typeColorMap['customer'], label: '客户' },
  { type: 'investee', color: typeColorMap['investee'], label: '投资对象' },
  { type: 'talent-related', color: typeColorMap['talent-related'], label: '人才关联' },
])

const graphNodes = computed<GraphNodeData[]>(() => {
  if (!selectedOwner.value) return []
  const owner = ecoNetworkNodes.value.find((n) => n.id === selectedOwner.value)
  const nodes: GraphNodeData[] = []
  if (owner) {
    nodes.push({ id: owner.id, name: owner.name, category: '链主', importance: 90 })
  }
  ecoNetworkNodes.value
    .filter((n) => n.id !== selectedOwner.value)
    .forEach((n) => {
      nodes.push({
        id: n.id,
        name: n.name,
        category: typeLabelMap[n.type] || n.type,
        importance: n.investmentPotential,
      })
    })
  return nodes
})

const graphEdges = computed<GraphEdgeData[]>(() => {
  if (!selectedOwner.value) return []
  return ecoNetworkNodes.value
    .filter((n) => n.id !== selectedOwner.value)
    .map((n) => ({
      source: selectedOwner.value,
      target: n.id,
      weight: n.investmentPotential / 100,
      type: n.type,
    }))
})

function handleFollowUp(row: any) {
  followData.value = row
  followForm.status = ''
  followForm.remark = ''
  followVisible.value = true
}

function handleFollowSubmit() {
  ElMessage.success('跟进记录已提交')
  followVisible.value = false
}

function handleOwnerChange() {
  selectedNode.value = null
}

function handleNodeClick(node: GraphNodeData) {
  selectedNode.value = ecoNetworkNodes.value.find((n) => n.id === node.id) ?? null
}

async function loadData() {
  loading.value = true
  try {
    const data = await fetchEcoNetworkNodes()
    ecoNetworkNodes.value = data
    if (data.length > 0) {
      selectedOwner.value = data[0].id
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.toolbar-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;

  .bar-label {
    font-size: 14px;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    white-space: nowrap;
  }

  .el-select {
    width: 240px;
  }
}

.graph-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  margin-bottom: 20px;
}

.graph-main {
  min-height: 480px;
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.graph-sidebar {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.sidebar-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.legend-dot {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  font-size: 13px;
  color: $text-secondary;
}

.node-detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-label {
  font-size: 13px;
  color: $text-secondary;
}

.detail-value {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.target-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
