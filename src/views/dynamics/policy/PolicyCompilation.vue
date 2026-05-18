<template>
  <div class="page-container">
    <PageHeader title="政策汇编" subtitle="产业相关政策法规汇总与分类整理">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">新增政策</el-button>
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

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="table-section">
      <el-table :data="filteredData" stripe border style="width: 100%">
        <el-table-column prop="title" label="政策名称" min-width="240" />
        <el-table-column prop="department" label="发布部门" width="160" />
        <el-table-column prop="level" label="政策层级" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === '国家级' ? 'danger' : 'info'" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="policyType" label="政策类型" width="160" />
        <el-table-column prop="publishDate" label="发布日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '现行' ? 'success' : 'info'" size="small">{{
              row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <a
              v-if="row.url"
              :href="row.url"
              target="_blank"
              rel="noopener noreferrer"
              class="policy-link"
              >查看</a
            >
            <el-link v-else type="primary" underline="never">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const kpiCards = [
  {
    key: 'total',
    label: '政策总数',
    value: 356,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+12',
    icon: 'Document',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'national',
    label: '国家级',
    value: 86,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+5',
    icon: 'Flag',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
  {
    key: 'municipal',
    label: '市区级',
    value: 270,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+7',
    icon: 'Location',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'effective',
    label: '现行有效',
    value: 298,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+3%',
    icon: 'CircleCheck',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
]

const filterFields = [
  {
    key: 'level',
    label: '政策层级',
    type: 'select' as const,
    options: [
      { label: '国家级', value: 'national' },
      { label: '市区级', value: 'municipal' },
    ],
  },
  {
    key: 'policyType',
    label: '政策类型',
    type: 'select' as const,
    options: [
      { label: '产业发展规划政策', value: 'industry-plan' },
      { label: '产业扶持政策', value: 'industry-support' },
      { label: '人才引进政策', value: 'talent' },
      { label: '住房保障政策', value: 'housing' },
    ],
  },
]

const allData = ref(
  Array.from({ length: 10 }, (_, i) => ({
    title: [
      '推动制造业数字化转型走深走实的若干意见',
      '电子信息制造业2025-2026年稳增长行动方案',
      '"人工智能+制造"专项行动方案',
      '新能源汽车产业发展规划（2025-2030年）',
      '关于促进生物医药产业创新发展的若干措施',
      '新材料产业发展专项行动方案',
      '高端装备制造业转型升级指导意见',
      '绿色低碳产业发展扶持政策',
      '数字经济发展实施方案',
      '集成电路产业促进条例',
    ][i],
    department: ['国务院', '工信部', '发改委', '科技部'][i % 4],
    level: ['国家级', '市区级'][i % 2],
    policyType: ['产业发展规划政策', '产业扶持政策', '人才引进政策', '住房保障政策'][i % 4],
    publishDate: `2025-0${3 + (i % 3)}-${String(10 + i).padStart(2, '0')}`,
    status: i % 5 === 0 ? '废止' : '现行',
    url: [
      'https://www.xinhuanet.com/tech/20251014/e179bcc3a2fb4419bb2e80ca0adac986/c.html',
      'https://finance.sina.com.cn/roll/2025-09-17/doc-infqtywq4817125.shtml',
      'https://www.nda.gov.cn/sjj/zwgk/zcfb/0112/20260107214358696030895_pc.html',
      'https://www.docin.com/p-4968679420.html',
      'https://baijiahao.baidu.com/s?id=1852285960424334019',
      'https://www.ccia.xin/guonazixun/3317.html',
      'https://www.miit.gov.cn/xwfb/bldhd/art/2026/art_4ba01aa6d2f54ced8ba3490ea4fb52c4.html',
      'https://www.vzkoo.com/read/2025052238a3967c0ef3fa40e01a8fc7.html',
      'https://www.miit.gov.cn/jgsj/xxjsfzs/gzdt/art/2025/art_c195b1b6c1f343e392ee83bf960af9f6.html',
      'https://www.chinabgao.com/info/1276759.html',
    ][i],
  })),
)
const keyword = ref('')
const currentPage = ref(1)
const total = ref(10)

const filteredData = computed(() => {
  if (!keyword.value) return allData.value
  return allData.value.filter((d) => d.title.includes(keyword.value))
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
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.table-section {
  padding: 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.policy-link {
  font-size: 14px;
  color: $color-primary;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
