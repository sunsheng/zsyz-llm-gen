<template>
  <div class="page-container">
    <PageHeader title="资质列表" subtitle="各类资质认定企业统计">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="content-card">
      <el-table :data="qualList" stripe border style="width: 100%">
        <el-table-column prop="name" label="资质类型" min-width="200" />
        <el-table-column prop="count" label="企业数量" width="120" />
        <el-table-column prop="newCount" label="新增数" width="100">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #67c23a">+{{ row.newCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expireCount" label="即将到期" width="100">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #f56c6c">{{ row.expireCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)"
              >查看企业</el-button
            >
            <el-button type="primary" link size="small">招商筛选</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import { getMockQualifiedEnterprises } from '@/api/mock/invest'

const router = useRouter()
const kpiCards = ref<any[]>([])
const qualList = ref<any[]>([])

function handleViewDetail(row: any) {
  router.push({ name: 'QualifiedDetail', params: { id: row.id } })
}

onMounted(() => {
  qualList.value = getMockQualifiedEnterprises()
  const total = qualList.value.reduce((s, q) => s + q.count, 0)
  const newTotal = qualList.value.reduce((s, q) => s + q.newCount, 0)
  const expireTotal = qualList.value.reduce((s, q) => s + q.expireCount, 0)
  kpiCards.value = [
    {
      key: 'totalTypes',
      label: '资质类型',
      value: qualList.value.length,
      unit: '种',
      trend: 'flat',
      trendValue: '—',
      icon: 'Document',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'totalCount',
      label: '企业总数',
      value: total,
      unit: '家',
      trend: 'up',
      trendValue: '+10.5%',
      icon: 'UserFilled',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'newCount',
      label: '新增企业',
      value: newTotal,
      unit: '家',
      trend: 'up',
      trendValue: '+15.3%',
      icon: 'Plus',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'expireCount',
      label: '即将到期',
      value: expireTotal,
      unit: '家',
      trend: 'down',
      trendValue: '-5.2%',
      icon: 'Warning',
      iconColor: '#F2637B',
      iconBgColor: '#FEF0F0',
    },
  ]
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
</style>
