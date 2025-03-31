import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useProduct } from "@/contexts/ProductContext";
import { Skeleton } from "@/components/ui/skeleton";

const LandingPage = () => {
  const navigate = useNavigate();
  const { products, loading, setSelectedProduct } = useProduct();
  const featuredProductsRef = useRef<HTMLElement>(null);
  
  const handleViewProduct = (id: string | number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
    }
    navigate(`/product/${id}`);
  };
  
  const scrollToProducts = () => {
    if (featuredProductsRef.current) {
      featuredProductsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white">
              Products
            </Button>
            <Button variant="ghost" className="text-white">
              Pricing
            </Button>
            <Button variant="ghost" className="text-white">
              About
            </Button>
            <Button variant="ghost" className="text-white">
              Contact
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-fade-in">
            Premium Digital Products
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-in opacity-80">
            Boost your productivity with our high-quality digital tools and resources
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6"
              onClick={scrollToProducts}
            >
              Browse Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="text-white border-white px-6 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section ref={featuredProductsRef} className="container mx-auto px-4 py-16 bg-black/30 backdrop-blur-sm rounded-3xl mb-16">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-800/80 rounded-xl overflow-hidden border border-gray-700 p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map(product => (
              <div 
                key={product.id} 
                className="bg-gray-800/80 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-gray-700 hover:border-purple-500/50 group cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Product+Image";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-400">${product.price}</span>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProduct(product.id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-lg">No products available yet.</p>
              <p className="mt-4 text-gray-400">Check back soon for new products!</p>
            </div>
          )}
        </div>
        <div className="text-center mt-12">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <div className="mt-6 md:mt-0">
              <p className="text-gray-400">© 2023 Digitalio. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
