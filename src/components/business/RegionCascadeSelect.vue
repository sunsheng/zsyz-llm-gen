<template>
  <el-cascader
    v-model="selected"
    :options="regionOptions"
    :props="{ value: 'code', label: 'name', children: 'children' }"
    :placeholder="placeholder"
    :clearable="true"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    level?: 'province' | 'city' | 'district'
    placeholder?: string
  }>(),
  {
    modelValue: '',
    level: 'city',
    placeholder: '请选择地区',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const selected = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val
  },
)

const regionOptions = [
  {
    code: 'zhejiang',
    name: '浙江省',
    children: [
      {
        code: 'hangzhou',
        name: '杭州市',
        children: [
          { code: 'xihu', name: '西湖区' },
          { code: 'binjiang', name: '滨江区' },
          { code: 'yuhang', name: '余杭区' },
        ],
      },
      {
        code: 'ningbo',
        name: '宁波市',
        children: [
          { code: 'haishu', name: '海曙区' },
          { code: 'jiangbei', name: '江北区' },
          { code: 'beilun', name: '北仑区' },
        ],
      },
      {
        code: 'jiaxing',
        name: '嘉兴市',
        children: [
          { code: 'nanhu', name: '南湖区' },
          { code: 'xiuzhou', name: '秀洲区' },
          { code: 'tongxiang', name: '桐乡市' },
          { code: 'haiNing', name: '海宁市' },
          { code: 'pinghu', name: '平湖市' },
        ],
      },
      { code: 'huzhou', name: '湖州市' },
      { code: 'shaoxing', name: '绍兴市' },
    ],
  },
  {
    code: 'jiangsu',
    name: '江苏省',
    children: [
      { code: 'nanjing', name: '南京市' },
      { code: 'suzhou', name: '苏州市' },
      { code: 'wuxi', name: '无锡市' },
    ],
  },
  { code: 'shanghai', name: '上海市' },
  {
    code: 'guangdong',
    name: '广东省',
    children: [
      { code: 'guangzhou', name: '广州市' },
      { code: 'shenzhen', name: '深圳市' },
      { code: 'dongguan', name: '东莞市' },
    ],
  },
  { code: 'beijing', name: '北京市' },
]

function handleChange(val: string | string[] | null | undefined) {
  emit('update:modelValue', val ?? '')
}
</script>
