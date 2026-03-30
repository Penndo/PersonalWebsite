import { useRef, useEffect, useState } from 'react';
import { Homepage, Products } from '@/pages';
import { GradientBackground, DynamicParticles } from '@/components';
import type { UserInfo, RecommendedItem } from '@/types';
import { mockUserInfo } from '@/services/mock';
import './styles/global.less';

function App() {  
  const productsRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  // 组件挂载时，检查是否有从详情页返回的记录，作为初始状态
  const [currentSection, setCurrentSection] = useState<'home' | 'products'>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('scrollPosition')) {
      return 'products';
    }
    return 'home';
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>([]);

  const scrollToSection = (element: HTMLElement | null, section: 'home' | 'products') => {
    if (isScrolling || !element) return;
    setIsScrolling(true);
    setCurrentSection(section);
    element.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 800);
  };



  useEffect(() => {
    // 导入需要的API
    import('@/services/api').then(({ userApi, projectApi, articleApi, pluginApi }) => {
      // 获取用户信息
      userApi
        .getUserInfo()
        .then((res) => {
          const raw = res.data as Partial<UserInfo>;
          const normalized: UserInfo = {
            ...mockUserInfo,
            ...raw,
            name: raw.name ?? mockUserInfo.name,
            profession: raw.profession ?? mockUserInfo.profession,
            introduction: raw.introduction ?? mockUserInfo.introduction,
            avatar: raw.avatar ?? mockUserInfo.avatar,
            age: typeof raw.age === 'number' ? raw.age : mockUserInfo.age,
            hobbies: Array.isArray(raw.hobbies) ? raw.hobbies : mockUserInfo.hobbies,
            phone: raw.phone ?? '',
            portfolio: raw.portfolio ?? '',
            wechatQRCode: raw.wechatQRCode ?? '',
          };
          setUserInfo(normalized);
        })
        .catch((err) => {
          console.error('Failed to fetch user info', err);
          setUserInfo(mockUserInfo);
        });

      // 获取推荐项目数据
      Promise.all([
        projectApi.getProjects(),
        articleApi.getArticles(),
        pluginApi.getPlugins()
      ])
      .then(([projectsRes, articlesRes, pluginsRes]) => {
        const allItems = [
          ...projectsRes.data.map(project => ({
            id: project.id,
            type: 'project' as const,
            title: project.title,
            defaultImage: project.coverUrl || `/icons/${project.title}-Default.png`,
            hoverImage: project.coverUrl || `/icons/${project.title}-Hover.png`,
            enabled: true,
            order: 0
          })),
          ...articlesRes.data.map(article => ({
            id: article.id,
            type: 'article' as const,
            title: article.title,
            defaultImage: article.coverUrl || `/icons/${article.title}-Default.png`,
            hoverImage: article.coverUrl || `/icons/${article.title}-Hover.png`,
            enabled: true,
            order: 0
          })),
          ...pluginsRes.data.map(plugin => ({
            id: plugin.id,
            type: 'plugin' as const,
            title: plugin.title,
            defaultImage: plugin.coverUrl || `/icons/${plugin.title}-Default.png`,
            hoverImage: plugin.coverUrl || `/icons/${plugin.title}-Hover.png`,
            enabled: true,
            order: 0
          }))
        ];
        
        // 按顺序排序并限制数量
        const sortedItems = allItems
          .sort((a, b) => a.order - b.order)
          .slice(0, 4);
        
        setRecommendedItems(sortedItems);
      })
      .catch((err) => {
        console.error('Failed to fetch recommended items', err);
        // 使用默认推荐项目
        setRecommendedItems([
          {
            id: '1',
            type: 'project',
            title: 'Hooinn',
            defaultImage: '/icons/HooInn-Default.png',
            hoverImage: '/icons/HooInn-hover.png',
            enabled: true,
            order: 1
          },
          {
            id: '2',
            type: 'project',
            title: 'PUB',
            defaultImage: '/icons/PUB-Default.png',
            hoverImage: '/icons/PUB-Hover.png',
            enabled: true,
            order: 2
          },
          {
            id: '3',
            type: 'project',
            title: '开运',
            defaultImage: '/icons/开运-Default.png',
            hoverImage: '/icons/开运-hover.png',
            enabled: true,
            order: 3
          },
          {
            id: '4',
            type: 'project',
            title: 'EZC',
            defaultImage: '/icons/EZC-Default.png',
            hoverImage: '/icons/EZC-Hover.png',
            enabled: true,
            order: 4
          }
        ]);
      });
    });
  }, []);

  useEffect(() => {
    
    let scrollTimeout: NodeJS.Timeout;

    const scrollToProducts = () => {
      if (isScrolling || !productsRef.current) return;
      setIsScrolling(true);
      setCurrentSection('products');
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 800);
    };

    const scrollToHome = () => {
      if (isScrolling) return;
      setIsScrolling(true);
      setCurrentSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 800);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (!isScrolling) {
        if (currentSection === 'home' && currentScrollY > 20) {
          scrollToProducts();
        } else if (
          currentSection === 'products' &&
          currentScrollY < windowHeight - 20
        ) {
          scrollToHome();
        }
      }
    };

    const handleScrollDebounced = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (!isScrolling) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (currentSection === 'home' && currentScrollY > 0 && currentScrollY <= 20) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          else if (currentSection === 'products' && currentScrollY >= windowHeight - 20 && currentScrollY < windowHeight) {
            productsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScrollDebounced, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollDebounced);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling, currentSection]);

  const effectiveUser = userInfo ?? mockUserInfo;

  return (
    <div className="app">
      <GradientBackground />
      <DynamicParticles />
      <Homepage 
        userInfo={effectiveUser} 
        recommendedItems={recommendedItems}
        onScrollDown={() => scrollToSection(productsRef.current, 'products')}
      />
      <div ref={productsRef}>
        <Products currentSection={currentSection} />
      </div>
    </div>
  );
}

export default App;
