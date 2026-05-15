<template>
  <div class="page-container">
    <PageHeader title="数据采集与整合" subtitle="运行分析数据采集与整合管理">
      <template #actions>
        <el-button type="primary" @click="handleRefresh">刷新状态</el-button>
      </template>
    </PageHeader>

    <div class="source-cards">
      <div v-for="source in dataSources" :key="source.name" class="source-card">
        <div class="source-card__header">
          <el-icon :size="28" :color="source.color"><component :is="source.icon" /></el-icon>
          <h4>{{ source.name }}</h4>
          <el-tag
            :type="
              source.status === '正常' ? 'success' : source.status === '延迟' ? 'warning' : 'danger'
            "
            size="small"
          >
            {{ source.status }}
          </el-tag>
        </div>
        <div class="source-card__stats">
          <div class="stat-item">
            <span class="stat-label">数据量</span>
            <span class="stat-value">{{ source.count }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">更新频率</span>
            <span class="stat-value">{{ source.frequency }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最后更新</span>
            <span class="stat-value">{{ source.lastUpdate }}</span>
          </div>
        </div>
        <el-progress :percentage="source.completion" :stroke-width="8" :color="source.color" />
        <div class="source-card__footer">
          <span>采集完成度 {{ source.completion }}%</span>
        </div>
      </div>
    </div>

    <div class="integration-section">
      <h4 class="section-title">数据整合进度</h4>
      <el-table :data="integrationTasks" stripe border style="width: 100%">
        <el-table-column prop="name" label="整合任务" min-width="200" />
        <el-table-column prop="source" label="数据来源" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '已完成' ? 'success' : row.status === '进行中' ? 'warning' : 'info'
              "
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="6" />
          </template>
        </el-table-column>
        <el-table-column prop="records" label="数据条数" width="120" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, DataLine, Monitor } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'

const dataSources = ref([
  {
    name: '企业填报',
    icon: Document,
    color: '#1889E8',
    status: '正常',
    count: '12,586条',
    frequency: '每日',
    lastUpdate: '2024-12-15 08:30',
    completion: 95,
  },
  {
    name: '政府部门',
    icon: DataLine,
    color: '#4ECB73',
    status: '正常',
    count: '8,432条',
    frequency: '每周',
    lastUpdate: '2024-12-14 18:00',
    completion: 88,
  },
  {
    name: '互联网公开',
    icon: Monitor,
    color: '#FBD437',
    status: '延迟',
    count: '25,120条',
    frequency: '实时',
    lastUpdate: '2024-12-15 06:15',
    completion: 72,
  },
])

const integrationTasks = ref([
  {
    name: '企业基础数据整合',
    source: '企业填报 + 政府部门',
    status: '已完成',
    progress: 100,
    records: 12586,
    updateTime: '2024-12-15 09:00',
  },
  {
    name: '财务数据对齐',
    source: '企业填报 + 互联网公开',
    status: '进行中',
    progress: 78,
    records: 8234,
    updateTime: '2024-12-15 08:45',
  },
  {
    name: '产业链关系映射',
    source: '政府部门 + 互联网公开',
    status: '进行中',
    progress: 62,
    records: 5620,
    updateTime: '2024-12-14 22:30',
  },
  {
    name: '区域经济数据整合',
    source: '全部来源',
    status: '进行中',
    progress: 45,
    records: 3280,
    updateTime: '2024-12-14 20:00',
  },
  {
    name: '创新能力指标计算',
    source: '企业填报 + 政府部门',
    status: '待开始',
    progress: 0,
    records: 0,
    updateTime: '-',
  },
])

function handleRefresh() {
  // Simulate refresh
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.source-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}
.source-card {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.source-card__header {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  margin-bottom: $spacing-base;
  h4 {
    flex: 1;
    margin: 0;
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}
.source-card__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}
.stat-item {
  text-align: center;
}
.stat-label {
  display: block;
  margin-bottom: 2px;
  font-size: $font-size-xs;
  color: $text-secondary;
}
.stat-value {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $text-primary;
}
.source-card__footer {
  margin-top: $spacing-sm;
  font-size: $font-size-xs;
  color: $text-secondary;
  text-align: center;
}
.integration-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.section-title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
