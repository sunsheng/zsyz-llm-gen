<template>
  <div class="page-container">
    <PageHeader title="产业新闻热点智能分析" subtitle="基于AI的产业新闻热点趋势分析与洞察" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <!-- 政策解读：政策摘要卡 -->
    <div class="section-title">政策解读</div>
    <div class="policy-summary-cards">
      <el-card
        v-for="policy in policySummaries"
        :key="policy.id"
        shadow="hover"
        class="policy-card"
      >
        <template #header>
          <div class="policy-card__header">
            <span class="policy-card__title">{{ policy.title }}</span>
            <el-tag size="small" :type="policy.status === '申报中' ? 'success' : 'info'">{{
              policy.status
            }}</el-tag>
          </div>
        </template>
        <div class="policy-card__body">
          <div class="policy-card__field">
            <span class="policy-card__label">补贴金额：</span>
            <span class="policy-card__value policy-card__value--highlight">{{
              policy.subsidyAmount
            }}</span>
          </div>
          <div class="policy-card__field">
            <span class="policy-card__label">申报条件：</span>
            <span class="policy-card__value">{{ policy.conditions }}</span>
          </div>
          <div class="policy-card__field">
            <span class="policy-card__label">截止时间：</span>
            <span class="policy-card__value policy-card__value--deadline">{{
              policy.deadline
            }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 热点追踪：事件时间轴 -->
    <div class="section-title">热点追踪</div>
    <div class="hotspot-tracking">
      <el-timeline>
        <el-timeline-item
          v-for="event in hotspotEvents"
          :key="event.id"
          :timestamp="event.date"
          placement="top"
          :type="
            event.type === 'major' ? 'danger' : event.type === 'important' ? 'warning' : 'primary'
          "
        >
          <el-card shadow="hover" class="timeline-card">
            <h4 class="timeline-card__title">{{ event.title }}</h4>
            <p class="timeline-card__desc">{{ event.description }}</p>
            <div v-if="event.relatedNews.length" class="timeline-card__related">
              <span class="timeline-card__related-label">关联新闻：</span>
              <el-tag
                v-for="news in event.relatedNews"
                :key="news"
                size="small"
                type="info"
                class="timeline-card__related-tag"
              >
                {{ news }}
              </el-tag>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 分析图表 -->
    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">热点趋势分析</h4>
        <BaseChart :option="trendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">热门关键词</h4>
        <BaseChart :option="wordCloudOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  {
    key: 'total',
    label: '分析新闻',
    value: 1280,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+12%',
    icon: 'Document',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'hotspot',
    label: '识别热点',
    value: 56,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+8',
    icon: 'Star',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'positive',
    label: '正面情感',
    value: 68,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+3%',
    icon: 'CircleCheck',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'negative',
    label: '负面预警',
    value: 15,
    unit: '%',
    trend: 'down' as const,
    trendValue: '-2%',
    icon: 'Warning',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
]

// 政策摘要卡数据
const policySummaries = ref([
  {
    id: 1,
    title: '"人工智能+制造"专项行动方案',
    status: '申报中',
    subsidyAmount: '最高500万元',
    conditions: '制造业企业上年度营收超1亿元，AI应用投入占比不低于3%',
    deadline: '2025-08-31',
  },
  {
    id: 2,
    title: '中小企业数字化转型补贴政策',
    status: '申报中',
    subsidyAmount: '最高100万元',
    conditions: '注册地在本区，上年度营收不低于500万元，开展数字化改造项目',
    deadline: '2025-09-15',
  },
  {
    id: 3,
    title: '高层次人才引进奖励政策',
    status: '即将截止',
    subsidyAmount: '最高200万元',
    conditions: '具有博士学历或高级职称，签订3年以上劳动合同',
    deadline: '2025-06-30',
  },
  {
    id: 4,
    title: '绿色低碳产业发展专项资金',
    status: '申报中',
    subsidyAmount: '最高300万元',
    conditions: '通过环评验收，碳排放同比下降10%以上，属于绿色制造体系企业',
    deadline: '2025-10-31',
  },
])

// 热点事件时间轴数据
const hotspotEvents = ref([
  {
    id: 1,
    title: '"祖冲之三号"量子计算原型机刷新世界纪录',
    date: '2025-03-03',
    type: 'major',
    description:
      '中国科学院研发的超导量子计算原型机"祖冲之三号"以封面论文形式发表于《物理评论快报》，构建了目前最高水准的超导量子计算机，刷新全球量子计算优越性纪录。',
    relatedNews: ['量子计算优越性新纪录解读', '超导量子芯片技术路线对比', '量子计算产业化应用前景'],
  },
  {
    id: 2,
    title: '工信部等八部门印发"人工智能+制造"专项行动方案',
    date: '2025-03-10',
    type: 'important',
    description:
      '工业和信息化部等八部门联合印发专项行动方案，推动人工智能加速与制造业深度融合，加快制造业生产模式和经济形态变革，重塑全球产业竞争格局。',
    relatedNews: ['AI+制造政策细则解读', '制造业数字化转型申报指南', '智能制造示范工厂申报启动'],
  },
  {
    id: 3,
    title: '碳纤维国产化率突破80%，大飞机碳纤维国产替代加速',
    date: '2025-04-15',
    type: 'normal',
    description:
      '国产碳纤维国产化率已从2019年的30%跃升至80%以上，T1200级碳纤维实现量产，光威复材等龙头企业推动大飞机用碳纤维国产替代进程。',
    relatedNews: ['碳纤维产业化应用前景', '大飞机材料国产化进展', '新材料产业投资趋势'],
  },
  {
    id: 4,
    title: '全球锂电池出货量突破2.8TWh，中国市场份额持续领先',
    date: '2025-05-08',
    type: 'important',
    description:
      '2025年全球锂电池总出货量预计突破2.8TWh，产值逼近1800亿美元，动力电池市场份额保持在70%以上，中国企业占据全球动力电池装机量前六中的四席。',
    relatedNews: ['锂电池产业链全景分析', '固态电池技术路线对比', '锂电行业产能出清趋势'],
  },
])

const trendOption = ref({})
const wordCloudOption = ref({})

onMounted(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['正面', '中性', '负面'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '正面', type: 'line', smooth: true, data: [120, 135, 128, 142, 155, 168] },
      { name: '中性', type: 'line', smooth: true, data: [80, 75, 82, 78, 72, 70] },
      { name: '负面', type: 'line', smooth: true, data: [25, 22, 28, 20, 18, 15] },
    ],
  }

  wordCloudOption.value = {
    tooltip: { show: true },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [12, 40],
        rotationRange: [-45, 45],
        gridSize: 8,
        textStyle: { fontFamily: 'sans-serif', fontWeight: 'bold' },
        data: [
          { name: '人工智能+制造', value: 100 },
          { name: '新能源汽车', value: 92 },
          { name: '量子计算', value: 88 },
          { name: '碳纤维', value: 82 },
          { name: '锂电池', value: 78 },
          { name: '生物医药', value: 75 },
          { name: '半导体', value: 72 },
          { name: '数字化转型', value: 68 },
          { name: '高端装备', value: 65 },
          { name: '碳中和', value: 60 },
          { name: '国产替代', value: 58 },
          { name: '创新药', value: 55 },
          { name: '低空经济', value: 52 },
          { name: '智能制造', value: 48 },
          { name: '集成电路', value: 45 },
        ].map((item) => ({
          ...item,
          textStyle: { color: chartColors[Math.floor(Math.random() * chartColors.length)] },
        })),
      },
    ],
  }
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
.section-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

// 政策摘要卡
.policy-summary-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.policy-card {
  &.el-card {
    border-radius: $radius-base;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    font-size: 15px;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__field {
    display: flex;
    gap: 4px;
    align-items: baseline;
    font-size: 14px;
    line-height: 1.5;
  }
  &__label {
    color: $text-secondary;
    white-space: nowrap;
  }
  &__value {
    color: $text-primary;
    &--highlight {
      font-weight: $font-weight-semibold;
      color: #f2637b;
    }
    &--deadline {
      color: #1889e8;
    }
  }
}

// 热点追踪时间轴
.hotspot-tracking {
  padding: 20px;
  margin-bottom: 24px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.timeline-card {
  &.el-card {
    border-radius: $radius-base;
  }
  &__title {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
  &__desc {
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 1.6;
    color: $text-secondary;
  }
  &__related {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }
  &__related-label {
    font-size: 13px;
    color: $text-secondary;
  }
  &__related-tag {
    cursor: pointer;
  }
}

// 图表区域
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
</style>
