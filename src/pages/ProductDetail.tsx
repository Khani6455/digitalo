
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, ArrowLeft, Star, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useProduct } from "@/contexts/ProductContext";
import Logo from "@/components/Logo";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, loading, setSelectedProduct, selectedProduct } = useProduct();
  const [added, setAdded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleAddToCart = () => {
    // In a real app, you would add the product to the cart
    // For demo purposes, we'll just show a toast and update the button state
    if (product) {
      const cartItem = {
        id: String(product.id), // Ensure the id is a string
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        features: product.features || []
      };
      
      // Add to cart (in a real app, update cart state)
      setSelectedProduct(cartItem); 

      // Show toast
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
      
      // Update button state
      setAdded(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const cartItem = {
        id: String(product.id), // Ensure the id is a string
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        features: product.features || []
      };
      
      // Save selected product and navigate to checkout
      setSelectedProduct(cartItem);
      
      // For free products, simulate direct download
      if (product.price === 0) {
        // Simulate download
        simulateDownload(product.name);
      } else {
        navigate("/checkout");
      }
    }
  };
  
  const simulateDownload = (productName: string) => {
    setDownloading(true);
    
    // Simulate download process
    toast({
      title: "Preparing Download",
      description: `Please wait while we prepare your download...`,
    });
    
    // Simulate delay
    setTimeout(() => {
      // Create a dummy download link
      const dummyContent = `Thank you for downloading ${productName}!\nThis is a demo download file.`;
      const blob = new Blob([dummyContent], {type: 'text/plain'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${productName.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Show success message
      toast({
        title: "Download Complete",
        description: `${productName} has been downloaded successfully.`,
      });
      
      // Reset downloading state
      setDownloading(false);
      
      // Simulate email
      toast({
        title: "Email Sent",
        description: "A download link has also been sent to your email address.",
      });
    }, 2000);
  };

  // Find the product based on the URL parameter
  const product = products.find(p => String(p.id) === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
        <p className="text-gray-300 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate("/products")} className="bg-purple-600 hover:bg-purple-700">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <Button variant="outline" className="text-white" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-800/50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain aspect-square"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/600?text=Product+Image";
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-400 ml-2">5.0 (24 reviews)</span>
            </div>
            
            <div className="text-3xl font-bold text-purple-400 mb-6">
              {product.price === 0 ? (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm inline-flex items-center mr-2">Free</span>
              ) : (
                `$${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}`
              )}
            </div>
            
            <p className="text-gray-300 mb-6 text-lg">{product.description}</p>
            
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-1" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              {product.price === 0 ? (
                <Button
                  className="bg-green-600 hover:bg-green-700 h-14 text-lg gap-2"
                  onClick={handleBuyNow}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Download Now
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 h-14 text-lg gap-2"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                  
                  <Button
                    variant={added ? "outline" : "secondary"}
                    className={`h-14 text-lg gap-2 ${
                      added ? "border-green-500 text-green-400" : "text-white"
                    }`}
                    onClick={handleAddToCart}
                  >
                    {added ? (
                      <>
                        <Check className="h-5 w-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
