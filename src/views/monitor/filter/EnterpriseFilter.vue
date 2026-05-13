<template>
  <div class="page-container">
    <PageHeader title="企业筛选" subtitle="按企业属性筛选监测对象">
      <template #actions>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        searchPlaceholder="搜索企业名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="stat-cards">
      <StatCard
        v-for="card in kpiCards"
        :key="card.key"
        v-bind="card"
      />
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">筛选结果 ({{ filteredData.length }} 家企业)</h4>
      <el-table :data="pagedData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业" width="140" />
        <el-table-column prop="scale" label="规模" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'operating' ? 'success' : 'info'" size="small">
              {{ row.status === 'operating' ? '在营' : '其他' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="revenue" label="营收(万元)" width="140" sortable>
          <template #default="{ row }">
            {{ row.revenue.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="growthRate" label="增长率(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growthRate >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growthRate >= 0 ? '+' : '' }}{{ row.growthRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" width="100" />
        <el-table-column prop="riskScore" label="风险评分" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.riskScore > 70 ? '#F56C6C' : row.riskScore > 40 ? '#E6A23C' : '#67C23A' }">
              {{ row.riskScore }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="currentPage" :total="filteredData.length" @change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const kpiCards = [
  { key: 'total', label: '筛选企业', value: 256, unit: '家', trend: 'flat' as const, trendValue: '', icon: 'Monitor', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'healthy', label: '健康企业', value: 198, unit: '家', trend: 'up' as const, trendValue: '+3.2%', icon: 'CircleCheck', iconColor: '#67C23A', iconBgColor: '#EDFAF0' },
  { key: 'warning', label: '预警企业', value: 42, unit: '家', trend: 'down' as const, trendValue: '-1.5%', icon: 'Warning', iconColor: '#E6A23C', iconBgColor: '#FDF6EC' },
  { key: 'risk', label: '风险企业', value: 16, unit: '家', trend: 'down' as const, trendValue: '-2.1%', icon: 'CircleClose', iconColor: '#F56C6C', iconBgColor: '#FEF0F0' }
]

const filterFields = [
  { key: 'scale', label: '企业规模', type: 'select' as const, options: [
    { label: '大型', value: 'large' },
    { label: '中型', value: 'medium' },
    { label: '小型', value: 'small' },
    { label: '微型', value: 'micro' }
  ]},
  { key: 'status', label: '经营状态', type: 'select' as const, options: [
    { label: '在营', value: 'operating' },
    { label: '其他', value: 'other' }
  ]},
  { key: 'risk', label: '风险等级', type: 'select' as const, options: [
    { label: '低风险', value: 'low' },
    { label: '中风险', value: 'medium' },
    { label: '高风险', value: 'high' }
  ]}
]

const allData = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.name.includes(keyword.value))
  }
  return data
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

onMounted(() => {
  const names = ['华创新材料科技', '东方精密制造', '博远生物医药', '天域半导体', '绿能新能源', '中科智联信息', '鼎盛环保科技', '创想数字技术', '恒达装备制造', '瑞丰新材料', '恒宇光电科技', '昌盛药业集团', '芯源集成电路', '亿能动力电池', '安泰环保设备', '智汇信息技术', '云帆数据科技', '铭远精密仪器', '盛达新材料', '宏图半导体']
  const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源']
  const scales = ['大型', '中型', '小型', '微型']
  const cities = ['杭州市', '宁波市', '温州市', '嘉兴市']

  allData.value = names.map((name, i) => ({
    name,
    industry: industries[i % industries.length],
    scale: scales[i % scales.length],
    status: i % 5 === 0 ? 'other' : 'operating',
    revenue: Math.floor(Math.random() * 100000 + 5000),
    growthRate: Math.floor(Math.random() * 40 - 10),
    city: cities[i % cities.length],
    riskScore: Math.floor(Math.random() * 100)
  }))
})

function handleSearch(kw: string) { keyword.value = kw; currentPage.value = 1 }
function handleFilter(_filters: Record<string, unknown>) { currentPage.value = 1 }
function handleReset() { keyword.value = ''; currentPage.value = 1 }
function handlePageChange(page: number) { currentPage.value = page }
function handleExport() {}
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
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
</style>
