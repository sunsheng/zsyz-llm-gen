<template>
  <div class="page-container">
    <PageHeader title="龙头骨干企业识别与评估" subtitle="龙头骨干企业智能识别与综合评估" />

    <div v-loading="loading" class="portrait-layout">
      <!-- 左面板: 企业选择 + 信息卡 + 评分 -->
      <div class="portrait-left">
        <div class="select-section">
          <el-select
            v-model="selectedId"
            placeholder="选择企业"
            filterable
            style="width: 100%"
            @change="handleSelect"
          >
            <el-option v-for="ent in enterprises" :key="ent.id" :label="ent.name" :value="ent.id" />
          </el-select>
        </div>

        <template v-if="current">
          <!-- 企业信息卡 -->
          <div class="info-card">
            <h4 class="info-card__name">{{ current.name }}</h4>
            <div class="info-card__row">
              <span class="info-card__label">所属行业</span>
              <span class="info-card__value">{{ current.industry }}</span>
            </div>
            <div class="info-card__row">
              <span class="info-card__label">年营收</span>
              <span class="info-card__value">{{ (current.revenue / 10000).toFixed(1) }} 亿元</span>
            </div>
            <div class="info-card__row">
              <span class="info-card__label">员工人数</span>
              <span class="info-card__value">{{ current.employeeCount.toLocaleString() }} 人</span>
            </div>
            <div class="info-card__row">
              <span class="info-card__label">扩张意愿</span>
              <el-tag :type="current.expansionIntent ? 'success' : 'info'" size="small">
                {{ current.expansionIntent ? '有扩张意愿' : '暂无意愿' }}
              </el-tag>
            </div>
          </div>

          <!-- 评分卡 -->
          <div class="score-cards">
            <div class="score-card">
              <div class="score-card__title">影响力评分</div>
              <ScoreRing :value="current.influenceScore" :size="90" />
            </div>
            <div class="score-card">
              <div class="score-card__title">带动力评分</div>
              <ScoreRing :value="current.drivingScore" :size="90" />
            </div>
          </div>

          <!-- 标签云 -->
          <div class="tag-cloud">
            <h5 class="tag-cloud__title">企业标签</h5>
            <div class="tag-cloud__items">
              <EnterpriseTag v-for="tag in current.tags" :key="tag" :text="tag" type="industry" />
            </div>
          </div>
        </template>

        <el-empty v-else description="请选择企业" :image-size="60" />
      </div>

      <!-- 右侧: 图表 + 评估结果 -->
      <div class="portrait-right">
        <template v-if="current">
          <!-- 多维评分雷达图 -->
          <div class="chart-panel">
            <h4 class="chart-panel__title">多维评分分析</h4>
            <BaseChart :option="radarOption" height="320px" />
          </div>

          <!-- 与行业龙头对比柱状图 -->
          <div class="chart-panel">
            <h4 class="chart-panel__title">与行业龙头对比</h4>
            <BaseChart :option="compareOption" height="320px" />
          </div>

          <!-- 评估结果 -->
          <div class="assess-result">
            <h4 class="assess-result__title">评估结果</h4>
            <el-tag :type="assessTagType" size="large" effect="dark" class="assess-result__tag">
              {{ assessLabel }}
            </el-tag>
            <p class="assess-result__desc">{{ assessDesc }}</p>
          </div>
        </template>

        <el-empty v-else description="请选择企业查看评估" :image-size="80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import EnterpriseTag from '@/components/business/EnterpriseTag.vue'
import { fetchLeadingEnterprisesDetailed } from '@/api/modules/investApi'
import type { LeadingEnterprise } from '@/api/types/invest'

const loading = ref(false)
const enterprises = ref<LeadingEnterprise[]>([])
const selectedId = ref('')

const current = computed(() => enterprises.value.find((e) => e.id === selectedId.value) ?? null)

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

// 评估结果
const assessLabel = computed(() => {
  if (!current.value) return ''
  const avg = (current.value.influenceScore + current.value.drivingScore) / 2
  if (avg >= 80 && current.value.expansionIntent) return '推荐招引'
  if (avg >= 60) return '持续关注'
  return '暂不推荐'
})

const assessTagType = computed(() => {
  const label = assessLabel.value
  if (label === '推荐招引') return 'success'
  if (label === '持续关注') return 'warning'
  return 'info'
})

const assessDesc = computed(() => {
  const label = assessLabel.value
  if (label === '推荐招引') return '该企业综合评分高且具备扩张意愿，建议优先推进招引工作。'
  if (label === '持续关注') return '该企业具备一定优势，建议保持持续跟踪和关注。'
  return '该企业当前暂不具备招引条件，可后续再评估。'
})

// 雷达图
const radarOption = computed<EChartsOption>(() => {
  if (!current.value) return {} as EChartsOption
  const ent = current.value
  const innovation = Math.floor(Math.random() * 20 + 60)
  const chainCoverage = Math.floor(Math.random() * 25 + 50)
  return {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '影响力', max: 100 },
        { name: '带动力', max: 100 },
        { name: '创新力', max: 100 },
        { name: '扩张意愿', max: 100 },
        { name: '产业链覆盖', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              ent.influenceScore,
              ent.drivingScore,
              innovation,
              ent.expansionIntent ? 85 : 30,
              chainCoverage,
            ],
            name: ent.name,
            areaStyle: { opacity: 0.2 },
          },
        ],
      },
    ],
  }
})

// 行业龙头对比柱状图
const compareOption = computed<EChartsOption>(() => {
  if (!current.value) return {} as EChartsOption
  const ent = current.value
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: [ent.name, '行业龙头均值'] },
    grid: { left: 60, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: ['影响力', '带动力', '创新力', '扩张意愿', '产业链覆盖'] },
    yAxis: { type: 'value', max: 100 },
    series: [
      {
        name: ent.name,
        type: 'bar',
        barMaxWidth: 32,
        data: [ent.influenceScore, ent.drivingScore, 72, ent.expansionIntent ? 85 : 30, 65],
      },
      {
        name: '行业龙头均值',
        type: 'bar',
        barMaxWidth: 32,
        data: [85, 82, 80, 75, 78],
      },
    ],
  }
})

function handleSelect() {
  // 切换企业时自动刷新
}

async function loadData() {
  loading.value = true
  try {
    enterprises.value = await fetchLeadingEnterprisesDetailed()
    if (enterprises.value.length > 0) {
      selectedId.value = enterprises.value[0].id
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.portrait-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
}

.portrait-left {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.select-section {
  margin-bottom: 20px;
}

.info-card {
  padding: 16px;
  margin-bottom: 16px;
  background: rgba($color-primary, 0.04);
  border-radius: $radius-base;
}

.info-card__name {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.info-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.info-card__label {
  font-size: 13px;
  color: $text-secondary;
}

.info-card__value {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.score-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.score-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 16px;
  background: $bg-card;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
}

.score-card__title {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-secondary;
}

.tag-cloud {
  margin-top: 8px;
}

.tag-cloud__title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.tag-cloud__items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.portrait-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.assess-result {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.assess-result__title {
  margin: 0;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
}

.assess-result__tag {
  font-size: 14px;
}

.assess-result__desc {
  margin: 0;
  font-size: 13px;
  color: $text-secondary;
}
</style>
