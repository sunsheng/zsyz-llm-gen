<template>
  <div class="page-container">
    <PageHeader title="榜单赋能招商工具" subtitle="榜单数据驱动的智能招商推荐" />

    <div class="config-section">
      <h4 class="section-title">配置参数</h4>
      <el-form :model="config" label-width="120px" inline>
        <el-form-item label="产业定位">
          <el-input
            v-model="config.industryFocus"
            placeholder="请输入产业定位描述"
            style="width: 320px"
          />
        </el-form-item>
        <el-form-item label="匹配维度">
          <el-select
            v-model="config.matchDimensions"
            multiple
            placeholder="请选择匹配维度"
            style="width: 360px"
          >
            <el-option label="技术互补" value="technology" />
            <el-option label="投资匹配" value="market" />
            <el-option label="资源协同" value="resource" />
            <el-option label="政策契合" value="policy" />
          </el-select>
        </el-form-item>
        <el-form-item label="最低协同度">
          <el-slider
            v-model="config.minSynergy"
            :min="0"
            :max="100"
            :step="5"
            :format-tooltip="(v: number) => v + '%'"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="generateRecommend"
            >生成推荐</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <template v-if="hasResult">
      <div class="chart-grid">
        <div class="chart-panel">
          <h4 class="chart-panel__title">行业分布</h4>
          <BaseChart :option="industryPieOption" height="300px" />
        </div>
        <div class="chart-panel">
          <h4 class="chart-panel__title">匹配度分布</h4>
          <BaseChart :option="matchDistOption" height="300px" />
        </div>
      </div>

      <div v-loading="loading" class="result-section">
        <h4 class="section-title">推荐企业（按协同度排序）</h4>
        <div class="card-grid">
          <el-card
            v-for="item in enterpriseList"
            :key="item.id"
            shadow="hover"
            class="enterprise-card"
          >
            <div class="enterprise-card__header">
              <span class="enterprise-card__name">{{ item.name }}</span>
              <ScoreRing :value="item.synergy" :size="52" :stroke-width="5" />
            </div>
            <div class="enterprise-card__body">
              <div class="enterprise-card__row">
                <span class="label">行业</span>
                <span class="value">{{ item.industry }}</span>
              </div>
              <div class="enterprise-card__row">
                <span class="label">区域</span>
                <span class="value">{{ item.region }}</span>
              </div>
              <div class="enterprise-card__row">
                <span class="label">营收(万)</span>
                <span class="value">{{ item.revenue.toLocaleString() }}</span>
              </div>
            </div>
            <div class="enterprise-card__tags">
              <el-tag v-for="tag in item.tags" :key="tag" size="small" class="tag-gap">{{
                tag
              }}</el-tag>
            </div>
          </el-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { fetchRankingEnterprises } from '@/api/modules/investApi'
import type { RankingEnterprise } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const hasResult = ref(false)
const enterpriseList = ref<RankingEnterprise[]>([])

const config = reactive({
  industryFocus: '',
  matchDimensions: [] as string[],
  minSynergy: 60,
})

const industryPieOption = ref({})
const matchDistOption = ref({})

async function generateRecommend() {
  loading.value = true
  hasResult.value = true
  try {
    const data = await fetchRankingEnterprises('empower-tool', 20)
    // 按协同度排序并过滤最低协同度
    enterpriseList.value = data
      .filter((e) => e.synergy >= config.minSynergy)
      .sort((a, b) => b.synergy - a.synergy)
    buildCharts()
  } finally {
    loading.value = false
  }
}

function buildCharts() {
  // 行业分布饼图
  const industryMap = new Map<string, number>()
  enterpriseList.value.forEach((e) => {
    industryMap.set(e.industry, (industryMap.get(e.industry) || 0) + 1)
  })
  industryPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: Array.from(industryMap.entries()).map(([name, value]) => ({ name, value })),
      },
    ],
  }

  // 匹配度分布柱状图
  const buckets = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%']
  const counts = [0, 0, 0, 0, 0]
  enterpriseList.value.forEach((e) => {
    const idx = Math.min(Math.floor(e.synergy / 20), 4)
    counts[idx]++
  })
  matchDistOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: buckets },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barMaxWidth: 32, data: counts }],
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.config-section {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
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
.result-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.enterprise-card {
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}
.enterprise-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.enterprise-card__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
}
.enterprise-card__body {
  margin-bottom: 8px;
}
.enterprise-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 13px;
  .label {
    color: $text-secondary;
  }
  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }
}
.enterprise-card__tags {
  padding-top: 8px;
  border-top: 1px solid $border-color-lighter;
}
.tag-gap {
  margin-right: 4px;
}
</style>
