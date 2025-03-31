
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "@/contexts/ProductContext";
import { ArrowLeft, ShoppingCart, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, loading, setSelectedProduct } = useProduct();
  
  // Find the product by ID
  const product = React.useMemo(() => {
    return products.find(p => p.id === id);
  }, [products, id]);

  React.useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product, setSelectedProduct]);
  
  const handlePurchase = () => {
    if (product) {
      if (product.price === 0) {
        // For free products, simulate a successful download
        toast({
          title: "Download Started",
          description: "Your free product download has started!",
        });
        
        // Simulate download completion after a short delay
        setTimeout(() => {
          toast({
            title: "Download Complete",
            description: "Your free product has been downloaded successfully!",
          });
        }, 2000);
      } else {
        // For paid products, navigate to checkout
        navigate("/checkout");
      }
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-40 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl text-white mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")} className="bg-purple-600 hover:bg-purple-700">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-black/20 rounded-xl overflow-hidden border border-gray-700 p-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Product+Image";
              }}
            />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{product.name}</h1>
            
            <div className="text-3xl font-bold text-purple-400">
              {product.price === 0 ? "Free" : `$${product.price.toFixed(2)}`}
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description}
            </p>
            
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-6 w-6 flex-shrink-0 text-green-400 mr-2">•</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-6">
              <Button 
                onClick={handlePurchase} 
                size="lg" 
                className={`${
                  product.price === 0 ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
                } px-8 py-6 text-lg`}
              >
                {product.price === 0 ? (
                  <>
                    <Download className="mr-2 h-5 w-5" /> Download Now
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
