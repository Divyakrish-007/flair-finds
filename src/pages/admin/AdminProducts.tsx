import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  ExternalLink,
  RefreshCw,
  Star
} from 'lucide-react';
import { Product, ProductCategory, Gender, PlatformSource } from '../../types';
import { productsApi, adminApi } from '../../services/api';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Dresses');
  const [gender, setGender] = useState<Gender>('Women');
  const [price, setPrice] = useState<number>(1499);
  const [originalPrice, setOriginalPrice] = useState<number>(2999);
  const [discount, setDiscount] = useState<number>(50);
  const [stock, setStock] = useState<number>(25);
  const [source, setSource] = useState<PlatformSource>('Amazon');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [sizesInput, setSizesInput] = useState('S, M, L, XL');
  const [colorsInput, setColorsInput] = useState('Black, White, Emerald');

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getProducts({ limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setCategory('Dresses');
    setGender('Women');
    setPrice(1499);
    setOriginalPrice(2999);
    setDiscount(50);
    setStock(25);
    setSource('Amazon');
    setImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80');
    setDescription('');
    setSizesInput('S, M, L, XL');
    setColorsInput('Black, White, Emerald');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setGender(p.gender);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setDiscount(p.discount);
    setStock(p.stock);
    setSource(p.source);
    setImage(p.image);
    setDescription(p.description);
    setSizesInput(p.sizes.join(', '));
    setColorsInput(p.colors.join(', '));
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted from database.');
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const productPayload = {
      name,
      brand,
      category,
      gender,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discount: Number(discount),
      stock: Number(stock),
      source,
      image,
      description,
      sizes: sizesInput.split(',').map(s => s.trim()).filter(Boolean),
      colors: colorsInput.split(',').map(c => c.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        const data = await adminApi.updateProduct(editingProduct.id, productPayload);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
        showToast('Product updated successfully!');
      } else {
        const data = await adminApi.addProduct(productPayload);
        setProducts(prev => [data.product, ...prev]);
        showToast('New product added to catalog!');
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-slide-left">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Product Management <span className="text-purple-400 text-base font-normal">({products.length})</span>
          </h1>
          <p className="text-xs text-slate-400">Add, edit, and control pricing & stock across all platform catalogs</p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs py-2.5 px-4 font-bold shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <input
          type="text"
          placeholder="Filter products by title, brand or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1A2E] text-xs text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-purple-500/25 outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Products Table */}
      <div className="glass bg-[#121224]/80 rounded-3xl border border-purple-500/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F0F1A] border-b border-purple-500/15 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category / Gender</th>
                <th className="p-4">Source</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-purple-950/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-12 object-cover rounded-lg bg-slate-900 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="text-white font-bold truncate">{prod.name}</p>
                        <p className="text-[10px] text-purple-300 font-medium">{prod.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{prod.category}</div>
                    <div className="text-[10px] text-slate-500">{prod.gender}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/30 text-purple-300 border border-purple-500/20">
                      {prod.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">₹{prod.price.toLocaleString('en-IN')}</div>
                    {prod.discount > 0 && (
                      <div className="text-[10px] text-emerald-400">{prod.discount}% off</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${prod.stock < 10 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="p-4 text-amber-400 font-bold flex items-center gap-1 mt-3 sm:mt-4">
                    <span>{prod.rating}</span>
                    <Star className="w-3 h-3 fill-amber-400" />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay p-4">
          <div className="modal-content max-w-2xl w-full bg-[#121224] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-950 via-[#1A1A2E] to-purple-950 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-400" />
                <span>{editingProduct ? 'Edit Fashion Product' : 'Add New Fashion Product'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field text-xs"
                    placeholder="e.g. Silk Satin Midi Dress"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="input-field text-xs"
                    placeholder="e.g. Zara, Nike, H&M"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-[#0F0F1A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-purple-500/30 outline-none"
                  >
                    {['Dresses', 'Tops', 'Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Shoes', 'Bags', 'Watches', 'Jewellery', 'Accessories'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Gender Target</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full bg-[#0F0F1A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-purple-500/30 outline-none"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Marketplace Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as PlatformSource)}
                    className="w-full bg-[#0F0F1A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-purple-500/30 outline-none"
                  >
                    <option value="Amazon">Amazon</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Meesho">Meesho</option>
                    <option value="Snapdeal">Snapdeal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Product Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-field text-xs"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Available Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  className="input-field text-xs"
                  placeholder="S, M, L, XL"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Available Colors (comma-separated)</label>
                <input
                  type="text"
                  value={colorsInput}
                  onChange={(e) => setColorsInput(e.target.value)}
                  className="input-field text-xs"
                  placeholder="Black, White, Emerald"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0F0F1A] text-xs text-white p-3 rounded-xl border border-purple-500/30 outline-none resize-none"
                  placeholder="Fabric, silhouette, styling notes..."
                />
              </div>

              <div className="pt-4 border-t border-purple-500/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-purple-500/20 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-6 font-bold"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save Updates' : 'Publish Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
