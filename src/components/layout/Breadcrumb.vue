<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        <el-icon :size="14"><HomeFilled /></el-icon>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
        <span v-if="item.isLast">{{ item.title }}</span>
        <router-link v-else :to="item.path">{{ item.title }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface BreadcrumbItem {
  title: string
  path: string
  isLast: boolean
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item, index) => ({
    title: item.meta.title as string,
    path: item.path,
    isLast: index === matched.length - 1,
  }))
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
}
</style>
