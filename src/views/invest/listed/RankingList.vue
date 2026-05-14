<template>
  <div class="page-container">
    <PageHeader title="榜单列表" subtitle="行业榜单招商资源">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="content-card">
      <el-table :data="rankings" stripe border style="width: 100%">
        <el-table-column prop="name" label="榜单名称" min-width="200" />
        <el-table-column prop="year" label="年份" width="100" />
        <el-table-column prop="count" label="企业数量" width="120" />
        <el-table-column prop="topCompany" label="榜首企业" width="140" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)"
              >查看详情</el-button
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
import { getMockRankings } from '@/api/mock/invest'

const router = useRouter()
const rankings = ref<any[]>([])

function handleViewDetail(row: any) {
  router.push({ name: 'RankingDetail', params: { id: row.id } })
}

onMounted(() => {
  rankings.value = getMockRankings()
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
