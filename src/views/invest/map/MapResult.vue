<template>
  <div class="page-container">
    <PageHeader title="招商结果" subtitle="地图招商结果汇总">
      <template #actions>
        <el-button @click="handleExport">导出结果</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="content-card">
      <h4 class="panel-title">招商结果列表</h4>
      <el-table :data="results" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="industry" label="行业" width="120" />
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
                (row.status === '洽谈中'
                  ? 'warning'
                  : row.status === '已接触'
                    ? 'info'
                    : 'info') as any
              "
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="所在区域" width="120" />
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
import { getMockMapTargets } from '@/api/mock/invest'

const kpiCards = ref<any[]>([])
const results = ref<any[]>([])

function handleExport() {}

onMounted(() => {
  kpiCards.value = [
    {
      key: 'total',
      label: '招商目标',
      value: 48,
      unit: '家',
      trend: 'up',
      trendValue: '+15.2%',
      icon: 'Aim',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'contacted',
      label: '已接触',
      value: 23,
      unit: '家',
      trend: 'up',
      trendValue: '+8.6%',
      icon: 'Phone',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'negotiating',
      label: '洽谈中',
      value: 12,
      unit: '家',
      trend: 'up',
      trendValue: '+20.0%',
      icon: 'ChatDotRound',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'signed',
      label: '已签约',
      value: 5,
      unit: '个',
      trend: 'up',
      trendValue: '+25.0%',
      icon: 'DocumentChecked',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
  ]
  results.value = getMockMapTargets()
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
