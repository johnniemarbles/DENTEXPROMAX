
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { Vendor, Product } from '../../../../packages/database/types';
import { insertProductSchema } from '../../../../packages/database/zod-schemas';
import { Button, Input } from '../../../../packages/ui/src';
import { LucidePlus, LucideTag } from 'lucide-react';

interface ProductsPageProps {
  vendor: Vendor;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ vendor }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });
  const [error, setError] = useState<string | null>(null);
  const db = createClient();

  const refresh = () => db.getProductsByVendor(vendor.id).then(setProducts);

  useEffect(() => {
    refresh();
  }, [vendor.id]);

  const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      try {
          const payload = {
              vendor_id: vendor.id,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              stock_count: parseInt(newProduct.stock),
              category: newProduct.category || 'General'
          };
          insertProductSchema.parse(payload);
          await db.createProduct(payload);
          setIsAdding(false);
          setNewProduct({ name: '', price: '', stock: '', category: '' });
          refresh();
      } catch (err: any) {
          if (err.errors) setError(err.errors[0].message);
          else setError("Invalid input");
      }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-orange-500 hover:bg-orange-600">
             <LucidePlus size={18} className="mr-2" /> Add Product
          </Button>
       </div>

       {isAdding && (
           <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100 mb-8 animate-in slide-in-from-top-4">
              <h3 className="font-bold text-lg mb-4">New Product Listing</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <Input label="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    <Input label="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Input label="Price ($)" type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    <Input label="Stock Count" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                 </div>
                 {error && <div className="text-red-500 text-sm">{error}</div>}
                 <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Save Product</Button>
                 </div>
              </form>
           </div>
       )}

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
                <tr>
                   <th className="px-6 py-4">Product Name</th>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4">Stock</th>
                   <th className="px-6 py-4">Price</th>
                   <th className="px-6 py-4 text-right">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                   <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                      <td className="px-6 py-4 text-slate-500 flex items-center gap-2"><LucideTag size={14} /> {p.category}</td>
                      <td className="px-6 py-4 text-slate-900">{p.stock_count} units</td>
                      <td className="px-6 py-4 font-mono text-slate-600">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                         <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">ACTIVE</span>
                      </td>
                   </tr>
                ))}
                {products.length === 0 && (
                   <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No products listed yet.</td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};
