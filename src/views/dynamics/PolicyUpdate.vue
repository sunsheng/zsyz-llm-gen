<template>
  <div class="page-container">
    <PageHeader title="政策更新" subtitle="产业相关政策动态追踪">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索政策名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="timeline-section">
      <el-timeline>
        <el-timeline-item
          v-for="item in filteredData"
          :key="item.id"
          :timestamp="item.date"
          placement="top"
          :type="
            item.impact === 'positive'
              ? 'success'
              : item.impact === 'negative'
                ? 'danger'
                : 'primary'
          "
        >
          <el-card shadow="hover">
            <div class="policy-card">
              <div class="policy-card__header">
                <el-tag
                  :type="
                    (item.impact === 'positive'
                      ? 'success'
                      : item.impact === 'negative'
                        ? 'danger'
                        : 'info') as any
                  "
                  size="small"
                >
                  {{
                    item.impact === 'positive'
                      ? '利好'
                      : item.impact === 'negative'
                        ? '利空'
                        : '中性'
                  }}
                </el-tag>
                <el-tag type="info" size="small">{{ item.level }}</el-tag>
                <el-tag effect="plain" size="small">{{ item.industry }}</el-tag>
              </div>
              <h4 class="policy-card__title">{{ item.title }}</h4>
              <p class="policy-card__desc">{{ item.summary }}</p>
              <div class="policy-card__meta">
                <span>发布机构: {{ item.publisher }}</span>
                <span>影响企业: {{ item.affectedCount }}家</span>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'

const filterFields = [
  {
    key: 'impact',
    label: '影响类型',
    type: 'select' as const,
    options: [
      { label: '利好', value: 'positive' },
      { label: '利空', value: 'negative' },
      { label: '中性', value: 'neutral' },
    ],
  },
  {
    key: 'level',
    label: '政策层级',
    type: 'select' as const,
    options: [
      { label: '国家级', value: 'national' },
      { label: '省级', value: 'provincial' },
      { label: '市级', value: 'municipal' },
    ],
  },
]

const allData = ref<any[]>([])
const keyword = ref('')

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.title.includes(keyword.value))
  }
  return data
})

onMounted(() => {
  const titles = [
    '关于加快推进高端装备制造业创新发展的实施意见',
    '新材料产业环保排放标准修订通知',
    '生物医药创新产品加速审批工作方案',
    '数字经济促进条例修订草案征求意见',
    '新能源补贴退坡时间表正式公布',
    '中小企业融资担保专项扶持政策',
    '产业园区税收优惠政策延期三年',
    '制造业数字化转型专项行动方案',
    '科技型中小企业研发费用加计扣除比例提高',
    '关于进一步优化外商投资环境的若干措施',
  ]
  const impacts: Array<'positive' | 'negative' | 'neutral'> = [
    'positive',
    'negative',
    'positive',
    'neutral',
    'negative',
    'positive',
    'positive',
    'positive',
    'positive',
    'positive',
  ]
  const levels = [
    '国家级',
    '省级',
    '省级',
    '国家级',
    '国家级',
    '省级',
    '市级',
    '国家级',
    '国家级',
    '省级',
  ]
  const industries = [
    '高端装备制造',
    '新材料',
    '生物医药',
    '电子信息',
    '新能源',
    '现代服务业',
    '现代服务业',
    '电子信息',
    '现代服务业',
    '现代服务业',
  ]
  const publishers = [
    '国务院',
    '省生态环境厅',
    '省药监局',
    '工信部',
    '国家能源局',
    '省财政厅',
    '市政府',
    '发改委',
    '财政部',
    '商务部',
  ]

  allData.value = titles.map((title, i) => ({
    id: `policy-${i + 1}`,
    title,
    date: `2025-05-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}`,
    impact: impacts[i],
    level: levels[i],
    industry: industries[i],
    publisher: publishers[i],
    affectedCount: Math.floor(Math.random() * 200 + 20),
    summary: '该政策旨在优化产业发展环境，促进产业高质量发展，对相关企业将产生深远影响。',
  }))
})

function handleSearch(kw: string) {
  keyword.value = kw
}
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() {
  keyword.value = ''
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.timeline-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.policy-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.policy-card__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.policy-card__desc {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: $text-secondary;
}
.policy-card__meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: $text-regular;
}
</style>
