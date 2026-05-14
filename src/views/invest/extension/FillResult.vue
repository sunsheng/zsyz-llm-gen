<template>
  <div class="page-container">
    <PageHeader title="补链结果" subtitle="补链招商结果汇总">
      <template #actions>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="content-card">
      <h4 class="panel-title">补链结果</h4>
      <el-table :data="results" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="chainPosition" label="补链位置" width="130" />
        <el-table-column prop="matchScore" label="匹配度" width="90">
          <template #default="{ row }">
            <span :style="{ color: row.matchScore >= 80 ? '#67C23A' : '#E6A23C', fontWeight: 600 }"
              >{{ row.matchScore }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="investmentAmount" label="投资额(万)" width="120">
          <template #default="{ row }">{{ row.investmentAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '已签约' ? 'success' : row.status === '洽谈中' ? 'warning' : 'info'
              "
              size="small"
              >{{ row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 4px">{{
              tag
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">跟进</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="1" :total="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockTargets } from '@/api/mock/invest'

const kpiCards = ref<any[]>([])
const results = ref<any[]>([])

function handleExport() {}

onMounted(() => {
  kpiCards.value = [
    {
      key: 'gapCount',
      label: '缺口总数',
      value: 15,
      unit: '个',
      trend: 'down',
      trendValue: '-8.3%',
      icon: 'Warning',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
    {
      key: 'filledCount',
      label: '已补链',
      value: 9,
      unit: '个',
      trend: 'up',
      trendValue: '+28.6%',
      icon: 'CircleCheck',
      iconColor: '#67C23A',
      iconBgColor: '#F0F9EB',
    },
    {
      key: 'fillRate',
      label: '补链率',
      value: 60,
      unit: '%',
      trend: 'up',
      trendValue: '+12.0%',
      icon: 'TrendCharts',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'signedAmount',
      label: '签约金额',
      value: 12.8,
      unit: '亿',
      trend: 'up',
      trendValue: '+35.2%',
      icon: 'Money',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
  ]
  results.value = getMockTargets(10)
})
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
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.panel-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
