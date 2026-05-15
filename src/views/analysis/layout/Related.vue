<template>
  <div class="page-container">
    <PageHeader title="关联企业" subtitle="产业链关联企业匹配">
      <template #actions>
        <el-input v-model="searchKey" placeholder="搜索企业名称" style="width: 240px" clearable>
          <template #prefix
            ><el-icon><Search /></el-icon
          ></template>
        </el-input>
        <el-select v-model="filterSegment" placeholder="产业链环节" clearable style="width: 160px">
          <el-option v-for="s in segments" :key="s" :label="s" :value="s" />
        </el-select>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="table-section">
      <el-table :data="filteredData" stripe border style="width: 100%" @row-click="handleRowClick">
        <el-table-column prop="name" label="企业名称" min-width="200" />
        <el-table-column prop="segment" label="产业链环节" width="160" />
        <el-table-column prop="industry" label="所属行业" width="160" />
        <el-table-column prop="region" label="所在区域" width="120" />
        <el-table-column prop="capital" label="注册资本(万)" width="140" />
        <el-table-column prop="matchScore" label="匹配度" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.matchScore"
              :color="row.matchScore >= 80 ? '#67C23A' : '#1889E8'"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="handleDetail(row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer v-model="drawerVisible" title="企业详情" size="480px">
      <template v-if="currentEnterprise">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="企业名称">{{ currentEnterprise.name }}</el-descriptions-item>
          <el-descriptions-item label="产业链环节">{{
            currentEnterprise.segment
          }}</el-descriptions-item>
          <el-descriptions-item label="所属行业">{{
            currentEnterprise.industry
          }}</el-descriptions-item>
          <el-descriptions-item label="所在区域">{{
            currentEnterprise.region
          }}</el-descriptions-item>
          <el-descriptions-item label="注册资本"
            >{{ currentEnterprise.capital }}万元</el-descriptions-item
          >
          <el-descriptions-item label="匹配度"
            >{{ currentEnterprise.matchScore }}%</el-descriptions-item
          >
          <el-descriptions-item label="联系人">{{
            currentEnterprise.contact
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            currentEnterprise.phone
          }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'

const segments = ['上游原材料', '中游制造', '下游应用', '研发设计', '物流配送', '技术服务']

const searchKey = ref('')
const filterSegment = ref('')
const drawerVisible = ref(false)
const currentEnterprise = ref<any>(null)

const tableData = ref([
  {
    name: '华芯微电子科技有限公司',
    segment: '中游制造',
    industry: '集成电路',
    region: '浦东新区',
    capital: 5000,
    matchScore: 92,
    contact: '张明',
    phone: '138-0000-1001',
  },
  {
    name: '博创智能装备有限公司',
    segment: '中游制造',
    industry: '智能装备',
    region: '松江区',
    capital: 8000,
    matchScore: 88,
    contact: '李华',
    phone: '138-0000-1002',
  },
  {
    name: '前沿材料科技有限公司',
    segment: '上游原材料',
    industry: '高端装备制造',
    region: '闵行区',
    capital: 3000,
    matchScore: 85,
    contact: '王强',
    phone: '138-0000-1003',
  },
  {
    name: '云智信息技术有限公司',
    segment: '技术服务',
    industry: '软件服务',
    region: '徐汇区',
    capital: 2000,
    matchScore: 82,
    contact: '赵敏',
    phone: '138-0000-1004',
  },
  {
    name: '数字智联科技有限公司',
    segment: '下游应用',
    industry: '数字经济',
    region: '嘉定区',
    capital: 12000,
    matchScore: 78,
    contact: '陈波',
    phone: '138-0000-1005',
  },
  {
    name: '精密模具制造有限公司',
    segment: '研发设计',
    industry: '精密制造',
    region: '宝山区',
    capital: 4500,
    matchScore: 75,
    contact: '刘洋',
    phone: '138-0000-1006',
  },
  {
    name: '时尚创意科技有限公司',
    segment: '研发设计',
    industry: '时尚产业',
    region: '张江',
    capital: 6000,
    matchScore: 72,
    contact: '周芳',
    phone: '138-0000-1007',
  },
  {
    name: '智慧物流有限公司',
    segment: '物流配送',
    industry: '现代物流',
    region: '青浦区',
    capital: 3500,
    matchScore: 68,
    contact: '吴刚',
    phone: '138-0000-1008',
  },
])

const filteredData = computed(() => {
  return tableData.value.filter((row) => {
    const matchName = !searchKey.value || row.name.includes(searchKey.value)
    const matchSegment = !filterSegment.value || row.segment === filterSegment.value
    return matchName && matchSegment
  })
})

function handleRowClick(row: any) {
  handleDetail(row)
}

function handleDetail(row: any) {
  currentEnterprise.value = row
  drawerVisible.value = true
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.table-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
