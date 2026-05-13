<template>
  <div class="page-container">
    <PageHeader title="科研机构详情" subtitle="科研机构详细信息">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
      </template>
    </PageHeader>

    <div class="detail-grid">
      <div class="detail-card">
        <h3>{{ institution.name }}</h3>
        <el-tag style="margin-left: 8px">{{ institution.type }}</el-tag>
        <el-divider />
        <div class="detail-rows">
          <div class="detail-row">
            <span class="label">研究领域</span>
            <span class="value">{{ institution.field }}</span>
          </div>
          <div class="detail-row">
            <span class="label">专利数量</span>
            <span class="value">{{ institution.patents }}项</span>
          </div>
          <div class="detail-row">
            <span class="label">技术转移</span>
            <span class="value">{{ institution.transfers }}项</span>
          </div>
          <div class="detail-row">
            <span class="label">合作企业</span>
            <span class="value">{{ institution.cooperation }}家</span>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h4 class="panel-title">科研能力评估</h4>
        <BaseChart :option="radarOption" height="300px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockResearchInstitutions } from '@/api/mock/invest'

const route = useRoute()
const institution = ref<any>({})
const radarOption = ref({})

onMounted(() => {
  const list = getMockResearchInstitutions()
  const id = route.params.id as string
  institution.value = list.find(i => i.id === id) || list[0]

  radarOption.value = {
    color: ['#1889E8'],
    tooltip: {},
    radar: {
      indicator: [
        { name: '专利产出', max: 100 },
        { name: '技术转移', max: 100 },
        { name: '企业合作', max: 100 },
        { name: '科研人才', max: 100 },
        { name: '项目数量', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          Math.min(institution.value.patents / 5, 100),
          Math.min(institution.value.transfers * 2, 100),
          Math.min(institution.value.cooperation, 100),
          Math.floor(Math.random() * 30 + 65),
          Math.floor(Math.random() * 30 + 55)
        ],
        areaStyle: { opacity: 0.3 }
      }]
    }]
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.detail-card,
.chart-card {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  h3 {
    display: inline;
    font-size: 20px;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;
  }
}
.panel-title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid $border-color-lighter;
  font-size: 14px;
  .label { color: $text-secondary; }
  .value { color: $text-primary; font-weight: $font-weight-medium; }
}
</style>
