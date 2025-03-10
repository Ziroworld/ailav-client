import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { createProduct, createCategory } from '../../../server/admin-api.jsx'; // Product API functions
import { uploadImage } from '../../../cloudinary/CloudinaryUploadWidget.jsx'; // Use the Cloudinary uploader function
import useProduct from '../../../hooks/useProduct.jsx'; // Hook for products
import useCategory from '../../../hooks/useCategory.jsx'; // Hook for categories

const ProductSection = () => {
  const { products, setProducts, loading, error } = useProduct();
  const { categories, setCategories, loadingCat, errorCat } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryAction, setCategoryAction] = useState('add'); // only "add" implemented for now
  const [newCategoryName, setNewCategoryName] = useState('');

  // Controlled form state for new product
  const [newProduct, setNewProduct] = useState({
    image: null,
    name: '',
    price: '',
    inStock: '',
    categoryId: '',
    description: '',
    additionalInfo: '',
    imageUrl: ''
  });

  const handleProductSubmit = async (e) => {
    e.preventDefault();
  
    let imageUrl = newProduct.imageUrl;
    if (newProduct.image) {
      // Upload the image to Cloudinary and get the URL
      imageUrl = await uploadImage(newProduct.image);
    }
  
  
    // Build the payload matching the backend's expected keys:
    const payload = {
      name: newProduct.name,
      price: Number(newProduct.price),
      inStock: Number(newProduct.inStock),               // Use 'stock' instead of 'inStock'
      categoryId: newProduct.categoryId,     // Pass the category's name
      description: newProduct.description,           // Use 'longDescription' instead of 'description'
      additionalInfo: newProduct.additionalInfo,
      imageUrl
    };

    console.log("Payload being sent:", payload);
  
    try {
      const createdProduct = await createProduct(payload);
      setProducts([...products, createdProduct.product]);
      console.log('Product created:', createdProduct);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  
    // Clear the form state
    setNewProduct({
      image: null,
      name: '',
      price: '',
      inStock: '',
      categoryId: '',
      description: '',
      additionalInfo: '',
      imageUrl: ''
    });
  };
  
  // Handler for category actions (only "add" is implemented here)
  const handleCategoryAction = async () => {
    if (categoryAction === 'add') {
      try {
        const createdCategory = await createCategory({ name: newCategoryName });
        // Refresh the categories by appending the new category
        setCategories([...categories, createdCategory]);
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
    setIsCategoryModalOpen(false);
    setNewCategoryName('');
  };

  // Filter products by search term
  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading || loadingCat) return <div>Loading...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;
  if (errorCat) return <div>Error loading categories: {errorCat.message}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-sm opacity-70">Manage your product inventory</p>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleProductSubmit} className="bg-base-100 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Product Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Image */}
          <div className="form-control">
            <label className="label">Product Image</label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/*"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  image: e.target.files ? e.target.files[0] : null
                })
              }
            />
          </div>
          {/* Product Name */}
          <div className="form-control">
            <label className="label">Product Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter product name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          {/* Price */}
          <div className="form-control">
            <label className="label">Price</label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Enter price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>
          {/* In Stock */}
          <div className="form-control">
            <label className="label">In Stock</label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Enter stock quantity"
              value={newProduct.inStock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, inStock: e.target.value })
              }
            />
          </div>
          {/* Category */}
          <div className="form-control">
            <label className="label">Category</label>
            <div className="flex gap-2">
              <select
                className="select select-bordered flex-1"
                value={newProduct.categoryId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, categoryId: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id || category.id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  setCategoryAction('add');
                  setIsCategoryModalOpen(true);
                }}
              >
                <Edit2 size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="form-control">
          <label className="label">Description</label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          ></textarea>
        </div>
        {/* Additional Information */}
        <div className="form-control">
          <label className="label">Additional Information</label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Enter additional information"
            value={newProduct.additionalInfo}
            onChange={(e) =>
              setNewProduct({ ...newProduct, additionalInfo: e.target.value })
            }
          ></textarea>
        </div>
        <button className="btn bg-black text-white hover:bg-gray-800 w-full md:w-auto" type="submit">
          Add New Product
        </button>
      </form>

      {/* Search Section for Products */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="input input-bordered w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section for Products */}
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>In Stock</th>
            <th className="hidden md:table-cell">Category</th>
            <th className="hidden lg:table-cell">Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length ? (
            currentProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td className="hidden md:table-cell">
                  {product.category}
                </td>
                <td className="hidden lg:table-cell">
                  {product.longDescription ? product.longDescription.slice(0, 50) : 'No description available'}...
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No products available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>


      {/* Pagination Section for Products */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="join-item btn btn-sm">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <dialog className={`modal ${isCategoryModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setIsCategoryModalOpen(false)}
          >
            <X size={16} />
          </button>
          <h3 className="font-bold text-lg">
            {categoryAction === 'add'
              ? 'Add Category'
              : categoryAction === 'update'
              ? 'Update Category'
              : 'Delete Category'}
          </h3>
          {categoryAction !== 'delete' ? (
            <div className="py-4">
              <input
                type="text"
                placeholder="Category name"
                className="input input-bordered w-full"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
          ) : (
            <div className="py-4">
              <select
                className="select select-bordered w-full"
                onChange={(e) =>
                  setSelectedCategory(
                    categories.find((cat) => cat.id === e.target.value) || null
                  )
                }
              >
                <option value="">Select category to delete</option>
                {categories.map((category) => (
                  <option key={category._id || category.id} value={category._id || category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="modal-action">
            <button
              className="btn bg-black text-white hover:bg-gray-800"
              onClick={handleCategoryAction}
            >
              {categoryAction === 'add'
                ? 'Add'
                : categoryAction === 'update'
                ? 'Update'
                : 'Delete'}
            </button>
            <button className="btn" onClick={() => setIsCategoryModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProductSection;
