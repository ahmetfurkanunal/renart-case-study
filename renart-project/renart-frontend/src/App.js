import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

const colorMap = {
  yellow: "#E6CA97",
  white: "#D9D9D9",
  rose: "#E1A4A9"
};

function App() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    popularityMin: "",
    popularityMax: ""
  });


  const fetchProducts = async () => {
    const queryParams = new URLSearchParams();

    if (filters.priceMin) queryParams.append("priceMin", filters.priceMin);
    if (filters.priceMax) queryParams.append("priceMax", filters.priceMax);
    if (filters.popularityMin) queryParams.append("popularityMin", filters.popularityMin);
    if (filters.popularityMax) queryParams.append("popularityMax", filters.popularityMax);

   const BASE_URL = "https://renart-case-study-fa0w.onrender.com";
  const response = await fetch(`${BASE_URL}/api/products?${queryParams.toString()}`);
    const data = await response.json();
    setProducts(data.map(p => ({ ...p, selectedColor: "yellow" })));
  };

  useEffect(() => {
    fetchProducts(); 
  }, []);

  const handleColorChange = (index, color) => {
    const updated = [...products];
    updated[index].selectedColor = color;
    setProducts(updated);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div style={{ padding: "2rem 4rem" }}>
      <h2 style={{ textAlign: "center" }}>Product List</h2>

      {}
      <div className="filter-bar">
        <input
          type="number"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={e => setFilters({ ...filters, priceMin: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={e => setFilters({ ...filters, priceMax: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Min Popularity (0-1)"
          value={filters.popularityMin}
          onChange={e => setFilters({ ...filters, popularityMin: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Max Popularity (0-1)"
          value={filters.popularityMax}
          onChange={e => setFilters({ ...filters, popularityMax: e.target.value })}
        />
        <button onClick={fetchProducts}>Filtrele</button>
      </div>

      {}
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={index} style={{ padding: "0 0.5rem" }}>
            <div className="product-card">
              <img src={product.images[product.selectedColor]} alt={product.name} />
              <div className="product-title">{product.name}</div>
              <div className="product-price">${product.price} USD</div>

              <div className="color-picker">
                {["yellow", "white", "rose"].map(color => (
                  <div
                    key={color}
                    className={`color-dot ${product.selectedColor === color ? "active" : ""}`}
                    onClick={() => handleColorChange(index, color)}
                    style={{ backgroundColor: colorMap[color] }}
                  />
                ))}
              </div>

              <div className="rating">⭐ {product.popularityOutOfFive}/5</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default App;
