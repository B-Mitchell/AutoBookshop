'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch featured books (this could be the top-rated or most popular ones)
  const fetchFeaturedBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books') // Assuming your books table is called 'books'
        .select('*')
        .limit(4); // Limit the number of featured books (you can adjust this)

      if (error) throw error;

      setFeaturedBooks(data);
    } catch (error) {
      console.error('Error fetching featured books:', error);
      setError('Failed to load featured books.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative w-full h-screen bg-gray-800 text-white flex items-center justify-center">
        <div className="relative z-10 text-center p-7 bg-opacity-70 bg-gray-900 rounded-lg">
          <h1 className="text-5xl font-bold mb-6">Discover Your Next Favorite Book</h1>
          <p className="text-xl mb-6">
            Browse through a wide selection of books from various faculties and departments.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md" onClick={() => router.push('/books')}>
              Browse Collection
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-12 bg-gray-200">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Next Read</h2>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for books, authors, or categories..."
              className="w-full p-4 border rounded-lg text-lg"
            />
            <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg w-full">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Science</h3>
              <p className="text-gray-600">Explore books in Physics, Chemistry, and Biology</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Arts</h3>
              <p className="text-gray-600">Explore books in History, Literature, and Philosophy</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Engineering</h3>
              <p className="text-gray-600">Explore books in Mechanical, Civil, and Electrical Engineering</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Business</h3>
              <p className="text-gray-600">Explore books in Finance, Marketing, and Management</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredBooks.length === 0 ? (
              <p>No featured books available.</p>
            ) : (
              featuredBooks.map((book) => (
                <div key={book.id} className="bg-white shadow-md rounded-lg cursor-pointer hover:scale-95 p-4 hover:shadow-lg transition" onClick={() => router.push(`/books/${book.id}`)}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${book.imgPath}`}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <h3 className="text-xl font-bold mt-4">{book.title}</h3>
                  <p className="text-gray-600">Author: {book.author}</p>
                  <p className="text-gray-900 font-bold mt-2">${book.amount}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Want to sell your books?</h2>
          <p className="text-lg mb-6">Join our community of vendors and start selling today!</p>
          <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-md" onClick={() => router.push('/profile')}>
            Become a Vendor
          </button>
        </div>
      </section>
    </main>
  );
}
