// 企业数据 Mock 工厂
import type { Enterprise, EnterpriseListItem, EnterpriseDetail } from '@/api/types/enterprise'

const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源', '节能环保', '数字创意', '现代服务业']
const tags = ['高新技术企业', '专精特新', '上市公司', '独角兽', '瞪羚企业', '科技型中小企业']
const cities = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '台州市']
const scales: Enterprise['scale'][] = ['large', 'medium', 'small', 'micro']
const statuses: Enterprise['status'][] = ['operating', 'revoked', 'moved', 'dissolved']
const qualifiers = ['ISO9001', 'ISO14001', 'CMMI5', 'IATF16949', '知识产权贯标', '两化融合贯标']

const companyNames = [
  '华创新材料科技有限公司', '东方精密制造股份有限公司', '博远生物医药集团有限公司',
  '天域半导体科技有限公司', '绿能新能源股份有限公司', '中科智联信息技术有限公司',
  '鼎盛环保科技有限公司', '创想数字技术有限公司', '恒达装备制造股份有限公司',
  '瑞丰新材料科技有限公司', '恒宇光电科技有限公司', '昌盛药业集团有限公司',
  '芯源集成电路有限公司', '亿能动力电池有限公司', '安泰环保设备有限公司',
  '智汇信息技术有限公司', '云帆数据科技有限公司', '铭远精密仪器有限公司',
  '盛达新材料有限公司', '宏图半导体有限公司', '远景智能科技有限公司',
  '立讯精密工业有限公司', '华大基因科技有限公司', '大疆创新科技有限公司',
  '宁德时代新能源有限公司', '比亚迪股份有限公司', '隆基绿能科技有限公司',
  '药明康德集团有限公司', '迈瑞医疗电子有限公司', '三一重工股份有限公司'
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

let idCounter = 0

function generateEnterprise(): Enterprise {
  idCounter++
  const scale = randomItem(scales)
  const revenueMap = { large: 50000 + Math.random() * 200000, medium: 5000 + Math.random() * 45000, small: 500 + Math.random() * 4500, micro: 50 + Math.random() * 450 }
  return {
    id: `ent-${idCounter}`,
    name: companyNames[(idCounter - 1) % companyNames.length],
    unifiedCode: `91330${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}${String(Math.floor(Math.random() * 10))}`,
    industry: randomItem(industries),
    industryCode: `C${Math.floor(Math.random() * 40 + 13)}`,
    registeredCapital: Math.floor(Math.random() * 50000 + 100),
    establishedDate: `${2005 + Math.floor(Math.random() * 18)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    legalPerson: ['张明', '李强', '王伟', '刘洋', '陈静', '赵磊', '黄海', '周波'][idCounter % 8],
    address: `浙江省${randomItem(cities)}${randomItem(['经济开发区', '高新技术区', '产业园区', '科技城'])}创新路${Math.floor(Math.random() * 200 + 1)}号`,
    businessScope: randomItem(industries) + '相关产品的研发、生产与销售',
    status: Math.random() > 0.1 ? 'operating' : randomItem(statuses.slice(1)),
    scale,
    tags: randomItems(tags, Math.floor(Math.random() * 3 + 1)),
    revenue: Math.floor(revenueMap[scale]),
    taxPaid: Math.floor(revenueMap[scale] * (0.05 + Math.random() * 0.1)),
    employeeCount: Math.floor(Math.random() * 5000 + (scale === 'large' ? 500 : scale === 'medium' ? 100 : 10)),
    province: '浙江省',
    city: randomItem(cities),
    district: randomItem(['西湖区', '滨江区', '余杭区', '萧山区', '江北区', '镇海区']),
    longitude: 118 + Math.random() * 4,
    latitude: 28 + Math.random() * 4,
    phone: `0571-${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
    website: `www.ent${idCounter}.com`,
    email: `contact@ent${idCounter}.com`,
    riskScore: Math.floor(Math.random() * 40 + 10),
    healthScore: Math.floor(Math.random() * 30 + 70),
    growthRate: Math.floor(Math.random() * 40 - 10),
    innovationScore: Math.floor(Math.random() * 40 + 60),
    qualificationList: randomItems(qualifiers, Math.floor(Math.random() * 3 + 1))
  }
}

export function getMockEnterpriseList(count = 20): EnterpriseListItem[] {
  return Array.from({ length: count }, () => {
    const ent = generateEnterprise()
    return {
      id: ent.id,
      name: ent.name,
      industry: ent.industry,
      scale: ent.scale,
      status: ent.status,
      tags: ent.tags,
      registeredCapital: ent.registeredCapital,
      revenue: ent.revenue,
      growthRate: ent.growthRate,
      city: ent.city,
      riskScore: ent.riskScore
    }
  })
}

export function getMockEnterpriseDetail(id: string): EnterpriseDetail {
  const ent = generateEnterprise()
  ent.id = id
  return {
    ...ent,
    subsidiaries: randomItems(companyNames, Math.floor(Math.random() * 3 + 1)),
    shareholders: randomItems(['国有资本', '民营资本', '外资', '混合所有制'], Math.floor(Math.random() * 2 + 1)),
    patents: Math.floor(Math.random() * 200 + 5),
    trademarks: Math.floor(Math.random() * 50 + 2),
    certifications: randomItems(qualifiers, Math.floor(Math.random() * 3 + 1))
  }
}

export function getMockEnterprise(id: string): Enterprise {
  const ent = generateEnterprise()
  ent.id = id
  return ent
}

export function getMockEnterpriseCount(): { total: number; operating: number; newThisMonth: number } {
  return { total: 1286, operating: 1158, newThisMonth: 42 }
}
