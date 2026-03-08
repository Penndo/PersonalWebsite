import type { UserInfo, Project, ProjectDetail, Article, Plugin } from '@/types';

export const mockUserInfo: UserInfo = {
  name: 'Yeatfish',
  profession: 'UI/UX/PM',
  age: 34,
  hobbies: ['篮球'],
  avatar: '',
  introduction: `这是一位拥有 10 年 UI/UX 设计工作经验与、2 年产品经理工作经验，兼具专业设计能力与产品思维的复合型牛马；
  他的复合色包括"用户同理心"、"商业判断力"、"高级的审美与品味"，助力产品在 AI 潮流中急速破浪。`,
};

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Hooinn',
    description: 'Hooinn（呼应）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务...',
    cover: '',
  },
  {
    id: '2',
    title: 'PUB',
    description: 'PUB（发行系统）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分发与管理服务...',
    cover: '',
  },
  {
    id: '3',
    title: '武侯服务',
    description: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    cover: '',
  },
  {
    id: '4',
    title: '数字堆场',
    description: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    cover: '',
  },
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: '设计系统构建指南',
    description: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
    cover: '',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: '用户体验设计方法论',
    description: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
    cover: '',
    date: '2024-02-20',
  },
  {
    id: '3',
    title: '产品思维与设计思维',
    description: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
    cover: '',
    date: '2024-03-10',
  },
  {
    id: '4',
    title: 'AI时代的设计趋势',
    description: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
    cover: '',
    date: '2024-04-05',
  },
  {
    id: '5',
    title: '移动端交互设计最佳实践',
    description: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
    cover: '',
    date: '2024-05-18',
  },
];

export const mockPlugins: Plugin[] = [
  {
    id: '1',
    title: 'Figma Design Token Generator',
    description: '自动从Figma设计文件生成设计令牌的工具插件...',
    cover: '',
  },
  {
    id: '2',
    title: 'Color Palette Creator',
    description: '快速创建和管理配色方案的Figma插件...',
    cover: '',
  },
  {
    id: '3',
    title: 'Icon Manager',
    description: '图标管理和导出工具，支持多种格式和尺寸...',
    cover: '',
  },
];

export const mockProjectDetail: Record<string, ProjectDetail> = {
  '1': {
    id: '1',
    title: 'Hooinn - 进出口物流UGC平台',
    summary: '一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务，连接全球物流从业者，打造专业的物流知识社区。',
    background: '随着全球贸易的快速发展，进出口物流行业面临着信息不对称、专业知识分散等问题。物流从业者需要一个专业的平台来分享经验、获取知识、建立人脉。Hooinn 应运而生，旨在解决这些痛点，为行业提供一个高质量的内容分享与交流平台。',
    designThinking: '设计过程中，我们深入研究了物流从业者的工作场景和需求。采用卡片式布局展示内容，方便用户快速浏览；设计了一套完整的标签系统，帮助用户精准找到所需内容；同时引入社交元素，促进用户之间的互动和知识共享。整体视觉风格采用专业、稳重的蓝色调，传达信任感和专业性。',
    images: [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200',
    ],
    tags: ['UI/UX设计', '移动端', 'Web端', 'B2B'],
    achievements: [
      '上线3个月内用户突破10万',
      '日活跃用户达到5000+',
      '用户平均停留时长超过15分钟',
      '获得行业最佳创新应用奖',
    ],
    client: 'Hooinn Inc.',
    year: '2023',
    role: 'UI/UX设计师 / 产品设计负责人',
    tools: ['Figma', 'Sketch', 'Principle', 'Zeplin'],
    link: 'https://hooinn.example.com',
  },
  '2': {
    id: '2',
    title: 'PUB - 内容发行管理系统',
    summary: '一款聚焦于进出口物流服务的内容分发与管理系统，为企业提供高效的内容管理、审核和分发能力。',
    background: '企业在内容运营过程中，面临着内容管理混乱、分发效率低下、审核流程不透明等问题。PUB 系统旨在为企业提供一站式的解决方案，从内容创作、审核到分发，实现全流程数字化管理。',
    designThinking: '设计上采用模块化思维，将复杂的功能拆分为清晰的功能模块。使用数据可视化技术，让运营数据一目了然。设计了一套灵活的工作流引擎，支持企业自定义审核流程。整体界面简洁高效，减少用户操作成本，提升工作效率。',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200',
    ],
    tags: ['后台系统', '数据可视化', '工作流', '企业级'],
    achievements: [
      '帮助企业内容分发效率提升300%',
      '审核流程时间缩短60%',
      '支持10+企业客户部署',
      '系统稳定性达到99.9%',
    ],
    client: '某物流科技集团',
    year: '2022',
    role: '产品设计 / UX设计',
    tools: ['Figma', 'Axure', 'Framer', 'Notion'],
    link: '',
  },
  '3': {
    id: '3',
    title: '武侯服务 - 政务服务平台',
    summary: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台。',
    background: '政府部门之间存在大量数据孤岛，地名地址信息不一致导致诸多问题。武侯服务平台旨在打通公安与政府之间的数据壁垒，实现地名地址信息的统一管理和实时同步。',
    designThinking: '考虑到政务用户的使用习惯，设计上追求简洁明了、操作便捷。采用地图可视化技术，直观展示地名地址信息。设计了一套完善的权限管理系统，确保数据安全。整体设计风格庄重专业，符合政务系统的定位。',
    images: [
      'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
    ],
    tags: ['政务系统', 'GIS', '数据同步', 'B2G'],
    achievements: [
      '实现公安与政府数据实时同步',
      '地名地址准确率提升至99.5%',
      '服务覆盖武侯区所有街道',
      '获得政务创新应用示范奖',
    ],
    client: '成都市武侯区政府',
    year: '2021',
    role: 'UI设计 / 交互设计',
    tools: ['Sketch', 'Adobe XD', 'Illustrator', 'After Effects'],
    link: '',
  },
  '4': {
    id: '4',
    title: '数字堆场 - 智慧物流管理',
    summary: '智慧堆场管理系统，通过数字化手段实现堆场资源的高效调度和可视化管理。',
    background: '传统堆场管理依赖人工调度，效率低下且容易出错。数字堆场项目旨在通过物联网技术和可视化手段，实现堆场资源的智能调度和实时监控。',
    designThinking: '设计上采用大屏可视化方案，让管理者能够实时掌握堆场状态。引入3D可视化技术，直观展示堆场布局和货物位置。设计智能调度算法界面，辅助决策。整体设计强调数据的实时性和准确性，帮助管理者做出快速决策。',
    images: [
      'https://images.unsplash.com/photo-1586528116493-a029325540fa?w=1200',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200',
    ],
    tags: ['智慧物流', '3D可视化', 'IoT', '大屏设计'],
    achievements: [
      '堆场利用率提升25%',
      '调度效率提升40%',
      '人工成本降低30%',
      '实现24小时无人值守',
    ],
    client: '某港口物流集团',
    year: '2022',
    role: '产品设计 / 可视化设计',
    tools: ['Figma', 'Blender', 'D3.js', 'Three.js'],
    link: '',
  },
};
