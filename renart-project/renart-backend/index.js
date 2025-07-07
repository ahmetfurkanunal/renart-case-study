const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());


const products = JSON.parse(fs.readFileSync("products.json", "utf-8"));


async function getGoldPrice() {
  try {
    const response = await axios.get(
      "https://api.goldapi.io/v1/XAU/USD",
      {
        headers: {
          "x-access-token": process.env.GOLD_API_KEY
        }
      }
    );
    return response.data.price;
  } catch (error) {
    console.error("Altın fiyatı alınamadı:", error.message);
    return 65;
  }
}


app.get("/api/products", async (req, res) => {
  try {
    const goldPrice = await getGoldPrice();

    const {
      priceMin,
      priceMax,
      popularityMin,
      popularityMax
    } = req.query;

    
    let filteredProducts = products.map((p) => {
      const price = ((p.popularityScore + 1) * p.weight * goldPrice);
      return {
        ...p,
        price: Number(price.toFixed(2)),
        popularityOutOfFive: (p.popularityScore * 5).toFixed(1)
      };
    });

    
    if (priceMin) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(priceMin));
    }
    if (priceMax) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(priceMax));
    }
    if (popularityMin) {
      filteredProducts = filteredProducts.filter(p => p.popularityScore >= Number(popularityMin));
    }
    if (popularityMax) {
      filteredProducts = filteredProducts.filter(p => p.popularityScore <= Number(popularityMax));
    }

    res.json(filteredProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Veri alınırken hata oluştu" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
