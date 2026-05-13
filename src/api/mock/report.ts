// 报告模板 Mock 数据工厂

export interface MockReportTemplate {
  id: string
  name: string
  type: string
  description: string
  createdAt: string
  status: 'draft' | 'published'
}

export interface MockReportData {
  id: string
  title: string
  period: string
  generatedAt: string
  sections: { title: string; content: string }[]
}

export function getMockReportTemplates(): MockReportTemplate[] {
  return [
    { id: 'tpl-1', name: '产业运行月度报告', type: 'monthly', description: '每月产业运行数据汇总与分析', createdAt: '2025-01-01', status: 'published' },
    { id: 'tpl-2', name: '季度产业评价报告', type: 'quarterly', description: '季度产业综合评价与趋势预测', createdAt: '2025-01-01', status: 'published' },
    { id: 'tpl-3', name: '年度产业发展报告', type: 'annual', description: '年度产业发展总结与展望', createdAt: '2025-01-01', status: 'draft' },
    { id: 'tpl-4', name: '区域对标分析报告', type: 'benchmark', description: '与对标城市综合对比分析', createdAt: '2025-02-15', status: 'published' },
    { id: 'tpl-5', name: '产业链招商报告', type: 'invest', description: '产业链招商目标与策略分析', createdAt: '2025-03-01', status: 'published' }
  ]
}

export function getMockReportData(id: string): MockReportData {
  return {
    id,
    title: '2025年4月产业运行月度报告',
    period: '2025-04',
    generatedAt: '2025-05-10',
    sections: [
      { title: '一、产业运行总体情况', content: '本月产业运行总体平稳，主要经济指标保持增长态势...' },
      { title: '二、重点产业链分析', content: '高端装备制造产业链运行良好，营收同比增长8.5%...' },
      { title: '三、企业景气指数', content: '企业景气指数为128.5，较上月上升2.3个百分点...' },
      { title: '四、存在问题与建议', content: '部分中小企业面临融资难问题，建议加大金融扶持力度...' }
    ]
  }
}
