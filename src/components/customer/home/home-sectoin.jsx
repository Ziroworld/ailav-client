import React, { useState, useMemo } from "react";
import useHome from "../../../hooks/useHome.jsx";
import { useCart } from "../../../hooks/useCart";
import ProductCarousal from "./product-carousal.jsx";
import { motion } from "framer-motion";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const fadeUp = {
  hidden: { opacity: 0, y: 64 },
  show: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 } },
};

const HomeSection = () => {
  const { homeData: products, loading, error } = useHome();
  const { addToCart } = useCart();

  // Shuffle for randomness
  const newArrivalRandom = useMemo(() => shuffleArray(products || []), [products]);
  const bestSellingRandom = useMemo(() => shuffleArray(products || []), [products]);

  // Responsive items per page
  const itemsPerPage = typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 5;
  const totalNewArrivalPages = Math.ceil(newArrivalRandom.length / itemsPerPage);
  const totalBestSellingPages = Math.ceil(bestSellingRandom.length / itemsPerPage);

  const [newArrivalSlide, setNewArrivalSlide] = useState(0);
  const [bestSellingSlide, setBestSellingSlide] = useState(0);

  if (loading)
    return <div className="flex items-center justify-center h-[60vh] text-2xl text-black/70">Loading products…</div>;
  if (error)
    return <div className="flex items-center justify-center h-[60vh] text-2xl text-red-500">Error loading products</div>;

  // Featured hero products
  const wineProduct = products.find((p) => p.category === "Wine");
  const beerProduct = products.find((p) => p.category === "Beer");

  // Paginate
  const newArrivalProducts = newArrivalRandom.slice(
    newArrivalSlide * itemsPerPage,
    (newArrivalSlide + 1) * itemsPerPage
  );
  const bestSellingProducts = bestSellingRandom.slice(
    bestSellingSlide * itemsPerPage,
    (bestSellingSlide + 1) * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white font-sans relative">
      {/* Visual FX background */}
      <div className="pointer-events-none select-none absolute -z-10 left-1/2 top-0 -translate-x-1/2 w-[950px] h-[700px] blur-[130px] opacity-30 bg-gradient-to-br from-black/10 via-gray-200 to-white"></div>

      {/* HERO OFFER - WINE */}
      {wineProduct && (
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto px-4 py-28 flex flex-col md:flex-row items-center justify-between min-h-[70vh] gap-10 md:gap-20"
        >
          <div className="flex-1 flex flex-col gap-4 md:pr-10">
            <div className="uppercase text-lg font-bold text-black/60 tracking-wider mb-1 flex items-center">
              <span>Seasonal Wine Offer</span>
              <span className="mx-2 font-extrabold text-black/80">&ndash; 15% OFF</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.9 } }}
              className="text-5xl md:text-6xl font-extrabold text-black leading-tight tracking-tight mb-1"
            >
              {wineProduct.name}
            </motion.h1>
            <div className="text-xl font-bold text-black/60 mb-2">${wineProduct.price}</div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.04 }}
              onClick={e => { e.preventDefault(); addToCart(wineProduct, 1); }}
              className="mt-1 w-max px-8 py-3 bg-black text-white rounded-full text-lg font-semibold shadow-lg hover:bg-gray-900 transition"
            >
              Add to cart
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
            className="flex-1 flex justify-center items-center relative"
          >
            <div className="absolute inset-0 scale-105 bg-white/50 blur-3xl rounded-3xl shadow-2xl opacity-70 z-0" />
            <motion.img
              src={wineProduct.imageUrl}
              alt={wineProduct.name}
              className="relative z-10 rounded-3xl aspect-[4/5] object-cover w-full max-w-[360px] shadow-[0_14px_60px_0_rgba(0,0,0,0.14)]"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.15, duration: 0.7, type: "spring" } }}
            />
          </motion.div>
        </motion.section>
      )}

      {/* NEW ARRIVALS - with your own ProductCarousal */}
      <ProductCarousal products={newArrivalProducts} title="New Arrivals" />

      {/* Ailav animated Description */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, type: "spring" }}
        className="max-w-4xl mx-auto py-14 md:py-24 px-4"
      >
        <motion.div
          className="bg-gradient-to-r from-white via-gray-50 to-gray-100 shadow-2xl rounded-3xl px-8 py-14 md:px-20 flex flex-col items-center"
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.05, type: "spring" }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-black mb-4 tracking-tight">Ailav</h2>
          <p className="max-w-2xl text-gray-700 md:text-lg text-center font-medium leading-relaxed">
            Ailav is Nepal's most beautiful modern alcohol delivery experience. With a meticulously curated range of wines, beers, and spirits—delivered chilled, fast, and reliably to your door—Ailav stands for next-level service, design, and genuine delight. Whether it’s a big celebration or a quiet evening, we make every moment seamless, safe, and memorable. Discover real world curation, trusted by thousands, designed for you.
          </p>
        </motion.div>
      </motion.section>

      {/* BEST SELLING - your ProductCarousal */}
      <ProductCarousal products={bestSellingProducts} title="Festival Best Selling" />

      {/* HERO OFFER - BEER */}
      {beerProduct && (
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 py-28 flex flex-col-reverse md:flex-row items-center justify-between min-h-[70vh] gap-10 md:gap-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
            className="flex-1 flex justify-center items-center relative"
          >
            <div className="absolute inset-0 scale-105 bg-white/50 blur-3xl rounded-3xl shadow-2xl opacity-70 z-0" />
            <motion.img
              src={beerProduct.imageUrl}
              alt={beerProduct.name}
              className="relative z-10 rounded-3xl aspect-[4/5] object-cover w-full max-w-[360px] shadow-[0_14px_60px_0_rgba(0,0,0,0.14)]"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.18, duration: 0.7, type: "spring" } }}
            />
          </motion.div>
          <div className="flex-1 flex flex-col gap-4 md:pl-10">
            <div className="uppercase text-lg font-bold text-black/60 tracking-wider mb-1 flex items-center">
              <span>Seasonal Beer Offer</span>
              <span className="mx-2 font-extrabold text-black/80">&ndash; 15% OFF</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.9 } }}
              className="text-5xl md:text-6xl font-extrabold text-black leading-tight tracking-tight mb-1"
            >
              {beerProduct.name}
            </motion.h1>
            <div className="text-xl font-bold text-black/60 mb-2">${beerProduct.price}</div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.04 }}
              onClick={e => { e.preventDefault(); addToCart(beerProduct, 1); }}
              className="mt-1 w-max px-8 py-3 bg-black text-white rounded-full text-lg font-semibold shadow-lg hover:bg-gray-900 transition"
            >
              Add to cart
            </motion.button>
          </div>
        </motion.section>
      )}

      {/* NEWSLETTER */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative w-full py-28 bg-white flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <div className="w-[540px] h-[200px] bg-gradient-to-br from-black/5 via-gray-100 to-white/60 rounded-full blur-2xl" />
        </div>
        <motion.div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center tracking-tight">
            Stay Up To Date About <span className="text-gray-400 font-light">Our Latest Offers</span>
          </h2>
          <form
            className="w-full max-w-xl flex flex-col md:flex-row items-center justify-center gap-4 px-2"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-8 py-4 rounded-full text-black text-lg font-semibold border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-black transition bg-white"
              required
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.04 }}
              className="px-10 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-900 shadow-xl transition"
              type="submit"
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomeSection;
