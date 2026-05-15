<template>
  <div class="page-container chain-enterprise-page">
    <PageHeader title="产业链关联企业" subtitle="产业链与企业匹配关系，企业分布与详情">
      <template #actions>
        <IndustryChainSelect v-model="selectedChain" placeholder="选择产业链" />
        <el-select v-model="matchType" placeholder="匹配状态" clearable style="width: 140px">
          <el-option label="已匹配" value="matched" />
          <el-option label="未匹配" value="unmatched" />
          <el-option label="部分匹配" value="partial" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索企业"
          clearable
          style="width: 180px"
          :prefix-icon="Search"
        />
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="chain-enterprise-page__content">
      <!-- 左侧：产业链环节列表 -->
      <div class="chain-sidebar">
        <div class="chain-sidebar__title">产业链环节</div>
        <div class="chain-sections">
          <div v-for="section in chainSections" :key="section.label" class="chain-section">
            <div class="chain-section__header">
              <span class="chain-section__dot" :style="{ background: section.color }"></span>
              <span class="chain-section__label">{{ section.label }}</span>
              <span class="chain-section__count">{{ section.nodes.length }}个环节</span>
            </div>
            <div
              v-for="node in section.nodes"
              :key="node.id"
              class="chain-node"
              :class="{ 'chain-node--active': activeNodeId === node.id }"
              @click="handleNodeSelect(node)"
            >
              <span class="chain-node__name">{{ node.name }}</span>
              <el-tag
                :type="
                  node.matchStatus === 'matched'
                    ? 'success'
                    : node.matchStatus === 'partial'
                      ? 'warning'
                      : 'danger'
                "
                size="small"
              >
                {{ node.matchCount }}家
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：关联企业列表 -->
      <div class="enterprise-main">
        <LoadingSpinner :loading="loading" type="skeleton" :rows="8">
          <!-- 统计概览 -->
          <div class="enterprise-stats">
            <StatCard
              icon="OfficeBuilding"
              label="关联企业总数"
              :value="totalEnterprises"
              unit="家"
              icon-color="#1889E8"
              icon-bg-color="#ECF5FF"
            />
            <StatCard
              icon="CircleCheck"
              label="已匹配企业"
              :value="matchedCount"
              unit="家"
              icon-color="#4ECB73"
              icon-bg-color="#F0F9EB"
              trend="up"
              trend-value="+8%"
            />
            <StatCard
              icon="Warning"
              label="未匹配环节"
              :value="unmatchedNodes"
              unit="个"
              icon-color="#F2637B"
              icon-bg-color="#FEF0F0"
            />
            <StatCard
              icon="Connection"
              label="匹配率"
              :value="matchRate"
              unit="%"
              icon-color="#975FE5"
              icon-bg-color="#F3F0FF"
            />
          </div>

          <!-- 企业表格 -->
          <div class="enterprise-table">
            <el-table :data="filteredEnterprises" stripe border style="width: 100%">
              <el-table-column prop="name" label="企业名称" min-width="180">
                <template #default="{ row }">
                  <span class="enterprise-name" @click="handleEnterpriseClick(row)">{{
                    row.name
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="chainNode" label="匹配环节" width="160" />
              <el-table-column prop="industry" label="所属产业" width="140" />
              <el-table-column prop="matchType" label="匹配类型" width="120">
                <template #default="{ row }">
                  <el-tag
                    :type="
                      row.matchType === '核心'
                        ? 'primary'
                        : row.matchType === '配套'
                          ? 'success'
                          : 'info'
                    "
                    size="small"
                  >
                    {{ row.matchType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="matchScore" label="匹配度" width="120">
                <template #default="{ row }">
                  <div class="match-score">
                    <el-progress
                      :percentage="row.matchScore"
                      :color="
                        row.matchScore >= 80
                          ? '#4ECB73'
                          : row.matchScore >= 60
                            ? '#FBD437'
                            : '#F2637B'
                      "
                      :stroke-width="8"
                      :show-text="false"
                    />
                    <span class="match-score__value">{{ row.matchScore }}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="region" label="所在区域" width="120" />
              <el-table-column prop="revenue" label="营收(亿元)" width="120" align="right" />
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="handleEnterpriseClick(row)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="enterprise-table__pagination">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="filteredEnterprises.length"
                layout="total, prev, pager, next"
                background
              />
            </div>
          </div>
        </LoadingSpinner>
      </div>
    </div>

    <!-- 企业详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="企业详情" size="420px" :destroy-on-close="true">
      <template v-if="selectedEnterprise">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="企业名称">{{
            selectedEnterprise.name
          }}</el-descriptions-item>
          <el-descriptions-item label="匹配环节">{{
            selectedEnterprise.chainNode
          }}</el-descriptions-item>
          <el-descriptions-item label="所属产业">{{
            selectedEnterprise.industry
          }}</el-descriptions-item>
          <el-descriptions-item label="匹配类型">{{
            selectedEnterprise.matchType
          }}</el-descriptions-item>
          <el-descriptions-item label="匹配度"
            >{{ selectedEnterprise.matchScore }}%</el-descriptions-item
          >
          <el-descriptions-item label="所在区域">{{
            selectedEnterprise.region
          }}</el-descriptions-item>
          <el-descriptions-item label="营收"
            >{{ selectedEnterprise.revenue }}亿元</el-descriptions-item
          >
        </el-descriptions>
        <div class="drawer-section">
          <h4 class="drawer-section__title">关联产业链环节</h4>
          <div class="drawer-section__tags">
            <el-tag
              v-for="node in selectedEnterprise.relatedNodes"
              :key="node"
              size="small"
              effect="plain"
              >{{ node }}</el-tag
            >
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import IndustryChainSelect from '@/components/business/IndustryChainSelect.vue'
import { useExport } from '@/composables/useExport'

const { exportToExcel } = useExport()

interface ChainNode {
  id: string
  name: string
  category: string
  matchCount: number
  matchStatus: 'matched' | 'partial' | 'unmatched'
}

interface EnterpriseItem {
  id: string
  name: string
  chainNode: string
  industry: string
  matchType: string
  matchScore: number
  region: string
  revenue: number
  relatedNodes: string[]
}

const selectedChain = ref<string | string[]>('high-end-equipment')
const matchType = ref('')
const searchKeyword = ref('')
const loading = ref(false)
const drawerVisible = ref(false)
const selectedEnterprise = ref<EnterpriseItem | null>(null)
const activeNodeId = ref('')
const currentPage = ref(1)
const pageSize = 20

const chainSections = ref<{ label: string; color: string; nodes: ChainNode[] }[]>([
  {
    label: '上游',
    color: '#36CBCB',
    nodes: [
      { id: 'up-1', name: '原材料供应', category: '上游', matchCount: 12, matchStatus: 'matched' },
      { id: 'up-2', name: '核心零部件', category: '上游', matchCount: 8, matchStatus: 'partial' },
      {
        id: 'up-3',
        name: '基础材料研发',
        category: '上游',
        matchCount: 3,
        matchStatus: 'unmatched',
      },
      { id: 'up-4', name: '特种钢材', category: '上游', matchCount: 6, matchStatus: 'matched' },
    ],
  },
  {
    label: '中游',
    color: '#1889E8',
    nodes: [
      { id: 'mid-1', name: '整机装配', category: '中游', matchCount: 15, matchStatus: 'matched' },
      { id: 'mid-2', name: '系统集成', category: '中游', matchCount: 10, matchStatus: 'partial' },
      { id: 'mid-3', name: '精密加工', category: '中游', matchCount: 7, matchStatus: 'matched' },
      { id: 'mid-4', name: '智能控制', category: '中游', matchCount: 9, matchStatus: 'matched' },
      { id: 'mid-5', name: '检测认证', category: '中游', matchCount: 2, matchStatus: 'unmatched' },
    ],
  },
  {
    label: '下游',
    color: '#4ECB73',
    nodes: [
      { id: 'down-1', name: '航空航天', category: '下游', matchCount: 11, matchStatus: 'matched' },
      {
        id: 'down-2',
        name: '新能源汽车',
        category: '下游',
        matchCount: 14,
        matchStatus: 'matched',
      },
      { id: 'down-3', name: '工业自动化', category: '下游', matchCount: 9, matchStatus: 'partial' },
      { id: 'down-4', name: '轨道交通', category: '下游', matchCount: 5, matchStatus: 'partial' },
    ],
  },
])

const enterprises = ref<EnterpriseItem[]>([
  {
    id: 'e1',
    name: '华创科技有限公司',
    chainNode: '整机装配',
    industry: '高端装备制造',
    matchType: '核心',
    matchScore: 95,
    region: '凯州新城',
    revenue: 128.5,
    relatedNodes: ['整机装配', '系统集成', '智能控制'],
  },
  {
    id: 'e2',
    name: '中科新材料集团',
    chainNode: '基础材料研发',
    industry: '前沿材料',
    matchType: '核心',
    matchScore: 88,
    region: '凯州新城',
    revenue: 86.3,
    relatedNodes: ['基础材料研发', '特种钢材'],
  },
  {
    id: 'e3',
    name: '远大智能装备',
    chainNode: '精密加工',
    industry: '高端装备制造',
    matchType: '核心',
    matchScore: 92,
    region: '成渝区域',
    revenue: 215.7,
    relatedNodes: ['精密加工', '整机装配'],
  },
  {
    id: 'e4',
    name: '恒信电子科技',
    chainNode: '智能控制',
    industry: '数字经济',
    matchType: '配套',
    matchScore: 78,
    region: '凯州新城',
    revenue: 45.2,
    relatedNodes: ['智能控制', '系统集成'],
  },
  {
    id: 'e5',
    name: '东方生物制药',
    chainNode: '检测认证',
    industry: '前沿材料',
    matchType: '配套',
    matchScore: 62,
    region: '京津冀区域',
    revenue: 156.8,
    relatedNodes: ['检测认证'],
  },
  {
    id: 'e6',
    name: '天成新能源',
    chainNode: '新能源汽车',
    industry: '高端装备制造',
    matchType: '核心',
    matchScore: 91,
    region: '珠三角区域',
    revenue: 342.1,
    relatedNodes: ['新能源汽车', '整机装配', '智能控制'],
  },
  {
    id: 'e7',
    name: '盛通精密仪器',
    chainNode: '核心零部件',
    industry: '高端装备制造',
    matchType: '配套',
    matchScore: 73,
    region: '凯州新城',
    revenue: 38.6,
    relatedNodes: ['核心零部件', '精密加工'],
  },
  {
    id: 'e8',
    name: '博远信息技术',
    chainNode: '系统集成',
    industry: '数字经济',
    matchType: '核心',
    matchScore: 86,
    region: '京津冀区域',
    revenue: 67.9,
    relatedNodes: ['系统集成', '智能控制'],
  },
  {
    id: 'e9',
    name: '瑞达材料科技',
    chainNode: '特种钢材',
    industry: '前沿材料',
    matchType: '配套',
    matchScore: 69,
    region: '凯州新城',
    revenue: 28.4,
    relatedNodes: ['特种钢材', '基础材料研发'],
  },
  {
    id: 'e10',
    name: '宏图智能制造',
    chainNode: '工业自动化',
    industry: '高端装备制造',
    matchType: '核心',
    matchScore: 84,
    region: '成渝区域',
    revenue: 189.3,
    relatedNodes: ['工业自动化', '整机装配', '精密加工'],
  },
  {
    id: 'e11',
    name: '安捷供应链',
    chainNode: '原材料供应',
    industry: '高端装备制造',
    matchType: '配套',
    matchScore: 71,
    region: '凯州新城',
    revenue: 22.1,
    relatedNodes: ['原材料供应'],
  },
  {
    id: 'e12',
    name: '金诺环保科技',
    chainNode: '检测认证',
    industry: '前沿材料',
    matchType: '配套',
    matchScore: 58,
    region: '中部区域',
    revenue: 15.6,
    relatedNodes: ['检测认证'],
  },
  {
    id: 'e13',
    name: '翔宇半导体',
    chainNode: '智能控制',
    industry: '数字经济',
    matchType: '核心',
    matchScore: 89,
    region: '珠三角区域',
    revenue: 276.4,
    relatedNodes: ['智能控制', '核心零部件'],
  },
  {
    id: 'e14',
    name: '鼎盛工业自动化',
    chainNode: '工业自动化',
    industry: '高端装备制造',
    matchType: '核心',
    matchScore: 82,
    region: '凯州新城',
    revenue: 95.7,
    relatedNodes: ['工业自动化', '系统集成'],
  },
  {
    id: 'e15',
    name: '国泰创新材料',
    chainNode: '基础材料研发',
    industry: '前沿材料',
    matchType: '核心',
    matchScore: 77,
    region: '成渝区域',
    revenue: 63.2,
    relatedNodes: ['基础材料研发', '原材料供应'],
  },
  {
    id: 'e16',
    name: '创维光电技术',
    chainNode: '核心零部件',
    industry: '数字经济',
    matchType: '配套',
    matchScore: 65,
    region: '凯州新城',
    revenue: 41.8,
    relatedNodes: ['核心零部件', '智能控制'],
  },
])

const filteredEnterprises = computed(() => {
  let list = enterprises.value
  if (activeNodeId.value) {
    list = list.filter((e) => e.relatedNodes.some((n) => n === getActiveNodeName()))
  }
  if (matchType.value) {
    if (matchType.value === 'matched') {
      list = list.filter((e) => e.matchScore >= 80)
    } else if (matchType.value === 'partial') {
      list = list.filter((e) => e.matchScore >= 60 && e.matchScore < 80)
    } else {
      list = list.filter((e) => e.matchScore < 60)
    }
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(
      (e) => e.name.toLowerCase().includes(kw) || e.chainNode.toLowerCase().includes(kw),
    )
  }
  return list
})

const totalEnterprises = computed(() => enterprises.value.length)
const matchedCount = computed(() => enterprises.value.filter((e) => e.matchScore >= 80).length)
const unmatchedNodes = computed(() => {
  const allNodes = chainSections.value.flatMap((s) => s.nodes)
  return allNodes.filter((n) => n.matchStatus === 'unmatched').length
})
const matchRate = computed(() => {
  if (!enterprises.value.length) return 0
  return Math.round((matchedCount.value / totalEnterprises.value) * 100)
})

function getActiveNodeName(): string {
  for (const section of chainSections.value) {
    const found = section.nodes.find((n) => n.id === activeNodeId.value)
    if (found) return found.name
  }
  return ''
}

function handleNodeSelect(node: ChainNode) {
  activeNodeId.value = activeNodeId.value === node.id ? '' : node.id
}

function handleEnterpriseClick(enterprise: EnterpriseItem) {
  selectedEnterprise.value = enterprise
  drawerVisible.value = true
}

function handleExport() {
  exportToExcel('产业链关联企业')
}

watch(selectedChain, () => {
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
.chain-enterprise-page__content {
  display: flex;
  gap: 20px;
  height: calc(100vh - #{$header-height} - 120px);
}

.chain-sidebar {
  flex-shrink: 0;
  width: 260px;
  overflow-y: auto;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chain-sidebar__title {
  padding: 16px;
  font-size: 15px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  border-bottom: 1px solid $border-color-lighter;
}

.chain-section {
  padding: 12px 16px;
}

.chain-section__header {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
}

.chain-section__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: $radius-round;
}

.chain-section__label {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.chain-section__count {
  margin-left: auto;
  font-size: 12px;
  color: $text-secondary;
}

.chain-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }

  &--active {
    background: rgba(24, 137, 232, 0.08);
  }
}

.chain-node__name {
  font-size: 13px;
  color: $text-regular;
}

.enterprise-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

.enterprise-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.enterprise-table {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.enterprise-name {
  color: $color-primary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.match-score {
  display: flex;
  gap: 8px;
  align-items: center;
}

.match-score__value {
  flex-shrink: 0;
  font-size: 12px;
  color: $text-regular;
}

.enterprise-table__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.drawer-section {
  margin-top: 20px;
}

.drawer-section__title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.drawer-section__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
