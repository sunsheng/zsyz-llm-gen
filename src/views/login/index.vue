<template>
  <div class="login-page">
    <!-- 左侧品牌面板 -->
    <div class="login-page__brand">
      <div class="login-page__brand-content">
        <div class="login-page__logo">
          <el-icon :size="32" color="#fff"><DataAnalysis /></el-icon>
        </div>
        <h1 class="login-page__title">产业招商平台</h1>
        <p class="login-page__subtitle">TERMINUS 特斯联 城市级物联网综合服务商</p>
        <div class="login-page__illustration">
          <!-- 简约等距风格装饰 SVG -->
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #1889e8; stop-opacity: 0.8" />
                <stop offset="100%" style="stop-color: #36cbcb; stop-opacity: 0.6" />
              </linearGradient>
            </defs>
            <!-- 城市/数据简笔插画 -->
            <rect x="80" y="120" width="50" height="100" rx="4" fill="url(#g1)" opacity="0.7" />
            <rect x="140" y="80" width="40" height="140" rx="4" fill="url(#g1)" opacity="0.85" />
            <rect x="190" y="100" width="60" height="120" rx="4" fill="url(#g1)" opacity="0.75" />
            <rect x="260" y="60" width="35" height="160" rx="4" fill="url(#g1)" opacity="0.9" />
            <rect x="305" y="110" width="45" height="110" rx="4" fill="url(#g1)" opacity="0.65" />
            <!-- 底线 -->
            <line
              x1="60"
              y1="220"
              x2="370"
              y2="220"
              stroke="#1889E8"
              stroke-width="2"
              opacity="0.3"
            />
            <!-- 数据点 -->
            <circle cx="105" cy="110" r="5" fill="#4ECB73" opacity="0.9" />
            <circle cx="160" cy="70" r="5" fill="#FBD437" opacity="0.9" />
            <circle cx="220" cy="90" r="5" fill="#F2637B" opacity="0.9" />
            <circle cx="277" cy="50" r="5" fill="#36CBCB" opacity="0.9" />
            <circle cx="327" cy="100" r="5" fill="#975FE5" opacity="0.9" />
            <!-- 连线 -->
            <line
              x1="105"
              y1="110"
              x2="160"
              y2="70"
              stroke="#4ECB73"
              stroke-width="1"
              opacity="0.4"
            />
            <line
              x1="160"
              y1="70"
              x2="220"
              y2="90"
              stroke="#FBD437"
              stroke-width="1"
              opacity="0.4"
            />
            <line
              x1="220"
              y1="90"
              x2="277"
              y2="50"
              stroke="#F2637B"
              stroke-width="1"
              opacity="0.4"
            />
            <line
              x1="277"
              y1="50"
              x2="327"
              y2="100"
              stroke="#36CBCB"
              stroke-width="1"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>
    </div>
    <!-- 右侧登录表单 -->
    <div class="login-page__form-wrapper">
      <div class="login-page__form-card">
        <h2 class="login-page__form-title">欢迎登录</h2>
        <p class="login-page__form-desc">产业招商平台管理系统</p>
        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          size="large"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <div class="login-page__options">
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码?</el-link>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="login-page__submit-btn"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-page__footer">
          <el-link type="info" :underline="false">用户协议</el-link>
          <span class="login-page__divider">|</span>
          <el-link type="info" :underline="false">隐私政策</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      // Mock 登录 - 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 600))
      userStore.login('mock-token-123456', {
        name: loginForm.username || '管理员',
        role: 'admin',
      })
      ElMessage.success('登录成功')
      router.push('/')
    } catch {
      ElMessage.error('登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login-page__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  background: linear-gradient(135deg, #e8f4fd 0%, #d0ebff 100%);
}

.login-page__brand-content {
  padding: 40px;
  text-align: center;
}

.login-page__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  background: $color-primary;
  border-radius: $radius-round;
}

.login-page__title {
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: $font-weight-bold;
  color: #1a1a1a;
}

.login-page__subtitle {
  margin-bottom: 40px;
  font-size: 14px;
  color: #909399;
}

.login-page__illustration {
  max-width: 400px;
  margin: 0 auto;

  svg {
    width: 100%;
    height: auto;
  }
}

.login-page__form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  background: $bg-card;
}

.login-page__form-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
}

.login-page__form-title {
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.login-page__form-desc {
  margin-bottom: 32px;
  font-size: 14px;
  color: $text-secondary;
}

.login-page__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.login-page__submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.login-page__footer {
  margin-top: 24px;
  text-align: center;

  .login-page__divider {
    margin: 0 8px;
    color: $border-color;
  }
}
</style>
