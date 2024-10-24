'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../supabase'; // Adjust the import path if needed
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const { user, isSignedIn } = useUser(); // Clerk auth
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false); // Boolean to check if user is admin
  const [adminData, setAdminData] = useState(null); // Stores admin data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch user data to check if admin
  const fetchAdminStatus = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users') // Assuming the users table includes the admin field
      .select('admin')
      .eq('clerk_id', user.id);

    if (error) {
      console.error('Error fetching admin data:', error);
      return;
    }

    if (data && data.length > 0) {
      setIsAdmin(data[0].admin === true); // Check if the user is an admin
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAdminStatus();
    }
  },);

  // Redirect if not admin or not signed in
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/'); // Redirect non-admin users to the home page
    }
  }, [isAdmin, isLoading, router]);

  if (!isSignedIn) {
    return <p>Please sign in to access the admin dashboard.</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Dashboard sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Books */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Books</h2>
          <button
            // onClick={() => router.push('/admin/books')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all w-full"
          >
            View & Edit Books
          </button>
          <p className="text-sm mt-2 text-gray-600">Add new books, edit existing books, or remove old listings.</p>
        </div>

        {/* Manage Users */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Users</h2>
          <button
            // onClick={() => router.push('/admin/users')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all w-full"
          >
            View & Edit Users
          </button>
          <p className="text-sm mt-2 text-gray-600">View registered users, edit their roles, or delete accounts.</p>
        </div>

        {/* Manage Orders */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Orders</h2>
          <button
            // onClick={() => router.push('/admin/orders')}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all w-full"
          >
            View & Edit Orders
          </button>
          <p className="text-sm mt-2 text-gray-600">Track and manage orders placed by users.</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-700">Total Books</h3>
            <p className="text-3xl font-bold text-blue-700">120</p> {/* Replace with dynamic data */}
          </div>

          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700">Total Users</h3>
            <p className="text-3xl font-bold text-green-700">450</p> {/* Replace with dynamic data */}
          </div>

          <div className="bg-yellow-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-yellow-700">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-700">35</p> {/* Replace with dynamic data */}
          </div>
        </div>
      </div>

      {/* Profile Settings and Logout */}
      <div className="mt-10 flex justify-end">
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
        //   onClick={() => router.push('/admin/settings')}
        >
          Profile Settings
        </button>
        <button
          className="bg-gray-600 text-white px-6 py-2 ml-4 rounded-lg hover:bg-gray-700 transition-all"
        //   onClick={() => router.push('/sign-out')}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
