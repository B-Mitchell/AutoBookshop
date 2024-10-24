'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

const VendorBooksPage = () => {
  const { user } = useUser(); // Get the logged-in user's information
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For handling image modal
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch books for the logged-in vendor
  const fetchBooks = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('vendorID', user.id); // Fetch books where vendorID matches the logged-in user's ID

      if (error) throw error;

      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error fetching books.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle modal to view book image
  const handleImageClick = (imgPath) => {
    setSelectedImage(imgPath);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Delete book
  const deleteBook = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const { error } = await supabase
          .from('books')
          .delete()
          .eq('id', bookId); // Delete book where id matches the bookId

        if (error) throw error;

        // Remove the deleted book from the local state
        setBooks(books.filter(book => book.id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Error deleting book.');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  },);

  // Filter books based on search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-full"
      />
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">Book ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Author</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">In Stock</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 w-4 overflow-hidden whitespace-nowrap text-ellipsis text-[.9rem]" title={book.id}>{book.id}</td>
              <td className="border border-gray-300 p-2">{book.title}</td>
              <td className="border border-gray-300 p-2">{book.author}</td>
              <td className="border border-gray-300 p-2">${book.amount}</td>
              <td className="border border-gray-300 p-2">{book.inStock}</td>
              <td className="border border-gray-300 p-2">
                <button 
                  onClick={() => handleImageClick(book.imgPath)} 
                  className="text-blue-600 underline"
                >
                  View Image
                </button>
              </td>
              <td className="border border-gray-300 p-2">
                <button 
                  onClick={() => deleteBook(book.id)} 
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying book image */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${selectedImage}`}
            alt="Book Cover"
            width={200}
            height={300}
            className="max-w-full max-h-full p-4"
          />
        </div>
      )}
    </div>
  );
};

export default VendorBooksPage;
