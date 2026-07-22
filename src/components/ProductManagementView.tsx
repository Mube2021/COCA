import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  QrCode,
  Barcode,
  Search,
  Filter,
  AlertTriangle,
  X,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const ProductManagementView: React.FC = () => {
  const { products, addProduct, editProduct, deleteProduct, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Barcode/QR view modal state
  const [selectedBarcodeProduct, setSelectedBarcodeProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [bottleSize, setBottleSize] = useState('300ml Glass');
  const [category, setCategory] = useState<Product['category']>('Carbonated Soft Drink');
  const [unitPrice, setUnitPrice] = useState<number>(18);
  const [costPrice, setCostPrice] = useState<number>(13.5);
  const [stockBottles, setStockBottles] = useState<number>(10000);
  const [minStockAlert, setMinStockAlert] = useState<number>(2000);
  const [barcode, setBarcode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [image, setImage] = useState('');

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBottleSize('300ml Glass');
    setCategory('Carbonated Soft Drink');
    setUnitPrice(18);
    setCostPrice(13.5);
    setStockBottles(5000);
    setMinStockAlert(1500);
    setBarcode(`5449000${Math.floor(100000 + Math.random() * 900000)}`);
    setQrCode(`COCA-PROD-${Date.now()}`);
    setImage('https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBottleSize(p.bottleSize);
    setCategory(p.category);
    setUnitPrice(p.unitPrice);
    setCostPrice(p.costPrice);
    setStockBottles(p.stockBottles);
    setMinStockAlert(p.minStockAlert);
    setBarcode(p.barcode);
    setQrCode(p.qrCode);
    setImage(p.image);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cratesInStock = Math.floor(stockBottles / 24);

    if (editingProduct) {
      editProduct({
        ...editingProduct,
        name,
        bottleSize,
        category,
        unitPrice: Number(unitPrice),
        costPrice: Number(costPrice),
        stockBottles: Number(stockBottles),
        cratesInStock,
        minStockAlert: Number(minStockAlert),
        barcode,
        qrCode,
        image: image || 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
      });
    } else {
      addProduct({
        name,
        bottleSize,
        category,
        unitPrice: Number(unitPrice),
        costPrice: Number(costPrice),
        stockBottles: Number(stockBottles),
        cratesInStock,
        minStockAlert: Number(minStockAlert),
        barcode,
        qrCode,
        image: image || 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
      });
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bottleSize.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Package className="w-6 h-6 text-[#E41E26]" />
            <span>Product & Beverage Catalog</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official Coca-Cola beverages, wholesale pricing in ETB, bottle specs, and barcode inventory sync.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#E41E26] hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, bottle size, or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="Carbonated Soft Drink">Carbonated Soft Drink</option>
            <option value="Juice">Juice</option>
            <option value="Energy">Energy</option>
            <option value="Water">Water</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="p-4">Product Details</th>
                <th className="p-4">Bottle Size</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Price (ETB)</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Codes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
              {filteredProducts.map((p) => {
                const isLowStock = p.stockBottles <= p.minStockAlert;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {p.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold bg-red-50 dark:bg-red-950/50 text-[#E41E26] px-2.5 py-1 rounded-md text-xs">
                        {p.bottleSize}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                      {p.category}
                    </td>

                    <td className="p-4">
                      <div className="font-black text-slate-900 dark:text-white text-sm">
                        {p.unitPrice} Birr
                      </div>
                      <div className="text-[10px] text-slate-400">Cost: {p.costPrice} ETB</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {p.stockBottles.toLocaleString()} Bottles
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500">
                          ({p.cratesInStock} Crates)
                        </span>
                        {isLowStock ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-0.5" /> Low Stock
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            Healthy
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => setSelectedBarcodeProduct(p)}
                        className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 px-2 py-1 rounded text-[11px] font-mono transition"
                      >
                        <Barcode className="w-3.5 h-3.5 text-red-600" />
                        <span>{p.barcode}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              {editingProduct ? 'Edit Product Details' : 'Add New Beverage Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Coca-Cola Original"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bottle Size / Spec
                  </label>
                  <input
                    type="text"
                    required
                    value={bottleSize}
                    onChange={(e) => setBottleSize(e.target.value)}
                    placeholder="e.g. 300ml Glass"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product['category'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="Carbonated Soft Drink">Carbonated Soft Drink</option>
                    <option value="Juice">Juice</option>
                    <option value="Energy">Energy</option>
                    <option value="Water">Water</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price (ETB / Bottle)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Price (ETB)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock (Bottles)
                  </label>
                  <input
                    type="number"
                    required
                    value={stockBottles}
                    onChange={(e) => setStockBottles(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    required
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Barcode Number
                  </label>
                  <input
                    type="text"
                    required
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    QR Code String
                  </label>
                  <input
                    type="text"
                    required
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E41E26] hover:bg-red-700 text-white rounded-lg font-bold shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode & QR Code View Dialog */}
      {selectedBarcodeProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 text-center relative">
            <button
              onClick={() => setSelectedBarcodeProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
              {selectedBarcodeProduct.name} ({selectedBarcodeProduct.bottleSize})
            </h3>
            <p className="text-xs text-slate-500 mb-4">Official Product Barcode & QR Identifier</p>

            {/* Generated Barcode Graphic Simulation */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 my-4 space-y-3">
              <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                BARCODE: {selectedBarcodeProduct.barcode}
              </div>
              <div className="flex justify-center items-center h-16 bg-white p-2 rounded border border-slate-300 space-x-1">
                {/* SVG Barcode lines */}
                {Array.from({ length: 30 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-black h-full"
                    style={{ width: `${(idx % 3) + 1}px` }}
                  ></div>
                ))}
              </div>

              <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                QR CODE: {selectedBarcodeProduct.qrCode}
              </div>
              <div className="w-24 h-24 mx-auto bg-white p-2 rounded border border-slate-300 grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`${idx % 2 === 0 ? 'bg-black' : 'bg-white'} rounded-xs`}
                  ></div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedBarcodeProduct(null)}
              className="w-full bg-[#E41E26] hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
