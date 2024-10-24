// 'use client';
// import { useState, useEffect } from 'react';
// import { useUser } from '@clerk/nextjs';
// import { supabase } from '../supabase';
// import { useRouter } from 'next/navigation';

// const ProfilePage = () => {
//     const router = useRouter();
//   const { user, isSignedIn } = useUser(); // Clerk auth
//   const [isVendor, setIsVendor] = useState(false); // Toggle for Vendor/User form
//   const [profileData, setProfileData] = useState(null); // Stores user profile data from Supabase
//   const [isLoading, setIsLoading] = useState(true); // Loading state
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // Toggle between user and vendor form
//   const toggleVendor = () => setIsVendor((prev) => !prev);

//   // Fetch user profile from Supabase by Clerk ID
//   const fetchProfile = async () => {
//     if (!user) return;

//     const { data, error } = await supabase
//       .from('users') // Assuming the table is named 'users'
//       .select('*')
//       .eq('clerk_id', user.id); // Use Clerk ID to find the user

//     if (data && data.length > 0) {
//       setProfileData(data[0]); // Store the user's profile data if it exists
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     if (user) {
//       fetchProfile();
//     }
//   }, [user]);

//   // Handle form submission for new registration (user/vendor)
//   const handleRegistration = async (e) => {
//     setIsSubmitting(true);
//     e.preventDefault();

//     const formData = new FormData(e.target);

//     const newProfile = {
//       clerk_id: user.id, // Use Clerk ID as a unique identifier
//       email: user.emailAddresses[0].emailAddress, // Clerk email
//       name: formData.get('name'),
//       email: user.emailAddresses[0].emailAddress,
//       phone: formData.get('phone'),
//       user_type: isVendor ? 'vendor' : 'user', // Set user_type based on the toggle
//       ...(isVendor && {
//         business_name: formData.get('business_name'),
//         bank_name: formData.get('bank_name'),
//         account_number: formData.get('account_number'),
//         account_name: formData.get('account_name'),
//       }), // Only for vendors
//     };
//     try {
//         const { data, error } = await supabase.from('users').insert([newProfile]);

//         setProfileData(data);
//         fetchProfile();
//     } catch (error) {
//         console.error(error);
//     } finally {
//         setIsSubmitting(false);
//     }
//   };

//   if (!isSignedIn) {
//     return <p>Please sign in to access your profile.</p>;
//   }

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="container mx-auto py-4">
//       <h1 className="text-2xl font-bold mb-4">Profile Page</h1>

//       {/* If the profile exists, display profile data */}
//       {profileData ? (
//         <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
//         <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Profile Information</h2>
      
//         {/* Profile Info Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Basic Information */}
//           <div className="col-span-1">
//             <h3 className="text-lg font-semibold text-blue-600 mb-4">Basic Information</h3>
//             <div className="space-y-2">
//               <p className="text-gray-700">
//                 <span className="font-semibold">Name: </span>{profileData.name}
//               </p>
//               <p className="text-gray-700">
//                 <span className="font-semibold">Email: </span>{profileData.email}
//               </p>
//               <p className="text-gray-700">
//                 <span className="font-semibold">Phone: </span>{profileData.phone}
//               </p>
//             </div>
//           </div>
      
//           {/* Vendor Information (Conditional) */}
//           {profileData.user_type === 'vendor' && (
//             <div className="col-span-1">
//               <h3 className="text-lg font-semibold text-blue-600 mb-4">Vendor Information</h3>
//               <div className="space-y-2">
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Business Name: </span>{profileData.business_name}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Bank Name: </span>{profileData.bank_name}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Account Number: </span>{profileData.account_number}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Account Name: </span>{profileData.account_name}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
      
//         {/* Profile Actions */}
//         <div className="mt-8 flex justify-end">
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all" onClick={() => router.push('/profile/books')}>
//             My Books
//           </button>
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all ml-2" onClick={() => router.push('/profile/orders')}>
//             Orders
//           </button>
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all ml-2" onClick={() => router.push('/profile/upload')}>
//             Upload
//           </button>
//         </div>
//       </div>
//       ) : (
//         // If no profile, display the registration form
//         <form onSubmit={handleRegistration} className="space-y-4">
//           <div className="flex items-center">
//             <span className="mr-4">Register as: </span>
//             <button
//               type="button"
//               className={`px-4 py-2 ${!isVendor ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
//               onClick={toggleVendor}
//             >
//               User
//             </button>
//             <button
//               type="button"
//               className={`ml-2 px-4 py-2 ${isVendor ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
//               onClick={toggleVendor}
//             >
//               Vendor
//             </button>
//           </div>

//           {/* Common fields for both user and vendor */}
//           <div>
//             <label className="block text-sm font-medium">Name</label>
//             <input name="name" type="text" required className="w-full p-2 border border-gray-300 rounded" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Email</label>
//             <input name="email" type="email" value={user.emailAddresses[0].emailAddress} disabled required className="w-full p-2 border border-gray-300 rounded" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Phone</label>
//             <input name="phone" type="text" required className="w-full p-2 border border-gray-300 rounded" />
//           </div>

//           {/* Vendor-specific fields */}
//           {isVendor && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium">Business Name</label>
//                 <input name="business_name" type="text" required={isVendor} className="w-full p-2 border border-gray-300 rounded" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Bank Name</label>
//                 <input name="bank_name" type="text" required={isVendor} className="w-full p-2 border border-gray-300 rounded" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Account Number</label>
//                 <input name="account_number" type="text" required={isVendor} className="w-full p-2 border border-gray-300 rounded" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Account Name</label>
//                 <input name="account_name" type="text" required={isVendor} className="w-full p-2 border border-gray-300 rounded" />
//               </div>
//             </>
//           )}

//           <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-blue-600 text-white rounded">
//             Register
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;
'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../supabase';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser(); // Clerk auth
  const [isVendor, setIsVendor] = useState(false); // Toggle for Vendor/User form
  const [profileData, setProfileData] = useState(null); // Stores user profile data from Supabase
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile from Supabase by Clerk ID
  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users') // Assuming the table is named 'users'
      .select('*')
      .eq('clerk_id', user.id); // Use Clerk ID to find the user

    if (data && data.length > 0) {
      setProfileData(data[0]); // Store the user's profile data if it exists
    }
    setIsLoading(false);
  };
  const toggleVendor = () => setIsVendor((prev) => !prev);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, );

  // Handle form submission for new registration (user/vendor)
  const handleRegistration = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    const formData = new FormData(e.target);

    const newProfile = {
      clerk_id: user.id, // Use Clerk ID as a unique identifier
      email: user.emailAddresses[0].emailAddress, // Clerk email
      name: formData.get('name'),
      email: user.emailAddresses[0].emailAddress,
      phone: formData.get('phone'),
      user_type: isVendor ? 'vendor' : 'user', // Set user_type based on the toggle
      ...(isVendor && {
        business_name: formData.get('business_name'),
        bank_name: formData.get('bank_name'),
        account_number: formData.get('account_number'),
        account_name: formData.get('account_name'),
      }), // Only for vendors
    };
    try {
      const { data, error } = await supabase.from('users').insert([newProfile]);

      setProfileData(data);
      fetchProfile();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return <p>Please sign in to access your profile.</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>

      {/* If the profile exists, display profile data */}
      {profileData ? (
        <div>
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Profile Information</h2>

            {/* Profile Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Basic Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Name: </span>{profileData.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email: </span>{profileData.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone: </span>{profileData.phone}
                  </p>
                </div>
              </div>

              {/* Vendor Information (Conditional) */}
              {profileData.user_type === 'vendor' && (
                <div className="col-span-1">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Vendor Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Business Name: </span>{profileData.business_name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Bank Name: </span>{profileData.bank_name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Account Number: </span>{profileData.account_number}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Account Name: </span>{profileData.account_name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Actions */}
            <div className="mt-8 flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all" onClick={() => router.push('/profile/books')}>
                My Books
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all ml-2" onClick={() => router.push('/profile/orders')}>
                Orders
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all ml-2" onClick={() => router.push('/profile/upload')}>
                Upload
              </button>
            </div>
          </div>

          {/* Dashboard Section */}
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Example Dashboard Cards */}
              <div className="bg-blue-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Books</h3>
                <p className="text-2xl font-bold text-blue-700">10</p>
              </div>

              <div className="bg-green-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Pending Orders</h3>
                <p className="text-2xl font-bold text-green-700">5</p>
              </div>

              <div className="bg-yellow-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">Total Earnings</h3>
                <p className="text-2xl font-bold text-yellow-700">$120</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // If no profile, display the registration form
        <form onSubmit={handleRegistration} className="space-y-4">
          <div className="flex items-center">
            <span className="mr-4">Register as: </span>
            <button
              type="button"
              className={`px-4 py-2 ${!isVendor ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={toggleVendor}
            >
              User
            </button>
            <button
              type="button"
              className={`ml-2 px-4 py-2 ${isVendor ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={toggleVendor}
            >
              Vendor
            </button>
          </div>

          {/* Common fields for both user and vendor */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" type="text" required className="w-full p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" value={user.emailAddresses[0].emailAddress} disabled required className="w-full p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input name="phone" type="text" required className="w-full p-2 border border-gray-300 rounded" />
          </div>

          {/* Vendor-specific fields */}
          {isVendor && (
            <>
              <div>
                <label className="block text-sm font-medium">Business Name</label>
                <input name="business_name" type="text" required className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium">Bank Name</label>
                <input name="bank_name" type="text" required className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium">Account Number</label>
                <input name="account_number" type="text" required className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium">Account Name</label>
                <input name="account_name" type="text" required className="w-full p-2 border border-gray-300 rounded" />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
