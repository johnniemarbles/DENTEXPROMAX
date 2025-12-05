
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../packages/database/client';
import { Vendor, Order, Product } from '../../../packages/database/types';
import { LucideDollarSign, LucidePackage, LucideTruck } from 'lucide-react';

interface VendorDashboardProps {
  vendor: Vendor;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendor }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const db = createClient();

  useEffect(() => {
    db.getOrdersByVendor(vendor.id).then(setOrders);
    db.getProductsByVendor(vendor.id).then(setProducts);
  }, [vendor.id]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'processing').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Executive Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         {/* REVENUE */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <LucideDollarSign size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</h3>
               </div>
            </div>
         </div>

         {/* ACTIVE LISTINGS */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <LucidePackage size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500 font-medium">Active Products</p>
                  <h3 className="text-2xl font-bold text-slate-900">{products.length}</h3>
               </div>
            </div>
         </div>

         {/* PENDING ORDERS */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                  <LucideTruck size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500 font-medium">Pending Shipment</p>
                  <h3 className="text-2xl font-bold text-slate-900">{pendingOrders}</h3>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
