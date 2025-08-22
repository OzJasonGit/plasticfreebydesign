 "use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser, faSearch, faBars, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import bimcopilot_icon from "./bimcopilot_logo.svg";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const Clock = dynamic(() => import("./Clock/clock"), { ssr: false });
const DateComponent = dynamic(() => import("./Clock/date"), { ssr: false });

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // New robust token management system
  const TokenManager = {
    // Set token with proper formatting
    setToken: (tokenValue) => {
      try {
        // Clear any existing token first
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        localStorage.removeItem("token");
        
        // Set new token in both localStorage and cookies
        localStorage.setItem("token", tokenValue);
        const cookieString = `token=${tokenValue}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = cookieString;
        
        // Verify it was set
        const verification = TokenManager.getToken();
        if (verification) {
          console.log('TokenManager: Token set successfully');
          return true;
        } else {
          console.log('TokenManager: Token verification failed');
          return false;
        }
      } catch (error) {
        console.error('TokenManager: Error setting token:', error);
        return false;
      }
    },

    // Get token with robust parsing
    getToken: () => {
      try {
        // First check localStorage (primary source)
        const localToken = localStorage.getItem("token");
        if (localToken) {
          return localToken;
        }
        
        // Fallback to cookies
        const allCookies = document.cookie;
        
        // Method 1: Split by semicolon and trim each cookie
        const cookies = allCookies.split(';').map(cookie => cookie.trim());
        
        // Find token cookie
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        
        if (tokenCookie) {
          const tokenValue = tokenCookie.split('=')[1];
          return tokenValue;
        }
        
        // Method 2: Regex fallback
        const regexMatch = allCookies.match(/token=([^;]+)/);
        if (regexMatch) {
          return regexMatch[1];
        }
        
        return null;
      } catch (error) {
        console.error('TokenManager: Error getting token:', error);
        return null;
      }
    },

    // Clear token
    clearToken: () => {
      try {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        localStorage.removeItem("token"); // Also remove from localStorage
        console.log('TokenManager: Token cleared successfully');
        return true;
      } catch (error) {
        console.error('TokenManager: Error clearing token:', error);
        return false;
      }
    },

    // Check if token exists
    hasToken: () => {
      return TokenManager.getToken() !== null;
    }
  };

  // Manual refresh function for authentication state
  const refreshAuthState = async () => {
    try {
      const token = TokenManager.getToken();
      
      if (token) {
        const response = await fetch("/api/header_route", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          if (data.isAuthenticated) {
            setUser(data.user);
          }
        } else {
          const errorText = await response.text();
          console.error("Manual refresh failed:", errorText);
          
          // Only clear token on specific authentication errors
          if (response.status === 401 || response.status === 403) {
            console.log('Authentication error detected, clearing token...');
            TokenManager.clearToken();
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Manual refresh error:", error);
    }
  };

  // Expose refresh function globally
  useEffect(() => {
    window.refreshHeaderAuth = refreshAuthState;
    return () => {
      delete window.refreshHeaderAuth;
    };
  }, []);

  // Expose TokenManager globally for other components
  useEffect(() => {
    window.TokenManager = TokenManager;
    console.log('TokenManager exposed globally');
    
    return () => {
      delete window.TokenManager;
    };
  }, []);

  // Check for existing tokens when component mounts
  useEffect(() => {
    const token = TokenManager.getToken();
    if (token) {
      console.log('Header: Existing token found on mount');
    }
  }, []);

  // Monitor authentication state changes for debugging
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Header: User authenticated:', user?.name, 'Role:', user?.role);
    } else {
      console.log('Header: User not authenticated');
    }
  }, [isAuthenticated, user]);

  // Fetch authentication status and user data
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const token = TokenManager.getToken();
        
        if (token) {
          const response = await fetch("/api/header_route", {
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(data.isAuthenticated);
            if (data.isAuthenticated) {
              setUser(data.user);
            }
          } else {
            const errorText = await response.text();
            console.error("Failed to fetch header data:", errorText);
            
            // Only clear token on specific authentication errors
            if (response.status === 401 || response.status === 403) {
              console.log('Authentication error detected, clearing token...');
              TokenManager.clearToken();
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };

    fetchHeaderData();

    // Check authentication status every 5 seconds
    const interval = setInterval(fetchHeaderData, 5000);

    // Listen for storage events (when user logs in/out in another tab)
    const handleStorageChange = () => {
      fetchHeaderData();
    };

    // Listen for custom login event
    const handleLogin = () => {
      console.log('Login event detected, refreshing auth state...');
      setTimeout(refreshAuthState, 1000);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLogin);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLogin);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('=== Logout Started ===');
      
      const response = await fetch("/api/header_route", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout API call successful");
        // Use TokenManager to clear token
        TokenManager.clearToken();
        setIsAuthenticated(false);
        setUser(null);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        console.log("Logout successful");
        // Redirect to home page
        window.location.href = "/";
      } else {
        console.error("Logout API call failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Force logout even if API fails
      console.log("Forcing logout due to API error");
      TokenManager.clearToken();
      setIsAuthenticated(false);
      setUser(null);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      window.location.href = "/";
    }
    
    console.log('=== Logout Completed ===');
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    console.log('Toggling dropdown, current state:', isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log('Clicking outside dropdown, closing...');
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setIsDropdownOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
              {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              {/* <div className="relative w-12 h-12 mr-3 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={bimcopilot_icon}
                  alt="BIM Copilot Logo"
                  fill
                  className="object-contain"
                />
              </div> */}
              <div className="hidden sm:block">
                <span className="text-2xl font-avant_garde_bold text-white transition-colors duration-300 group-hover:text-emerald-400">
                  plasticfreebydesign
                </span>
                  </div>
                </Link>
              </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="relative px-4 py-2 text-sm font-medium text-stone-200 hover:text-white transition-all duration-300 group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
            <Link href="/products" className="relative px-4 py-2 text-sm font-medium text-stone-200 hover:text-white transition-all duration-300 group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/services" className="relative px-4 py-2 text-sm font-medium text-stone-200 hover:text-white transition-all duration-300 group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/blog" className="relative px-4 py-2 text-sm font-medium text-stone-200 hover:text-white transition-all duration-300 group">
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
          </nav>
   
          {/* Right Side */}
          <div className="flex items-center space-x-6">

            {/* Time & Date (Desktop only) */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-stone-800 text-stone-200 border border-stone-700">
                <Clock />
                <div className="w-px h-4 bg-stone-600"></div>
                <DateComponent />
              </div>
              </div>

            {/* Icons (search, wishlist, cart) */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-all duration-300">
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
              </button>
              <Link href="/cart" className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-all duration-300">
                <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
              </Link>
            </div>

            {/* Authentication */}
            <div className="hidden md:flex items-center space-x-4">
                  {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={toggleDropdown}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                    <span className="text-sm font-medium">Hi, {user?.name}</span>
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                     <div className="absolute right-0 mt-3 w-56 origin-top-right bg-stone-900 rounded-xl shadow-2xl ring-1 ring-stone-700 divide-y divide-stone-700 focus:outline-none z-50">
                       <div className="px-4 py-3">
                         <p className="text-sm text-stone-400">Signed in as</p>
                         <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                         <p className="text-sm text-emerald-400 mt-1">Hi, {user?.name || 'User'}</p>
                       </div>
                       <div className="py-1">
                         <Link
                           href="/profile"
                           className="block w-full text-left px-4 py-3 text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors duration-200 rounded-lg mx-2"
                           onClick={() => setIsDropdownOpen(false)}
                           >
                             <span className="flex items-center">
                             <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                               Profile
                             </span>
                         </Link>
                           <button
                             onClick={handleLogout}
                           className="block w-full text-left px-4 py-3 text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors duration-200 rounded-lg mx-2"
                           >
                             <span className="flex items-center">
                             <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-4 h-4" />
                             Sign out
                             </span>
                           </button>
                         </div>
                     </div>
                   )}
                </div>
              ) : (
                <>
                  <Link 
                    href="/signin" 
                    className="px-4 py-2 min-w-[80px] text-sm font-medium text-stone-300 hover:text-white transition-all duration-300"
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/signup" 
                    className="px-4 py-2 min-w-[80px] text-sm font-medium rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-stone-800">
          <div className="px-4 py-6 space-y-4">
            <nav className="space-y-3">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="block px-3 py-2 text-base font-medium text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link href="/services" className="block px-3 py-2 text-base font-medium text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Services
              </Link>
              <Link href="/blog" className="block px-3 py-2 text-base font-medium text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Blog
              </Link>
            </nav>
            
            {/* Mobile Authentication */}
            <div className="pt-4 border-t border-stone-700">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-3 py-2 bg-stone-800 rounded-lg">
                    <p className="text-sm text-stone-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    <p className="text-sm text-emerald-400">Hi, {user?.name}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-base font-medium text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                      Profile
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200"
                  >
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-4 h-4" />
                      Sign out
                    </span>
                  </button>
                    </div>
                  ) : (
                <div className="space-y-3">
                  <Link 
                    href="/signin" 
                    className="block px-3 py-2 text-base font-medium text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                      </Link>
                  <Link 
                    href="/signup" 
                    className="block px-3 py-2 text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                      </Link>
                    </div>
                  )}
                </div>
            
            {/* Mobile Time and Date */}
            <div className="pt-4 border-t border-stone-700">
              <div className="flex items-center justify-center space-x-4 px-3 py-2 bg-stone-800 rounded-full border border-stone-700">
                <Clock />
                <div className="w-px h-4 bg-stone-600"></div>
                <DateComponent />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
