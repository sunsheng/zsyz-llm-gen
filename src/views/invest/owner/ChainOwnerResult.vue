<template>
  <div class="page-container">
    <PageHeader title="链主适配结果" subtitle="链主适配招商结果汇总">
      <template #actions>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="content-card">
      <el-table :data="results" stripe border style="width: 100%">
        <el-table-column prop="chainName" label="产业链" min-width="160" />
        <el-table-column prop="ownerName" label="链主企业" width="120" />
        <el-table-column prop="matchScore" label="匹配度" width="90">
          <template #default="{ row }">
            <span :style="{ color: row.matchScore >= 80 ? '#67C23A' : '#E6A23C', fontWeight: 600 }"
              >{{ row.matchScore }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="driveIndex" label="带动指数" width="100" />
        <el-table-column prop="influenceRange" label="影响力(%)" width="110">
          <template #default="{ row }">{{ row.influenceRange }}%</template>
        </el-table-column>
        <el-table-column prop="cooperationCount" label="合作企业" width="100" />
        <el-table-column prop="revenue" label="营收(万)" width="120">
          <template #default="{ row }">{{ row.revenue?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">跟进</el-button>
            <el-button type="danger" link size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="1" :total="10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockChainOwners } from '@/api/mock/invest'

const results = ref<any[]>([])

function handleExport() {}

onMounted(() => {
  results.value = getMockChainOwners()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
