// 格式化工具
import dayjs from 'dayjs'

/** 格式化金额（万元） */
export function formatWan(value: number): string {
  if (value >= 10000) {
    return (value / 10000).toFixed(2) + '亿'
  }
  return value.toLocaleString() + '万'
}

/** 格式化金额（亿元） */
export function formatYi(value: number): string {
  return value.toFixed(2) + '亿'
}

/** 格式化百分比 */
export function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + '%'
}

/** 格式化数字（千分位） */
export function formatNumber(value: number): string {
  return value.toLocaleString()
}

/** 格式化日期 */
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

/** 格式化日期时间 */
export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
