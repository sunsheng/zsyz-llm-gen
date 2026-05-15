<template>
  <div class="page-container">
    <PageHeader title="报告模板" subtitle="运行分析报告模板管理">
      <template #actions>
        <el-button type="primary">新建模板</el-button>
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
          <el-button type="primary" link @click="handleGenerate(tpl)">生成</el-button>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'

const previewVisible = ref(false)
const previewTemplate = ref<any>(null)

const templates = ref([
  {
    id: 1,
    name: '月度运行分析报告',
    description: '月度产业运行数据汇总分析，包含产值、增速、结构等核心指标',
    cycle: '月度',
    indicators: 28,
    color: '#1889E8',
    indicatorList: ['产值', '增速', '产业结构', '利润率', '入驻率', '企业数'],
    structure: [
      {
        label: '一、总体运行概况',
        children: [{ label: '1.1 产值与增速' }, { label: '1.2 入驻与空置' }],
      },
      {
        label: '二、产业结构分析',
        children: [{ label: '2.1 二级产业占比' }, { label: '2.2 重点企业表现' }],
      },
      { label: '三、问题与建议' },
    ],
  },
  {
    id: 2,
    name: '季度运行分析报告',
    description: '季度深度分析报告，增加趋势对比与预测分析',
    cycle: '季度',
    indicators: 42,
    color: '#36CBCB',
    indicatorList: ['季度产值', '同比增速', '环比增速', '预测值', '置信区间'],
    structure: [
      {
        label: '一、季度运行总览',
        children: [{ label: '1.1 核心指标' }, { label: '1.2 环比分析' }],
      },
      { label: '二、深度分析', children: [{ label: '2.1 产业链' }, { label: '2.2 区域对比' }] },
      { label: '三、趋势预测' },
    ],
  },
  {
    id: 3,
    name: '年度运行分析报告',
    description: '年度综合分析报告，全面回顾与展望',
    cycle: '年度',
    indicators: 65,
    color: '#4ECB73',
    indicatorList: ['年度产值', '增长趋势', '投资规模', '创新能力', '人才资源'],
    structure: [
      { label: '一、年度总览', children: [{ label: '1.1 核心指标' }, { label: '1.2 年度对比' }] },
      {
        label: '二、多维度分析',
        children: [{ label: '2.1 产业' }, { label: '2.2 区域' }, { label: '2.3 企业' }],
      },
      { label: '三、下年度展望' },
    ],
  },
  {
    id: 4,
    name: '专项分析报告',
    description: '针对特定产业或区域的专项深度分析',
    cycle: '按需',
    indicators: 35,
    color: '#F2637B',
    indicatorList: ['专项指标', '对标分析', 'SWOT分析', '政策建议'],
    structure: [
      { label: '一、专项背景' },
      { label: '二、数据深度分析', children: [{ label: '2.1 现状' }, { label: '2.2 问题' }] },
      { label: '三、对策建议' },
    ],
  },
])

function handlePreview(tpl: any) {
  previewTemplate.value = tpl
  previewVisible.value = true
}

function handleGenerate(_tpl: any) {
  // Would trigger report generation
}
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
