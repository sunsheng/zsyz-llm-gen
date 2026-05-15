<template>
  <el-cascader
    v-model="selected"
    :options="chainOptions"
    :props="{ value: 'code', label: 'name', children: 'children' }"
    :placeholder="placeholder"
    :clearable="true"
    :multiple="multiple"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    multiple?: boolean
    placeholder?: string
  }>(),
  {
    modelValue: '',
    multiple: false,
    placeholder: '请选择产业链',
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

const chainOptions = [
  {
    code: 'high-end-equipment',
    name: '高端装备制造',
    children: [{ code: 'he-auto', name: '汽车汽配' }],
  },
  {
    code: 'frontier-material',
    name: '前沿材料',
    children: [
      { code: 'fm-glass-fiber', name: '玻纤及复合材料' },
      { code: 'fm-new-energy', name: '新能源材料' },
      { code: 'fm-carbon-fiber', name: '碳纤维及复合材料' },
    ],
  },
  {
    code: 'digital-economy',
    name: '数字经济',
    children: [
      { code: 'de-5g', name: '5G' },
      { code: 'de-ic', name: '集成电路' },
      { code: 'de-computing', name: '先进计算' },
      { code: 'de-security', name: '智能安防' },
    ],
  },
  {
    code: 'fashion',
    name: '时尚产业',
    children: [],
  },
  {
    code: 'modern-service',
    name: '现代服务业',
    children: [],
  },
]

function handleChange(val: string | string[] | null | undefined) {
  emit('update:modelValue', val ?? (props.multiple ? [] : ''))
}
</script>
