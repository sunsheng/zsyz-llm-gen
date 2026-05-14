<template>
  <div class="page-container">
    <PageHeader title="产业活动" subtitle="产业峰会、展会、论坛等活动">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索活动名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="event-grid">
      <el-card v-for="event in filteredData" :key="event.id" shadow="hover" class="event-card">
        <div class="event-card__badge" :class="`event-card__badge--${event.status}`">
          {{
            event.status === 'upcoming'
              ? '即将开始'
              : event.status === 'ongoing'
                ? '进行中'
                : '已结束'
          }}
        </div>
        <h4 class="event-card__title">{{ event.name }}</h4>
        <div class="event-card__info">
          <div class="event-card__row">
            <span class="event-card__label">时间</span>
            <span>{{ event.date }}</span>
          </div>
          <div class="event-card__row">
            <span class="event-card__label">地点</span>
            <span>{{ event.location }}</span>
          </div>
          <div class="event-card__row">
            <span class="event-card__label">规模</span>
            <span>{{ event.scale }}人</span>
          </div>
          <div class="event-card__row">
            <span class="event-card__label">行业</span>
            <span>{{ event.industry }}</span>
          </div>
        </div>
        <p class="event-card__desc">{{ event.desc }}</p>
        <div class="event-card__footer">
          <el-tag size="small" effect="plain">{{ event.type }}</el-tag>
          <el-link type="primary" :underline="false">查看详情</el-link>
        </div>
      </el-card>
    </div>

    <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const filterFields = [
  {
    key: 'status',
    label: '活动状态',
    type: 'select' as const,
    options: [
      { label: '即将开始', value: 'upcoming' },
      { label: '进行中', value: 'ongoing' },
      { label: '已结束', value: 'ended' },
    ],
  },
  {
    key: 'type',
    label: '活动类型',
    type: 'select' as const,
    options: [
      { label: '峰会', value: 'summit' },
      { label: '展会', value: 'exhibition' },
      { label: '论坛', value: 'forum' },
    ],
  },
]

const allData = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const total = ref(0)

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.name.includes(keyword.value))
  }
  return data
})

onMounted(() => {
  const events = [
    {
      name: '长三角高端装备制造产业峰会',
      date: '2025-06-15',
      location: '杭州国际博览中心',
      scale: 800,
      industry: '高端装备制造',
      type: '峰会',
      status: 'upcoming',
      desc: '聚焦高端装备制造前沿技术，探讨产业升级路径',
    },
    {
      name: '新材料创新应用展览会',
      date: '2025-05-20',
      location: '宁波国际会展中心',
      scale: 1200,
      industry: '新材料',
      type: '展会',
      status: 'ongoing',
      desc: '展示新材料领域最新研究成果和产业应用',
    },
    {
      name: '生物医药产业发展论坛',
      date: '2025-05-10',
      location: '杭州洲际酒店',
      scale: 500,
      industry: '生物医药',
      type: '论坛',
      status: 'ended',
      desc: '深入探讨生物医药产业创新发展趋势',
    },
    {
      name: '半导体产业技术大会',
      date: '2025-06-22',
      location: '上海浦东会展中心',
      scale: 1000,
      industry: '电子信息',
      type: '峰会',
      status: 'upcoming',
      desc: '聚焦半导体核心技术突破与产业生态建设',
    },
    {
      name: '新能源产业投资洽谈会',
      date: '2025-06-08',
      location: '嘉兴科技城',
      scale: 400,
      industry: '新能源',
      type: '论坛',
      status: 'upcoming',
      desc: '新能源项目招商与投资对接',
    },
    {
      name: '数字经济创新应用大赛',
      date: '2025-05-18',
      location: '杭州云栖小镇',
      scale: 600,
      industry: '数字创意',
      type: '展会',
      status: 'ongoing',
      desc: '推动数字技术与实体经济深度融合',
    },
    {
      name: '节能环保技术交流会',
      date: '2025-04-28',
      location: '绍兴国际酒店',
      scale: 300,
      industry: '节能环保',
      type: '论坛',
      status: 'ended',
      desc: '交流环保新技术新工艺，促进绿色发展',
    },
    {
      name: '智能制造装备博览会',
      date: '2025-07-05',
      location: '温州国际会展中心',
      scale: 900,
      industry: '高端装备制造',
      type: '展会',
      status: 'upcoming',
      desc: '展示智能制造装备最新产品与解决方案',
    },
  ]

  allData.value = events.map((e, i) => ({ id: `event-${i + 1}`, ...e }))
  total.value = allData.value.length
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
.event-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 16px;
}
.event-card {
  position: relative;
  &.el-card {
    border-radius: $radius-base;
  }
}
.event-card__badge {
  display: inline-block;
  padding: 2px 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 10px;
}
.event-card__badge--upcoming {
  color: #1889e8;
  background: #ecf5ff;
}
.event-card__badge--ongoing {
  color: #67c23a;
  background: #edfaf0;
}
.event-card__badge--ended {
  color: #909399;
  background: #f5f7fa;
}
.event-card__title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.event-card__info {
  margin-bottom: 10px;
}
.event-card__row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 3px 0;
  font-size: 13px;
  color: $text-regular;
}
.event-card__label {
  flex-shrink: 0;
  width: 40px;
  color: $text-secondary;
}
.event-card__desc {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.5;
  color: $text-secondary;
}
.event-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
