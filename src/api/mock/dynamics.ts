// 产业动态 Mock 数据工厂
import type {
  DynamicsNews,
  NewsDomain,
  PolicySummary,
  HotspotEvent,
  DynamicsPolicy,
  PolicyMonitor,
} from '@/api/types/dynamics'

const newsTitles: Record<string, string[]> = {
  policy: [
    '国务院推动制造业数字化转型走深走实，发布标准体系建设指南',
    '工信部等八部门印发"人工智能+制造"专项行动方案',
    '电子信息制造业2025-2026年稳增长行动方案正式发布',
    '制造业领域超80项惠企政策形成多层次扶持格局',
    '工信部发布两化融合2025年工作要点，加速工业互联网发展',
  ],
  industry: [
    '新能源汽车全球销量突破2000万辆，市场渗透率超25%',
    '生物医药产业迎来出海交易热潮，创新药市场快速增长',
    '碳纤维国产化率突破80%，大飞机用碳纤维国产替代加速',
    '航空航天产业集群建设加速，低空经济成新增长极',
    '京津冀协同布局六大产业链，生物医药与新能源领跑',
  ],
  technology: [
    '"祖冲之三号"量子计算原型机刷新全球超导量子计算优越性纪录',
    '本源量子"悟空芯"搭载72量子比特实现商业化应用',
    '国产T1200级碳纤维实现量产，性能指标达国际先进水平',
    '纳米双光子工厂制备出保真度99.4%的光子器件',
    '高端工业母机核心技术攻关取得阶段性突破',
  ],
  market: [
    '2025年全球锂电池出货量预计突破2.8TWh，动力电池占比超70%',
    '全球半导体市场预计增长14%达7170亿美元，AI驱动需求强劲',
    '碳纤维下游应用年复合增长率超16.5%，国产替代加速推进',
    '锂电行业产能出清与转型调整，头部企业巩固市场地位',
    '智能制造装备市场需求持续增长，产业规模突破3万亿元',
  ],
}

const newsSummaries: Record<string, string[]> = {
  policy: [
    '国务院在"十四五"规划系列发布会上指出，制造业是国家经济命脉所系，将坚持高端化、智能化、绿色化、融合化方向推动传统产业转型升级，编制发布制造业数字化转型标准体系建设指南。',
    '工业和信息化部等八部门联合印发《"人工智能+制造"专项行动方案》，推动人工智能加速与实体经济深度融合，加快制造业生产模式和经济形态变革，重塑全球竞争格局。',
    '工信部正式发布电子信息制造业2025-2026年稳增长行动方案，聚焦集成电路、新型显示、智能终端等重点领域，提出一系列稳增长、促转型政策措施。',
    '全国工业和信息化领域惠企政策汇编显示，2025年制造业政策支持体系已形成国家级、省级及地市级共88项多层次、全链条扶持格局，助力产业高质量发展。',
    '工信部发布信息化和工业化融合2025年工作要点，提出迭代优化两化融合标准体系，聚焦工业互联网、数字化供应链、设备数字化管理等关键领域。',
  ],
  industry: [
    '2025年全球新能源汽车销量预计达2000万辆左右，同比增长约20%，市场渗透率提升至25%以上，中国品牌在全球市场份额持续攀升。',
    '中国生物医药产业迎来从"并跑"到"领跑"的关键转型期，创新药出海交易额创历史新高，从药品研发、准入到支付全链条生态正在重塑。',
    '碳纤维国产化率已从2019年的30%跃升至80%以上，光威复材等龙头企业推动大飞机用碳纤维国产替代，T1200级量产技术实现突破。',
    '成都获批国家航空航天先进制造业集群，正加快构建现代化航空航天产业集群，全力打造西部低空经济中心，综合实力稳居全国前三。',
    '京津冀协同布局氢能、生物医药、网络安全、高端工业母机、新能源和智能网联汽车、机器人六大产业链，推动创新链与产业链深度融合。',
  ],
  technology: [
    '中国科学院研发的超导量子计算原型机"祖冲之三号"刷新全球量子计算优越性纪录，以封面论文形式发表于《物理评论快报》，审稿人评价其构建了目前最高水准的超导量子计算机。',
    '本源量子发布"悟空芯"量子芯片，搭载72量子比特实现商业化应用，标志着中国在量子计算硬件领域跻身全球第一梯队，"一带一路"沿线合作加速推进。',
    '国产T1200级碳纤维实现量产，性能指标达到国际先进水平，中国化学工业协会预测2025-2030年碳纤维下游应用年复合增长率将超16.5%。',
    '我国科研团队打造出"纳米双光子工厂"，制备出保真度达99.4%的光子器件，为量子通信和量子计算提供关键硬件支撑。',
    '工信部推动高端工业母机核心技术攻关取得阶段性突破，国产五轴联动数控机床精度和稳定性显著提升，重点领域国产化替代加速推进。',
  ],
  market: [
    '2025年全球锂电池总出货量预计突破2.8TWh，产值逼近1800亿美元，动力电池依然占据主导地位，市场份额持续保持在70%以上，中国市场表现尤为突出。',
    '据Gartner预测，2025年全球半导体收入将增长14%达到7170亿美元，增长动力主要源于AI服务器、新能源汽车等领域对半导体的强劲需求，存储芯片市场复苏明显。',
    '碳纤维下游应用年复合增长率超16.5%，国产化率已跃升至80%以上，从航天到风电的多场景应用推动碳纤维工艺突围，2025-2030年市场前景广阔。',
    '锂电行业处于产能出清与转型调整期，头部企业通过技术迭代和资源整合巩固市场地位，具备产能全球化布局、多元化产品结构的企业更具竞争优势。',
    '智能制造装备市场需求持续增长，AI技术从辅助工具转变为制造系统核心，数字孪生从概念验证走向规模化应用，2025年产业规模有望突破3万亿元。',
  ],
}

const newsUrls: Record<string, string[]> = {
  policy: [
    'https://www.xinhuanet.com/tech/20251014/e179bcc3a2fb4419bb2e80ca0adac986/c.html',
    'https://www.nda.gov.cn/sjj/zwgk/zcfb/0112/20260107214358696030895_pc.html',
    'https://finance.sina.com.cn/roll/2025-09-17/doc-infqtywq4817125.shtml',
    'https://www.vzkoo.com/read/2025052238a3967c0ef3fa40e01a8fc7.html',
    'https://www.miit.gov.cn/jgsj/xxjsfzs/gzdt/art/2025/art_c195b1b6c1f343e392ee83bf960af9f6.html',
  ],
  industry: [
    'https://www.docin.com/p-4968679420.html',
    'https://baijiahao.baidu.com/s?id=1852285960424334019',
    'https://www.vzkoo.com/read/20250808c923ff0acccd4013def1d05e.html',
    'https://www.chengdu.gov.cn/cdsrmzf/c174133/2026-02/24/content_4348a8cda3734ac3a7ea05bedb932ad7.shtml',
    'https://baijiahao.baidu.com/s?id=1838235020524062543',
  ],
  technology: [
    'https://www.cas.cn/yw/202503/t20250304_5048593.shtml',
    'https://www.chinairn.com/news/20250512/163447430.shtml',
    'https://www.ccia.xin/guonazixun/3317.html',
    'https://news.cctv.cn/2025/09/21/ARTIkHv6E0NWwHQBRmgIG4wo250921.shtml',
    'https://www.miit.gov.cn/xwfb/bldhd/art/2026/art_4ba01aa6d2f54ced8ba3490ea4fb52c4.html',
  ],
  market: [
    'https://m.gepresearch.com/104/view-893639-1.html',
    'https://blog.11467.com/b9403945.htm',
    'https://zhuanlan.zhihu.com/p/1972340373113278631',
    'https://www.sohu.com/a/955629788_121956424',
    'https://www.chinairn.com/hyzx/20260409/181553195.shtml',
  ],
}

const newsSources = [
  '新华社',
  '经济日报',
  '科技日报',
  '中国工业报',
  '中国证券报',
  '人民日报',
  '央视新闻',
  '工信微报',
  '第一财经',
  '21世纪经济报道',
]

export function getMockNewsList(count = 10): DynamicsNews[] {
  const domains = Object.keys(newsTitles) as Array<keyof typeof newsTitles>
  return Array.from({ length: count }, (_, i) => {
    const domain = domains[i % domains.length] as NewsDomain
    const titles = newsTitles[domain]
    const summaries = newsSummaries[domain]
    const urls = newsUrls[domain]
    return {
      id: i + 1,
      title: titles[i % titles.length],
      summary: summaries[i % summaries.length],
      domain,
      source: newsSources[i % newsSources.length],
      publishDate: `2025-05-${String(10 + i).padStart(2, '0')}`,
      url: urls[i % urls.length],
    }
  })
}

export function getMockPolicySummaries(): PolicySummary[] {
  return [
    {
      id: 1,
      title: '"人工智能+制造"专项行动方案',
      status: '申报中',
      subsidyAmount: '最高500万元',
      conditions: '制造业企业上年度营收超1亿元，AI应用投入占比不低于3%',
      deadline: '2025-08-31',
    },
    {
      id: 2,
      title: '中小企业数字化转型补贴政策',
      status: '申报中',
      subsidyAmount: '最高100万元',
      conditions: '注册地在本区，上年度营收不低于500万元，开展数字化改造项目',
      deadline: '2025-09-15',
    },
    {
      id: 3,
      title: '高层次人才引进奖励政策',
      status: '即将截止',
      subsidyAmount: '最高200万元',
      conditions: '具有博士学历或高级职称，签订3年以上劳动合同',
      deadline: '2025-06-30',
    },
    {
      id: 4,
      title: '绿色低碳产业发展专项资金',
      status: '申报中',
      subsidyAmount: '最高300万元',
      conditions: '通过环评验收，碳排放同比下降10%以上，属于绿色制造体系企业',
      deadline: '2025-10-31',
    },
  ]
}

export function getMockHotspotEvents(): HotspotEvent[] {
  return [
    {
      id: 1,
      title: '"祖冲之三号"量子计算原型机刷新世界纪录',
      date: '2025-03-03',
      type: 'major',
      description:
        '中国科学院研发的超导量子计算原型机"祖冲之三号"以封面论文形式发表于《物理评论快报》，构建了目前最高水准的超导量子计算机，刷新全球量子计算优越性纪录。',
      relatedNews: [
        '量子计算优越性新纪录解读',
        '超导量子芯片技术路线对比',
        '量子计算产业化应用前景',
      ],
    },
    {
      id: 2,
      title: '工信部等八部门印发"人工智能+制造"专项行动方案',
      date: '2025-03-10',
      type: 'important',
      description:
        '工业和信息化部等八部门联合印发专项行动方案，推动人工智能加速与制造业深度融合，加快制造业生产模式和经济形态变革，重塑全球产业竞争格局。',
      relatedNews: ['AI+制造政策细则解读', '制造业数字化转型申报指南', '智能制造示范工厂申报启动'],
    },
    {
      id: 3,
      title: '碳纤维国产化率突破80%，大飞机碳纤维国产替代加速',
      date: '2025-04-15',
      type: 'normal',
      description:
        '国产碳纤维国产化率已从2019年的30%跃升至80%以上，T1200级碳纤维实现量产，光威复材等龙头企业推动大飞机用碳纤维国产替代进程。',
      relatedNews: ['碳纤维产业化应用前景', '大飞机材料国产化进展', '新材料产业投资趋势'],
    },
    {
      id: 4,
      title: '全球锂电池出货量突破2.8TWh，中国市场份额持续领先',
      date: '2025-05-08',
      type: 'important',
      description:
        '2025年全球锂电池总出货量预计突破2.8TWh，产值逼近1800亿美元，动力电池市场份额保持在70%以上，中国企业占据全球动力电池装机量前六中的四席。',
      relatedNews: ['锂电池产业链全景分析', '固态电池技术路线对比', '锂电行业产能出清趋势'],
    },
  ]
}

export function getMockPolicyList(count = 10): DynamicsPolicy[] {
  const policyTitles = [
    '推动制造业数字化转型走深走实的若干意见',
    '电子信息制造业2025-2026年稳增长行动方案',
    '"人工智能+制造"专项行动方案',
    '新能源汽车产业发展规划（2025-2030年）',
    '关于促进生物医药产业创新发展的若干措施',
    '新材料产业发展专项行动方案',
    '高端装备制造业转型升级指导意见',
    '绿色低碳产业发展扶持政策',
    '数字经济发展实施方案',
    '集成电路产业促进条例',
  ]
  const policyUrls = [
    'https://www.xinhuanet.com/tech/20251014/e179bcc3a2fb4419bb2e80ca0adac986/c.html',
    'https://finance.sina.com.cn/roll/2025-09-17/doc-infqtywq4817125.shtml',
    'https://www.nda.gov.cn/sjj/zwgk/zcfb/0112/20260107214358696030895_pc.html',
    'https://www.docin.com/p-4968679420.html',
    'https://baijiahao.baidu.com/s?id=1852285960424334019',
    'https://www.ccia.xin/guonazixun/3317.html',
    'https://www.miit.gov.cn/xwfb/bldhd/art/2026/art_4ba01aa6d2f54ced8ba3490ea4fb52c4.html',
    'https://www.vzkoo.com/read/2025052238a3967c0ef3fa40e01a8fc7.html',
    'https://www.miit.gov.cn/jgsj/xxjsfzs/gzdt/art/2025/art_c195b1b6c1f343e392ee83bf960af9f6.html',
    'https://www.chinabgao.com/info/1276759.html',
  ]
  const departments = ['国务院', '工信部', '发改委', '科技部']
  const policyTypes: DynamicsPolicy['policyType'][] = [
    'industry-plan',
    'industry-support',
    'talent',
    'housing',
  ]
  return Array.from({ length: count }, (_, i) => ({
    title: policyTitles[i % policyTitles.length],
    department: departments[i % departments.length],
    level: (['national', 'municipal'] as const)[i % 2],
    policyType: policyTypes[i % policyTypes.length],
    publishDate: `2025-0${3 + (i % 3)}-${String(10 + i).padStart(2, '0')}`,
    status: i % 5 === 0 ? ('废止' as const) : ('现行' as const),
    url: policyUrls[i % policyUrls.length],
  }))
}

export function getMockPolicyMonitorList(): PolicyMonitor[] {
  return [
    {
      policy: '"人工智能+制造"专项行动方案',
      progress: 92,
      benefitedEnterprises: 320,
      fundScale: '3.2亿',
      jobsCreated: 1860,
      keyNode: '项目验收',
      deadline: '2025-12-31',
      responsible: '工信局',
    },
    {
      policy: '电子信息制造业稳增长行动方案',
      progress: 78,
      benefitedEnterprises: 256,
      fundScale: '2.8亿',
      jobsCreated: 1520,
      keyNode: '资金拨付',
      deadline: '2025-09-30',
      responsible: '发改委',
    },
    {
      policy: '生物医药创新发展若干措施',
      progress: 65,
      benefitedEnterprises: 198,
      fundScale: '1.5亿',
      jobsCreated: 980,
      keyNode: '资金拨付',
      deadline: '2025-11-30',
      responsible: '科技局',
    },
    {
      policy: '新材料产业发展专项行动方案',
      progress: 45,
      benefitedEnterprises: 142,
      fundScale: '0.8亿',
      jobsCreated: 520,
      keyNode: '项目验收',
      deadline: '2025-08-31',
      responsible: '工信局',
    },
    {
      policy: '高端装备制造业转型升级意见',
      progress: 88,
      benefitedEnterprises: 285,
      fundScale: '2.6亿',
      jobsCreated: 1680,
      keyNode: '项目验收',
      deadline: '2025-10-31',
      responsible: '发改委',
    },
    {
      policy: '绿色低碳产业发展扶持政策',
      progress: 55,
      benefitedEnterprises: 85,
      fundScale: '4.7亿',
      jobsCreated: 2000,
      keyNode: '资金拨付',
      deadline: '2025-12-31',
      responsible: '科技局',
    },
  ]
}
