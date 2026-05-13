<template>
  <div class="page-container">
    <PageHeader title="自定义筛选" subtitle="自定义多维度组合筛选">
      <template #actions>
        <el-button @click="handleSave">保存方案</el-button>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <div class="custom-filter-card">
        <h4 class="chart-panel__title">筛选条件</h4>
        <el-form :model="filterForm" label-width="100px" inline>
          <el-form-item label="企业名称">
            <el-input v-model="filterForm.keyword" placeholder="请输入企业名称" clearable />
          </el-form-item>
          <el-form-item label="行业">
            <el-select v-model="filterForm.industry" placeholder="请选择行业" clearable>
              <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="区域">
            <el-select v-model="filterForm.region" placeholder="请选择区域" clearable>
              <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="企业规模">
            <el-select v-model="filterForm.scale" placeholder="请选择规模" clearable>
              <el-option label="大型" value="large" />
              <el-option label="中型" value="medium" />
              <el-option label="小型" value="small" />
            </el-select>
          </el-form-item>
          <el-form-item label="健康评分">
            <el-slider v-model="filterForm.healthRange" range :min="0" :max="100" style="width: 200px" />
          </el-form-item>
          <el-form-item label="营收范围">
            <el-input-number v-model="filterForm.revenueMin" :min="0" placeholder="最低" />
            <span style="margin: 0 8px">-</span>
            <el-input-number v-model="filterForm.revenueMax" :min="0" placeholder="最高" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业" width="140" />
        <el-table-column prop="scale" label="规模" width="80" />
        <el-table-column prop="revenue" label="营收(万元)" width="120" sortable>
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="healthScore" label="健康评分" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.healthScore >= 80 ? '#67C23A' : row.healthScore >= 60 ? '#E6A23C' : '#F56C6C' }">
              {{ row.healthScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="growth" label="增长率(%)" width="110">
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" width="100" />
      </el-table>
      <PaginationBar :current="currentPage" :total="filteredData.length" @change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const kpiCards = [
  { key: 'total', label: '筛选结果', value: 186, unit: '家', trend: 'flat' as const, trendValue: '', icon: 'Filter', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'healthy', label: '健康企业', value: 142, unit: '家', trend: 'up' as const, trendValue: '+5.6%', icon: 'CircleCheck', iconColor: '#67C23A', iconBgColor: '#EDFAF0' },
  { key: 'warning', label: '预警企业', value: 32, unit: '家', trend: 'down' as const, trendValue: '-3.2%', icon: 'Warning', iconColor: '#E6A23C', iconBgColor: '#FDF6EC' },
  { key: 'risk', label: '风险企业', value: 12, unit: '家', trend: 'down' as const, trendValue: '-1.8%', icon: 'CircleClose', iconColor: '#F56C6C', iconBgColor: '#FEF0F0' }
]

const industryOptions = [
  { label: '高端装备制造', value: '1' },
  { label: '新材料', value: '2' },
  { label: '生物医药', value: '3' },
  { label: '电子信息', value: '4' },
  { label: '新能源', value: '5' }
]
const regionOptions = [
  { label: '杭州市', value: '1' },
  { label: '宁波市', value: '2' },
  { label: '温州市', value: '3' },
  { label: '嘉兴市', value: '4' }
]

const filterForm = reactive({
  keyword: '',
  industry: '',
  region: '',
  scale: '',
  healthRange: [0, 100] as number[],
  revenueMin: undefined as number | undefined,
  revenueMax: undefined as number | undefined
})

const allData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 20

const filteredData = computed(() => {
  let data = allData.value
  if (filterForm.keyword) {
    data = data.filter((d: any) => d.name.includes(filterForm.keyword))
  }
  data = data.filter((d: any) => d.healthScore >= filterForm.healthRange[0] && d.healthScore <= filterForm.healthRange[1])
  return data
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

onMounted(() => {
  const names = ['华创新材料科技', '东方精密制造', '博远生物医药', '天域半导体', '绿能新能源', '中科智联信息', '鼎盛环保科技', '创想数字技术', '恒达装备制造', '瑞丰新材料', '恒宇光电科技', '昌盛药业集团', '芯源集成电路', '亿能动力电池', '安泰环保设备', '智汇信息技术', '云帆数据科技', '铭远精密仪器', '盛达新材料', '宏图半导体']
  const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源']
  const scales = ['大型', '中型', '小型']
  const cities = ['杭州市', '宁波市', '温州市', '嘉兴市']

  allData.value = names.map((name, i) => ({
    name,
    industry: industries[i % industries.length],
    scale: scales[i % scales.length],
    revenue: Math.floor(Math.random() * 100000 + 5000),
    healthScore: Math.floor(Math.random() * 30 + 70),
    growth: Math.floor(Math.random() * 40 - 10),
    city: cities[i % cities.length]
  }))
})

function handleFilter() { currentPage.value = 1 }
function handleReset() {
  filterForm.keyword = ''
  filterForm.industry = ''
  filterForm.region = ''
  filterForm.scale = ''
  filterForm.healthRange = [0, 100]
  filterForm.revenueMin = undefined
  filterForm.revenueMax = undefined
  currentPage.value = 1
}
function handlePageChange(page: number) { currentPage.value = page }
function handleSave() {}
function handleExport() {}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.custom-filter-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
