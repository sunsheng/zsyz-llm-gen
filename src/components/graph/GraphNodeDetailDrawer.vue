<template>
  <el-drawer
    :model-value="props.visible"
    title="节点详情"
    direction="rtl"
    size="400px"
    :before-close="handleClose"
  >
    <template v-if="node">
      <div class="node-detail__header">
        <h3 class="node-detail__name">{{ node.name }}</h3>
        <el-tag v-if="node.category" size="small" type="primary">{{ node.category }}</el-tag>
      </div>

      <el-descriptions :column="1" border size="small" class="node-detail__info">
        <el-descriptions-item label="重要性指数">{{ node.importance || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联企业数">{{
          node.enterpriseCount || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="节点ID">{{ node.id }}</el-descriptions-item>
      </el-descriptions>

      <div class="node-detail__section">
        <h4>关联企业</h4>
        <el-empty v-if="!relatedEnterprises.length" description="暂无关联企业" :image-size="60" />
        <div v-else class="node-detail__enterprises">
          <div v-for="ent in relatedEnterprises" :key="ent" class="node-detail__ent-item">
            <el-icon><OfficeBuilding /></el-icon>
            <span>{{ ent }}</span>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { GraphNodeData } from '@/composables/useForceGraph'

const props = withDefaults(
  defineProps<{
    visible: boolean
    node: GraphNodeData | null
    relatedEnterprises?: string[]
  }>(),
  {
    relatedEnterprises: () => [],
  },
)

const emit = defineEmits<{
  'update:visible': [val: boolean]
}>()

function handleClose() {
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.node-detail__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
}

.node-detail__name {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.node-detail__info {
  margin-bottom: 20px;
}

.node-detail__section {
  h4 {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}

.node-detail__ent-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;
  color: $text-regular;
  border-bottom: 1px solid $border-color-lighter;
}
</style>
