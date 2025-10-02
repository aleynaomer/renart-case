// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

// Swiper v8 için doğru importlar
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import './App.css';

// Swiper modüllerini kullan
SwiperCore.use([Navigation, Scrollbar]);

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FİLTRELEME İÇİN YENİ STATE'LER ---
  const [minPrice, setMinPrice] = useState(''); // Min fiyat input'u için state
  const [maxPrice, setMaxPrice] = useState(''); // Max fiyat input'u için state

  // API'den veri çeken fonksiyonu ayrı bir fonksiyona taşıyalım
  const fetchProducts = (filterUrl = '') => {
    setLoading(true); // Her yeni istekte yükleniyor durumuna geç
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

  // Bileşen ilk yüklendiğinde tüm ürünleri çek
  useEffect(() => {
    fetchProducts();
  }, []);

  // "Filtrele" butonuna tıklandığında çalışacak fonksiyon
  const handleFilter = () => {
    // Sorgu parametrelerini oluşturalım
    const queryParams = new URLSearchParams();
    if (minPrice) {
      queryParams.append('minPrice', minPrice);
    }
    if (maxPrice) {
      queryParams.append('maxPrice', maxPrice);
    }
    
    // URL'yi oluştur: "?minPrice=100&maxPrice=500" gibi
    const filterUrl = `?${queryParams.toString()}`;
    fetchProducts(filterUrl);
  };

  // Filtreyi temizleme fonksiyonu
  const clearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    fetchProducts(); // Filtresiz olarak tüm ürünleri yeniden çek
  };


  if (error) return <div className="error">Hata: {error}</div>;

  return (
    <div className="App">
      <h1 className="main-title">Product List</h1>

      {/* --- FİLTRELEME ARAYÜZÜ --- */}
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

      {/* Yüklenme durumu veya ürün listesi */}
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
