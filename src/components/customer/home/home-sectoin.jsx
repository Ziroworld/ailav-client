import React, { useState, useMemo } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useHome from '../../../hooks/useHome.jsx';

// Helper function for shuffling an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const HomeSection = () => {
  // Retrieve products using the useHome hook.
  const { homeData: products, loading, error } = useHome();

  // Always call hooks unconditionally.
  const newArrivalRandom = useMemo(() => shuffleArray(products || []), [products]);
  const bestSellingRandom = useMemo(() => shuffleArray(products || []), [products]);

  const itemsPerPage =
    typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 5;
  const totalNewArrivalPages = Math.ceil(newArrivalRandom.length / itemsPerPage);
  const totalBestSellingPages = Math.ceil(bestSellingRandom.length / itemsPerPage);

  const [newArrivalSlide, setNewArrivalSlide] = useState(0);
  const [bestSellingSlide, setBestSellingSlide] = useState(0);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  // For hero cards, pick one wine and one beer product.
  const wineProduct = products.find((p) => p.category === 'Wine');
  const beerProduct = products.find((p) => p.category === 'Beer');

  const nextNewArrival = () => {
    setNewArrivalSlide((prev) => (prev + 1) % totalNewArrivalPages);
  };

  const prevNewArrival = () => {
    setNewArrivalSlide((prev) => (prev - 1 + totalNewArrivalPages) % totalNewArrivalPages);
  };

  const nextBestSelling = () => {
    setBestSellingSlide((prev) => (prev + 1) % totalBestSellingPages);
  };

  const prevBestSelling = () => {
    setBestSellingSlide((prev) => (prev - 1 + totalBestSellingPages) % totalBestSellingPages);
  };

  // Paginate the randomized arrays.
  const newArrivalProducts = newArrivalRandom.slice(
    newArrivalSlide * itemsPerPage,
    (newArrivalSlide + 1) * itemsPerPage
  );
  const bestSellingProducts = bestSellingRandom.slice(
    bestSellingSlide * itemsPerPage,
    (bestSellingSlide + 1) * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
            <Link to="/homepage" className="text-xl font-bold text-black">AILAV</Link>
              <div className="hidden md:flex space-x-6">
                <a className="text-gray-700 hover:text-black">Category</a>
                <a className="text-gray-700 hover:text-black">About us</a>
                <a className="text-gray-700 hover:text-black">Contact us</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              <Link 
                to="/auth/login" 
                className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-full hover:bg-gray-50"
              >
                Sign in
              </Link>
              <Link 
                to="/auth/register" 
                className="px-6 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800"
              >
                Join now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Top Hero Section - Seasonal Wine Offer */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          {/* Details on the left */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-bold">
              Seasonal Wine Offer – Enjoy 15% off on select wines!
            </h2>
            <h1 className="text-4xl font-bold mt-2">
              {wineProduct ? wineProduct.name : 'Wine Product'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              $ {wineProduct ? wineProduct.price : 'Price'}
            </p>
            <button className="mt-4 w-full md:w-auto px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800">
              Add to cart
            </button>
          </div>
          {/* Image on the right */}
          <div className="md:w-1/2">
            <img
              src={
                wineProduct
                  ? wineProduct.imageUrl
                  : 'https://source.unsplash.com/random/800x800?champagne'
              }
              alt={wineProduct ? wineProduct.name : ""}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold">New Arrivals</h2>
          <div className="flex space-x-2">
            <button onClick={prevNewArrival} className="p-2 rounded-full bg-black hover:bg-gray-800 text-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextNewArrival} className="p-2 rounded-full bg-black hover:bg-gray-800 text-white">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {newArrivalProducts.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover h-48 w-full"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-lg">{product.name}</h3>
                <p className="text-base font-bold">$ {product.price}</p>
                <div className="card-actions">
                  <button className="w-full px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 text-sm">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Festival Best Selling Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold">Festival Best Selling</h2>
          <div className="flex space-x-2">
            <button onClick={prevBestSelling} className="p-2 rounded-full bg-black hover:bg-gray-800 text-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextBestSelling} className="p-2 rounded-full bg-black hover:bg-gray-800 text-white">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {bestSellingProducts.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover h-48 w-full"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-lg">{product.name}</h3>
                <p className="text-base font-bold">$ {product.price}</p>
                <div className="card-actions">
                  <button className="w-full px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 text-sm">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Hero Section - Seasonal Beer Offer */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Image on the left */}
          <div className="md:w-1/2">
            <img
              src={
                beerProduct
                  ? beerProduct.imageUrl
                  : 'https://source.unsplash.com/random/800x800?beer'
              }
              alt={beerProduct ? beerProduct.name : ""}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          {/* Details on the right */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-bold">
              Seasonal Beer Offer – Enjoy 15% off on select beers!
            </h2>
            <h1 className="text-4xl font-bold mt-2">
              {beerProduct ? beerProduct.name : 'Beer Product'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              $ {beerProduct ? beerProduct.price : 'Price'}
            </p>
            <button className="mt-4 w-full md:w-auto px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800">
              Add to cart
            </button>
          </div>
        </div>
      </div>

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

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Ailav.co</h3>
              <p className="text-gray-600 mb-4">
                Your ultimate liquor delivery website. Enjoy a wide range of wines, beers, and spirits delivered straight to your door.
              </p>
              <p className="text-gray-600">
                Location: 5-Sitapaila, KTM, Nepal<br />
                Phone: +977 9765346808
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">COMPANY</h4>
              {["About", "Features", "Works", "Career"].map((item, idx) => (
                <ul key={idx} className="space-y-2 text-gray-600">
                  <li><a>{item}</a></li>
                </ul>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-4">HELP</h4>
              {["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"].map((item, idx) => (
                <ul key={idx} className="space-y-2 text-gray-600">
                  <li><a>{item}</a></li>
                </ul>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-4">RESOURCES</h4>
              {["Cocktail Recipes", "Wine Pairing Guide", "Event Updates", "Industry Insights"].map((item, idx) => (
                <ul key={idx} className="space-y-2 text-gray-600">
                  <li><a>{item}</a></li>
                </ul>
              ))}
            </div>
          </div>
          <div className="border-t pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 mb-4 md:mb-0">
                Ailav.co © 2000-2023, All Rights Reserved
              </p>
              <div className="flex items-center space-x-4">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg" alt="Visa" className="h-6" />
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paypal.svg" alt="PayPal" className="h-6" />
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/applepay.svg" alt="Apple Pay" className="h-6" />
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlepay.svg" alt="Google Pay" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeSection;
