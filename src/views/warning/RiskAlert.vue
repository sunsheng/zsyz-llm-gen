<template>
  <div class="page-container">
    <PageHeader title="风险预警" subtitle="实时风险预警推送与处置">
      <template #actions>
        <el-button @click="handleMarkAllRead">全部已读</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索企业名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="alert-list">
      <div
        v-for="alert in filteredAlerts"
        :key="alert.id"
        class="alert-item"
        :class="{ 'alert-item--unread': !alert.read }"
      >
        <div class="alert-item__header">
          <el-tag
            :type="
              alert.level === 'critical'
                ? 'danger'
                : alert.level === 'high'
                  ? 'danger'
                  : alert.level === 'medium'
                    ? 'warning'
                    : 'success'
            "
            size="small"
          >
            {{
              alert.level === 'critical'
                ? '极高风险'
                : alert.level === 'high'
                  ? '高风险'
                  : alert.level === 'medium'
                    ? '中风险'
                    : '低风险'
            }}
          </el-tag>
          <el-tag type="info" size="small">{{ alert.type }}</el-tag>
          <span class="alert-item__time">{{ alert.time }}</span>
          <span v-if="!alert.read" class="alert-item__unread-dot"></span>
        </div>
        <h4 class="alert-item__title">{{ alert.title }}</h4>
        <p class="alert-item__desc">{{ alert.desc }}</p>
        <div class="alert-item__footer">
          <span>涉及企业: {{ alert.enterprise }}</span>
          <div class="alert-item__actions">
            <el-button size="small" type="primary" link>查看详情</el-button>
            <el-button size="small" link>标记已读</el-button>
          </div>
        </div>
      </div>
    </div>

    <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const kpiCards = [
  {
    key: 'total',
    label: '今日预警',
    value: 18,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+3',
    icon: 'Bell',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'unread',
    label: '未读预警',
    value: 6,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+2',
    icon: 'Message',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'critical',
    label: '紧急预警',
    value: 3,
    unit: '条',
    trend: 'flat' as const,
    trendValue: '',
    icon: 'Warning',
    iconColor: '#F56C6C',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'handled',
    label: '已处置',
    value: 12,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+5',
    icon: 'CircleCheck',
    iconColor: '#67C23A',
    iconBgColor: '#EDFAF0',
  },
]

const filterFields = [
  {
    key: 'level',
    label: '风险等级',
    type: 'select' as const,
    options: [
      { label: '极高风险', value: 'critical' },
      { label: '高风险', value: 'high' },
      { label: '中风险', value: 'medium' },
      { label: '低风险', value: 'low' },
    ],
  },
  {
    key: 'type',
    label: '风险类型',
    type: 'select' as const,
    options: [
      { label: '企业风险', value: 'enterprise' },
      { label: '行业风险', value: 'industry' },
      { label: '政策风险', value: 'policy' },
      { label: '供应链风险', value: 'supply' },
    ],
  },
]

const allAlerts = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const total = ref(0)

const filteredAlerts = computed(() => {
  let data = allAlerts.value
  if (keyword.value) {
    data = data.filter(
      (d: any) => d.enterprise.includes(keyword.value) || d.title.includes(keyword.value),
    )
  }
  return data
})

onMounted(() => {
  const titles = [
    '华创新材料科技现金流持续恶化预警',
    '生物医药行业产能过剩风险升级',
    '环保排放标准修订影响新材料产业',
    '天域半导体核心供应商断供预警',
    '东方精密制造经营异常监测预警',
    '绿能新能源补贴退坡风险提醒',
    '博远生物医药研发项目失败风险',
    '电子信息产业技术迭代加速预警',
    '鼎盛环保科技信用评级下调预警',
    '创想数字技术数据安全合规预警',
    '高端装备原材料价格大幅上涨预警',
    '恒达装备制造用工荒风险提示',
  ]
  const levels: Array<'low' | 'medium' | 'high' | 'critical'> = [
    'critical',
    'high',
    'medium',
    'low',
  ]
  const types = ['企业风险', '行业风险', '政策风险', '供应链风险']
  const enterprises = [
    '华创新材料科技',
    '高端装备制造行业',
    '新材料产业',
    '天域半导体',
    '东方精密制造',
    '绿能新能源',
    '博远生物医药',
    '电子信息行业',
    '鼎盛环保科技',
    '创想数字技术',
    '原材料市场',
    '恒达装备制造',
  ]
  const descs = [
    '企业连续3个月经营现金流为负，短期偿债能力下降',
    '行业产能利用率降至65%，供过于求风险加剧',
    '新排放标准将于下月实施，超标企业面临停产风险',
    '核心供应商宣布减产，替代供应渠道有限',
    '企业工商信息异常，多项经营指标偏离正常范围',
    '新能源补贴退坡时间表确定，相关企业利润承压',
    '核心在研项目III期临床未达预期，研发投入面临减值',
    '关键技术路线变更，部分存量产线面临淘汰',
    '企业信用评级由AA下调至AA-，融资成本上升',
    '数据安全法实施细则出台，企业合规改造迫在眉睫',
    '稀土、锂等关键原材料价格月涨幅超15%',
    '制造业用工缺口扩大，产能利用率受限',
  ]

  allAlerts.value = titles.map((title, i) => ({
    id: `alert-${i + 1}`,
    title,
    level: levels[i % 4],
    type: types[i % 4],
    enterprise: enterprises[i],
    time: `2025-05-13 ${String(8 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    desc: descs[i],
    read: i > 5,
  }))
  total.value = allAlerts.value.length
})

function handleSearch(kw: string) {
  keyword.value = kw
  currentPage.value = 1
}
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() {
  keyword.value = ''
}
function handlePageChange(page: number) {
  currentPage.value = page
}
function handleMarkAllRead() {
  allAlerts.value.forEach((a) => {
    a.read = true
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.alert-item {
  padding: 16px 20px;
  background: $bg-card;
  border-left: 4px solid transparent;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  transition: border-left-color 0.2s;
}
.alert-item--unread {
  background: #fffbfb;
  border-left-color: #f56c6c;
}
.alert-item__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.alert-item__time {
  margin-left: auto;
  font-size: 12px;
  color: $text-secondary;
}
.alert-item__unread-dot {
  width: 8px;
  height: 8px;
  background: #f56c6c;
  border-radius: 50%;
}
.alert-item__title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.alert-item__desc {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.5;
  color: $text-secondary;
}
.alert-item__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: $text-regular;
}
.alert-item__actions {
  display: flex;
  gap: 8px;
}
</style>
