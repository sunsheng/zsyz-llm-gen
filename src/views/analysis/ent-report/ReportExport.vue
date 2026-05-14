<template>
  <div class="page-container">
    <PageHeader title="报告导出" subtitle="运行分析报告导出管理">
      <template #actions>
        <el-button type="primary" @click="handleCreate">新建报告</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="table-section">
      <div class="table-header">
        <h4 class="chart-panel__title">报告列表</h4>
        <div class="table-header__actions">
          <el-input v-model="searchText" placeholder="搜索报告" style="width: 240px" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
      <el-table :data="filteredReports" stripe border style="width: 100%">
        <el-table-column prop="name" label="报告名称" min-width="200" />
        <el-table-column prop="type" label="报告类型" width="120">
          <template #default="{ row }">
            <el-tag
              :type="
                (row.type === '月报'
                  ? ''
                  : row.type === '季报'
                    ? 'success'
                    : row.type === '年报'
                      ? 'warning'
                      : 'info') as any
              "
              size="small"
            >
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="报告周期" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '已完成' ? 'success' : row.status === '生成中' ? 'warning' : 'info'
              "
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleExport(row)">导出</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="reports.length"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'

const kpiCards = ref([
  {
    key: 'total',
    label: '报告总数',
    value: 48,
    unit: '份',
    trend: 'up' as const,
    trendValue: '+12.5%',
    icon: 'Document',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'monthly',
    label: '月报数量',
    value: 24,
    unit: '份',
    trend: 'up' as const,
    trendValue: '+8.3%',
    icon: 'Calendar',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'quarterly',
    label: '季报数量',
    value: 12,
    unit: '份',
    trend: 'up' as const,
    trendValue: '+16.7%',
    icon: 'Date',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'annual',
    label: '年报数量',
    value: 12,
    unit: '份',
    trend: 'flat' as const,
    trendValue: '0%',
    icon: 'Timer',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
])

const searchText = ref('')
const currentPage = ref(1)

const reports = ref([
  {
    id: '1',
    name: '2026年4月产业运行月报',
    type: '月报',
    period: '2026年4月',
    status: '已完成',
    createTime: '2026-05-01 10:00',
  },
  {
    id: '2',
    name: '2026年3月产业运行月报',
    type: '月报',
    period: '2026年3月',
    status: '已完成',
    createTime: '2026-04-01 10:00',
  },
  {
    id: '3',
    name: '2026年Q1产业运行季报',
    type: '季报',
    period: '2026年Q1',
    status: '已完成',
    createTime: '2026-04-05 14:00',
  },
  {
    id: '4',
    name: '2026年2月产业运行月报',
    type: '月报',
    period: '2026年2月',
    status: '已完成',
    createTime: '2026-03-01 10:00',
  },
  {
    id: '5',
    name: '2026年1月产业运行月报',
    type: '月报',
    period: '2026年1月',
    status: '已完成',
    createTime: '2026-02-01 10:00',
  },
  {
    id: '6',
    name: '2025年年度产业运行报告',
    type: '年报',
    period: '2025年度',
    status: '已完成',
    createTime: '2026-01-15 09:00',
  },
  {
    id: '7',
    name: '2025年Q4产业运行季报',
    type: '季报',
    period: '2025年Q4',
    status: '已完成',
    createTime: '2026-01-05 14:00',
  },
  {
    id: '8',
    name: '2025年Q3产业运行季报',
    type: '季报',
    period: '2025年Q3',
    status: '已完成',
    createTime: '2025-10-05 14:00',
  },
  {
    id: '9',
    name: '2025年Q2产业运行季报',
    type: '季报',
    period: '2025年Q2',
    status: '已完成',
    createTime: '2025-07-05 14:00',
  },
  {
    id: '10',
    name: '2025年Q1产业运行季报',
    type: '季报',
    period: '2025年Q1',
    status: '已完成',
    createTime: '2025-04-05 14:00',
  },
  {
    id: '11',
    name: '2025年年度区域对比报告',
    type: '年报',
    period: '2025年度',
    status: '已完成',
    createTime: '2026-01-20 09:00',
  },
  {
    id: '12',
    name: '2026年5月产业运行月报',
    type: '月报',
    period: '2026年5月',
    status: '生成中',
    createTime: '2026-05-13 08:00',
  },
])

const filteredReports = computed(() => {
  if (!searchText.value) return reports.value
  return reports.value.filter(
    (r) => r.name.includes(searchText.value) || r.type.includes(searchText.value),
  )
})

function handleCreate() {
  ElMessage.success('新建报告功能开发中')
}

function handleView(row: any) {
  ElMessage.info(`查看报告: ${row.name}`)
}

function handleExport(row: any) {
  ElMessage.success(`导出报告: ${row.name}`)
}

function handleDelete(row: any) {
  ElMessage.warning(`删除报告: ${row.name}`)
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
.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.table-header__actions {
  display: flex;
  gap: 12px;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
