<template>
  <div class="search-filter-bar">
    <div class="search-filter-bar__search">
      <el-input
        v-model="keyword"
        :placeholder="searchPlaceholder"
        clearable
        :prefix-icon="Search"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      />
      <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
    </div>
    <div v-if="filters.length" class="search-filter-bar__filters">
      <template v-for="filter in filters" :key="filter.key">
        <el-select
          v-if="filter.type === 'select'"
          v-model="filterValues[filter.key]"
          :placeholder="filter.placeholder || `请选择${filter.label}`"
          clearable
          @change="handleFilterChange"
        >
          <el-option
            v-for="opt in (filter.options || [])"
            :key="(opt as any).value"
            :label="(opt as any).label"
            :value="(opt as any).value"
          />
        </el-select>
        <el-cascader
          v-else-if="filter.type === 'cascader'"
          v-model="filterValues[filter.key]"
          :options="(filter.options as any)"
          :placeholder="filter.placeholder || `请选择${filter.label}`"
          clearable
          @change="handleFilterChange"
        />
        <el-date-picker
          v-else-if="filter.type === 'date'"
          v-model="filterValues[filter.key]"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleFilterChange"
        />
      </template>
      <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

export interface FilterOption {
  label: string
  value: string | number
  [key: string]: unknown
}

export interface FilterField {
  key: string
  label: string
  type: 'select' | 'cascader' | 'date'
  placeholder?: string
  options?: FilterOption[]
}

const props = withDefaults(defineProps<{
  searchPlaceholder?: string
  filters?: FilterField[]
}>(), {
  searchPlaceholder: '请输入关键词搜索',
  filters: () => []
})

const emit = defineEmits<{
  search: [keyword: string]
  filter: [filters: Record<string, unknown>]
  reset: []
}>()

const keyword = ref('')
const filterValues = reactive<Record<string, any>>({})

function handleSearch() {
  emit('search', keyword.value)
}

function handleFilterChange() {
  emit('filter', { ...filterValues })
}

function handleReset() {
  keyword.value = ''
  Object.keys(filterValues).forEach(key => {
    filterValues[key] = undefined
  })
  emit('reset')
}
</script>

<style lang="scss" scoped>
.search-filter-bar {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
  margin-bottom: 16px;
}

.search-filter-bar__search {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  .el-input {
    max-width: 400px;
  }
}

.search-filter-bar__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
