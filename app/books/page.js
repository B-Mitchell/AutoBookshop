'use client'; // Ensure the page is a client component
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; // Adjust the path as necessary
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BooksPage = () => {
  const [books, setBooks] = useState([]); // Store fetched books
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Store any error messages
  const [searchTerm, setSearchTerm] = useState(''); // Track the search input
  const router = useRouter();

  // Fetch all books from Supabase
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('books').select('*'); // Fetching data from the "books" table

        if (error) {
          throw error;
        }

        setBooks(data); // Store fetched books
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Error fetching books. Please try again later.'); // Set error message
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) // Convert both book titles and search term to lowercase for case-insensitive matching
  );

  // Handle loading state
  if (loading) {
    return <p className="text-center mt-4">Loading books...</p>;
  }

  // Handle error state
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Books</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchTerm} // Bind search term to input
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {filteredBooks.length === 0 ? ( // Check if there are no filtered books
          <p className="text-center">No books found.</p>
        ) : (
          filteredBooks.map((book) => ( // Render filtered books
            <div key={book.id} className="border p-4 rounded-lg shadow-md bg-white flex flex-col items-center">
              {/* Book Image */}
              <div className="mb-4">
                {book.imgPath ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${book.imgPath}`}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="rounded-md object-cover h-[15rem]"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              {/* Book Details */}
              <h2 className="text-lg font-bold text-center mb-1">{book.title}</h2>
              <p className="text-gray-700 text-center mb-1">Author: <span className="font-medium">{book.author}</span></p>
              <p className="text-gray-500 text-center text-sm mb-4">Department: <span className="font-medium">{book.faculty}</span></p>

              {/* View Details Button */}
              <button onClick={() => router.push(`/books/${book.id}`)} className="mt-auto bg-blue-600 text-white p-2 rounded-md w-full transition-all hover:bg-blue-700">
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BooksPage;
