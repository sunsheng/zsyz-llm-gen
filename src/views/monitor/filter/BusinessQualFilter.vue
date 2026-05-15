<template>
  <div class="page-container">
    <PageHeader title="经营与资质筛选" subtitle="企业经营状况与资质筛选">
      <template #actions>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </template>
    </PageHeader>

    <div class="filter-panel">
      <el-form :model="filterForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="关键词">
              <el-input v-model="filterForm.keyword" placeholder="请输入关键词" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分类">
              <el-select v-model="filterForm.category" placeholder="请选择" clearable>
                <el-option label="分类一" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="filterForm.status" placeholder="请选择" clearable>
                <el-option label="活跃" value="active" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="content-card">
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="category" label="分类" width="140" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar
        :current="pagination.current"
        :total="pagination.total"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const filterForm = reactive({ keyword: '', category: '', status: '' })
const tableData = ref<any[]>([])
const pagination = reactive({ current: 1, total: 0 })

function handleFilter() {
  tableData.value = []
  pagination.total = 0
}

function handleReset() {
  filterForm.keyword = ''
  filterForm.category = ''
  filterForm.status = ''
  handleFilter()
}

function handlePageChange(page: number) {
  pagination.current = page
  handleFilter()
}

onMounted(() => {
  handleFilter()
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
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.filter-panel {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
