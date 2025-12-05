
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { Vendor, Order } from '../../../../packages/database/types';
import { LucideTruck, LucideClock, LucideCheckCircle } from 'lucide-react';

interface OrdersPageProps {
  vendor: Vendor;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ vendor }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const db = createClient();

  const refresh = () => db.getOrdersByVendor(vendor.id).then(setOrders);

  useEffect(() => {
    refresh();
  }, [vendor.id]);

  const handleStatusChange = async (orderId: string, newStatus: 'processing' | 'shipped' | 'delivered') => {
      await db.updateOrderStatus(orderId, newStatus);
      refresh();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
       <h1 className="text-3xl font-bold text-slate-900 mb-8">Order Management</h1>

       <div className="space-y-4">
          {orders.map(order => (
             <div key={order.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900">Order #{order.id.split('-')[1]}</h3>
                      <span className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</span>
                   </div>
                   <div className="text-sm text-slate-600">
                      Total: <span className="font-bold text-slate-900">${order.total_amount.toFixed(2)}</span>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase
                      ${order.status === 'processing' ? 'bg-orange-100 text-orange-700' : ''}
                      ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                   `}>
                      {order.status === 'processing' && <LucideClock size={14} />}
                      {order.status === 'shipped' && <LucideTruck size={14} />}
                      {order.status === 'delivered' && <LucideCheckCircle size={14} />}
                      {order.status}
                   </div>

                   <select 
                      className="text-sm border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-orange-500"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                   >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                   </select>
                </div>
             </div>
          ))}
          {orders.length === 0 && (
             <div className="text-center py-12 text-slate-400">No orders found.</div>
          )}
       </div>
    </div>
  );
};
