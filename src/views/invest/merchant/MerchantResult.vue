<template>
  <div class="page-container">
    <PageHeader title="以商招商结果" subtitle="以商招商结果汇总">
      <template #actions>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="content-card">
      <el-table :data="results" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="chainPosition" label="链上位置" width="130" />
        <el-table-column prop="matchScore" label="匹配度" width="90">
          <template #default="{ row }">
            <span :style="{ color: row.matchScore >= 80 ? '#67C23A' : '#E6A23C', fontWeight: 600 }">{{ row.matchScore }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="investmentAmount" label="投资额(万)" width="120">
          <template #default="{ row }">{{ row.investmentAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status) as any" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">跟进</el-button>
            <el-button type="danger" link size="small">移除</el-button>
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
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockTargets } from '@/api/mock/invest'

const results = ref<any[]>([])

function statusTagType(status: string) {
  const map: Record<string, string> = { '待接触': 'info', '已接触': '', '洽谈中': 'warning', '已签约': 'success' }
  return map[status] || ''
}

function handleExport() {}

onMounted(() => {
  results.value = getMockTargets(10)
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.content-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
