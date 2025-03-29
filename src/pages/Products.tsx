
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useProduct } from "@/contexts/ProductContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const Products = () => {
  const navigate = useNavigate();
  const { products, loading, setSelectedProduct } = useProduct();
  
  const handleViewProduct = (id: string | number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
    }
    navigate(`/product/${id}`);
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
            <Link to="/admin-login">
              <Button variant="outline" className="text-white border-white">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-4">
          <Button 
            variant="ghost" 
            className="text-white" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white">All Products</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            // Display skeletons while loading
            Array.from({ length: 8 }).map((_, index) => (
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
              <Button 
                className="mt-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate('/admin-login')}
              >
                Login as Admin to add products
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 py-12 border-t border-gray-800 mt-16">
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

export default Products;
