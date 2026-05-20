// 企业数据 Mock 工厂
import type { Enterprise, EnterpriseListItem, EnterpriseDetail } from '@/api/types/enterprise'
import { companyNames, industries } from './shared-data'

const tags = ['高新技术企业', '专精特新', '上市公司', '独角兽', '瞪羚企业', '科技型中小企业']
const cities = ['德阳市', '成都市', '绵阳市', '宜宾市', '泸州市', '南充市', '达州市', '乐山市']
const scales: Enterprise['scale'][] = ['large', 'medium', 'small', 'micro']
const statuses: Enterprise['status'][] = ['operating', 'revoked', 'moved', 'dissolved']
const qualifiers = ['ISO9001', 'ISO14001', 'CMMI5', 'IATF16949', '知识产权贯标', '两化融合贯标']

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
  const revenueMap = {
    large: 50000 + Math.random() * 200000,
    medium: 5000 + Math.random() * 45000,
    small: 500 + Math.random() * 4500,
    micro: 50 + Math.random() * 450,
  }
  return {
    id: `ent-${idCounter}`,
    name: companyNames[(idCounter - 1) % companyNames.length],
    unifiedCode: `915106${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}${String(Math.floor(Math.random() * 10))}`,
    industry: randomItem(industries),
    industryCode: `C${Math.floor(Math.random() * 40 + 13)}`,
    registeredCapital: Math.floor(Math.random() * 50000 + 100),
    establishedDate: `${2005 + Math.floor(Math.random() * 18)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
    legalPerson: ['张明', '李强', '王伟', '刘洋', '陈静', '赵磊', '黄海', '周波'][idCounter % 8],
    address: `四川省${randomItem(cities)}${randomItem(['凯州新城产业园', '高新技术区', '经济开发区', '科技城'])}创新路${Math.floor(Math.random() * 200 + 1)}号`,
    businessScope: randomItem(industries) + '相关产品的研发、生产与销售',
    status: Math.random() > 0.1 ? 'operating' : randomItem(statuses.slice(1)),
    scale,
    tags: randomItems(tags, Math.floor(Math.random() * 3 + 1)),
    revenue: Math.floor(revenueMap[scale]),
    taxPaid: Math.floor(revenueMap[scale] * (0.05 + Math.random() * 0.1)),
    employeeCount: Math.floor(
      Math.random() * 5000 + (scale === 'large' ? 500 : scale === 'medium' ? 100 : 10),
    ),
    province: '四川省',
    city: randomItem(cities),
    district: randomItem(['旌阳区', '罗江区', '中江县', '广汉市', '什邡市', '绵竹市']),
    longitude: 104 + Math.random() * 1.5,
    latitude: 30.5 + Math.random() * 1.5,
    phone: `0838-${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
    website: `www.ent${idCounter}.com`,
    email: `contact@ent${idCounter}.com`,
    riskScore: Math.floor(Math.random() * 40 + 10),
    healthScore: Math.floor(Math.random() * 30 + 70),
    growthRate: Math.floor(Math.random() * 40 - 10),
    innovationScore: Math.floor(Math.random() * 40 + 60),
    qualificationList: randomItems(qualifiers, Math.floor(Math.random() * 3 + 1)),
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
      riskScore: ent.riskScore,
    }
  })
}

export function getMockEnterpriseDetail(id: string): EnterpriseDetail {
  const ent = generateEnterprise()
  ent.id = id
  return {
    ...ent,
    subsidiaries: randomItems(companyNames, Math.floor(Math.random() * 3 + 1)),
    shareholders: randomItems(
      ['国有资本', '民营资本', '外资', '混合所有制'],
      Math.floor(Math.random() * 2 + 1),
    ),
    patents: Math.floor(Math.random() * 200 + 5),
    trademarks: Math.floor(Math.random() * 50 + 2),
    certifications: randomItems(qualifiers, Math.floor(Math.random() * 3 + 1)),
  }
}

export function getMockEnterprise(id: string): Enterprise {
  const ent = generateEnterprise()
  ent.id = id
  return ent
}

export function getMockEnterpriseCount(): {
  total: number
  operating: number
  newThisMonth: number
} {
  return { total: 1286, operating: 1158, newThisMonth: 42 }
}
