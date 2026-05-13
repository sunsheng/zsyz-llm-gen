<template>
  <div class="page-container">
    <PageHeader title="榜单详情" subtitle="榜单企业详细信息">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
        <el-button type="primary">导出</el-button>
      </template>
    </PageHeader>

    <div class="detail-card">
      <div class="detail-header">
        <div class="detail-header__info">
          <h3>{{ rankingInfo.name }}</h3>
          <p>{{ rankingInfo.year }}年度 | 入榜企业 {{ rankingInfo.count }}家</p>
        </div>
        <div class="detail-header__stats">
          <div class="stat-item">
            <span class="stat-item__value">{{ companyList.length }}</span>
            <span class="stat-item__label">企业数</span>
          </div>
          <div class="stat-item">
            <span class="stat-item__value">{{ topRegion }}</span>
            <span class="stat-item__label">主要区域</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-card">
      <el-table :data="companyList" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="{ row }">
            <span :style="{ fontWeight: row.rank <= 3 ? 'bold' : 'normal', color: row.rank <= 3 ? '#FBD437' : '#303133' }">
              {{ row.rank }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="revenue" label="营收(万)" width="130">
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="tags" label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 4px">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default>
            <el-button type="primary" link size="small">招商</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import { getMockRankings, getMockRankingDetails } from '@/api/mock/invest'

const route = useRoute()
const rankingInfo = ref<any>({ name: '', year: '', count: 0, topCompany: '' })
const companyList = ref<any[]>([])
const topRegion = ref('')

onMounted(() => {
  const rankings = getMockRankings()
  const id = (route.params.id as string) || 'rank-1'
  rankingInfo.value = rankings.find(r => r.id === id) || rankings[0]
  companyList.value = getMockRankingDetails(id)
  topRegion.value = '北京市'
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.detail-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  margin-bottom: 20px;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-size: 20px;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0 0 4px 0;
  }
  p {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}
.detail-header__stats {
  display: flex;
  gap: 32px;
}
.stat-item {
  text-align: center;
}
.stat-item__value {
  display: block;
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: #1889E8;
}
.stat-item__label {
  font-size: 12px;
  color: $text-secondary;
}
.content-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
