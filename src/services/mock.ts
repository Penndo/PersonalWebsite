import type { UserInfo, Project, ProjectDetail, Article, ArticleDetail, Plugin, PluginDetail } from '@/types';

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
    routeId: 'hooinn',
    summary: 'Hooinn（呼应）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务...',
    description: 'Hooinn（呼应）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分享与交流服务...',
    cover: '',
  },
  {
    id: '2',
    title: 'PUB',
    routeId: 'pub',
    summary: 'PUB（发行系统）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分发与管理服务...',
    description: 'PUB（发行系统）是一款聚焦于进出口物流服务的 UGC 平台，为用户提供内容分发与管理服务...',
    cover: '',
  },
  {
    id: '3',
    title: '武侯服务',
    routeId: 'wuhou-service',
    summary: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    description: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    cover: '',
  },
  {
    id: '4',
    title: '数字堆场',
    routeId: 'digital-yard',
    summary: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    description: '成都ezc平台是为了解决公安与政府之间地名地址与信息同步问题而构建的统一服务平台...',
    cover: '',
  },
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: '设计系统构建指南',
    routeId: 'design-system-guide',
    summary: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
    description: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
    cover: '',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: '用户体验设计方法论',
    routeId: 'ux-design-methodology',
    summary: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
    description: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
    cover: '',
    date: '2024-02-20',
  },
  {
    id: '3',
    title: '产品思维与设计思维',
    routeId: 'product-vs-design-thinking',
    summary: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
    description: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
    cover: '',
    date: '2024-03-10',
  },
  {
    id: '4',
    title: 'AI时代的设计趋势',
    routeId: 'ai-design-trends',
    summary: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
    description: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
    cover: '',
    date: '2024-04-05',
  },
  {
    id: '5',
    title: '移动端交互设计最佳实践',
    routeId: 'mobile-interaction-best-practices',
    summary: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
    description: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
    cover: '',
    date: '2024-05-18',
  },
];

export const mockPlugins: Plugin[] = [
  {
    id: '1',
    title: 'Figma Design Token Generator',
    routeId: 'figma-design-token-generator',
    summary: '自动从Figma设计文件生成设计令牌的工具插件...',
    description: '自动从Figma设计文件生成设计令牌的工具插件...',
    cover: '',
  },
  {
    id: '2',
    title: 'Color Palette Creator',
    routeId: 'color-palette-creator',
    summary: '快速创建和管理配色方案的Figma插件...',
    description: '快速创建和管理配色方案的Figma插件...',
    cover: '',
  },
  {
    id: '3',
    title: 'Icon Manager',
    routeId: 'icon-manager',
    summary: '图标管理和导出工具，支持多种格式和尺寸...',
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

export const mockArticleDetail: Record<string, ArticleDetail> = {
  '1': {
    id: '1',
    title: '设计系统构建指南',
    description: '如何从零开始构建一套完整的设计系统，包括设计语言、组件库和文档规范...',
    cover: '',
    date: '2024-01-15',
    link: 'https://example.com/article/1',
    readingTime: 8,
    views: 1250,
    tags: ['设计系统', 'UI设计', '组件库', '设计规范'],
    content: `
      <h2>什么是设计系统</h2>
      <p>设计系统是一套完整的标准，旨在通过可复用的组件和模式来管理设计。它包含设计语言、组件库、样式指南和设计原则，帮助团队保持一致性和效率。</p>
      
      <h2>为什么需要设计系统</h2>
      <p>随着产品规模的扩大，设计不一致的问题会越来越明显。设计系统能够：</p>
      <ul>
        <li>提高设计和开发效率</li>
        <li>保证产品体验的一致性</li>
        <li>降低维护成本</li>
        <li>促进团队协作</li>
      </ul>
      
      <h2>如何构建设计系统</h2>
      <p>构建设计系统是一个渐进的过程，需要从以下几个方面入手：</p>
      <h3>1. 定义设计语言</h3>
      <p>设计语言是设计系统的核心，包括色彩、字体、图标、间距等视觉元素。这些元素需要基于品牌调性和用户需求来定义。</p>
      
      <h3>2. 建立组件库</h3>
      <p>组件库是设计系统的实现层，包含按钮、输入框、卡片等基础组件。每个组件都需要有明确的使用场景和规范。</p>
      
      <h3>3. 编写文档</h3>
      <p>完善的文档是设计系统成功的关键。文档应该包含设计原则、组件使用指南、最佳实践等内容。</p>
    `,
    author: {
      name: 'Yeatfish',
      avatar: '',
      bio: 'UI/UX设计师，专注于设计系统和用户体验',
    },
  },
  '2': {
    id: '2',
    title: '用户体验设计方法论',
    description: '深入探讨用户体验设计的核心方法论，从用户研究到设计验证的完整流程...',
    cover: '',
    date: '2024-02-20',
    link: 'https://example.com/article/2',
    readingTime: 12,
    views: 980,
    tags: ['用户体验', '设计方法', '用户研究', '设计验证'],
    content: `
      <h2>用户体验设计的核心</h2>
      <p>用户体验设计是以用户为中心的设计方法，关注用户在使用产品过程中的感受和体验。好的用户体验能够提升用户满意度和产品价值。</p>
      
      <h2>设计流程</h2>
      <h3>1. 用户研究</h3>
      <p>了解用户需求是设计的第一步。通过访谈、问卷、观察等方法收集用户信息，建立用户画像。</p>
      
      <h3>2. 信息架构</h3>
      <p>合理的信息架构能够帮助用户快速找到所需内容。需要考虑内容的组织方式和导航结构。</p>
      
      <h3>3. 交互设计</h3>
      <p>交互设计关注用户与产品的互动方式。需要设计清晰的操作流程和反馈机制。</p>
      
      <h3>4. 视觉设计</h3>
      <p>视觉设计不仅关乎美观，更影响用户的使用体验。需要平衡美学和功能性。</p>
      
      <h3>5. 设计验证</h3>
      <p>通过可用性测试、A/B测试等方法验证设计方案，持续优化用户体验。</p>
    `,
    author: {
      name: 'Yeatfish',
      avatar: '',
      bio: 'UI/UX设计师，专注于用户体验设计',
    },
  },
  '3': {
    id: '3',
    title: '产品思维与设计思维',
    description: '产品思维与设计思维的区别与融合，如何在项目中平衡商业目标与用户需求...',
    cover: '',
    date: '2024-03-10',
    link: 'https://example.com/article/3',
    readingTime: 10,
    views: 1500,
    tags: ['产品思维', '设计思维', '商业目标', '用户需求'],
    content: `
      <h2>两种思维的差异</h2>
      <p>产品思维关注商业价值和市场机会，强调解决问题和实现目标。设计思维关注用户需求和体验，强调同理心和创新。</p>
      
      <h2>产品思维的核心</h2>
      <ul>
        <li><strong>商业目标：</strong>理解产品的商业模式和盈利方式</li>
        <li><strong>市场定位：</strong>明确产品的目标用户和竞争优势</li>
        <li><strong>数据驱动：</strong>用数据指导产品决策</li>
        <li><strong>迭代优化：</strong>持续改进产品功能</li>
      </ul>
      
      <h2>设计思维的核心</h2>
      <ul>
        <li><strong>用户同理心：</strong>深入理解用户需求和痛点</li>
        <li><strong>定义问题：</strong>准确把握问题的本质</li>
        <li><strong>创意发散：</strong>探索多种解决方案</li>
        <li><strong>原型验证：</strong>快速验证设计想法</li>
      </ul>
      
      <h2>融合两种思维</h2>
      <p>优秀的产品需要同时兼顾商业价值和用户体验。产品思维确保方向正确，设计思维确保体验优秀。两者相辅相成，共同推动产品成功。</p>
    `,
    author: {
      name: 'Yeatfish',
      avatar: '',
      bio: 'UI/UX设计师 & 产品经理',
    },
  },
  '4': {
    id: '4',
    title: 'AI时代的设计趋势',
    description: '探讨人工智能时代下设计师需要掌握的新技能和面临的机遇与挑战...',
    cover: '',
    date: '2024-04-05',
    link: 'https://example.com/article/4',
    readingTime: 15,
    views: 2100,
    tags: ['人工智能', '设计趋势', 'AI设计', '未来设计'],
    content: `
      <h2>AI对设计的影响</h2>
      <p>人工智能正在深刻改变设计行业。从自动化设计到智能辅助，AI工具正在提升设计效率，同时也对设计师提出了新的要求。</p>
      
      <h2>AI设计工具的发展</h2>
      <h3>1. 图像生成</h3>
      <p>Midjourney、DALL-E等工具能够根据文字描述生成高质量图像，为设计师提供创意灵感。</p>
      
      <h3>2. 界面设计</h3>
      <p>AI可以根据需求自动生成界面设计，大大提高设计效率。但设计师仍需要把控整体体验。</p>
      
      <h3>3. 代码生成</h3>
      <p>AI可以将设计稿直接转换为代码，缩短设计与开发之间的距离。</p>
      
      <h2>设计师的新技能</h2>
      <ul>
        <li><strong>AI工具使用：</strong>熟练掌握各类AI设计工具</li>
        <li><strong>提示词工程：</strong>学会与AI有效沟通</li>
        <li><strong>批判性思维：</strong>判断AI生成内容的优劣</li>
        <li><strong>战略思维：</strong>专注于更高层次的设计决策</li>
      </ul>
      
      <h2>未来展望</h2>
      <p>AI不会取代设计师，但会使用AI的设计师将取代不会使用AI的设计师。拥抱变化，持续学习，才能在AI时代保持竞争力。</p>
    `,
    author: {
      name: 'Yeatfish',
      avatar: '',
      bio: '关注AI与设计融合的探索者',
    },
  },
  '5': {
    id: '5',
    title: '移动端交互设计最佳实践',
    description: '移动端应用交互设计的最佳实践，包括手势设计、动效设计和用户体验优化...',
    cover: '',
    date: '2024-05-18',
    link: 'https://example.com/article/5',
    readingTime: 11,
    views: 1800,
    tags: ['移动端', '交互设计', '手势设计', '动效设计'],
    content: `
      <h2>移动端设计的特点</h2>
      <p>移动设备有其独特的使用场景和限制。屏幕尺寸小、使用环境多变、操作方式以触摸为主，这些因素都影响着移动端的设计决策。</p>
      
      <h2>手势设计原则</h2>
      <h3>1. 符合直觉</h3>
      <p>手势操作应该符合用户的认知习惯。例如，左右滑动切换内容，下拉刷新等。</p>
      
      <h3>2. 可见性</h3>
      <p>可手势操作的区域需要有明确的视觉提示，让用户知道这里可以交互。</p>
      
      <h3>3. 容错性</h3>
      <p>手势识别需要有一定的容错空间，避免用户因为操作不精确而失败。</p>
      
      <h2>动效设计</h2>
      <p>合理的动效能够提升用户体验：</p>
      <ul>
        <li><strong>过渡动画：</strong>让界面变化更加自然</li>
        <li><strong>反馈动画：</strong>确认用户的操作</li>
        <li><strong>引导动画：</strong>帮助用户理解功能</li>
        <li><strong>情感化动画：</strong>增加产品的趣味性</li>
      </ul>
      
      <h2>性能优化</h2>
      <p>移动端设备性能有限，动效需要优化性能：</p>
      <ul>
        <li>使用transform和opacity属性</li>
        <li>避免触发重排</li>
        <li>控制同时运行的动画数量</li>
        <li>提供减少动效的选项</li>
      </ul>
    `,
    author: {
      name: 'Yeatfish',
      avatar: '',
      bio: '移动端设计专家',
    },
  },
};

export const mockPluginDetail: Record<string, PluginDetail> = {
  '1': {
    id: '1',
    title: 'Figma Design Token Generator',
    description: '自动从Figma设计文件生成设计令牌的工具插件，支持导出为CSS、JSON、SCSS等多种格式...',
    cover: '',
    link: 'https://figma.com/plugin/1',
    version: '2.1.0',
    downloads: 15000,
    rating: 4.8,
    tags: ['设计令牌', 'Figma插件', '开发工具', '设计系统'],
    features: [
      '自动提取颜色和字体样式',
      '支持多种导出格式',
      '实时同步设计变更',
      '自定义命名规则',
      '团队协作支持',
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    ],
    author: {
      name: 'Yeatfish',
      avatar: '',
    },
  },
  '2': {
    id: '2',
    title: 'Color Palette Creator',
    description: '快速创建和管理配色方案的Figma插件，提供智能配色建议和色彩和谐工具...',
    cover: '',
    link: 'https://figma.com/plugin/2',
    version: '1.5.2',
    downloads: 8900,
    rating: 4.6,
    tags: ['配色工具', 'Figma插件', '色彩理论', '设计辅助'],
    features: [
      '智能配色建议',
      '色彩和谐生成器',
      'WCAG对比度检查',
      '调色板导出',
      '历史记录管理',
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
    ],
    author: {
      name: 'Yeatfish',
      avatar: '',
    },
  },
  '3': {
    id: '3',
    title: 'Icon Manager',
    description: '图标管理和导出工具，支持多种格式和尺寸，帮助设计师高效管理图标资源...',
    cover: '',
    link: 'https://figma.com/plugin/3',
    version: '3.0.1',
    downloads: 22000,
    rating: 4.9,
    tags: ['图标管理', 'Figma插件', '资源管理', '导出工具'],
    features: [
      '批量导出多种格式',
      '自动尺寸适配',
      '图标分类管理',
      '搜索和筛选',
      '团队共享库',
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
    ],
    author: {
      name: 'Yeatfish',
      avatar: '',
    },
  },
};
