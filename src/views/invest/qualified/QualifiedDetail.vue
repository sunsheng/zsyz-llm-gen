<template>
  <div class="page-container">
    <PageHeader title="资质详情" subtitle="资质认定企业详情">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
        <el-button type="primary">导出</el-button>
      </template>
    </PageHeader>

    <div class="detail-card">
      <h3>{{ qualName }}</h3>
      <div class="detail-stats">
        <div class="detail-stat">
          <span class="detail-stat__value">{{ total }}</span>
          <span class="detail-stat__label">认定企业</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat__value" style="color: #67c23a">{{ newList.length }}</span>
          <span class="detail-stat__label">新增</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat__value" style="color: #f56c6c">{{ expiringCount }}</span>
          <span class="detail-stat__label">即将到期</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <el-table :data="newList" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="140" />
        <el-table-column prop="qualification" label="资质类型" width="160" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="validDate" label="有效期至" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '有效' ? 'success' : row.status === '即将到期' ? 'warning' : 'danger'
              "
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default>
            <el-button type="primary" link size="small">招商</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar :current="1" :total="total" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockQualifiedEnterprises, getMockQualifiedList } from '@/api/mock/invest'

const route = useRoute()
const qualName = ref('')
const total = ref(0)
const newList = ref<any[]>([])
const expiringCount = ref(0)

onMounted(() => {
  const quals = getMockQualifiedEnterprises()
  const id = route.params.id as string
  const qual = quals.find((q) => q.id === id) || quals[0]
  qualName.value = qual.name
  total.value = qual.count
  expiringCount.value = qual.expireCount
  newList.value = getMockQualifiedList(qual.name)
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.detail-card {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  h3 {
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: $font-weight-bold;
    color: $text-primary;
  }
}
.detail-stats {
  display: flex;
  gap: 48px;
}
.detail-stat {
  text-align: center;
}
.detail-stat__value {
  display: block;
  font-size: 28px;
  font-weight: $font-weight-bold;
  color: #1889e8;
}
.detail-stat__label {
  font-size: 13px;
  color: $text-secondary;
}
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
