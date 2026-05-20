<template>
  <div class="page-container">
    <PageHeader title="多维度画像" subtitle="企业多维度综合画像" />

    <div class="enterprise-selector content-card">
      <span class="selector-label">选择企业：</span>
      <el-select
        v-model="selectedEnterpriseId"
        placeholder="请选择企业"
        filterable
        style="width: 320px"
        @change="handleEnterpriseChange"
      >
        <el-option
          v-for="ent in enterpriseOptions"
          :key="ent.id"
          :label="ent.name"
          :value="ent.id"
        />
      </el-select>
    </div>

    <div class="portrait-layout">
      <!-- 左侧面板 -->
      <div class="portrait-side">
        <div class="info-card">
          <h4 class="card-title">企业基本信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">企业名称</span>
              <span class="info-value">{{ portrait.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">行业</span>
              <el-tag size="small">{{ portrait.industry }}</el-tag>
            </div>
            <div class="info-item">
              <span class="info-label">规模</span>
              <span class="info-value">{{ portrait.scale }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">成立时间</span>
              <span class="info-value">{{ portrait.established }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">法人</span>
              <span class="info-value">{{ portrait.legalPerson }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">注册资本</span>
              <span class="info-value">{{ portrait.registeredCapital.toLocaleString() }}万元</span>
            </div>
            <div class="info-item">
              <span class="info-label">营收</span>
              <span class="info-value">{{ portrait.revenue.toLocaleString() }}万元</span>
            </div>
            <div class="info-item">
              <span class="info-label">员工数</span>
              <span class="info-value">{{ portrait.employeeCount }}人</span>
            </div>
          </div>
        </div>

        <div class="score-card">
          <h4 class="card-title">健康评分</h4>
          <BaseChart :option="scoreGaugeOption" height="200px" />
        </div>

        <div class="tag-card">
          <h4 class="card-title">资质标签</h4>
          <div class="tag-cloud">
            <el-tag
              v-for="tag in portrait.tags"
              :key="tag"
              size="small"
              type="primary"
              style="margin: 4px"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div v-if="portrait.coordinates" class="info-card">
          <h4 class="card-title">地理坐标</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">经度</span>
              <span class="info-value">{{ portrait.coordinates.lng.toFixed(4) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">纬度</span>
              <span class="info-value">{{ portrait.coordinates.lat.toFixed(4) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="portrait-main">
        <div class="chart-panel">
          <h4 class="chart-panel__title">股权结构</h4>
          <el-table :data="portrait.shareholders" stripe border style="width: 100%">
            <el-table-column prop="name" label="股东名称" min-width="160" />
            <el-table-column prop="type" label="资本类型" width="120">
              <template #default="{ row }">
                <el-tag size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ratio" label="持股比例(%)" width="120">
              <template #default="{ row }">{{ row.ratio }}%</template>
            </el-table-column>
          </el-table>
        </div>

        <div class="chart-panel">
          <h4 class="chart-panel__title">对外投资</h4>
          <el-table :data="portrait.investments" stripe border style="width: 100%">
            <el-table-column prop="name" label="被投企业" min-width="200" />
            <el-table-column prop="ratio" label="持股比例(%)" width="140">
              <template #default="{ row }">{{ row.ratio }}%</template>
            </el-table-column>
          </el-table>
        </div>

        <div class="chart-panel">
          <h4 class="chart-panel__title">分支机构</h4>
          <div class="branch-list">
            <el-tag
              v-for="branch in portrait.branches"
              :key="branch"
              size="small"
              type="info"
              style="margin: 4px"
            >
              {{ branch }}
            </el-tag>
            <el-empty v-if="!portrait.branches.length" description="暂无分支机构" />
          </div>
        </div>

        <div class="chart-panel">
          <h4 class="chart-panel__title">资质认证</h4>
          <el-table :data="portrait.qualifications" stripe border style="width: 100%">
            <el-table-column prop="name" label="资质名称" min-width="160" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag
                  :type="
                    row.status === '有效'
                      ? 'success'
                      : row.status === '即将到期'
                        ? 'warning'
                        : 'danger'
                  "
                  size="small"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="validUntil" label="有效期至" width="120" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchMultiDimensionPortrait, fetchFilterEnterpriseList } from '@/api/modules/monitorApi'
import type { MultiDimensionPortraitData } from '@/api/mock/monitor'

const selectedEnterpriseId = ref('')
const enterpriseOptions = ref<Array<{ id: string; name: string }>>([])

const portrait = ref<MultiDimensionPortraitData>({
  id: '',
  name: '',
  industry: '',
  scale: '',
  established: '',
  legalPerson: '',
  registeredCapital: 0,
  revenue: 0,
  employeeCount: 0,
  healthScore: 0,
  tags: [],
  shareholders: [],
  branches: [],
  investments: [],
  qualifications: [],
  coordinates: undefined,
})

const scoreGaugeOption = ref({})

async function handleEnterpriseChange(id: string) {
  if (!id) return
  await loadPortrait(id)
}

async function loadPortrait(id: string) {
  const data = (await fetchMultiDimensionPortrait(id)) as MultiDimensionPortraitData
  portrait.value = data

  const score = data.healthScore
  scoreGaugeOption.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        itemStyle: {
          color: score >= 80 ? '#4ECB73' : score >= 60 ? '#FBD437' : '#F2637B',
        },
        progress: { show: true, width: 16 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 16, color: [[1, '#E8ECF1']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          fontWeight: 700,
          formatter: '{value}分',
          offsetCenter: [0, '0%'],
        },
        title: { offsetCenter: [0, '30%'], fontSize: 13, color: '#909399' },
        data: [{ value: score, name: '健康评分' }],
      },
    ],
  }
}

onMounted(async () => {
  try {
    const list = (await fetchFilterEnterpriseList(20)) as Array<{ id: string; name: string }>
    enterpriseOptions.value = list.map((e) => ({ id: e.id, name: e.name }))
    if (enterpriseOptions.value.length > 0) {
      selectedEnterpriseId.value = enterpriseOptions.value[0].id
      await loadPortrait(selectedEnterpriseId.value)
    }
  } catch {
    // fallback
    await loadPortrait('ent-1')
  }
})
</script>

<style lang="scss" scoped>
.enterprise-selector {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 20px;
}
.selector-label {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
}
.page-container {
  padding: 20px;
}
.portrait-layout {
  display: flex;
  gap: 20px;
}
.portrait-side {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 20px;
  width: 380px;
}
.portrait-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.info-card,
.score-card,
.tag-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.card-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.info-label {
  font-size: 12px;
  color: #909399;
}
.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
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
.branch-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
