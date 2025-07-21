import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../../hooks/useCart"; // Adjust path if needed

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.imageUrl || "https://via.placeholder.com/180?text=No+Image"];

  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || images.length < 2) return;
    const interval = setInterval(() => {
      setImgIndex(prev => (prev + 1) % images.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  useEffect(() => {
    if (isHovered) return;
    const timeout = setTimeout(() => setImgIndex(0), 500);
    return () => clearTimeout(timeout);
  }, [isHovered]);

  return (
    <div
      className={`
        group cursor-pointer relative flex flex-col items-center
        bg-white/95 backdrop-blur-xl border border-gray-200
        shadow-xl rounded-3xl px-4 pt-4 pb-6 mb-3
        transition-all duration-300
        hover:scale-[1.024] hover:shadow-[0_8px_36px_0_rgba(0,0,0,0.12)]
      `}
      onClick={() => navigate(`/customer/product/${product._id}`)}
      style={{
        minWidth: 210,
        minHeight: 310,
        boxShadow: "0 4px 36px 0 rgba(0,0,0,0.07), 0 1.5px 14px 0 rgba(30,50,60,0.09)"
      }}
    >
      {/* Wishlist & Cart Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          className="
            w-9 h-9 rounded-full bg-white shadow flex items-center justify-center
            border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-gray-50 hover:scale-110 transition-all
          "
          onClick={e => {
            e.stopPropagation();
            // handleWishlist(product._id);
          }}
          aria-label="Add to wishlist"
        >
          <FaHeart size={18} />
        </button>
        <button
          className="
            w-9 h-9 rounded-full bg-white shadow flex items-center justify-center
            border border-gray-200 text-gray-500 hover:text-green-600 hover:bg-gray-50 hover:scale-110 transition-all
          "
          onClick={e => {
            e.stopPropagation();
            addToCart(product, 1); // Add to cart!
          }}
          aria-label="Add to cart"
        >
          <FaShoppingCart size={18} />
        </button>
      </div>

      {/* Image */}
      <div
        className="
          relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden mb-3
          shadow-md bg-gray-100 border border-gray-200 flex items-center justify-center
          group-hover:shadow-[0_6px_18px_0_rgba(0,0,0,0.08)]
          transition-all duration-200
        "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={e => { e.stopPropagation(); setImgIndex(prev => (prev + 1) % images.length); }}
      >
        <img
          src={images[imgIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-2xl"
          style={{ background: "#f5f5f5", aspectRatio: "4/5" }}
        />
      </div>

      {/* Price */}
      <span className="font-bold text-lg mb-1 text-black tracking-tight">
        NPR {product.price?.toLocaleString()}
      </span>
      {/* Name */}
      <span className="text-center text-base sm:text-[17px] mb-2 font-medium text-gray-800 line-clamp-2 leading-tight">
        {product.name}
      </span>
      {/* View Details */}
      <button
        className="
          mt-3 px-5 py-2 bg-black text-white rounded-full font-semibold shadow
          transition-all duration-200 hover:shadow-2xl hover:scale-105
          text-[15px] tracking-wide
        "
        onClick={e => {
          e.stopPropagation();
          navigate(`/customer/product/${product._id}`);
        }}
      >
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
