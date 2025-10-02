// backend/server.js

require('dotenv').config(); // .env dosyasındaki değişkenleri yüklemek için en üste bunu ekliyoruz.

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const productsData = require('./products.json');

const app = express();
const PORT = 3001;

app.use(cors());

// --- YENİ: GoldAPI.io'dan Direkt USD Fiyatı Çekme ---

const getRealTimeGoldPrice = async () => {
  try {
    // API isteğini axios ile yapıyoruz.
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': process.env.GOLD_API_KEY // API anahtarını .env dosyasından güvenli bir şekilde alıyoruz.
      }
    } );

    // Gelen yanıttan 1 gram altının fiyatını alıyoruz.
    // GoldAPI, 1 ONS (ounce) fiyatını verir. 1 ons = 31.1035 gram.
    // Bu yüzden ons fiyatını grama çevirmemiz gerekiyor.
    const pricePerOunce = response.data.price;
    const pricePerGram = pricePerOunce / 31.1035;
    
    return pricePerGram;

  } catch (error) {
    console.error("GoldAPI.io'dan veri alınırken hata oluştu:", error.response ? error.response.data : error.message);
    // Hata durumunda, uygulamanın çökmemesi için makul bir varsayılan değer döndür.
    return 75; // Örnek: 1 gram için 75 USD
  }
};


// --- API ENDPOINT'İ ---

app.get('/api/products', async (req, res) => {
  try {
    console.log("Güncel altın fiyatı GoldAPI.io'dan çekiliyor...");
    
    const goldPriceUSD = await getRealTimeGoldPrice();
    console.log(`Güncel Altın Fiyatı: ${goldPriceUSD.toFixed(2)} USD/gram`);

    // 1. Önce tüm ürünlerin fiyatlarını hesaplayalım.
    let allProductsWithPrice = productsData.map(product => {
      const calculatedPrice = (product.popularityScore + 1) * product.weight * goldPriceUSD;
      return {
        ...product,
        price: parseFloat(calculatedPrice.toFixed(2)),
        priceCurrency: 'USD'
      };
    });

    // 2. Şimdi gelen sorgu parametrelerine göre filtreleme yapalım.
    // req.query'den filtre değerlerini alıyoruz.
    const { minPrice, maxPrice, minPopularity } = req.query;

    // Filtrelenmiş ürünleri tutacağımız değişken. Başlangıçta tüm ürünleri içerir.
    let filteredProducts = allProductsWithPrice;

    // Fiyat Aralığı Filtresi
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Popülerlik Puanı Filtresi
    if (minPopularity) {
      // Not: Bizim popülerlik skorumuz 0-1 arasında.
      filteredProducts = filteredProducts.filter(p => p.popularityScore >= parseFloat(minPopularity));
    }
    
    // 3. Son olarak, filtrelenmiş ürün listesini yanıt olarak gönderelim.
    res.json(filteredProducts);

  } catch (error) {
    console.error("API hatası:", error);
    res.status(500).json({ message: "Sunucuda bir hata oluştu." });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Backend sunucusu başarıyla başlatıldı!`);
  console.log(`🚀 Dinlenen adres: http://localhost:${PORT}` );
});
