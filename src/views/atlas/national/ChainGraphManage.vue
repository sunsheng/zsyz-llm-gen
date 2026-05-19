<template>
  <div class="page-container graph-manage-page">
    <PageHeader title="产业链图谱管理" subtitle="图谱配置、创建、编辑与企业关联管理">
      <template #actions>
        <el-button type="primary" :icon="Plus" @click="handleCreate">新建图谱</el-button>
      </template>
    </PageHeader>

    <LoadingSpinner :loading="loading" type="skeleton" :rows="8">
      <!-- 统计卡片 -->
      <div class="graph-manage-stats">
        <StatCard
          icon="Share"
          label="图谱总数"
          :value="graphs.length"
          unit="个"
          icon-color="#1889E8"
          icon-bg-color="#ECF5FF"
        />
        <StatCard
          icon="CircleCheck"
          label="已发布"
          :value="publishedCount"
          unit="个"
          icon-color="#4ECB73"
          icon-bg-color="#F0F9EB"
        />
        <StatCard
          icon="EditPen"
          label="编辑中"
          :value="editingCount"
          unit="个"
          icon-color="#FBD437"
          icon-bg-color="#FDF6EC"
        />
        <StatCard
          icon="Connection"
          label="关联企业总数"
          :value="totalLinkedEnterprises"
          unit="家"
          icon-color="#975FE5"
          icon-bg-color="#F3F0FF"
        />
      </div>

      <!-- 搜索与筛选 -->
      <div class="graph-manage-filters">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索图谱名称"
          clearable
          style="width: 220px"
          :prefix-icon="Search"
        />
        <el-select v-model="statusFilter" placeholder="状态" clearable style="width: 140px">
          <el-option label="已发布" value="published" />
          <el-option label="编辑中" value="editing" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-select v-model="industryFilter" placeholder="产业" clearable style="width: 160px">
          <el-option label="高端装备制造" value="high-end-equipment" />
          <el-option label="前沿材料" value="frontier-material" />
          <el-option label="数字经济" value="digital-economy" />
          <el-option label="时尚产业" value="fashion" />
        </el-select>
      </div>

      <!-- 图谱列表 -->
      <div class="graph-manage-table">
        <el-table :data="filteredGraphs" stripe border style="width: 100%">
          <el-table-column prop="name" label="图谱名称" min-width="200">
            <template #default="{ row }">
              <span class="graph-name" @click="handleEdit(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="industry" label="所属产业" width="140" />
          <el-table-column prop="nodeCount" label="节点数" width="90" align="center" />
          <el-table-column prop="edgeCount" label="关系数" width="90" align="center" />
          <el-table-column prop="enterpriseCount" label="关联企业" width="100" align="center" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag
                :type="
                  row.status === 'published'
                    ? 'success'
                    : row.status === 'editing'
                      ? 'warning'
                      : 'info'
                "
                size="small"
              >
                {{ statusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updatedBy" label="更新人" width="100" />
          <el-table-column prop="updatedAt" label="更新时间" width="170" />
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button type="primary" link size="small" @click="handleConfig(row)"
                >配置</el-button
              >
              <el-button
                :type="row.status === 'published' ? 'warning' : 'success'"
                link
                size="small"
                @click="handleTogglePublish(row)"
              >
                {{ row.status === 'published' ? '下架' : '发布' }}
              </el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </LoadingSpinner>

    <!-- 新建/编辑图谱对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑图谱' : '新建图谱'"
      width="1020px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="图谱名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入图谱名称" />
        </el-form-item>
        <el-form-item label="所属产业" prop="industry">
          <el-select v-model="formData.industry" placeholder="请选择产业" style="width: 100%">
            <el-option label="高端装备制造" value="high-end-equipment" />
            <el-option label="前沿材料" value="frontier-material" />
            <el-option label="数字经济" value="digital-economy" />
            <el-option label="时尚产业" value="fashion" />
          </el-select>
        </el-form-item>
        <el-form-item label="图谱描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入图谱描述"
          />
        </el-form-item>
        <el-form-item label="图谱类型" prop="graphType">
          <el-radio-group v-model="formData.graphType">
            <el-radio value="chain">产业链图谱</el-radio>
            <el-radio value="enterprise">企业关系图谱</el-radio>
            <el-radio value="tech">技术图谱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据来源" prop="dataSource">
          <el-select v-model="formData.dataSource" placeholder="请选择数据来源" style="width: 100%">
            <el-option label="系统内置" value="built-in" />
            <el-option label="手动创建" value="manual" />
            <el-option label="外部导入" value="import" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 图谱配置抽屉 -->
    <el-drawer v-model="configDrawerVisible" title="图谱配置" size="520px" :destroy-on-close="true">
      <template v-if="configGraph">
        <el-form label-width="100px" label-position="top">
          <el-form-item label="图谱名称">
            <el-input v-model="configGraph.name" />
          </el-form-item>
          <el-form-item label="布局方式">
            <el-radio-group v-model="configGraph.layout">
              <el-radio value="force">力导向布局</el-radio>
              <el-radio value="hierarchical">层级布局</el-radio>
              <el-radio value="circular">环形布局</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="节点样式">
            <div class="config-row">
              <span class="config-label">节点大小</span>
              <el-slider v-model="configGraph.nodeSize" :min="10" :max="60" style="width: 200px" />
            </div>
            <div class="config-row">
              <span class="config-label">标签显示</span>
              <el-switch v-model="configGraph.showLabels" />
            </div>
          </el-form-item>
          <el-form-item label="关联企业">
            <div class="linked-enterprises">
              <div
                v-for="(ent, i) in configGraph.linkedEnterprises"
                :key="i"
                class="linked-enterprise"
              >
                <span>{{ ent }}</span>
                <el-button type="danger" link size="small" @click="removeEnterprise(i)">
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
              <el-button type="primary" link :icon="Plus" @click="addEnterprise"
                >添加企业</el-button
              >
            </div>
          </el-form-item>
        </el-form>
        <div class="config-footer">
          <el-button @click="configDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveConfig">保存配置</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { Plus, Search, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface GraphItem {
  id: string
  name: string
  industry: string
  nodeCount: number
  edgeCount: number
  enterpriseCount: number
  status: 'published' | 'editing' | 'draft'
  updatedBy: string
  updatedAt: string
  linkedEnterprises: string[]
  layout: string
  nodeSize: number
  showLabels: boolean
}

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const industryFilter = ref('')
const dialogVisible = ref(false)
const configDrawerVisible = ref(false)
const isEditing = ref(false)
const formRef = ref<FormInstance>()
const configGraph = ref<GraphItem | null>(null)

const formData = reactive({
  name: '',
  industry: '',
  description: '',
  graphType: 'chain',
  dataSource: 'built-in',
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入图谱名称', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择产业', trigger: 'change' }],
  graphType: [{ required: true, message: '请选择图谱类型', trigger: 'change' }],
}

const graphs = ref<GraphItem[]>([
  {
    id: 'g1',
    name: '高端装备制造产业链图谱',
    industry: '高端装备制造',
    nodeCount: 28,
    edgeCount: 45,
    enterpriseCount: 86,
    status: 'published',
    updatedBy: '张明',
    updatedAt: '2026-05-10 14:30',
    linkedEnterprises: ['华创科技', '远大智能', '盛通精密'],
    layout: 'force',
    nodeSize: 30,
    showLabels: true,
  },
  {
    id: 'g2',
    name: '前沿材料产业链图谱',
    industry: '前沿材料',
    nodeCount: 22,
    edgeCount: 35,
    enterpriseCount: 52,
    status: 'published',
    updatedBy: '李芳',
    updatedAt: '2026-05-09 16:20',
    linkedEnterprises: ['中科新材料', '瑞达材料'],
    layout: 'force',
    nodeSize: 25,
    showLabels: true,
  },
  {
    id: 'g3',
    name: '数字经济产业链图谱',
    industry: '数字经济',
    nodeCount: 32,
    edgeCount: 56,
    enterpriseCount: 110,
    status: 'editing',
    updatedBy: '王磊',
    updatedAt: '2026-05-13 09:45',
    linkedEnterprises: ['翔宇半导体', '恒信电子', '博远信息'],
    layout: 'hierarchical',
    nodeSize: 28,
    showLabels: true,
  },
  {
    id: 'g4',
    name: '时尚产业产业链图谱',
    industry: '时尚产业',
    nodeCount: 18,
    edgeCount: 28,
    enterpriseCount: 45,
    status: 'editing',
    updatedBy: '陈静',
    updatedAt: '2026-05-12 11:00',
    linkedEnterprises: ['凯州纺织', '锦绣设计'],
    layout: 'force',
    nodeSize: 26,
    showLabels: true,
  },
  {
    id: 'g5',
    name: '新能源汽车产业链图谱',
    industry: '高端装备制造',
    nodeCount: 25,
    edgeCount: 40,
    enterpriseCount: 68,
    status: 'published',
    updatedBy: '张明',
    updatedAt: '2026-05-08 10:15',
    linkedEnterprises: ['天成新能源', '鼎盛自动化'],
    layout: 'force',
    nodeSize: 30,
    showLabels: true,
  },
  {
    id: 'g6',
    name: '生物医药产业链图谱',
    industry: '前沿材料',
    nodeCount: 20,
    edgeCount: 30,
    enterpriseCount: 38,
    status: 'draft',
    updatedBy: '刘洋',
    updatedAt: '2026-05-07 15:30',
    linkedEnterprises: ['东方生物'],
    layout: 'circular',
    nodeSize: 22,
    showLabels: false,
  },
])

const filteredGraphs = computed(() => {
  let list = graphs.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter((g) => g.name.toLowerCase().includes(kw))
  }
  if (statusFilter.value) {
    list = list.filter((g) => g.status === statusFilter.value)
  }
  if (industryFilter.value) {
    list = list.filter((g) => g.industry === industryName(industryFilter.value))
  }
  return list
})

const publishedCount = computed(() => graphs.value.filter((g) => g.status === 'published').length)
const editingCount = computed(() => graphs.value.filter((g) => g.status === 'editing').length)
const totalLinkedEnterprises = computed(() =>
  graphs.value.reduce((sum, g) => sum + g.enterpriseCount, 0),
)

function industryName(code: string): string {
  const map: Record<string, string> = {
    'high-end-equipment': '高端装备制造',
    'frontier-material': '前沿材料',
    'digital-economy': '数字经济',
    fashion: '时尚产业',
  }
  return map[code] || code
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { published: '已发布', editing: '编辑中', draft: '草稿' }
  return map[status] || status
}

function handleCreate() {
  isEditing.value = false
  formData.name = ''
  formData.industry = ''
  formData.description = ''
  formData.graphType = 'chain'
  formData.dataSource = 'built-in'
  dialogVisible.value = true
}

function handleEdit(row: GraphItem) {
  isEditing.value = true
  formData.name = row.name
  formData.industry = row.industry
  formData.description = ''
  formData.graphType = 'chain'
  formData.dataSource = 'built-in'
  dialogVisible.value = true
}

function handleConfig(row: GraphItem) {
  configGraph.value = { ...row }
  configDrawerVisible.value = true
}

function handleTogglePublish(row: GraphItem) {
  const action = row.status === 'published' ? '下架' : '发布'
  ElMessageBox.confirm(`确定${action}图谱"${row.name}"？`, '提示', { type: 'warning' })
    .then(() => {
      row.status = row.status === 'published' ? 'draft' : 'published'
      ElMessage.success(`${action}成功`)
    })
    .catch(() => {})
}

function handleDelete(row: GraphItem) {
  ElMessageBox.confirm(`确定删除图谱"${row.name}"？此操作不可恢复。`, '警告', {
    type: 'warning',
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
  })
    .then(() => {
      const idx = graphs.value.findIndex((g) => g.id === row.id)
      if (idx !== -1) graphs.value.splice(idx, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

async function handleSave() {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (!valid) return
    if (isEditing.value) {
      ElMessage.success('图谱已更新')
    } else {
      graphs.value.push({
        id: `g${Date.now()}`,
        name: formData.name,
        industry: formData.industry,
        nodeCount: 0,
        edgeCount: 0,
        enterpriseCount: 0,
        status: 'draft',
        updatedBy: '当前用户',
        updatedAt: new Date().toLocaleString('zh-CN'),
        linkedEnterprises: [],
        layout: 'force',
        nodeSize: 28,
        showLabels: true,
      })
      ElMessage.success('图谱创建成功')
    }
    dialogVisible.value = false
  })
}

function handleSaveConfig() {
  ElMessage.success('配置已保存')
  configDrawerVisible.value = false
}

function removeEnterprise(index: number) {
  configGraph.value?.linkedEnterprises.splice(index, 1)
}

function addEnterprise() {
  configGraph.value?.linkedEnterprises.push('新关联企业')
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
})
</script>

<style lang="scss" scoped>
.graph-manage-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.graph-manage-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.graph-manage-table {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.graph-name {
  color: $color-primary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.config-row {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

.config-label {
  flex-shrink: 0;
  width: 60px;
  font-size: 13px;
  color: $text-secondary;
}

.linked-enterprises {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.linked-enterprise {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  font-size: 13px;
  background: $bg-hover;
  border-radius: $radius-base;
}

.config-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid $border-color-lighter;
}
</style>
