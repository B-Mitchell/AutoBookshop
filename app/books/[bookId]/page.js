'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; 
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BookDetailsPage = ({ params }) => {
  const { bookId } = React.use(params);
  const { user, isSignedIn } = useUser(); // Clerk auth
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // New state for payment modal
  const [billingAddress, setBillingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState(1); // Default to 1 copy
  const [proofImage, setProofImage] = useState(null); // New state for proof of payment image
  const [vendorAccount, setVendorAccount] = useState(null); // Vendor's account details

  // const userId = user.id;
  // Fetch book details based on bookId

  // Fetch vendor's account details based on vendorID
  const fetchVendorAccount = async (vendorID) => {
    try {
      const { data, error } = await supabase
        .from('users') // Assuming 'users' table contains vendor account details
        .select('account_number, bank_name, account_name')
        .eq('clerk_id', vendorID)
        .single();

      if (error) {
        throw error;
      }
      console.log(data)
      setVendorAccount(data);
    } catch (error) {
      console.error('Error fetching vendor account details:', error);
    }
  };
  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();
  
        if (error) {
          throw error;
        }
        setBook(data);
        if (user) {
          fetchVendorAccount(data.vendorID); // Fetch vendor account details
          console.log(data.vendorID)
        }
        
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Error fetching book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [bookId, user]);

  // Handle order placement
  const handleOrder = async (e) => {
    e.preventDefault();
      if (!user) {
        alert('Please log in to place an order');
        return;
      }
      const userId = user.id;
    // Prepare the order data
    const orderData = {
      bookID: bookId,
      userID: userId,
      title: book.title,
      vendorID: book.vendorID, 
      address: billingAddress,
      phone: phoneNumber,
      copies: numberOfCopies,
      status: 0,
      cost: book.amount * numberOfCopies,
    };

    // Insert order into the database
    const { error } = await supabase.from('orders').insert([orderData]);

    if (error) {
      console.error('Error placing order:', error);
    } else {
      alert(`Order placed for: ${book.title} (Copies: ${numberOfCopies})`);
      setIsModalOpen(false); // Close order modal
      setIsPaymentModalOpen(true); // Open payment modal
    }
  };

  // Handle proof of payment image change
  const handleProofChange = (e) => {
    setProofImage(e.target.files[0]);
  };

  if (loading) return <p className='text-center mt-3 text-[1.1rem] animate-pulse'>Loading book details...</p>;
  //if (!isSignedIn) return <p>please create an account to view this page</p>;
  if (error) return <p className="text-red-500 text-center mt-3 text-[1.1rem]">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:border mt-7 border-gray-300 rounded-md shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
        {/* Book Details */}
        <div className="p-4 border-r border-gray-300">
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <p className="text-lg mb-2">Author: <span className="font-medium">{book.author}</span></p>
          <p className="text-md mb-2 text-gray-600">Department: {book.faculty}</p>
          <p className="text-md mb-2 text-gray-600">In Stock: {book.inStock}</p>
          <p className="text-xl font-semibold mb-4 text-green-700">${book.amount}</p>
          <p className="mb-6 text-gray-700">Book Description: {book.desc}</p>
          <p className="mb-6 text-gray-700">Vendor Description: {book.vendorDesc}</p>

          {/* Order Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white py-2 px-4 rounded-lg transition-all hover:bg-green-700"
          >
            Place Order
          </button>
        </div>

        <div className='md:hidden block w-[100%]'>
            <hr />
        </div>

        {/* Book Image */}
        <div className="flex justify-center">
          {book.imgPath ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${book.imgPath}`}
              alt={book.title}
              width={300}
              height={400}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-64 h-96 bg-gray-200 rounded-md flex items-center justify-center">
              <span>No Image Available</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <form onSubmit={handleOrder}>
              <div className="mb-4">
                <label className="block mb-1">Billing Address:</label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Number of Copies:</label>
                <input
                  type="number"
                  min="1"
                  value={numberOfCopies}
                  onChange={(e) => setNumberOfCopies(Number(e.target.value))}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="flex justify-between mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg transition-all hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg transition-all hover:bg-green-700"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {isPaymentModalOpen && vendorAccount && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Vendor Account Details</h2>
            <p className="mb-4"><strong>Bank Name:</strong> {vendorAccount.bank_name}</p>
            <p className="mb-4"><strong>Account Name:</strong> {vendorAccount.account_name}</p>
            <p className="mb-4"><strong>Account Number:</strong> {vendorAccount.account_number}</p>

            <form>
              <div className="mb-4">
                <label className="block mb-1">Upload Proof of Payment:</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleProofChange}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button 
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg transition-all hover:bg-gray-500"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg transition-all hover:bg-green-700"
                >
                  Submit Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
