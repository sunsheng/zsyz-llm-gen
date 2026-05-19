<template>
  <div class="page-container">
    <PageHeader title="数据采集与整合" subtitle="企业运行数据采集与整合管理" />

    <div class="source-cards">
      <div v-for="source in dataSources" :key="source.name" class="source-card">
        <div class="source-card__header">
          <el-icon :size="24" :color="source.color"
            ><component :is="iconMap[source.icon]"
          /></el-icon>
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
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Document, DataLine, Monitor, Connection } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { fetchEntReportDataCollection } from '@/api/modules/analysisApi'
import type { DataSourceInfo, IntegrationTask } from '@/api/types/analysis'

const iconMap: Record<string, any> = { Document, DataLine, Monitor, Connection }

const dataSources = ref<DataSourceInfo[]>([])
const integrationTasks = ref<IntegrationTask[]>([])

async function loadData() {
  const data = await fetchEntReportDataCollection()
  dataSources.value = data.dataSources
  integrationTasks.value = data.integrationTasks
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.source-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  grid-template-columns: repeat(2, 1fr);
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
