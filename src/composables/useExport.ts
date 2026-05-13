// 导出功能 composable
import { ElMessage } from 'element-plus'

export function useExport() {
  async function exportToExcel(fileName: string) {
    // 占位实现
    ElMessage.info(`导出 ${fileName}.xlsx 功能开发中`)
  }

  async function exportToPDF(fileName: string) {
    ElMessage.info(`导出 ${fileName}.pdf 功能开发中`)
  }

  async function exportToImage(fileName: string) {
    ElMessage.info(`导出 ${fileName}.png 功能开发中`)
  }

  return { exportToExcel, exportToPDF, exportToImage }
}
