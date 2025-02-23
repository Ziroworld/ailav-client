import React, { useState, useMemo } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useHome from '../../../hooks/useHome.jsx';
import { useCart } from '../../../hooks/useCart';

/** Utility to shuffle an array in-place */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const HomeSection = () => {
  const { homeData: products, loading, error } = useHome();
  const { addToCart } = useCart();

  // Shuffle data for new arrivals & best selling
  const newArrivalRandom = useMemo(() => shuffleArray(products || []), [products]);
  const bestSellingRandom = useMemo(() => shuffleArray(products || []), [products]);

  // Decide how many items to show per page
  const itemsPerPage =
    typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 5;

  const totalNewArrivalPages = Math.ceil(newArrivalRandom.length / itemsPerPage);
  const totalBestSellingPages = Math.ceil(bestSellingRandom.length / itemsPerPage);

  // Track which "slide" we're on
  const [newArrivalSlide, setNewArrivalSlide] = useState(0);
  const [bestSellingSlide, setBestSellingSlide] = useState(0);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  // Pick one Wine & one Beer product for the hero sections
  const wineProduct = products.find((p) => p.category === 'Wine');
  const beerProduct = products.find((p) => p.category === 'Beer');

  // Pagination logic for New Arrivals
  const nextNewArrival = () => {
    setNewArrivalSlide((prev) => (prev + 1) % totalNewArrivalPages);
  };
  const prevNewArrival = () => {
    setNewArrivalSlide((prev) => (prev - 1 + totalNewArrivalPages) % totalNewArrivalPages);
  };
  const newArrivalProducts = newArrivalRandom.slice(
    newArrivalSlide * itemsPerPage,
    (newArrivalSlide + 1) * itemsPerPage
  );

  // Pagination logic for Festival Best Selling
  const nextBestSelling = () => {
    setBestSellingSlide((prev) => (prev + 1) % totalBestSellingPages);
  };
  const prevBestSelling = () => {
    setBestSellingSlide((prev) => (prev - 1 + totalBestSellingPages) % totalBestSellingPages);
  };
  const bestSellingProducts = bestSellingRandom.slice(
    bestSellingSlide * itemsPerPage,
    (bestSellingSlide + 1) * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Hero Section - Wine Offer */}
      {wineProduct && (
        <Link to={`/customer/product/${wineProduct._id}`}>
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col-reverse md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-xl font-bold">
                  Seasonal Wine Offer – Enjoy 15% off on select wines!
                </h2>
                <h1 className="text-4xl font-bold mt-2">{wineProduct.name}</h1>
                <p className="text-sm text-gray-600 mt-1">${wineProduct.price}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(wineProduct, 1);
                  }}
                  className="mt-4 w-full md:w-auto px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                >
                  Add to cart
                </button>
              </div>
              <div className="md:w-1/2">
                <img
                  src={wineProduct.imageUrl}
                  alt={wineProduct.name}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold">New Arrivals</h2>
          <div className="flex space-x-2">
            <button
              onClick={prevNewArrival}
              className="p-2 rounded-full bg-black hover:bg-gray-800 text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextNewArrival}
              className="p-2 rounded-full bg-black hover:bg-gray-800 text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {newArrivalProducts.map((product) => (
            <Link to={`/customer/product/${product._id}`} key={product._id}>
              {/* UPDATED CARD DESIGN: fixed height, flex layout, consistent styling */}
              <div className="card bg-base-100 shadow-xl h-80 hover:shadow-2xl transition-shadow flex flex-col">
                {/* Image area */}
                <figure className="h-1/2 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </figure>
                {/* Card body */}
                <div className="card-body p-4 flex-1 flex flex-col">
                  <h3 className="card-title text-lg font-bold line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-base font-bold mt-1">${product.price}</p>
                  {/* Keep "Add to cart" at the bottom */}
                  <div className="card-actions mt-auto">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                      }}
                      className="w-full px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 text-sm"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Festival Best Selling Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold">Festival Best Selling</h2>
          <div className="flex space-x-2">
            <button
              onClick={prevBestSelling}
              className="p-2 rounded-full bg-black hover:bg-gray-800 text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextBestSelling}
              className="p-2 rounded-full bg-black hover:bg-gray-800 text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {bestSellingProducts.map((product) => (
            <Link to={`/customer/product/${product._id}`} key={product._id}>
              {/* Same updated card design for consistency */}
              <div className="card bg-base-100 shadow-xl h-80 hover:shadow-2xl transition-shadow flex flex-col">
                <figure className="h-1/2 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </figure>
                <div className="card-body p-4 flex-1 flex flex-col">
                  <h3 className="card-title text-lg font-bold line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-base font-bold mt-1">${product.price}</p>
                  <div className="card-actions mt-auto">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                      }}
                      className="w-full px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 text-sm"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Hero Section - Beer Offer */}
      {beerProduct && (
        <Link to={`/customer/product/${beerProduct._id}`}>
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img
                  src={beerProduct.imageUrl}
                  alt={beerProduct.name}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-xl font-bold">
                  Seasonal Beer Offer – Enjoy 15% off on select beers!
                </h2>
                <h1 className="text-4xl font-bold mt-2">{beerProduct.name}</h1>
                <p className="text-sm text-gray-600 mt-1">${beerProduct.price}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(beerProduct, 1);
                  }}
                  className="mt-4 w-full md:w-auto px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Newsletter Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-full text-black"
              />
              <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 md:flex-shrink-0">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
