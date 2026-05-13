<template>
  <div class="main-layout">
    <AppHeader />
    <div class="main-layout__body">
      <AppSidebar />
      <main class="main-layout__content" :class="{ 'is-collapsed': appStore.sidebarCollapsed }">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.main-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-layout__body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding-top: $header-height;
}

.main-layout__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: $sidebar-width;
  transition: $transition-sidebar;
  min-width: 0;

  &.is-collapsed {
    margin-left: $sidebar-collapsed-width;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 300ms ease-out, transform 300ms ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
