<template>
  <div class="page-header">
    <div class="page-header__left">
      <h2 v-if="title" class="page-header__title">{{ title }}</h2>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-header__title {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0;
}

.page-header__subtitle {
  font-size: 14px;
  color: $text-secondary;
  margin-top: 4px;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
