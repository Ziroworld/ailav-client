// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const HomeSection = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const featuredItems = [
//     {
//       id: 1,
//       name: "Premium Whiskey",
//       description: "Aged 12 years, smooth finish with caramel notes",
//       image: "https://placeholder.com/800x600",
//       price: "$59.99"
//     }
//   ];

//   const categories = [
//     "Wine", "Beer", "Whiskey", "Vodka", "Gin", "Rum", "Tequila", "Soft Drinks"
//   ];

//   const products = [
//     {
//       id: 1,
//       name: "Red Wine",
//       description: "Classic Cabernet Sauvignon",
//       image: "https://placeholder.com/400x300",
//       price: "$29.99"
//     }
//   ];

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle('dark');
//   };

//   return (
//     <div className={`min-h-screen ${isDarkMode ? 'dark:bg-gray-900' : 'bg-white'}`}>
//       <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <Link to="/" className="flex items-center">
//               <span className="text-2xl font-bold text-black dark:text-white">LiquorStore</span>
//             </Link>

//             <div className="hidden md:flex items-center space-x-8">
//               <Link to="/products" className="text-black dark:text-white hover:text-gray-600">Products</Link>
//               <Link to="/about" className="text-black dark:text-white hover:text-gray-600">About Us</Link>
              
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="w-64 px-4 py-1 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-black dark:text-white"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <button onClick={toggleTheme} className="p-2">
//                 {isDarkMode ? '🌞' : '🌙'}
//               </button>
//               <Link to="/cart" className="text-black dark:text-white">
//                 <span className="relative">
//                   🛒
//                   <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black rounded-full w-5 h-5 text-xs flex items-center justify-center">0</span>
//                 </span>
//               </Link>
//               <Link to="/register" className="text-black dark:text-white hover:underline">Register</Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="pt-16">
//         <div className="container mx-auto px-4 py-8">
//           <div className="overflow-x-auto flex space-x-4 pb-4">
//             {featuredItems.map((item) => (
//               <div key={item.id} className="flex-none w-full md:w-2/3 lg:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//                 <div className="flex flex-col md:flex-row">
//                   <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-t-lg md:rounded-l-lg md:rounded-t-none"></div>
//                   <div className="p-6 flex flex-col justify-between">
//                     <div>
//                       <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{item.name}</h2>
//                       <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
//                     </div>
//                     <button className="mt-4 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200">
//                       Shop Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="container mx-auto px-4 py-6">
//           <div className="flex overflow-x-auto space-x-6 pb-2">
//             {categories.map((category, index) => (
//               <button
//                 key={index}
//                 className="flex-none text-black dark:text-white hover:underline px-4 py-2"
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//                 <div className="w-full h-48 bg-gray-200"></div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{product.name}</h3>
//                   <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
//                   <div className="flex justify-between items-center">
//                     <span className="text-black dark:text-white font-bold">{product.price}</span>
//                     <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200">
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <span className="text-2xl font-bold text-black dark:text-white">LiquorStore</span>
//             </div>
//             <div className="flex flex-wrap justify-center md:justify-end space-x-6">
//               <Link to="/about" className="text-black dark:text-white hover:text-gray-600">About Us</Link>
//               <Link to="/contact" className="text-black dark:text-white hover:text-gray-600">Contact</Link>
//               <Link to="/terms" className="text-black dark:text-white hover:text-gray-600">Terms</Link>
//               <Link to="/privacy" className="text-black dark:text-white hover:text-gray-600">Privacy</Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomeSection;