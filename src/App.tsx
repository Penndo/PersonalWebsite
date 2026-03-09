import { useRef, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Homepage, Products } from '@/pages';
import { GradientBackground, DynamicParticles } from '@/components';
import { mockUserInfo } from '@/services/mock';
import './styles/global.less';

function App() {
  const productsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'products'>('home');

  const scrollToSection = (element: HTMLElement | null, section: 'home' | 'products') => {
    if (isScrolling || !element) return;
    setIsScrolling(true);
    setCurrentSection(section);
    element.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 800);
  };

  const scrollToTop = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    setCurrentSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 800);
  };

  useEffect(() => {
    if (location.hash && productsRef.current) {
      const timer = setTimeout(() => {
        scrollToSection(productsRef.current, 'products');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    if (!isScrolling) {
      if (currentSection === 'home' && currentScrollY > 20) {
        scrollToSection(productsRef.current, 'products');
      }
      else if (currentSection === 'products' && currentScrollY < windowHeight - 20) {
        scrollToTop();
      }
    }
  }, [isScrolling, currentSection]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

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
  }, [handleScroll, isScrolling, currentSection]);

  return (
    <div className="app">
      <GradientBackground />
      <DynamicParticles />
      <Homepage 
        userInfo={mockUserInfo} 
        onScrollDown={() => scrollToSection(productsRef.current, 'products')}
      />
      <div ref={productsRef}>
        <Products />
      </div>
    </div>
  );
}

export default App;
