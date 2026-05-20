<template>
  <div class="page-container">
    <PageHeader title="人才流动与共享机制" subtitle="科研人才流动与共享机制" />

    <div v-loading="loading" class="profile-layout">
      <!-- 左面板: 专家选择 + 信息卡 -->
      <div class="profile-left">
        <div class="content-card">
          <h4 class="panel-title">专家选择</h4>
          <el-select
            v-model="selectedId"
            placeholder="请选择专家"
            style="width: 100%"
            @change="handleSelect"
          >
            <el-option
              v-for="item in talentItems"
              :key="item.id"
              :label="item.expertName"
              :value="item.id"
            />
          </el-select>
        </div>

        <div v-if="currentExpert" class="content-card expert-card">
          <div class="expert-card__header">
            <div class="expert-card__avatar">
              {{ currentExpert.expertName.charAt(currentExpert.expertName.length - 1) }}
            </div>
            <div class="expert-card__info">
              <h3 class="expert-card__name">{{ currentExpert.expertName }}</h3>
              <p class="expert-card__field">{{ currentExpert.field }}</p>
            </div>
          </div>
          <div class="expert-card__detail">
            <div class="detail-row">
              <span class="detail-label">所属机构</span>
              <span class="detail-value">{{ currentExpert.institution }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">研究领域</span>
              <span class="detail-value">{{ currentExpert.field }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">合规状态</span>
              <el-tag :type="complianceTagType(currentExpert.complianceStatus) as any" size="small">
                {{ complianceLabel(currentExpert.complianceStatus) }}
              </el-tag>
            </div>
          </div>
        </div>

        <div v-else class="content-card empty-hint">
          <el-empty description="请选择一位专家查看详情" :image-size="80" />
        </div>
      </div>

      <!-- 右侧: 可服务时段 + 企业匹配 -->
      <div class="profile-right">
        <div v-if="currentExpert" class="content-card">
          <h4 class="panel-title">可服务时段</h4>
          <div class="availability-cards">
            <div
              v-for="opt in availabilityOptions"
              :key="opt.value"
              class="availability-card"
              :class="{ 'availability-card--active': selectedAvailability === opt.value }"
              @click="selectAvailability(opt.value)"
            >
              <el-icon :size="24" :color="opt.iconColor"><component :is="opt.icon" /></el-icon>
              <div class="availability-card__text">
                <span class="availability-card__label">{{ opt.label }}</span>
                <span class="availability-card__desc">{{ opt.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentExpert" class="content-card">
          <h4 class="panel-title">企业匹配</h4>
          <div class="match-list">
            <div v-for="(name, idx) in currentExpert.enterpriseMatch" :key="idx" class="match-item">
              <div class="match-item__name">
                <el-icon :size="16" color="#1889E8"><OfficeBuilding /></el-icon>
                <span>{{ name }}</span>
              </div>
              <div class="match-item__detail">
                <span class="match-item__field">领域: {{ currentExpert.field }}</span>
                <span class="match-item__reason">
                  匹配说明: {{ name }}在{{ currentExpert.field }}领域与{{
                    currentExpert.expertName
                  }}研究方向高度契合
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!currentExpert" class="content-card empty-hint">
          <el-empty description="选择专家后查看服务时段与企业匹配" :image-size="80" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { OfficeBuilding } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { fetchTalentShareItems } from '@/api/modules/investApi'
import type { TalentShareItem } from '@/api/types/invest'

const loading = ref(false)
const talentItems = ref<TalentShareItem[]>([])
const selectedId = ref('')
const selectedAvailability = ref('')

const currentExpert = computed(() => {
  if (!selectedId.value) return null
  return talentItems.value.find((i) => i.id === selectedId.value) || null
})

const availabilityOptions = [
  {
    value: 'monthly',
    label: '月度',
    desc: '每月可提供咨询服务',
    icon: 'Calendar',
    iconColor: '#1889E8',
  },
  {
    value: 'quarterly',
    label: '季度',
    desc: '每季度可提供咨询服务',
    icon: 'Date',
    iconColor: '#36CBCB',
  },
  {
    value: 'annual',
    label: '年度',
    desc: '每年可提供咨询服务',
    icon: 'Timer',
    iconColor: '#FBD437',
  },
]

function complianceTagType(
  status: string,
): '' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'approved') return 'success'
  if (status === 'pending') return 'warning'
  return 'danger'
}

function complianceLabel(status: string): string {
  if (status === 'approved') return '已批准'
  if (status === 'pending') return '审核中'
  return '受限'
}

function handleSelect() {
  // Expert info is computed from selectedId
  if (currentExpert.value) {
    selectedAvailability.value = currentExpert.value.availability
  }
}

function selectAvailability(value: string) {
  selectedAvailability.value = value
}

async function loadData() {
  loading.value = true
  try {
    talentItems.value = await fetchTalentShareItems()
    if (talentItems.value.length > 0) {
      selectedId.value = talentItems.value[0].id
      selectedAvailability.value = talentItems.value[0].availability
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
.profile-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
  align-items: start;
}
.panel-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.expert-card__header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}
.expert-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: #fff;
  background: $color-primary;
  border-radius: $radius-round;
}
.expert-card__info {
  flex: 1;
}
.expert-card__name {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}
.expert-card__field {
  margin: 0;
  font-size: 13px;
  color: $text-secondary;
}
.expert-card__detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.detail-row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}
.detail-label {
  flex-shrink: 0;
  width: 72px;
  color: $text-secondary;
}
.detail-value {
  color: $text-regular;
}
.empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.availability-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.availability-card {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px;
  text-align: center;
  cursor: pointer;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
  transition: all 200ms ease;

  &:hover {
    border-color: $color-primary;
  }

  &--active {
    background: #ecf5ff;
    border-color: $color-primary;
  }
}
.availability-card__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.availability-card__label {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.availability-card__desc {
  font-size: 12px;
  color: $text-secondary;
}
.match-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.match-item {
  padding: 14px;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
  transition: box-shadow 200ms ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}
.match-item__name {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.match-item__detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 22px;
  font-size: 13px;
}
.match-item__field {
  color: $text-secondary;
}
.match-item__reason {
  color: $text-regular;
}
</style>
