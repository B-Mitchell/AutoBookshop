'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs'; // Assuming you're using Clerk for auth
import { supabase } from '@/app/supabase';

const UploadBook = () => {
  const { user } = useUser(); // Get the current user
  const router = useRouter(); // Router for navigation
  const [ isVendor, setIsVendor ] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    desc: '',
    dept: '',
    faculty: '',
    amount: '',
    inStock: '',
    vendorDesc: '',
    ebookPrice: '',
  });
  useEffect(() => {
    // Check if the user is a vendor
    const checkVendorStatus = async () => {
      const { data, error } = await supabase
        .from('users') // Assuming you have a vendors table
        .select('*')
        .eq('email', user.emailAddresses[0].emailAddress) // Check based on the email
        if (error) {
            console.log(error)
        } else {
            setIsVendor(true);
            console.log(data);
        }
    };

    if (user) {
      checkVendorStatus();
      console.log(isVendor);
    }
  }, [user, isVendor]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Create a preview of the uploaded image
  };

  const handleCreateBook = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if the user has uploaded an image
      if (!imageFile) throw new Error('Please upload an image');

      // Generate a unique image path based on the user ID and file name
      const imagePath = `books/${user.id}_${imageFile.name}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images') // Replace with your bucket name
        .upload(imagePath, imageFile);

      if (uploadError) throw uploadError;

      // Insert book data into the database, including the image file path
      const { error } = await supabase
        .from('books')
        .insert([
          {
            ...formData,
            vendorID: user.id, // Use Clerk user ID as vendor ID
            imgPath: imagePath, // Store the image path in the database
          },
        ]);

      if (error) throw error;

      alert('Book uploaded successfully!');
      setFormData({
        title: '',
        author: '',
        desc: '',
        dept: '',
        faculty: '',
        amount: '',
        inStock: '',
        vendorDesc: '',
        ebookPrice: '',
      })
    } catch (error) {
      console.error(error);
      setError('Error uploading book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateBook(); // Call the create book function
  };

  // Redirect or show message if not vendor
  if (!isVendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-red-500">Only vendors can upload books.</p>
        
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Upload Book</h1>
      <div className="flex flex-col md:flex-row">
        {/* Form Section */}
        <form className="md:w-1/2" onSubmit={handleSubmit}>
          {/* Form Fields */}
          {/* Book ID */} 
          {/* BOOK ID is automatically geneated in the database */}
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Author */}
          <div className="mb-4">
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Department */}
          <div className="mb-4">
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Faculty */}
          <div className="mb-4">
            <label className="block text-gray-700">Faculty</label>
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* In Stock */}
          <div className="mb-4">
            <label className="block text-gray-700">In Stock</label>
            <input
              type="number"
              name="inStock"
              value={formData.inStock}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Vendor Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Vendor Description</label>
            <textarea
              name="vendorDesc"
              value={formData.vendorDesc}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Ebook Price */}
          <div className="mb-4">
            <label className="block text-gray-700">Ebook Price</label>
            <input
              type="number"
              name="ebookPrice"
              value={formData.ebookPrice}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white p-2 rounded-md" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Book'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        {/* Image Preview Section */}
        <div className="md:w-1/2 md:pl-4 mt-4 md:mt-0">
          {imagePreview && (
            <div className="border w-[100%] rounded-md mt-7 overflow-hidden">
              <Image src={imagePreview} alt="Book Cover Preview" width={300} height={400} className="object-cover w-[100%]" />
            </div>
          )}
          {!imagePreview && (
            <div className="border w-[100%] rounded-md mt-7 h-[100%] overflow-hidden">
                <p className='text-center mt-8 text-gray-600'>Image goes here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadBook;
