import React, { useEffect, useState } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../../../server/admin-api'; // adjust path as needed

const SingleProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the product by ID from the backend
  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductById(id)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <p>Error loading product.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-black hover:opacity-75 transition-opacity"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 uppercase">{product.category}</p>
              <h1 className="text-3xl font-bold text-black">{product.name}</h1>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-black">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
                <button 
                  className="btn btn-ghost btn-sm"
                  aria-label="Share product"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="py-4 border-y">
              <div className="flex items-center justify-between">
                <span className="text-black">Availability</span>
                <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            {/* Additional Information */}
            {product.additionalInfo && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-black">Additional Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.additionalInfo}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="join border rounded-lg">
                  <button className="join-item btn btn-ghost px-4">-</button>
                  <input 
                    type="text" 
                    className="join-item w-16 text-center border-none" 
                    value="1" 
                    readOnly 
                  />
                  <button className="join-item btn btn-ghost px-4">+</button>
                </div>
                <button className="btn bg-black text-white hover:bg-gray-800 flex-1">
                  Add to Cart
                </button>
              </div>
              {/* "Buy Now" button removed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
