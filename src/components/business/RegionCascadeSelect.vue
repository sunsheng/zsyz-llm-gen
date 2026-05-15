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
    code: 'sichuan',
    name: '四川省',
    children: [
      {
        code: 'deyang',
        name: '德阳市',
        children: [
          { code: 'jingyang', name: '旌阳区' },
          { code: 'luojiang', name: '罗江区' },
          { code: 'zhongjiang', name: '中江县' },
          { code: 'guanghan', name: '广汉市' },
          { code: 'shifang', name: '什邡市' },
          { code: 'mianzhu', name: '绵竹市' },
        ],
      },
      {
        code: 'chengdu',
        name: '成都市',
        children: [
          { code: 'jinjiang', name: '锦江区' },
          { code: 'wuhou', name: '武侯区' },
          { code: 'gaoxin', name: '高新区' },
        ],
      },
      { code: 'mianyang', name: '绵阳市' },
      { code: 'yibin', name: '宜宾市' },
      { code: 'luzhou', name: '泸州市' },
    ],
  },
  {
    code: 'chongqing',
    name: '重庆市',
    children: [
      { code: 'yuzhong', name: '渝中区' },
      { code: 'jiangbei', name: '江北区' },
      { code: 'yubei', name: '渝北区' },
    ],
  },
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
  { code: 'shanghai', name: '上海市' },
]

function handleChange(val: string | string[] | null | undefined) {
  emit('update:modelValue', val ?? '')
}
</script>
