
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const productsData = require('./products.json');

const app = express();
const PORT = 3001;

app.use(cors());


const getRealTimeGoldPrice = async () => {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': process.env.GOLD_API_KEY 
      }
    } );

    
    const pricePerOunce = response.data.price;
    const pricePerGram = pricePerOunce / 31.1035;
    
    return pricePerGram;

  } catch (error) {
    console.error("GoldAPI.io'dan veri alınırken hata oluştu:", error.response ? error.response.data : error.message);
    return 75; 
  }
};



app.get('/api/products', async (req, res) => {
  try {
    console.log("Güncel altın fiyatı GoldAPI.io'dan çekiliyor...");
    
    const goldPriceUSD = await getRealTimeGoldPrice();
    console.log(`Güncel Altın Fiyatı: ${goldPriceUSD.toFixed(2)} USD/gram`);

    let allProductsWithPrice = productsData.map(product => {
      const calculatedPrice = (product.popularityScore + 1) * product.weight * goldPriceUSD;
      return {
        ...product,
        price: parseFloat(calculatedPrice.toFixed(2)),
        priceCurrency: 'USD'
      };
    });

    
    const { minPrice, maxPrice, minPopularity } = req.query;

    let filteredProducts = allProductsWithPrice;

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (minPopularity) {
      filteredProducts = filteredProducts.filter(p => p.popularityScore >= parseFloat(minPopularity));
    }
    
    res.json(filteredProducts);

  } catch (error) {
    console.error("API hatası:", error);
    res.status(500).json({ message: "Sunucuda bir hata oluştu." });
  }
});


app.listen(PORT, () => {
  console.log(` Backend sunucusu başarıyla başlatıldı!`);
  console.log(`Dinlenen adres: http://localhost:${PORT}` );
});
