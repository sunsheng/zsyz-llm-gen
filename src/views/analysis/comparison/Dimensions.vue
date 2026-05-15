<template>
  <div class="page-container">
    <PageHeader title="对比维度" subtitle="多维度园区对比分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <el-tabs v-model="activeDimension" type="border-card">
      <el-tab-pane v-for="dim in dimensions" :key="dim.key" :label="dim.label" :name="dim.key">
        <el-table :data="dim.tableData" stripe border style="width: 100%">
          <el-table-column prop="indicator" label="指标" min-width="200" fixed />
          <el-table-column v-for="park in compareParks" :key="park" :label="park" width="160">
            <template #default="{ row }">
              <span :class="{ 'highlight-max': row[park + '_isMax'] }">{{ row[park] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'

const activeDimension = ref('basic')
const compareParks = ['科技园', '产业园', '创新园']

const dimensions = computed(() => {
  const raw = [
    {
      key: 'basic',
      label: '基础信息',
      tableData: [
        { indicator: '占地面积(万㎡)', 科技园: '52.8', 产业园: '68.5', 创新园: '35.2' },
        { indicator: '建筑面积(万㎡)', 科技园: '85.6', 产业园: '112.3', 创新园: '58.2' },
        { indicator: '入驻企业数', 科技园: '86', 产业园: '68', 创新园: '55' },
        { indicator: '员工总数', 科技园: '12580', 产业园: '8920', 创新园: '6580' },
        { indicator: '园区等级', 科技园: '国家级', 产业园: '省级', 创新园: '省级' },
      ],
    },
    {
      key: 'industry',
      label: '产业发展',
      tableData: [
        { indicator: '主导产业', 科技园: '数字经济', 产业园: '高端装备制造', 创新园: '前沿材料' },
        { indicator: '产值(亿)', 科技园: '358', 产业园: '285', 创新园: '245' },
        { indicator: '产值增速(%)', 科技园: '12.3', 产业园: '10.5', 创新园: '8.8' },
        { indicator: '产业链完整度', 科技园: '92%', 产业园: '85%', 创新园: '78%' },
        { indicator: '重点企业数', 科技园: '28', 产业园: '22', 创新园: '18' },
      ],
    },
    {
      key: 'benefit',
      label: '经济效益',
      tableData: [
        { indicator: '税收收入(亿)', 科技园: '18.5', 产业园: '15.2', 创新园: '12.8' },
        { indicator: '利润总额(亿)', 科技园: '22.3', 产业园: '18.7', 创新园: '15.6' },
        { indicator: '利润率(%)', 科技园: '8.5', 产业园: '7.2', 创新园: '6.8' },
        { indicator: '劳动生产率(万/人)', 科技园: '42.5', 产业园: '38.2', 创新园: '35.8' },
        { indicator: '入驻率(%)', 科技园: '92', 产业园: '85', 创新园: '78' },
      ],
    },
    {
      key: 'innovation',
      label: '创新能力',
      tableData: [
        { indicator: '研发投入(亿)', 科技园: '28.5', 产业园: '22.3', 创新园: '18.6' },
        { indicator: '专利数量', 科技园: '568', 产业园: '425', 创新园: '358' },
        { indicator: '高新技术企业数', 科技园: '42', 产业园: '35', 创新园: '28' },
        { indicator: '研发人员占比(%)', 科技园: '25.6', 产业园: '22.1', 创新园: '20.8' },
        { indicator: '产学研合作项目', 科技园: '18', 产业园: '12', 创新园: '15' },
      ],
    },
    {
      key: 'talent',
      label: '人才资源',
      tableData: [
        { indicator: '博士人数', 科技园: '385', 产业园: '268', 创新园: '312' },
        { indicator: '硕士人数', 科技园: '1850', 产业园: '1420', 创新园: '1280' },
        { indicator: '高层次人才数', 科技园: '86', 产业园: '62', 创新园: '75' },
        { indicator: '人才流动率(%)', 科技园: '8.5', 产业园: '6.2', 创新园: '7.8' },
        { indicator: '人才公寓(套)', 科技园: '520', 产业园: '380', 创新园: '280' },
      ],
    },
    {
      key: 'environment',
      label: '营商环境',
      tableData: [
        { indicator: '政策支持力度', 科技园: 'A级', 产业园: 'B级', 创新园: 'B级' },
        { indicator: '政务服务效率', 科技园: '95分', 产业园: '88分', 创新园: '82分' },
        { indicator: '基础设施评分', 科技园: '92', 产业园: '85', 创新园: '78' },
        { indicator: '金融服务网点', 科技园: '12', 产业园: '8', 创新园: '6' },
        { indicator: '生活配套评分', 科技园: '88', 产业园: '75', 创新园: '72' },
      ],
    },
  ]

  // Add _isMax flags for numeric comparisons
  return raw.map((dim) => ({
    ...dim,
    tableData: dim.tableData.map((row: Record<string, string>) => {
      const numericValues = compareParks
        .map((park) => ({ park, num: parseFloat(row[park]) }))
        .filter((v) => !isNaN(v.num))
      const maxPark =
        numericValues.length > 1 ? numericValues.reduce((a, b) => (a.num > b.num ? a : b)).park : ''
      const enhancedRow: Record<string, any> = { ...row }
      compareParks.forEach((park) => {
        enhancedRow[park + '_isMax'] = park === maxPark
      })
      return enhancedRow
    }),
  }))
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.highlight-max {
  font-weight: $font-weight-bold;
  color: $color-primary;
}
</style>
