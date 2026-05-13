<template>
  <header class="app-header">
    <div class="app-header__left">
      <div class="app-header__logo" @click="router.push('/')">
        <div class="app-header__logo-icon">
          <el-icon :size="28"><DataAnalysis /></el-icon>
        </div>
        <span class="app-header__title">产业招商平台</span>
      </div>
      <el-icon
        class="app-header__collapse-btn"
        :size="20"
        @click="appStore.toggleSidebar"
      >
        <component :is="appStore.sidebarCollapsed ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <div class="app-header__right">
      <Breadcrumb />
      <div class="app-header__actions">
        <el-tooltip content="全局搜索" placement="bottom">
          <el-icon :size="20" class="app-header__icon-btn"><Search /></el-icon>
        </el-tooltip>
        <el-tooltip content="消息通知" placement="bottom">
          <el-badge :value="3" :max="99">
            <el-icon :size="20" class="app-header__icon-btn"><Bell /></el-icon>
          </el-badge>
        </el-tooltip>
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
  left: 0;
  right: 0;
  height: $header-height;
  background: $bg-card;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.app-header__logo-icon {
  width: 36px;
  height: 36px;
  background: $color-primary;
  border-radius: $radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.app-header__title {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  white-space: nowrap;
}

.app-header__collapse-btn {
  cursor: pointer;
  color: $text-regular;
  transition: color $transition-fast;
  &:hover {
    color: $color-primary;
  }
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-header__icon-btn {
  cursor: pointer;
  color: $text-regular;
  transition: color $transition-fast;
  &:hover {
    color: $color-primary;
  }
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.app-header__username {
  font-size: 14px;
  color: $text-primary;
}
</style>
