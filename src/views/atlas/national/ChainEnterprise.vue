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
            <el-table :data="pagedEnterprises" stripe border style="width: 100%">
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
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import IndustryChainSelect from '@/components/business/IndustryChainSelect.vue'

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

const pagedEnterprises = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEnterprises.value.slice(start, start + pageSize)
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

watch(selectedChain, (val) => {
  loading.value = true
  const code = Array.isArray(val) ? val[val.length - 1] : val
  // 根据选择的产业链生成不同的侧边栏和表格数据
  generateDataForChain(code)
  setTimeout(() => {
    loading.value = false
  }, 300)
})

function generateDataForChain(code: string) {
  const chainMap: Record<
    string,
    {
      sections: { label: string; color: string; nodes: ChainNode[] }[]
      enterprises: EnterpriseItem[]
    }
  > = {
    'high-end-equipment': {
      sections: [
        {
          label: '上游',
          color: '#36CBCB',
          nodes: [
            {
              id: 'up-1',
              name: '原材料供应',
              category: '上游',
              matchCount: 12,
              matchStatus: 'matched',
            },
            {
              id: 'up-2',
              name: '核心零部件',
              category: '上游',
              matchCount: 8,
              matchStatus: 'partial',
            },
            {
              id: 'up-3',
              name: '基础材料研发',
              category: '上游',
              matchCount: 3,
              matchStatus: 'unmatched',
            },
            {
              id: 'up-4',
              name: '特种钢材',
              category: '上游',
              matchCount: 6,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '中游',
          color: '#1889E8',
          nodes: [
            {
              id: 'mid-1',
              name: '整机装配',
              category: '中游',
              matchCount: 15,
              matchStatus: 'matched',
            },
            {
              id: 'mid-2',
              name: '系统集成',
              category: '中游',
              matchCount: 10,
              matchStatus: 'partial',
            },
            {
              id: 'mid-3',
              name: '精密加工',
              category: '中游',
              matchCount: 7,
              matchStatus: 'matched',
            },
            {
              id: 'mid-4',
              name: '智能控制',
              category: '中游',
              matchCount: 9,
              matchStatus: 'matched',
            },
            {
              id: 'mid-5',
              name: '检测认证',
              category: '中游',
              matchCount: 2,
              matchStatus: 'unmatched',
            },
          ],
        },
        {
          label: '下游',
          color: '#4ECB73',
          nodes: [
            {
              id: 'down-1',
              name: '航空航天',
              category: '下游',
              matchCount: 11,
              matchStatus: 'matched',
            },
            {
              id: 'down-2',
              name: '新能源汽车',
              category: '下游',
              matchCount: 14,
              matchStatus: 'matched',
            },
            {
              id: 'down-3',
              name: '工业自动化',
              category: '下游',
              matchCount: 9,
              matchStatus: 'partial',
            },
            {
              id: 'down-4',
              name: '轨道交通',
              category: '下游',
              matchCount: 5,
              matchStatus: 'partial',
            },
          ],
        },
      ],
      enterprises: [
        {
          id: 'e1',
          name: '东方电机集团',
          chainNode: '整机装配',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 95,
          region: '成渝区域',
          revenue: 328.5,
          relatedNodes: ['整机装配', '系统集成', '智能控制'],
        },
        {
          id: 'e2',
          name: '国机重装',
          chainNode: '精密加工',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 93,
          region: '成渝区域',
          revenue: 256.3,
          relatedNodes: ['精密加工', '整机装配'],
        },
        {
          id: 'e3',
          name: '远大智能装备',
          chainNode: '系统集成',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 91,
          region: '成渝区域',
          revenue: 215.7,
          relatedNodes: ['系统集成', '智能控制'],
        },
        {
          id: 'e4',
          name: '天成新能源',
          chainNode: '新能源汽车',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 89,
          region: '珠三角区域',
          revenue: 342.1,
          relatedNodes: ['新能源汽车', '智能控制'],
        },
        {
          id: 'e5',
          name: '华创科技有限公司',
          chainNode: '智能控制',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 88,
          region: '凯州新城',
          revenue: 128.5,
          relatedNodes: ['智能控制', '核心零部件'],
        },
        {
          id: 'e6',
          name: '中航工业成飞',
          chainNode: '航空航天',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 96,
          region: '成渝区域',
          revenue: 512.6,
          relatedNodes: ['航空航天', '精密加工', '核心零部件'],
        },
        {
          id: 'e7',
          name: '盛通精密仪器',
          chainNode: '核心零部件',
          industry: '高端装备制造',
          matchType: '配套',
          matchScore: 78,
          region: '凯州新城',
          revenue: 38.6,
          relatedNodes: ['核心零部件', '精密加工'],
        },
        {
          id: 'e8',
          name: '鼎盛工业自动化',
          chainNode: '工业自动化',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 84,
          region: '凯州新城',
          revenue: 95.7,
          relatedNodes: ['工业自动化', '系统集成'],
        },
        {
          id: 'e9',
          name: '宏图智能制造',
          chainNode: '原材料供应',
          industry: '高端装备制造',
          matchType: '配套',
          matchScore: 73,
          region: '成渝区域',
          revenue: 189.3,
          relatedNodes: ['原材料供应', '特种钢材'],
        },
        {
          id: 'e10',
          name: '安捷供应链',
          chainNode: '特种钢材',
          industry: '高端装备制造',
          matchType: '配套',
          matchScore: 71,
          region: '凯州新城',
          revenue: 22.1,
          relatedNodes: ['特种钢材', '原材料供应'],
        },
        {
          id: 'e11',
          name: '中铁宝桥',
          chainNode: '轨道交通',
          industry: '高端装备制造',
          matchType: '核心',
          matchScore: 87,
          region: '成渝区域',
          revenue: 176.4,
          relatedNodes: ['轨道交通', '精密加工'],
        },
        {
          id: 'e12',
          name: '长安新能源汽车',
          chainNode: '检测认证',
          industry: '高端装备制造',
          matchType: '配套',
          matchScore: 68,
          region: '成渝区域',
          revenue: 405.2,
          relatedNodes: ['检测认证', '新能源汽车'],
        },
      ],
    },
    'frontier-material': {
      sections: [
        {
          label: '上游',
          color: '#36CBCB',
          nodes: [
            {
              id: 'up-1',
              name: '矿产开采',
              category: '上游',
              matchCount: 8,
              matchStatus: 'matched',
            },
            {
              id: 'up-2',
              name: '基础化工',
              category: '上游',
              matchCount: 5,
              matchStatus: 'partial',
            },
            {
              id: 'up-3',
              name: '原料制备',
              category: '上游',
              matchCount: 10,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '中游',
          color: '#1889E8',
          nodes: [
            {
              id: 'mid-1',
              name: '材料加工',
              category: '中游',
              matchCount: 12,
              matchStatus: 'matched',
            },
            {
              id: 'mid-2',
              name: '合成制备',
              category: '中游',
              matchCount: 7,
              matchStatus: 'partial',
            },
            {
              id: 'mid-3',
              name: '性能改性',
              category: '中游',
              matchCount: 4,
              matchStatus: 'unmatched',
            },
            {
              id: 'mid-4',
              name: '复合材料',
              category: '中游',
              matchCount: 9,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '下游',
          color: '#4ECB73',
          nodes: [
            {
              id: 'down-1',
              name: '应用制造',
              category: '下游',
              matchCount: 11,
              matchStatus: 'matched',
            },
            {
              id: 'down-2',
              name: '产品检测',
              category: '下游',
              matchCount: 6,
              matchStatus: 'partial',
            },
            {
              id: 'down-3',
              name: '市场销售',
              category: '下游',
              matchCount: 8,
              matchStatus: 'matched',
            },
          ],
        },
      ],
      enterprises: [
        {
          id: 'e1',
          name: '中国巨石集团',
          chainNode: '原料制备',
          industry: '前沿材料',
          matchType: '核心',
          matchScore: 96,
          region: '长三角区域',
          revenue: 286.3,
          relatedNodes: ['原料制备', '矿产开采', '材料加工'],
        },
        {
          id: 'e2',
          name: '中科新材料集团',
          chainNode: '材料加工',
          industry: '前沿材料',
          matchType: '核心',
          matchScore: 92,
          region: '凯州新城',
          revenue: 86.3,
          relatedNodes: ['材料加工', '合成制备'],
        },
        {
          id: 'e3',
          name: '瑞达材料科技',
          chainNode: '合成制备',
          industry: '前沿材料',
          matchType: '核心',
          matchScore: 88,
          region: '凯州新城',
          revenue: 28.4,
          relatedNodes: ['合成制备', '性能改性'],
        },
        {
          id: 'e4',
          name: '国泰创新材料',
          chainNode: '复合材料',
          industry: '前沿材料',
          matchType: '核心',
          matchScore: 91,
          region: '成渝区域',
          revenue: 63.2,
          relatedNodes: ['复合材料', '材料加工'],
        },
        {
          id: 'e5',
          name: '东方生物制药',
          chainNode: '基础化工',
          industry: '前沿材料',
          matchType: '配套',
          matchScore: 78,
          region: '京津冀区域',
          revenue: 156.8,
          relatedNodes: ['基础化工', '原料制备'],
        },
        {
          id: 'e6',
          name: '金诺环保科技',
          chainNode: '产品检测',
          industry: '前沿材料',
          matchType: '配套',
          matchScore: 62,
          region: '中部区域',
          revenue: 15.6,
          relatedNodes: ['产品检测'],
        },
        {
          id: 'e7',
          name: '光威复材',
          chainNode: '复合材料',
          industry: '前沿材料',
          matchType: '核心',
          matchScore: 94,
          region: '长三角区域',
          revenue: 45.7,
          relatedNodes: ['复合材料', '应用制造'],
        },
        {
          id: 'e8',
          name: '恒逸石化',
          chainNode: '矿产开采',
          industry: '前沿材料',
          matchType: '配套',
          matchScore: 76,
          region: '珠三角区域',
          revenue: 312.5,
          relatedNodes: ['矿产开采', '基础化工'],
        },
        {
          id: 'e9',
          name: '硅宝科技',
          chainNode: '性能改性',
          industry: '前沿材料',
          matchType: '配套',
          matchScore: 69,
          region: '成渝区域',
          revenue: 18.9,
          relatedNodes: ['性能改性', '合成制备'],
        },
        {
          id: 'e10',
          name: '天齐锂业',
          chainNode: '原料制备',
          industry: '前沿材料',
          matchType: '核心',
          matchScore: 93,
          region: '成渝区域',
          revenue: 526.8,
          relatedNodes: ['原料制备', '应用制造'],
        },
        {
          id: 'e11',
          name: '北新建材',
          chainNode: '应用制造',
          industry: '前沿材料',
          matchType: '核心',
          matchScore: 85,
          region: '京津冀区域',
          revenue: 198.4,
          relatedNodes: ['应用制造', '市场销售'],
        },
        {
          id: 'e12',
          name: '龙星化工',
          chainNode: '市场销售',
          industry: '前沿材料',
          matchType: '配套',
          matchScore: 58,
          region: '中部区域',
          revenue: 42.1,
          relatedNodes: ['市场销售', '产品检测'],
        },
      ],
    },
    'digital-economy': {
      sections: [
        {
          label: '上游',
          color: '#36CBCB',
          nodes: [
            {
              id: 'up-1',
              name: '芯片设计',
              category: '上游',
              matchCount: 9,
              matchStatus: 'partial',
            },
            {
              id: 'up-2',
              name: '晶圆制造',
              category: '上游',
              matchCount: 4,
              matchStatus: 'unmatched',
            },
            {
              id: 'up-3',
              name: '封装测试',
              category: '上游',
              matchCount: 7,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '中游',
          color: '#1889E8',
          nodes: [
            {
              id: 'mid-1',
              name: '模组组装',
              category: '中游',
              matchCount: 11,
              matchStatus: 'matched',
            },
            {
              id: 'mid-2',
              name: '系统集成',
              category: '中游',
              matchCount: 8,
              matchStatus: 'matched',
            },
            {
              id: 'mid-3',
              name: '软件开发',
              category: '中游',
              matchCount: 13,
              matchStatus: 'matched',
            },
            {
              id: 'mid-4',
              name: '算法优化',
              category: '中游',
              matchCount: 3,
              matchStatus: 'unmatched',
            },
          ],
        },
        {
          label: '下游',
          color: '#4ECB73',
          nodes: [
            {
              id: 'down-1',
              name: '终端产品',
              category: '下游',
              matchCount: 10,
              matchStatus: 'matched',
            },
            {
              id: 'down-2',
              name: '运维服务',
              category: '下游',
              matchCount: 6,
              matchStatus: 'partial',
            },
            {
              id: 'down-3',
              name: '数据服务',
              category: '下游',
              matchCount: 8,
              matchStatus: 'matched',
            },
          ],
        },
      ],
      enterprises: [
        {
          id: 'e1',
          name: '翔宇半导体',
          chainNode: '芯片设计',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 95,
          region: '珠三角区域',
          revenue: 276.4,
          relatedNodes: ['芯片设计', '封装测试'],
        },
        {
          id: 'e2',
          name: '博远信息技术',
          chainNode: '系统集成',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 92,
          region: '京津冀区域',
          revenue: 67.9,
          relatedNodes: ['系统集成', '软件开发'],
        },
        {
          id: 'e3',
          name: '恒信电子科技',
          chainNode: '封装测试',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 89,
          region: '凯州新城',
          revenue: 45.2,
          relatedNodes: ['封装测试', '模组组装'],
        },
        {
          id: 'e4',
          name: '创维光电技术',
          chainNode: '模组组装',
          industry: '数字经济',
          matchType: '配套',
          matchScore: 78,
          region: '凯州新城',
          revenue: 41.8,
          relatedNodes: ['模组组装', '终端产品'],
        },
        {
          id: 'e5',
          name: '中科曙光',
          chainNode: '算法优化',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 94,
          region: '京津冀区域',
          revenue: 135.6,
          relatedNodes: ['算法优化', '软件开发'],
        },
        {
          id: 'e6',
          name: '紫光集团',
          chainNode: '晶圆制造',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 91,
          region: '长三角区域',
          revenue: 328.7,
          relatedNodes: ['晶圆制造', '芯片设计'],
        },
        {
          id: 'e7',
          name: '浪潮信息',
          chainNode: '软件开发',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 88,
          region: '京津冀区域',
          revenue: 256.3,
          relatedNodes: ['软件开发', '数据服务'],
        },
        {
          id: 'e8',
          name: '科大讯飞',
          chainNode: '算法优化',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 93,
          region: '长三角区域',
          revenue: 189.5,
          relatedNodes: ['算法优化', '系统集成'],
        },
        {
          id: 'e9',
          name: '易华录信息',
          chainNode: '数据服务',
          industry: '数字经济',
          matchType: '配套',
          matchScore: 72,
          region: '京津冀区域',
          revenue: 56.8,
          relatedNodes: ['数据服务', '运维服务'],
        },
        {
          id: 'e10',
          name: '中芯国际',
          chainNode: '晶圆制造',
          industry: '数字经济',
          matchType: '核心',
          matchScore: 97,
          region: '长三角区域',
          revenue: 456.2,
          relatedNodes: ['晶圆制造', '封装测试', '芯片设计'],
        },
        {
          id: 'e11',
          name: '深信服科技',
          chainNode: '运维服务',
          industry: '数字经济',
          matchType: '配套',
          matchScore: 76,
          region: '珠三角区域',
          revenue: 88.4,
          relatedNodes: ['运维服务', '终端产品'],
        },
        {
          id: 'e12',
          name: '金山办公',
          chainNode: '终端产品',
          industry: '数字经济',
          matchType: '配套',
          matchScore: 65,
          region: '京津冀区域',
          revenue: 42.1,
          relatedNodes: ['终端产品', '软件开发'],
        },
      ],
    },
    fashion: {
      sections: [
        {
          label: '上游',
          color: '#36CBCB',
          nodes: [
            {
              id: 'up-1',
              name: '纺织原料',
              category: '上游',
              matchCount: 10,
              matchStatus: 'matched',
            },
            {
              id: 'up-2',
              name: '皮革供应',
              category: '上游',
              matchCount: 6,
              matchStatus: 'partial',
            },
            {
              id: 'up-3',
              name: '面料研发',
              category: '上游',
              matchCount: 7,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '中游',
          color: '#1889E8',
          nodes: [
            {
              id: 'mid-1',
              name: '服装加工',
              category: '中游',
              matchCount: 14,
              matchStatus: 'matched',
            },
            {
              id: 'mid-2',
              name: '鞋帽制造',
              category: '中游',
              matchCount: 8,
              matchStatus: 'partial',
            },
            {
              id: 'mid-3',
              name: '配饰生产',
              category: '中游',
              matchCount: 5,
              matchStatus: 'unmatched',
            },
            {
              id: 'mid-4',
              name: '品牌设计',
              category: '中游',
              matchCount: 11,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '下游',
          color: '#4ECB73',
          nodes: [
            {
              id: 'down-1',
              name: '时尚零售',
              category: '下游',
              matchCount: 12,
              matchStatus: 'matched',
            },
            {
              id: 'down-2',
              name: '电商运营',
              category: '下游',
              matchCount: 9,
              matchStatus: 'matched',
            },
            {
              id: 'down-3',
              name: '潮流传媒',
              category: '下游',
              matchCount: 3,
              matchStatus: 'unmatched',
            },
          ],
        },
      ],
      enterprises: [
        {
          id: 'e1',
          name: '雅戈尔集团',
          chainNode: '服装加工',
          industry: '时尚产业',
          matchType: '核心',
          matchScore: 94,
          region: '长三角区域',
          revenue: 312.5,
          relatedNodes: ['服装加工', '面料研发', '品牌设计'],
        },
        {
          id: 'e2',
          name: '安踏体育',
          chainNode: '鞋帽制造',
          industry: '时尚产业',
          matchType: '核心',
          matchScore: 96,
          region: '珠三角区域',
          revenue: 526.8,
          relatedNodes: ['鞋帽制造', '品牌设计'],
        },
        {
          id: 'e3',
          name: '申洲国际',
          chainNode: '面料研发',
          industry: '时尚产业',
          matchType: '核心',
          matchScore: 91,
          region: '长三角区域',
          revenue: 248.3,
          relatedNodes: ['面料研发', '纺织原料'],
        },
        {
          id: 'e4',
          name: '华利集团',
          chainNode: '鞋帽制造',
          industry: '时尚产业',
          matchType: '核心',
          matchScore: 89,
          region: '珠三角区域',
          revenue: 186.5,
          relatedNodes: ['鞋帽制造', '皮革供应'],
        },
        {
          id: 'e5',
          name: '地素时尚',
          chainNode: '品牌设计',
          industry: '时尚产业',
          matchType: '核心',
          matchScore: 87,
          region: '长三角区域',
          revenue: 35.6,
          relatedNodes: ['品牌设计', '服装加工'],
        },
        {
          id: 'e6',
          name: '比音勒芬',
          chainNode: '时尚零售',
          industry: '时尚产业',
          matchType: '配套',
          matchScore: 78,
          region: '珠三角区域',
          revenue: 42.8,
          relatedNodes: ['时尚零售', '电商运营'],
        },
        {
          id: 'e7',
          name: '海澜之家',
          chainNode: '时尚零售',
          industry: '时尚产业',
          matchType: '核心',
          matchScore: 92,
          region: '长三角区域',
          revenue: 218.6,
          relatedNodes: ['时尚零售', '服装加工'],
        },
        {
          id: 'e8',
          name: '太平鸟服饰',
          chainNode: '电商运营',
          industry: '时尚产业',
          matchType: '配套',
          matchScore: 82,
          region: '长三角区域',
          revenue: 98.5,
          relatedNodes: ['电商运营', '品牌设计'],
        },
        {
          id: 'e9',
          name: '兴业皮革',
          chainNode: '皮革供应',
          industry: '时尚产业',
          matchType: '配套',
          matchScore: 65,
          region: '中部区域',
          revenue: 28.4,
          relatedNodes: ['皮革供应', '配饰生产'],
        },
        {
          id: 'e10',
          name: '歌力思集团',
          chainNode: '配饰生产',
          industry: '时尚产业',
          matchType: '配套',
          matchScore: 71,
          region: '珠三角区域',
          revenue: 56.3,
          relatedNodes: ['配饰生产', '品牌设计'],
        },
        {
          id: 'e11',
          name: '七匹狼实业',
          chainNode: '纺织原料',
          industry: '时尚产业',
          matchType: '配套',
          matchScore: 68,
          region: '珠三角区域',
          revenue: 38.9,
          relatedNodes: ['纺织原料', '面料研发'],
        },
        {
          id: 'e12',
          name: '芒果传媒',
          chainNode: '潮流传媒',
          industry: '时尚产业',
          matchType: '配套',
          matchScore: 55,
          region: '中部区域',
          revenue: 15.2,
          relatedNodes: ['潮流传媒', '电商运营'],
        },
      ],
    },
    'modern-service': {
      sections: [
        {
          label: '上游',
          color: '#36CBCB',
          nodes: [
            {
              id: 'up-1',
              name: '信息咨询',
              category: '上游',
              matchCount: 9,
              matchStatus: 'matched',
            },
            {
              id: 'up-2',
              name: '技术研发',
              category: '上游',
              matchCount: 6,
              matchStatus: 'partial',
            },
            {
              id: 'up-3',
              name: '人才培训',
              category: '上游',
              matchCount: 11,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '中游',
          color: '#1889E8',
          nodes: [
            {
              id: 'mid-1',
              name: '金融服务',
              category: '中游',
              matchCount: 14,
              matchStatus: 'matched',
            },
            {
              id: 'mid-2',
              name: '物流仓储',
              category: '中游',
              matchCount: 8,
              matchStatus: 'matched',
            },
            {
              id: 'mid-3',
              name: '商务咨询',
              category: '中游',
              matchCount: 5,
              matchStatus: 'partial',
            },
            {
              id: 'mid-4',
              name: '信息技术服务',
              category: '中游',
              matchCount: 10,
              matchStatus: 'matched',
            },
          ],
        },
        {
          label: '下游',
          color: '#4ECB73',
          nodes: [
            {
              id: 'down-1',
              name: '文旅康养',
              category: '下游',
              matchCount: 7,
              matchStatus: 'matched',
            },
            {
              id: 'down-2',
              name: '会展服务',
              category: '下游',
              matchCount: 4,
              matchStatus: 'unmatched',
            },
            {
              id: 'down-3',
              name: '物业管理',
              category: '下游',
              matchCount: 9,
              matchStatus: 'matched',
            },
          ],
        },
      ],
      enterprises: [
        {
          id: 'e1',
          name: '招商银行',
          chainNode: '金融服务',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 97,
          region: '珠三角区域',
          revenue: 2856.3,
          relatedNodes: ['金融服务', '信息技术服务'],
        },
        {
          id: 'e2',
          name: '顺丰控股',
          chainNode: '物流仓储',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 95,
          region: '珠三角区域',
          revenue: 1256.8,
          relatedNodes: ['物流仓储', '信息技术服务'],
        },
        {
          id: 'e3',
          name: '中金公司',
          chainNode: '金融服务',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 93,
          region: '京津冀区域',
          revenue: 685.4,
          relatedNodes: ['金融服务', '商务咨询'],
        },
        {
          id: 'e4',
          name: '用友网络',
          chainNode: '信息技术服务',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 91,
          region: '京津冀区域',
          revenue: 128.6,
          relatedNodes: ['信息技术服务', '技术研发'],
        },
        {
          id: 'e5',
          name: '普华永道咨询',
          chainNode: '商务咨询',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 89,
          region: '长三角区域',
          revenue: 356.2,
          relatedNodes: ['商务咨询', '信息咨询'],
        },
        {
          id: 'e6',
          name: '中智人力',
          chainNode: '人才培训',
          industry: '现代服务业',
          matchType: '配套',
          matchScore: 82,
          region: '京津冀区域',
          revenue: 45.8,
          relatedNodes: ['人才培训', '信息咨询'],
        },
        {
          id: 'e7',
          name: '锦江酒店',
          chainNode: '文旅康养',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 86,
          region: '长三角区域',
          revenue: 198.5,
          relatedNodes: ['文旅康养', '物业管理'],
        },
        {
          id: 'e8',
          name: '万达信息',
          chainNode: '技术研发',
          industry: '现代服务业',
          matchType: '配套',
          matchScore: 75,
          region: '长三角区域',
          revenue: 68.4,
          relatedNodes: ['技术研发', '信息技术服务'],
        },
        {
          id: 'e9',
          name: '国际博览集团',
          chainNode: '会展服务',
          industry: '现代服务业',
          matchType: '配套',
          matchScore: 62,
          region: '凯州新城',
          revenue: 32.6,
          relatedNodes: ['会展服务', '商务咨询'],
        },
        {
          id: 'e10',
          name: '万科物业',
          chainNode: '物业管理',
          industry: '现代服务业',
          matchType: '配套',
          matchScore: 78,
          region: '珠三角区域',
          revenue: 156.3,
          relatedNodes: ['物业管理', '文旅康养'],
        },
        {
          id: 'e11',
          name: '安永咨询',
          chainNode: '信息咨询',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 88,
          region: '长三角区域',
          revenue: 285.6,
          relatedNodes: ['信息咨询', '商务咨询', '金融服务'],
        },
        {
          id: 'e12',
          name: '菜鸟网络',
          chainNode: '物流仓储',
          industry: '现代服务业',
          matchType: '核心',
          matchScore: 92,
          region: '长三角区域',
          revenue: 428.5,
          relatedNodes: ['物流仓储', '信息技术服务', '技术研发'],
        },
      ],
    },
  }
  const defaultData = chainMap['high-end-equipment']
  const data = chainMap[code] || defaultData
  chainSections.value = data.sections
  enterprises.value = data.enterprises
  activeNodeId.value = ''
  currentPage.value = 1
}

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
