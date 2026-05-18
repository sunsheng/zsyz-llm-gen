<template>
  <div class="page-container">
    <PageHeader title="报告生成与输出" subtitle="企业运行报告配置与生成" />

    <div class="form-section">
      <el-form :model="form" label-width="120px" style="max-width: 640px">
        <el-form-item label="报告类型">
          <el-radio-group v-model="form.type">
            <el-radio-button value="standard">标准报告</el-radio-button>
            <el-radio-button value="special">专项报告</el-radio-button>
            <el-radio-button value="custom">定制报告</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="目标企业">
          <el-select v-model="form.enterprise" placeholder="选择企业" style="width: 100%">
            <el-option v-for="e in enterprises" :key="e.id" :label="e.name" :value="e.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="报告周期">
          <el-date-picker
            v-model="form.period"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item v-if="form.type === 'special'" label="专项方向">
          <el-select v-model="form.direction" placeholder="选择专项方向" style="width: 100%">
            <el-option label="经营健康度分析" value="health" />
            <el-option label="创新能力评估" value="innovation" />
            <el-option label="风险预警分析" value="risk" />
            <el-option label="可持续发展评估" value="sustainable" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.type === 'custom'" label="自定义指标">
          <el-checkbox-group v-model="form.indicators">
            <el-checkbox label="经营健康度" />
            <el-checkbox label="创新能力" />
            <el-checkbox label="人力资源" />
            <el-checkbox label="可持续发展" />
            <el-checkbox label="风险预警" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="输出格式">
          <el-checkbox-group v-model="form.formats">
            <el-checkbox label="PDF" />
            <el-checkbox label="Word" />
            <el-checkbox label="Excel" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="generating" @click="handleGenerate">
            {{ generating ? '生成中...' : '生成报告' }}
          </el-button>
          <el-button size="large" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="generatedReport" class="result-section">
      <h4 class="section-title">报告生成结果</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="报告名称">{{ generatedReport.name }}</el-descriptions-item>
        <el-descriptions-item label="目标企业">{{
          generatedReport.enterprise
        }}</el-descriptions-item>
        <el-descriptions-item label="报告周期">{{ generatedReport.period }}</el-descriptions-item>
        <el-descriptions-item label="生成时间">{{ generatedReport.time }}</el-descriptions-item>
      </el-descriptions>

      <div class="preview-section">
        <h4 class="section-title">报告预览</h4>
        <div class="preview-content">
          <div class="preview-header">
            <h3>{{ generatedReport.name }}</h3>
            <p>报告周期: {{ generatedReport.period }}</p>
          </div>
          <el-divider />
          <div class="preview-body">
            <h4>一、企业概况</h4>
            <p>
              {{
                generatedReport.enterprise
              }}位于凯州新城，是一家专注于高端装备制造领域的重点企业...
            </p>
            <h4>二、经营健康度评价</h4>
            <p>综合评分: 82.5分 | 等级: 良好</p>
            <el-progress :percentage="82.5" :stroke-width="10" />
            <h4>三、核心指标</h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="营业收入">12.8亿</el-descriptions-item>
              <el-descriptions-item label="利润总额">1.2亿</el-descriptions-item>
              <el-descriptions-item label="资产负债率">45.6%</el-descriptions-item>
              <el-descriptions-item label="成本费用利润率">9.1%</el-descriptions-item>
            </el-descriptions>
            <h4>四、诊断建议</h4>
            <ul>
              <li>建议加强研发投入，提升创新能力指标</li>
              <li>优化成本结构，进一步提高利润率</li>
              <li>关注人才储备，增强可持续发展能力</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { fetchEntReportEnterprises } from '@/api/modules/analysisApi'
import type { EntReportEnterprise } from '@/api/types/analysis'

const enterprises = ref<EntReportEnterprise[]>([])

const form = ref({
  type: 'standard',
  enterprise: '',
  period: null as any,
  direction: '',
  indicators: ['经营健康度', '创新能力'],
  formats: ['PDF'],
})

const generating = ref(false)
const generatedReport = ref<any>(null)

async function loadData() {
  const data = await fetchEntReportEnterprises()
  enterprises.value = data.enterprises
}

async function handleGenerate() {
  generating.value = true
  await new Promise((resolve) => setTimeout(resolve, 1500))
  const ent =
    enterprises.value.find((e) => e.name === form.value.enterprise) || enterprises.value[0]
  if (ent) {
    generatedReport.value = {
      name: `${ent.name} - ${form.value.type === 'standard' ? '标准' : form.value.type === 'special' ? '专项' : '定制'}运行分析报告`,
      enterprise: ent.name,
      period: '2024年度',
      time: new Date().toLocaleString(),
    }
  }
  generating.value = false
}

function handleReset() {
  form.value = {
    type: 'standard',
    enterprise: '',
    period: null,
    direction: '',
    indicators: ['经营健康度', '创新能力'],
    formats: ['PDF'],
  }
  generatedReport.value = null
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.form-section {
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.result-section {
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

.preview-section {
  margin-top: $spacing-lg;
}

.preview-content {
  padding: $spacing-lg;
  background: #fafbfc;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
}

.preview-header {
  h3 {
    margin: 0 0 $spacing-sm;
    font-size: 18px;
    color: $text-primary;
  }

  p {
    margin: 0;
    color: $text-secondary;
  }
}

.preview-body {
  h4 {
    margin: $spacing-base 0 $spacing-sm;
    font-size: 14px;
    color: $text-primary;
  }

  p {
    margin: $spacing-sm 0;
    font-size: 13px;
    color: $text-regular;
  }

  ul {
    padding-left: 20px;
    margin: $spacing-sm 0;

    li {
      margin-bottom: $spacing-xs;
      font-size: 13px;
      color: $text-regular;
    }
  }
}
</style>
