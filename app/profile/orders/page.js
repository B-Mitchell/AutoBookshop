'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; 
import { useUser } from '@clerk/nextjs';

const OrdersPage = () => {
  const { user } = useUser(); // Clerk auth
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders based on user type
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`userID.eq.${user.id},vendorID.eq.${user.id}`); // Fetch orders for both users and vendors

      if (error) throw error;

      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) {
      console.error('Error deleting order:', error);
    } else {
      // Refresh orders after deletion
      setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
    }
  };

  useEffect(() => {
    if (user) {
        fetchOrders();
    }
  }, );

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">Order ID</th>
            <th className="border border-gray-300 p-2">Book Title</th>
            <th className="border border-gray-300 p-2">Copies</th>
            <th className="border border-gray-300 p-2">Total Cost</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{order.id}</td>
              <td className="border border-gray-300 p-2">{order.title}</td>
              <td className="border border-gray-300 p-2">{order.copies}</td>
              <td className="border border-gray-300 p-2">${order.cost}</td>
              <td className="border border-gray-300 p-2">{order.status === 0 ? 'Pending' : 'Completed'}</td>
              <td className="border border-gray-300 p-2">
                <button 
                  onClick={() => handleDeleteOrder(order.id)} 
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 ? (<p className='text-center mt-3 text-red-500'>No orders yet</p>) : null }
    </div>
  );
};

export default OrdersPage;
