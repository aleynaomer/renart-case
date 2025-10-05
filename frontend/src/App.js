
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import './App.css';

SwiperCore.use([Navigation, Scrollbar]);

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [minPrice, setMinPrice] = useState(''); 
  const [maxPrice, setMaxPrice] = useState(''); 

  const fetchProducts = (filterUrl = '') => {
    setLoading(true); 
    fetch(`https://renart-case-ben.onrender.com/api/products${filterUrl}` )
      .then(response => {
        if (!response.ok) throw new Error('Veri alınamadı.');
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilter = () => {
    const queryParams = new URLSearchParams();
    if (minPrice) {
      queryParams.append('minPrice', minPrice);
    }
    if (maxPrice) {
      queryParams.append('maxPrice', maxPrice);
    }
    
    const filterUrl = `?${queryParams.toString()}`;
    fetchProducts(filterUrl);
  };

  const clearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    fetchProducts(); 
  };


  if (error) return <div className="error">Hata: {error}</div>;

  return (
    <div className="App">
      <h1 className="main-title">Product List</h1>

      <div className="filter-container">
        <input
          type="number"
          placeholder="Min Fiyat ($)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max Fiyat ($)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="filter-input"
        />
        <button onClick={handleFilter} className="filter-button">Filtrele</button>
        <button onClick={clearFilter} className="clear-button">Temizle</button>
      </div>

      {loading ? (
        <div className="loading">Ürünler Yükleniyor...</div>
      ) : (
        <div className="product-container">
          <Swiper
            navigation
            scrollbar={{ draggable: true }}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="product-swiper"
          >
            {products.map(product => (
              <SwiperSlide key={product.name}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default App;
