<template>
  <div class="page-container">
    <PageHeader title="关键节点" subtitle="产业链关键节点识别与分析" />

    <div class="stat-cards">
      <StatCard
        icon="Warning"
        label="卡脖子节点"
        :value="bottleneckCount"
        unit="个"
        trend="down"
        trend-value="较上季度-2"
        icon-color="#F56C6C"
        icon-bg-color="#FEF0F0"
      />
      <StatCard
        icon="TrophyBase"
        label="高附加值节点"
        :value="highValueCount"
        unit="个"
        trend="up"
        trend-value="较上季度+3"
        icon-color="#E6A23C"
        icon-bg-color="#FDF6EC"
      />
      <StatCard
        icon="Document"
        label="政策敏感节点"
        :value="policySensitiveCount"
        unit="个"
        trend="flat"
        icon-color="#1889E8"
        icon-bg-color="#ECF5FF"
      />
    </div>

    <div class="split-layout">
      <div v-loading="loading" class="split-top content-card">
        <h4 class="card-title">关键节点列表</h4>
        <el-table :data="nodeList" stripe border>
          <el-table-column prop="name" label="节点名称" min-width="120" />
          <el-table-column prop="nodeType" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="nodeTypeTagMap[row.nodeType] as any" size="small">
                {{ nodeTypeLabelMap[row.nodeType] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="importance" label="重要性" width="100" sortable>
            <template #default="{ row }">
              <span
                :class="[
                  'importance-badge',
                  row.importance >= 80 ? 'high' : row.importance >= 60 ? 'medium' : 'low',
                ]"
              >
                {{ row.importance }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="本地企业数" width="120">
            <template #default="{ row }"> {{ row.localEnterprises.length }} 家 </template>
          </el-table-column>
          <el-table-column label="是否缺失" width="100">
            <template #default="{ row }">
              <el-tag :type="row.missingFlag ? 'danger' : 'success'" size="small">
                {{ row.missingFlag ? '缺失' : '覆盖' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewDetail(row)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="split-bottom content-card">
        <h4 class="card-title">关键节点分布</h4>
        <BaseChart :option="chartOption" height="320px" :loading="loading" />
      </div>
    </div>

    <el-dialog v-model="detailVisible" title="节点详情" width="780px">
      <template v-if="detailNode">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="节点名称">{{ detailNode.name }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="nodeTypeTagMap[detailNode.nodeType] as any" size="small">
              {{ nodeTypeLabelMap[detailNode.nodeType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="重要性">{{ detailNode.importance }}</el-descriptions-item>
          <el-descriptions-item label="是否缺失">
            <el-tag :type="detailNode.missingFlag ? 'danger' : 'success'" size="small">
              {{ detailNode.missingFlag ? '缺失' : '覆盖' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{
            detailNode.description
          }}</el-descriptions-item>
          <el-descriptions-item label="本地企业" :span="2">
            <el-tag
              v-for="(ent, idx) in detailNode.localEnterprises"
              :key="idx"
              size="small"
              effect="plain"
              style="margin-right: 6px; margin-bottom: 4px"
            >
              {{ ent }}
            </el-tag>
            <span v-if="!detailNode.localEnterprises.length">暂无</span>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchKeyNodes } from '@/api/modules/investApi'
import type { KeyNodeData } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const nodeTypeLabelMap: Record<string, string> = {
  bottleneck: '卡脖子',
  'high-value': '高附加值',
  'policy-sensitive': '政策敏感',
  standard: '标准',
}
const nodeTypeTagMap: Record<string, string> = {
  bottleneck: 'danger',
  'high-value': 'warning',
  'policy-sensitive': '',
  standard: 'info',
}

const loading = ref(false)
const nodeList = ref<KeyNodeData[]>([])
const detailVisible = ref(false)
const detailNode = ref<KeyNodeData | null>(null)

const bottleneckCount = computed(
  () => nodeList.value.filter((n) => n.nodeType === 'bottleneck').length,
)
const highValueCount = computed(
  () => nodeList.value.filter((n) => n.nodeType === 'high-value').length,
)
const policySensitiveCount = computed(
  () => nodeList.value.filter((n) => n.nodeType === 'policy-sensitive').length,
)

const chartOption = computed<EChartsOption>(() => {
  const sorted = [...nodeList.value].sort((a, b) => b.importance - a.importance)
  return {
    color: chartColors,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '6%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: { type: 'value', max: 100 },
    yAxis: {
      type: 'category',
      data: sorted.map((n) => n.name),
      inverse: true,
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: sorted.map((n) => ({
          value: n.importance,
          itemStyle: {
            color:
              n.nodeType === 'bottleneck'
                ? '#F56C6C'
                : n.nodeType === 'high-value'
                  ? '#E6A23C'
                  : n.nodeType === 'policy-sensitive'
                    ? '#1889E8'
                    : '#909399',
          },
        })),
      },
    ],
  }
})

function handleViewDetail(node: KeyNodeData) {
  detailNode.value = node
  detailVisible.value = true
}

async function loadData() {
  loading.value = true
  try {
    nodeList.value = await fetchKeyNodes(10)
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

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.split-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.importance-badge {
  display: inline-block;
  padding: 2px 8px;
  font-weight: $font-weight-medium;
  border-radius: 4px;

  &.high {
    color: #f56c6c;
    background: #fef0f0;
  }

  &.medium {
    color: #e6a23c;
    background: #fdf6ec;
  }

  &.low {
    color: #909399;
    background: #f4f4f5;
  }
}
</style>
