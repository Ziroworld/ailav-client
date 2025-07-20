import React, { useState } from "react";
import ProductCard from "./product-card ";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ProductCarousel({ products = [], title, subtitle, visible = 4 }) {
  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      if (w < 640) return 1;
      if (w < 900) return 2;
      return visible;
    }
    return visible;
  };

  const [start, setStart] = useState(0);
  const [currVisible, setCurrVisible] = useState(getVisibleCount());

  React.useEffect(() => {
    const onResize = () => setCurrVisible(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [visible]);

  React.useEffect(() => {
    if (start > products.length - currVisible) {
      setStart(Math.max(0, products.length - currVisible));
    }
  }, [currVisible, products.length]);

  const maxVisible = Math.min(currVisible, products.length);
  const canPrev = start > 0;
  const canNext = start + maxVisible < products.length;
  const currentProducts = products.slice(start, start + maxVisible);

  const handlePrev = () => {
    if (canPrev) setStart((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    if (canNext) setStart((s) => Math.min(products.length - maxVisible, s + 1));
  };

  return (
    <div className="max-w-6xl mx-auto py-14 relative px-2">
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">{title}</h2>
      )}
      {subtitle && (
        <p className="text-center text-gray-500 mb-6">{subtitle}</p>
      )}
      <div className="relative flex items-center group">
        {/* Left Arrow */}
        {canPrev && (
          <button
            className="absolute left-0 sm:-left-8 z-20 p-3 rounded-full bg-white border border-gray-300 shadow-lg
                        hover:bg-black hover:text-white transition-all duration-200 opacity-90"
            onClick={handlePrev}
            aria-label="Previous"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <FaChevronLeft size={20} />
          </button>
        )}
        {/* Product Grid */}
        <div
          className={`grid w-full gap-7 lg:gap-8
            grid-cols-1
            ${maxVisible === 2 ? "sm:grid-cols-2" : ""}
            ${maxVisible === 4 ? "md:grid-cols-4" : ""}
            transition-all`}
          style={{ padding: "0.5rem 0" }}
        >
          {currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {/* Right Arrow */}
        {canNext && (
          <button
            className="absolute right-0 sm:-right-8 z-20 p-3 rounded-full bg-white border border-gray-300 shadow-lg
                        hover:bg-black hover:text-white transition-all duration-200 opacity-90"
            onClick={handleNext}
            aria-label="Next"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCarousel;
