import { useRef, useEffect, useState } from 'react';
import { Homepage, Products } from '@/pages';
import { GradientBackground, DynamicParticles } from '@/components';
import { mockUserInfo } from '@/services/mock';
import './styles/global.less';

function App() {
  const productsRef = useRef<HTMLDivElement>(null);
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
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (!isScrolling) {
        // If we are currently at 'home' and scroll down slightly (e.g. > 10px), go to 'products'
        if (currentSection === 'home' && currentScrollY > 10) {
          scrollToSection(productsRef.current, 'products');
        }
        // If we are currently at 'products' and scroll up slightly (e.g. < full height - 10px), go to 'home'
        // Note: products section starts at windowHeight roughly. So if we are above windowHeight - 10, go back.
        // We use windowHeight * 0.9 as a safe threshold to detect intent to go back up
        else if (currentSection === 'products' && currentScrollY < windowHeight - 10) {
          scrollToTop();
        }

        // Debounce check for small scrolls (<= 10px) to snap back
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (!isScrolling) {
            const currentY = window.scrollY;
            // If at home and scrolled a tiny bit (<= 10px), snap back to top
            if (currentSection === 'home' && currentY > 0 && currentY <= 10) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // If at products and scrolled up a tiny bit (>= height - 10px), snap back to products
            else if (currentSection === 'products' && currentY >= windowHeight - 10 && currentY < windowHeight) {
              productsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling, currentSection]);

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
