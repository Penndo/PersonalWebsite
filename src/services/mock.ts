import type { UserInfo, Project, Article, Plugin } from '@/types';

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
