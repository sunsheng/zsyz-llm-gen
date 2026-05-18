<template>
  <div class="page-container">
    <PageHeader title="产业新闻热点采集" subtitle="实时采集与汇总产业新闻热点">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新数据</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索新闻标题"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="news-list">
      <el-card v-for="news in filteredData" :key="news.id" shadow="hover" class="news-card">
        <div class="news-card__header">
          <el-tag
            :type="
              news.domain === 'policy'
                ? 'danger'
                : news.domain === 'industry'
                  ? 'warning'
                  : news.domain === 'technology'
                    ? 'success'
                    : 'info'
            "
            size="small"
          >
            {{
              news.domain === 'policy'
                ? '政策动态'
                : news.domain === 'industry'
                  ? '行业前沿'
                  : news.domain === 'technology'
                    ? '技术突破'
                    : '市场变化'
            }}
          </el-tag>
          <span class="news-card__source">{{ news.source }}</span>
          <span class="news-card__date">{{ news.publishDate }}</span>
        </div>
        <h4 class="news-card__title">{{ news.title }}</h4>
        <p class="news-card__summary">{{ news.summary }}</p>
        <div class="news-card__footer">
          <a
            v-if="news.url"
            :href="news.url"
            target="_blank"
            rel="noopener noreferrer"
            class="news-card__link"
            >查看详情</a
          >
          <el-link v-else type="primary" underline="never">查看详情</el-link>
        </div>
      </el-card>
    </div>

    <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const kpiCards = [
  {
    key: 'today',
    label: '今日采集',
    value: 42,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+8',
    icon: 'Document',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'hotspot',
    label: '热点事件',
    value: 12,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+3',
    icon: 'Star',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'source',
    label: '采集源',
    value: 28,
    unit: '个',
    trend: 'flat' as const,
    trendValue: '',
    icon: 'Connection',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'weekly',
    label: '本周累计',
    value: 286,
    unit: '条',
    trend: 'up' as const,
    trendValue: '+15%',
    icon: 'DataLine',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
]

const filterFields = [
  {
    key: 'domain',
    label: '领域',
    type: 'select' as const,
    options: [
      { label: '政策动态', value: 'policy' },
      { label: '行业前沿', value: 'industry' },
      { label: '技术突破', value: 'technology' },
      { label: '市场变化', value: 'market' },
    ],
  },
]

const allData = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: [
      '国务院推动制造业数字化转型走深走实，发布标准体系建设指南',
      '新能源汽车全球销量突破2000万辆，市场渗透率超25%',
      '"祖冲之三号"量子计算原型机刷新全球超导量子计算优越性纪录',
      '2025年全球锂电池出货量预计突破2.8TWh，动力电池占比超70%',
      '工信部等八部门印发"人工智能+制造"专项行动方案',
      '生物医药产业迎来出海交易热潮，创新药市场快速增长',
      '本源量子"悟空芯"搭载72量子比特实现商业化应用',
      '全球半导体市场预计增长14%达7170亿美元，AI驱动需求强劲',
      '电子信息制造业2025-2026年稳增长行动方案正式发布',
      '碳纤维国产化率突破80%，大飞机用碳纤维国产替代加速',
    ][i],
    summary: [
      '国务院在"十四五"规划系列发布会上指出，制造业是国家经济命脉所系，将坚持高端化、智能化、绿色化、融合化方向推动传统产业转型升级，编制发布制造业数字化转型标准体系建设指南。',
      '2025年全球新能源汽车销量预计达2000万辆左右，同比增长约20%，市场渗透率提升至25%以上，中国品牌在全球市场份额持续攀升。',
      '中国科学院研发的超导量子计算原型机"祖冲之三号"以封面论文形式发表于《物理评论快报》，构建了目前最高水准的超导量子计算机，刷新全球量子计算优越性纪录。',
      '2025年全球锂电池总出货量预计突破2.8TWh，产值逼近1800亿美元，动力电池依然占据主导地位，市场份额持续保持在70%以上，中国市场表现尤为突出。',
      '工业和信息化部等八部门联合印发专项行动方案，推动人工智能加速与制造业深度融合，加快制造业生产模式和经济形态变革，重塑全球竞争格局。',
      '中国生物医药产业迎来从"并跑"到"领跑"的关键转型期，创新药出海交易额创历史新高，从药品研发、准入到支付全链条生态正在重塑。',
      '本源量子发布"悟空芯"量子芯片，搭载72量子比特实现商业化应用，标志着中国在量子计算硬件领域跻身全球第一梯队。',
      '据Gartner预测，2025年全球半导体收入将增长14%达到7170亿美元，增长动力主要源于AI服务器、新能源汽车等领域对半导体的强劲需求。',
      '工信部正式发布电子信息制造业2025-2026年稳增长行动方案，聚焦集成电路、新型显示、智能终端等重点领域，提出一系列稳增长、促转型政策措施。',
      '碳纤维国产化率已从2019年的30%跃升至80%以上，光威复材等龙头企业推动大飞机用碳纤维国产替代，T1200级量产技术实现突破。',
    ][i],
    domain: (['policy', 'industry', 'technology', 'market'] as const)[i % 4],
    source: [
      '新华社',
      '经济日报',
      '科技日报',
      '中国工业报',
      '人民日报',
      '央视新闻',
      '工信微报',
      '中国证券报',
      '第一财经',
      '21世纪经济报道',
    ][i],
    publishDate: `2025-05-${String(10 + i).padStart(2, '0')}`,
    url: [
      'https://www.xinhuanet.com/tech/20251014/e179bcc3a2fb4419bb2e80ca0adac986/c.html',
      'https://www.docin.com/p-4968679420.html',
      'https://www.cas.cn/yw/202503/t20250304_5048593.shtml',
      'https://m.gepresearch.com/104/view-893639-1.html',
      'https://www.nda.gov.cn/sjj/zwgk/zcfb/0112/20260107214358696030895_pc.html',
      'https://baijiahao.baidu.com/s?id=1852285960424334019',
      'https://www.chinairn.com/news/20250512/163447430.shtml',
      'https://blog.11467.com/b9403945.htm',
      'https://finance.sina.com.cn/roll/2025-09-17/doc-infqtywq4817125.shtml',
      'https://www.vzkoo.com/read/20250808c923ff0acccd4013def1d05e.html',
    ][i],
  })),
)
const keyword = ref('')
const currentPage = ref(1)
const total = ref(10)

const filteredData = computed(() => {
  if (!keyword.value) return allData.value
  return allData.value.filter((d) => d.title.includes(keyword.value))
})

function handleSearch(kw: string) {
  keyword.value = kw
  currentPage.value = 1
}
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() {
  keyword.value = ''
}
function handlePageChange(page: number) {
  currentPage.value = page
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.news-card {
  &.el-card {
    border-radius: $radius-base;
  }
}
.news-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.news-card__source {
  margin-left: auto;
  font-size: 12px;
  color: $text-secondary;
}
.news-card__date {
  font-size: 12px;
  color: $text-secondary;
}
.news-card__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  cursor: pointer;
  &:hover {
    color: $color-primary;
  }
}
.news-card__summary {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: $text-secondary;
}
.news-card__footer {
  display: flex;
  justify-content: flex-end;
}
.news-card__link {
  font-size: 14px;
  color: $color-primary;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
