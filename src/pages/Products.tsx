
import React from "react";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

const Products = () => {
  const { products, loading, setSelectedProduct } = useProduct();
  const navigate = useNavigate();
  
  const handleViewProduct = (id: string | number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
    }
    navigate(`/product/${id}`);
  };
  
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={goBack}
              className="mr-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="text-white"
              onClick={() => navigate('/products')}
            >
              Products
            </Button>
            <Button 
              variant="ghost" 
              className="text-white"
              onClick={() => window.alert("Pricing page coming soon!")}
            >
              Pricing
            </Button>
            <Button 
              variant="ghost" 
              className="text-white"
              onClick={() => window.alert("About page coming soon!")}
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              className="text-white"
              onClick={() => window.alert("Contact page coming soon!")}
            >
              Contact
            </Button>
            <Button 
              variant="outline" 
              className="text-white ml-2"
              onClick={() => navigate('/admin-dashboard')}
            >
              Admin
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-white">All Products</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-800/80 rounded-xl overflow-hidden border border-gray-700 p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
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
                  <p className="text-gray-400 mb-4 text-sm line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-400">
                      {product.price === 0 ? "Free" : `$${product.price}`}
                    </span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
