'use client';
import React, { useState } from 'react';
import { useUser, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'; // Clerk for authentication
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from "@/public/logo.png"; // Assuming the logo is placed in the public folder

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const router = useRouter(); // Initialize router for navigation

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Helper function for navigation
  const navigate = (path) => {
    router.push(path);
    toggleMenu(); // Close menu after navigating
  };

  return (
    <nav className="bg-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer bg-red-500 rounded-full" onClick={() => navigate('/')}>
            <Image src={logo} alt="Logo" width={50} height={50} />
          </div>

          {/* Menu for larger screens */}
          <div className="hidden md:block">
            <ul className="ml-10 flex items-baseline space-x-4">
              <li>
                <button onClick={() => navigate('/')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/books')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Books
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/profile')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </button>
              </li>

              {/* Signed In View */}
              <SignedIn>
                <li>
                  <UserButton /> {/* Clerk's UserButton for profile/logout */}
                </li>
              </SignedIn>

              {/* Signed Out View */}
              <SignedOut>
                <li>
                  <SignInButton mode="modal" className="hover:bg-gray-500 px-3 py-2 rounded-md font-medium text-white">
                    Sign In
                  </SignInButton>
                </li>
              </SignedOut>
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-blue-900 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden text-center">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <li>
              <button onClick={() => navigate('/')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/books')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full">
                Books
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/profile')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full">
                Profile
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full">
                Admin
              </button>
            </li>

            {/* Signed In View */}
            <SignedIn>
              <li className="hover:bg-blue-700 block text-left px-3 py-2 rounded-md text-base font-medium w-full">
                <UserButton /> {/* Clerk's UserButton for profile/logout */}
              </li>
            </SignedIn>

            {/* Signed Out View */}
            <SignedOut>
              <li>
                <SignInButton mode="modal" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full">
                  Sign In
                </SignInButton>
              </li>
            </SignedOut>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
