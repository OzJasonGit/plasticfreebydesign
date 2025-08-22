"use client";
import { useState, useEffect } from "react";
import { CartProvider } from "@/components/Context/CartContext";
import Header from "@/components/Header/Header";
import Menu from "@/components/Menu/menu";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar, faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-pulse text-stone-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-stone-50">
        {/* <Menu /> */}
        <Header />
        
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200"></div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-avant_garde_bold text-stone-800 mb-8 leading-tight">
              Sustainable
              <br />
              <span className="text-stone-600">Design</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover tools and resources for architects, designers, and enthusiasts who care about the future of our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products"
                className="bg-stone-800 text-stone-50 px-8 py-4 rounded-lg hover:bg-stone-700 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Shop Now
                <FontAwesomeIcon 
                  icon={faArrowRight} 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                />
              </Link>
              <Link 
                href="/services"
                className="border-2 border-stone-800 text-stone-800 px-8 py-4 rounded-lg hover:bg-stone-800 hover:text-stone-50 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-stone-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-stone-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-avant_garde_bold text-stone-800 mb-6">
                Featured Tools
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Essential resources for modern design professionals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsLoading ? (
                <div className="animate-pulse text-stone-400 text-xl">Loading featured products...</div>
              ) : featuredProducts.length === 0 ? (
                <div className="text-center text-stone-600">No featured products found.</div>
              ) : (
                featuredProducts.map((product, index) => (
                  <div key={product.product_id || index} className="group bg-stone-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="w-full h-64 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                      {product.main_image ? (
                        <img 
                          src={product.main_image} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="text-6xl text-stone-400" style={{ display: product.main_image ? 'none' : 'flex' }}>
                        🏗️
                      </div>
                    </div>
                    <h3 className="text-2xl font-avant_garde_bold text-stone-800 mb-3">
                      {product.title}
                    </h3>
                    <p className="text-stone-600 mb-4 leading-relaxed">
                      {product.short_description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-stone-800">
                          ${product.student_price}
                        </span>
                        <span className="text-sm text-stone-500">/</span>
                        <span className="text-sm text-stone-600">
                          {product.license_type === 'student' ? 'Student' : 'Commercial'}
                        </span>
                      </div>
                      <Link 
                        href={`/products/${product.slug}`}
                        className="text-stone-800 hover:text-stone-600 font-medium group-hover:underline"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6 bg-stone-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-avant_garde_bold text-stone-800 mb-6">
                Why Choose Us
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                We're committed to empowering designers with sustainable, innovative tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-3xl text-stone-50">♻️</div>
                </div>
                <h3 className="text-2xl font-avant_garde_bold text-stone-800 mb-4">
                  Sustainable
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Every tool and resource is designed with environmental impact in mind.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-3xl text-stone-50">🚀</div>
                </div>
                <h3 className="text-2xl font-avant_garde_bold text-stone-800 mb-4">
                  Innovative
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Cutting-edge technology that keeps you ahead of the curve.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-3xl text-stone-50">🤝</div>
                </div>
                <h3 className="text-2xl font-avant_garde_bold text-stone-800 mb-4">
                  Community
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Join a network of passionate designers and architects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-stone-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-avant_garde_bold text-stone-50 mb-6">
              Ready to Transform Your Design Process?
            </h2>
            <p className="text-xl text-stone-200 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who are already using our tools to create better, more sustainable designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="bg-stone-50 text-stone-800 px-8 py-4 rounded-lg hover:bg-stone-100 transition-all duration-300 font-medium"
              >
                Get Started Free
              </Link>
              <Link 
                href="/products"
                className="border-2 border-stone-50 text-stone-50 px-8 py-4 rounded-lg hover:bg-stone-50 hover:text-stone-800 transition-all duration-300 font-medium"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </CartProvider>
  );
};

export default Home;
