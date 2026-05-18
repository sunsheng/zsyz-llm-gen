<template>
  <div class="page-container key-node-page">
    <PageHeader title="产业链关键环节识别" subtitle="凯州新城产业链主导环节与薄弱环节识别分析">
      <template #actions>
        <el-select v-model="selectedRegion" placeholder="选择区域" style="width: 160px">
          <el-option v-for="r in regionOptions" :key="r.code" :label="r.name" :value="r.code" />
        </el-select>
        <IndustryChainSelect v-model="selectedChain" placeholder="选择产业链" />
        <el-select v-model="dimension" placeholder="分析维度" style="width: 160px">
          <el-option label="综合评估" value="composite" />
          <el-option label="产出贡献" value="output" />
          <el-option label="龙头集中度" value="leading" />
          <el-option label="市场份额" value="market" />
        </el-select>
      </template>
    </PageHeader>

    <LoadingSpinner :loading="loading" type="skeleton" :rows="8">
      <!-- 统计卡片 -->
      <div class="key-node-stats">
        <StatCard
          icon="Medal"
          label="主导环节"
          :value="dominantCount"
          unit="个"
          icon-color="#1889E8"
          icon-bg-color="#ECF5FF"
        />
        <StatCard
          icon="Warning"
          label="薄弱环节"
          :value="weakCount"
          unit="个"
          icon-color="#F2637B"
          icon-bg-color="#FEF0F0"
          trend="down"
          trend-value="-2%"
        />
        <StatCard
          icon="TrendCharts"
          label="平均集中度"
          :value="avgConcentration"
          unit="%"
          icon-color="#36CBCB"
          icon-bg-color="#E6FFFB"
        />
        <StatCard
          icon="DataLine"
          label="环节总数"
          :value="totalNodes"
          unit="个"
          icon-color="#975FE5"
          icon-bg-color="#F3F0FF"
        />
      </div>

      <div class="key-node-content">
        <!-- 左侧：关键环节列表 -->
        <div class="node-list-panel">
          <div class="panel-header">
            <h3 class="panel-title">关键环节识别</h3>
            <el-radio-group v-model="filterType" size="small">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="dominant">主导</el-radio-button>
              <el-radio-button value="weak">薄弱</el-radio-button>
            </el-radio-group>
          </div>
          <div class="node-list">
            <div
              v-for="node in filteredNodes"
              :key="node.id"
              class="node-card"
              :class="{
                'node-card--dominant': node.type === 'dominant',
                'node-card--weak': node.type === 'weak',
              }"
              @click="handleNodeClick(node)"
            >
              <div class="node-card__header">
                <span class="node-card__name">{{ node.name }}</span>
                <el-tag
                  :type="
                    node.type === 'dominant' ? 'primary' : node.type === 'weak' ? 'danger' : 'info'
                  "
                  size="small"
                >
                  {{ node.type === 'dominant' ? '主导' : node.type === 'weak' ? '薄弱' : '一般' }}
                </el-tag>
              </div>
              <div class="node-card__category">{{ node.category }} · {{ node.region }}</div>
              <div class="node-card__metrics">
                <div class="node-card__metric">
                  <span class="node-card__metric-label">产出贡献</span>
                  <el-progress
                    :percentage="node.outputScore"
                    :stroke-width="6"
                    :color="node.outputScore >= 70 ? '#1889E8' : '#F2637B'"
                    :show-text="false"
                  />
                  <span class="node-card__metric-value">{{ node.outputScore }}%</span>
                </div>
                <div class="node-card__metric">
                  <span class="node-card__metric-label">龙头集中</span>
                  <el-progress
                    :percentage="node.leadingScore"
                    :stroke-width="6"
                    :color="node.leadingScore >= 70 ? '#36CBCB' : '#FBD437'"
                    :show-text="false"
                  />
                  <span class="node-card__metric-value">{{ node.leadingScore }}%</span>
                </div>
                <div class="node-card__metric">
                  <span class="node-card__metric-label">市场份额</span>
                  <el-progress
                    :percentage="node.marketScore"
                    :stroke-width="6"
                    :color="node.marketScore >= 70 ? '#4ECB73' : '#F2637B'"
                    :show-text="false"
                  />
                  <span class="node-card__metric-value">{{ node.marketScore }}%</span>
                </div>
              </div>
              <div class="node-card__enterprises">
                <span class="node-card__enterprises-label">龙头企业：</span>
                <span class="node-card__enterprises-value">{{
                  node.leadingEnterprises.join('、')
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：环节详情 -->
        <div class="node-detail-panel">
          <template v-if="activeNode">
            <div class="detail-header">
              <h3 class="detail-title">{{ activeNode.name }}</h3>
              <el-tag
                :type="
                  activeNode.type === 'dominant'
                    ? 'primary'
                    : activeNode.type === 'weak'
                      ? 'danger'
                      : 'info'
                "
              >
                {{
                  activeNode.type === 'dominant'
                    ? '主导环节'
                    : activeNode.type === 'weak'
                      ? '薄弱环节'
                      : '一般环节'
                }}
              </el-tag>
            </div>

            <!-- 评分雷达 -->
            <div class="detail-radar">
              <v-chart :option="radarOption" autoresize style="height: 280px" />
            </div>

            <!-- 环节指标详情 -->
            <div class="detail-metrics">
              <h4 class="detail-section-title">指标详情</h4>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="产出贡献"
                  >{{ activeNode.outputScore }}%</el-descriptions-item
                >
                <el-descriptions-item label="龙头集中度"
                  >{{ activeNode.leadingScore }}%</el-descriptions-item
                >
                <el-descriptions-item label="市场份额"
                  >{{ activeNode.marketScore }}%</el-descriptions-item
                >
                <el-descriptions-item label="综合评分"
                  >{{ activeNode.compositeScore }}分</el-descriptions-item
                >
                <el-descriptions-item label="关联企业数"
                  >{{ activeNode.enterpriseCount }}家</el-descriptions-item
                >
                <el-descriptions-item label="环节层级">{{
                  activeNode.category
                }}</el-descriptions-item>
                <el-descriptions-item label="所属区域">{{
                  activeNode.region
                }}</el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 龙头企业 -->
            <div class="detail-enterprises">
              <h4 class="detail-section-title">龙头企业</h4>
              <el-table :data="activeNode.enterpriseDetails" stripe border size="small">
                <el-table-column prop="name" label="企业名称" min-width="140" />
                <el-table-column prop="marketShare" label="市场份额" width="100">
                  <template #default="{ row }">{{ row.marketShare }}%</template>
                </el-table-column>
                <el-table-column prop="revenue" label="营收(亿)" width="100" align="right" />
                <el-table-column prop="park" label="所在园区" width="140" />
              </el-table>
            </div>

            <!-- 补强建议 -->
            <div v-if="activeNode.type === 'weak'" class="detail-suggestion">
              <h4 class="detail-section-title">补强建议</h4>
              <div class="suggestion-list">
                <div v-for="(s, i) in activeNode.suggestions" :key="i" class="suggestion-item">
                  <el-icon :size="16" color="#1889E8"><Promotion /></el-icon>
                  <span>{{ s }}</span>
                </div>
              </div>
            </div>
          </template>
          <el-empty v-else description="请选择环节查看详情" />
        </div>
      </div>
    </LoadingSpinner>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import IndustryChainSelect from '@/components/business/IndustryChainSelect.vue'
import VChart from 'vue-echarts'

interface EnterpriseDetail {
  name: string
  marketShare: number
  revenue: number
  park: string
}

interface KeyNode {
  id: string
  name: string
  category: string
  region: string
  type: 'dominant' | 'weak' | 'normal'
  outputScore: number
  leadingScore: number
  marketScore: number
  compositeScore: number
  enterpriseCount: number
  leadingEnterprises: string[]
  enterpriseDetails: EnterpriseDetail[]
  suggestions: string[]
}

const regionOptions = [
  { code: 'kaizhou', name: '凯州新城' },
  { code: 'chengyu', name: '成渝区域' },
  { code: 'pearl', name: '珠三角区域' },
]

const selectedRegion = ref('kaizhou')
const selectedChain = ref<string | string[]>('high-end-equipment')
const dimension = ref('composite')
const filterType = ref('all')
const loading = ref(false)
const activeNode = ref<KeyNode | null>(null)

const nodes = ref<KeyNode[]>([
  {
    id: 'n1',
    name: '整机装配',
    category: '中游',
    region: '凯州新城',
    type: 'dominant',
    outputScore: 88,
    leadingScore: 82,
    marketScore: 80,
    compositeScore: 83,
    enterpriseCount: 10,
    leadingEnterprises: ['华创科技(凯州)', '凯州智能电气'],
    enterpriseDetails: [
      { name: '华创科技(凯州)', marketShare: 25, revenue: 128.5, park: '产业园A区' },
      { name: '凯州智能电气', marketShare: 18, revenue: 52.3, park: '产业园A区' },
    ],
    suggestions: [],
  },
  {
    id: 'n2',
    name: '核心零部件',
    category: '上游',
    region: '凯州新城',
    type: 'weak',
    outputScore: 30,
    leadingScore: 25,
    marketScore: 18,
    compositeScore: 24,
    enterpriseCount: 2,
    leadingEnterprises: ['盛通精密', '创维光电'],
    enterpriseDetails: [
      { name: '盛通精密', marketShare: 10, revenue: 38.6, park: '产业园B区' },
      { name: '创维光电', marketShare: 6, revenue: 41.8, park: '数字产业园' },
    ],
    suggestions: ['引进核心零部件龙头企业补链', '鼓励本地企业技术升级', '搭建零部件供需对接平台'],
  },
  {
    id: 'n3',
    name: '智能控制',
    category: '中游',
    region: '凯州新城',
    type: 'dominant',
    outputScore: 82,
    leadingScore: 78,
    marketScore: 72,
    compositeScore: 77,
    enterpriseCount: 7,
    leadingEnterprises: ['凯州智能电气', '恒信电子'],
    enterpriseDetails: [
      { name: '凯州智能电气', marketShare: 20, revenue: 52.3, park: '产业园A区' },
      { name: '恒信电子', marketShare: 15, revenue: 45.2, park: '数字产业园' },
    ],
    suggestions: [],
  },
  {
    id: 'n4',
    name: '基础材料研发',
    category: '上游',
    region: '凯州新城',
    type: 'weak',
    outputScore: 28,
    leadingScore: 22,
    marketScore: 15,
    compositeScore: 22,
    enterpriseCount: 1,
    leadingEnterprises: ['中科新材料(凯州)'],
    enterpriseDetails: [
      { name: '中科新材料(凯州)', marketShare: 8, revenue: 86.3, park: '科技园' },
    ],
    suggestions: ['加强与高校院所产学研合作', '设立专项研发基金', '引进国际先进材料企业'],
  },
  {
    id: 'n5',
    name: '新能源汽车',
    category: '下游',
    region: '凯州新城',
    type: 'normal',
    outputScore: 65,
    leadingScore: 55,
    marketScore: 50,
    compositeScore: 57,
    enterpriseCount: 5,
    leadingEnterprises: ['鼎盛自动化', '凯州新能源'],
    enterpriseDetails: [
      { name: '鼎盛自动化', marketShare: 12, revenue: 95.7, park: '产业园A区' },
      { name: '凯州新能源', marketShare: 8, revenue: 36.5, park: '产业园C区' },
    ],
    suggestions: [],
  },
  {
    id: 'n6',
    name: '精密加工',
    category: '中游',
    region: '凯州新城',
    type: 'normal',
    outputScore: 58,
    leadingScore: 50,
    marketScore: 45,
    compositeScore: 51,
    enterpriseCount: 5,
    leadingEnterprises: ['盛通精密', '凯州精密模具'],
    enterpriseDetails: [
      { name: '盛通精密', marketShare: 14, revenue: 38.6, park: '产业园B区' },
      { name: '凯州精密模具', marketShare: 10, revenue: 18.9, park: '产业园B区' },
    ],
    suggestions: [],
  },
])

const filteredNodes = computed(() => {
  if (filterType.value === 'all') return nodes.value
  return nodes.value.filter((n) => n.type === filterType.value)
})

const dominantCount = computed(() => nodes.value.filter((n) => n.type === 'dominant').length)
const weakCount = computed(() => nodes.value.filter((n) => n.type === 'weak').length)
const avgConcentration = computed(() => {
  if (!nodes.value.length) return 0
  return Math.round(nodes.value.reduce((sum, n) => sum + n.compositeScore, 0) / nodes.value.length)
})
const totalNodes = computed(() => nodes.value.length)

const radarOption = computed(() => {
  if (!activeNode.value) return {}
  return {
    tooltip: {},
    radar: {
      indicator: [
        { name: '产出贡献', max: 100 },
        { name: '龙头集中度', max: 100 },
        { name: '市场份额', max: 100 },
      ],
      shape: 'circle',
      splitNumber: 4,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              activeNode.value.outputScore,
              activeNode.value.leadingScore,
              activeNode.value.marketScore,
            ],
            name: activeNode.value.name,
            areaStyle: { color: 'rgba(24, 137, 232, 0.15)' },
            lineStyle: { color: '#1889E8' },
            itemStyle: { color: '#1889E8' },
          },
        ],
      },
    ],
  }
})

function handleNodeClick(node: KeyNode) {
  activeNode.value = node
}

watch([selectedRegion, selectedChain], () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
})

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
})
</script>

<style lang="scss" scoped>
.key-node-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.key-node-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - #{$header-height} - 240px);
}

.node-list-panel {
  flex-shrink: 0;
  width: 380px;
  overflow-y: auto;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid $border-color-lighter;
}

.panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.node-list {
  padding: 12px;
}

.node-card {
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
  transition:
    border-color $transition-fast,
    box-shadow $transition-fast;

  &:hover {
    border-color: $color-primary;
    box-shadow: 0 2px 8px 0 rgba(24, 137, 232, 0.1);
  }

  &--dominant {
    border-left: 3px solid #1889e8;
  }

  &--weak {
    border-left: 3px solid #f2637b;
  }
}

.node-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.node-card__name {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.node-card__category {
  margin-bottom: 12px;
  font-size: 12px;
  color: $text-secondary;
}

.node-card__metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.node-card__metric {
  display: flex;
  gap: 8px;
  align-items: center;
}

.node-card__metric-label {
  flex-shrink: 0;
  width: 56px;
  font-size: 12px;
  color: $text-secondary;
}

.node-card__metric .el-progress {
  flex: 1;
}

.node-card__metric-value {
  flex-shrink: 0;
  width: 32px;
  font-size: 12px;
  color: $text-regular;
  text-align: right;
}

.node-card__enterprises {
  font-size: 12px;
  color: $text-secondary;
}

.node-card__enterprises-label {
  color: $text-placeholder;
}

.node-card__enterprises-value {
  color: $text-regular;
}

.node-detail-panel {
  flex: 1;
  min-width: 0;
  padding: 20px;
  overflow-y: auto;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.detail-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.detail-title {
  margin: 0;
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.detail-section-title {
  margin: 20px 0 12px;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.detail-radar {
  margin-bottom: 20px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 13px;
  color: $text-regular;
}
</style>
