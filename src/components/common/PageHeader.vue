<template>
  <div class="page-header">
    <div class="page-header__left">
      <h2 v-if="title" class="page-header__title">{{ title }}</h2>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div class="page-header__actions">
      <slot name="actions"></slot>
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
  margin: 0;
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.page-header__subtitle {
  margin-top: 4px;
  font-size: 14px;
  color: $text-secondary;
}

.page-header__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
