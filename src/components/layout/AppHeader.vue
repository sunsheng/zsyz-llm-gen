<template>
  <header class="app-header">
    <div class="app-header__left">
      <div class="app-header__logo" @click="router.push('/')">
        <div class="app-header__logo-icon">
          <el-icon :size="28"><DataAnalysis /></el-icon>
        </div>
        <span class="app-header__title">产业招商平台</span>
      </div>
      <el-icon class="app-header__collapse-btn" :size="20" @click="appStore.toggleSidebar">
        <component :is="appStore.sidebarCollapsed ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <div class="app-header__right">
      <Breadcrumb />
      <div class="app-header__actions">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="app-header__user">
            <el-avatar :size="32" icon="UserFilled" />
            <span class="app-header__username">{{ userStore.userInfo.name || '管理员' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Breadcrumb from './Breadcrumb.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  padding: 0 20px;
  background: $bg-card;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

.app-header__left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.app-header__logo {
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
}

.app-header__logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #fff;
  background: $color-primary;
  border-radius: $radius-base;
}

.app-header__title {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  white-space: nowrap;
}

.app-header__collapse-btn {
  color: $text-regular;
  cursor: pointer;
  transition: color $transition-fast;
  &:hover {
    color: $color-primary;
  }
}

.app-header__right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.app-header__actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.app-header__icon-btn {
  color: $text-regular;
  cursor: pointer;
  transition: color $transition-fast;
  &:hover {
    color: $color-primary;
  }
}

.app-header__user {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}

.app-header__username {
  font-size: 14px;
  color: $text-primary;
}
</style>
