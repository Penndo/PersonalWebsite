import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Homepage, Products } from '@/pages';
import { GradientBackground, DynamicParticles } from '@/components';
import { userApi } from '@/services/api';
import type { UserInfo } from '@/types';
import { mockUserInfo } from '@/services/mock';
import './styles/global.less';

function App() {
  const productsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'products'>('home');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const scrollToSection = (element: HTMLElement | null, section: 'home' | 'products') => {
    if (isScrolling || !element) return;
    setIsScrolling(true);
    setCurrentSection(section);
    element.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 800);
  };

  useEffect(() => {
    if (location.hash && productsRef.current) {
      const element = productsRef.current;
      const timer = setTimeout(() => {
        if (isScrolling) return;
        setIsScrolling(true);
        setCurrentSection('products');
        element.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setIsScrolling(false), 800);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, isScrolling]);

  useEffect(() => {
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
        };
        setUserInfo(normalized);
      })
      .catch((err) => {
        console.error('Failed to fetch user info', err);
        setUserInfo(mockUserInfo);
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
        onScrollDown={() => scrollToSection(productsRef.current, 'products')}
      />
      <div ref={productsRef}>
        <Products />
      </div>
    </div>
  );
}

export default App;
