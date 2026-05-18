<template>
  <div class="page-container">
    <PageHeader title="报告模板" subtitle="运行分析报告模板管理">
      <template #actions>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新建模板</el-button>
      </template>
    </PageHeader>

    <div class="template-grid">
      <div v-for="tpl in templates" :key="tpl.id" class="template-card">
        <div class="template-card__icon" :style="{ background: tpl.color }">
          <el-icon :size="32" color="#fff"><Document /></el-icon>
        </div>
        <div class="template-card__body">
          <h4>{{ tpl.name }}</h4>
          <p class="template-card__desc">{{ tpl.description }}</p>
          <div class="template-card__meta">
            <span>周期: {{ tpl.cycle }}</span>
            <span>指标: {{ tpl.indicators }}项</span>
          </div>
        </div>
        <div class="template-card__actions">
          <el-button type="primary" link @click="handlePreview(tpl)">预览</el-button>
          <el-button type="danger" link @click="handleDelete(tpl)">删除</el-button>
        </div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" :title="previewTemplate?.name + ' - 预览'" width="720px">
      <div v-if="previewTemplate" class="preview-content">
        <h3>{{ previewTemplate.name }}</h3>
        <p>{{ previewTemplate.description }}</p>
        <el-divider />
        <h4>报告结构</h4>
        <el-tree
          :data="previewTemplate.structure"
          :props="{ label: 'label', children: 'children' }"
          default-expand-all
        />
        <el-divider />
        <h4>核心指标</h4>
        <el-tag v-for="ind in previewTemplate.indicatorList" :key="ind" style="margin: 4px">{{
          ind
        }}</el-tag>
      </div>
    </el-dialog>

    <!-- 新建/编辑模板弹窗 -->
    <el-dialog v-model="formVisible" :title="form.id ? '编辑模板' : '新建模板'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="模板名称" required>
          <el-input v-model="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板描述" required>
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入模板描述"
          />
        </el-form-item>
        <el-form-item label="报告周期" required>
          <el-select v-model="form.cycle" style="width: 100%">
            <el-option label="月度" value="月度" />
            <el-option label="季度" value="季度" />
            <el-option label="年度" value="年度" />
            <el-option label="按需" value="按需" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板颜色">
          <el-color-picker v-model="form.color" />
        </el-form-item>
        <el-form-item label="核心指标">
          <el-select
            v-model="form.indicatorList"
            multiple
            filterable
            allow-create
            style="width: 100%"
            placeholder="输入指标名称后回车添加"
          >
            <el-option label="产值" value="产值" />
            <el-option label="增速" value="增速" />
            <el-option label="产业结构" value="产业结构" />
            <el-option label="利润率" value="利润率" />
            <el-option label="入驻率" value="入驻率" />
            <el-option label="企业数" value="企业数" />
            <el-option label="同比增速" value="同比增速" />
            <el-option label="环比增速" value="环比增速" />
            <el-option label="投资规模" value="投资规模" />
            <el-option label="创新能力" value="创新能力" />
            <el-option label="人才资源" value="人才资源" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Document, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import { fetchReportTemplates } from '@/api/modules/analysisApi'
import type { ReportTemplate } from '@/api/types/analysis'

const previewVisible = ref(false)
const previewTemplate = ref<ReportTemplate | null>(null)
const templates = ref<ReportTemplate[]>([])
const formVisible = ref(false)

const defaultForm = {
  id: 0,
  name: '',
  description: '',
  cycle: '月度',
  indicators: 0,
  color: '#1889E8',
  indicatorList: [] as string[],
  structure: [] as { label: string; children?: { label: string }[] }[],
}

const form = reactive({ ...defaultForm })

async function loadData() {
  const data = await fetchReportTemplates()
  templates.value = data.templates
}

function handlePreview(tpl: ReportTemplate) {
  previewTemplate.value = tpl
  previewVisible.value = true
}

function handleAdd() {
  Object.assign(form, { ...defaultForm, id: 0, indicatorList: [] })
  formVisible.value = true
}

function handleDelete(tpl: ReportTemplate) {
  ElMessageBox.confirm(`确定删除模板"${tpl.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    templates.value = templates.value.filter((t) => t.id !== tpl.id)
    ElMessage.success('删除成功')
  })
}

function handleSave() {
  if (!form.name) {
    ElMessage.warning('请输入模板名称')
    return
  }
  if (!form.description) {
    ElMessage.warning('请输入模板描述')
    return
  }

  const newTemplate: ReportTemplate = {
    id: form.id || Date.now(),
    name: form.name,
    description: form.description,
    cycle: form.cycle,
    indicators: form.indicatorList.length,
    color: form.color,
    indicatorList: [...form.indicatorList],
    structure: form.indicatorList.map((ind, i) => ({ label: `${i + 1}. ${ind}` })),
  }

  if (form.id) {
    const idx = templates.value.findIndex((t) => t.id === form.id)
    if (idx !== -1) templates.value[idx] = newTemplate
  } else {
    templates.value.push(newTemplate)
  }

  formVisible.value = false
  ElMessage.success(form.id ? '编辑成功' : '新建成功')
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
}
.template-card {
  display: flex;
  gap: $spacing-base;
  align-items: flex-start;
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  transition: box-shadow $transition-fast;
  &:hover {
    box-shadow: $shadow-dropdown;
  }
}
.template-card__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: $radius-lg;
}
.template-card__body {
  flex: 1;
  h4 {
    margin: 0 0 $spacing-xs;
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}
.template-card__desc {
  margin: 0 0 $spacing-sm;
  font-size: $font-size-sm;
  line-height: 1.5;
  color: $text-regular;
}
.template-card__meta {
  display: flex;
  gap: $spacing-md;
  font-size: $font-size-xs;
  color: $text-secondary;
}
.template-card__actions {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: $spacing-xs;
}
.preview-content {
  h3 {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-lg;
  }
  h4 {
    margin: $spacing-base 0 $spacing-sm;
    font-size: $font-size-md;
  }
  p {
    line-height: 1.6;
    color: $text-regular;
  }
}
</style>
