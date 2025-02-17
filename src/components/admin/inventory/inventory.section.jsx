import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProduct from '../../../hooks/useProduct.jsx'; // Hook for products

const InventorySection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Dynamically fetch products from the backend
  const { products, loading, error } = useProduct();

  const categories = ['all', 'Electronics', 'Fashion', 'Home', 'Books'];

  // Filter products based on search term and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Show loading or error states if needed
  if (loading) {
    return (
      <div className="p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p>Error loading products.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-black">Inventory</h1>
        <p className="text-sm text-gray-600">Browse and manage your product inventory</p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset pagination on search
            }}
          />
        </div>
        <div className="dropdown">
          <label tabIndex="0" className="btn m-1">
            <Filter size={20} className="mr-2" />
            Filter by Category
            <ChevronDown size={16} className="ml-2" />
          </label>
          <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {categories.map((category) => (
              <li key={category}>
                <button
                  className={`${selectedCategory === category ? 'bg-black text-white' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1); // reset pagination on filter
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product, index) => {
          // Use product.id, or fallback to product._id or index
          const productId = product.id || product._id || index;
          return (
            <div
              key={productId}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() =>
                navigate(`/admin/product/single-product/${productId}`, { state: { product } })
              }
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.imageUrl} // product.imageUrl should be the Cloudinary URL from the backend
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-black truncate">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-black">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">{product.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Section */}
      {filteredProducts.length > pageSize && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn">
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn">
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InventorySection;
