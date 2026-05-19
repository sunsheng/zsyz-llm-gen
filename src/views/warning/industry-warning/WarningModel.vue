<template>
  <div class="page-container">
    <PageHeader title="预警分析模型" subtitle="产业发展预警模型配置与运行管理">
      <template #actions>
        <el-button type="primary" @click="handleAddModel">新建模型</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">模型预警趋势</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">模型准确率对比</h4>
        <BaseChart :option="accuracyOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">预警模型列表</h4>
      <el-table :data="summary?.models ?? []" stripe border style="width: 100%">
        <el-table-column prop="name" label="模型名称" min-width="180" />
        <el-table-column prop="typeName" label="模型类型" width="140">
          <template #default="{ row }">
            <el-tag size="small">{{ row.typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="准确率" width="100">
          <template #default="{ row }"> {{ row.accuracy }}% </template>
        </el-table-column>
        <el-table-column label="召回率" width="100">
          <template #default="{ row }"> {{ row.recall }}% </template>
        </el-table-column>
        <el-table-column prop="lastRun" label="最近运行" width="160" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.running ? 'success' : 'info'" size="small">
              {{ row.running ? '运行中' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" underline="never" @click="handleRunModel(row)">运行</el-link>
            <el-link
              type="primary"
              underline="never"
              style="margin-left: 8px"
              @click="handleEditModel(row)"
              >编辑</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新建/编辑模型弹窗 -->
    <el-dialog v-model="modelDialogVisible" :title="isEdit ? '编辑模型' : '新建模型'" width="780px">
      <el-form :model="modelForm" label-width="80px">
        <el-form-item label="模型名称" required>
          <el-input v-model="modelForm.name" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="模型类型" required>
          <el-select v-model="modelForm.type" placeholder="请选择模型类型" style="width: 100%">
            <el-option label="趋势预测" value="趋势预测" />
            <el-option label="异常检测" value="异常检测" />
            <el-option label="关联分析" value="关联分析" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="modelForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入模型描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleModelSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchWarningModels } from '@/api/modules/warningApi'
import type { WarningModelSummary } from '@/api/types/warning'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const summary = ref<WarningModelSummary | null>(null)

const modelDialogVisible = ref(false)
const isEdit = ref(false)
const editingRow = ref<any>(null)
const modelForm = reactive({ name: '', type: '', description: '' })

function handleAddModel() {
  modelForm.name = ''
  modelForm.type = ''
  modelForm.description = ''
  isEdit.value = false
  editingRow.value = null
  modelDialogVisible.value = true
}

function handleEditModel(row: any) {
  modelForm.name = row.name
  modelForm.type = row.typeName
  modelForm.description = ''
  isEdit.value = true
  editingRow.value = row
  modelDialogVisible.value = true
}

function handleModelSubmit() {
  if (!modelForm.name) {
    ElMessage.warning('请输入模型名称')
    return
  }
  if (isEdit.value && editingRow.value) {
    editingRow.value.name = modelForm.name
    editingRow.value.typeName = modelForm.type
    ElMessage.success('模型编辑成功')
  } else {
    const models = summary.value?.models
    if (models) {
      models.unshift({
        id: Date.now().toString(),
        name: modelForm.name,
        type: 'time_series' as any,
        typeName: modelForm.type,
        accuracy: 0,
        recall: 0,
        lastRun: '-',
        running: false,
      })
    }
    ElMessage.success('模型创建成功')
  }
  modelDialogVisible.value = false
}

function handleRunModel(row: any) {
  ElMessageBox.confirm('确认运行该模型？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      row.running = true
      ElMessage.success('模型运行已启动')
    })
    .catch(() => {})
}

const kpiCards = computed(() => {
  if (!summary.value) return []
  const kpi = summary.value.kpiCards
  return [
    {
      key: 'models',
      label: '预警模型',
      value: kpi.totalModels,
      unit: '个',
      trend: 'up' as const,
      trendValue: '+2',
      icon: 'Cpu',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'running',
      label: '运行中',
      value: kpi.runningCount,
      unit: '个',
      trend: 'flat' as const,
      trendValue: '',
      icon: 'VideoPlay',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'avgAccuracy',
      label: '平均准确率',
      value: kpi.avgAccuracy,
      unit: '%',
      trend: 'up' as const,
      trendValue: '+2.5%',
      icon: 'CircleCheck',
      iconColor: '#FBD437',
      iconBgColor: '#FFF8E6',
    },
    {
      key: 'predictions',
      label: '本月预测',
      value: kpi.monthlyPredictions,
      unit: '次',
      trend: 'up' as const,
      trendValue: '+15%',
      icon: 'DataLine',
      iconColor: '#975FE5',
      iconBgColor: '#F3ECFF',
    },
  ]
})

const trendOption = ref({})
const accuracyOption = ref({})

function buildCharts() {
  if (!summary.value) return

  const { trendData, accuracyComparison } = summary.value

  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['预警次数', '确认次数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trendData.months },
    yAxis: { type: 'value' },
    series: [
      { name: '预警次数', type: 'line', smooth: true, data: trendData.alertCount },
      { name: '确认次数', type: 'line', smooth: true, data: trendData.confirmedCount },
    ],
  }

  accuracyOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: accuracyComparison.models,
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: 'value', name: '%', max: 100 },
    series: [
      {
        name: '准确率',
        type: 'bar',
        barMaxWidth: 32,
        data: accuracyComparison.accuracy,
      },
      {
        name: '召回率',
        type: 'bar',
        barMaxWidth: 32,
        data: accuracyComparison.recall,
      },
    ],
  }
}

async function loadData() {
  summary.value = await fetchWarningModels()
  buildCharts()
}

onMounted(() => {
  loadData()
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
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
