import { useRef } from 'react';
import { Homepage, Products } from '@/pages';
import { mockUserInfo } from '@/services/mock';
import './styles/global.less';

function App() {
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Homepage 
        userInfo={mockUserInfo} 
        onScrollDown={scrollToProducts}
      />
      <div ref={productsRef}>
        <Products />
      </div>
    </div>
  );
}

export default App;
