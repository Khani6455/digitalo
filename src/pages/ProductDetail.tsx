
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

// Mock product data
const PRODUCTS = [
  {
    id: 1,
    name: "Premium UI Component Library",
    description: "Complete set of customizable UI components for modern web applications. Build beautiful interfaces with our professionally designed components that are easy to integrate and customize.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format",
    features: [
      "300+ customizable components",
      "Responsive design system",
      "Dark and light mode support",
      "Accessibility compliant",
      "Regular updates",
      "Premium support"
    ]
  },
  {
    id: 2,
    name: "Developer Toolkit Pro",
    description: "Essential tools and utilities for web development workflow. Boost your productivity with our comprehensive toolkit designed specifically for professional developers.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&auto=format",
    features: [
      "Code snippets library",
      "Performance optimization tools",
      "Debug assistant",
      "Asset management",
      "Build automation",
      "Cross-browser testing tools"
    ]
  },
  {
    id: 3,
    name: "Code Editor Plus",
    description: "Advanced code editor with syntax highlighting and AI suggestions. Write better code faster with intelligent autocomplete, refactoring suggestions, and error detection.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format",
    features: [
      "AI-powered code completion",
      "Multi-language support",
      "Git integration",
      "Customizable themes",
      "Plugin ecosystem",
      "Cloud synchronization"
    ]
  },
  {
    id: 4,
    name: "Web Analytics Dashboard",
    description: "Comprehensive analytics solution for tracking website performance. Gain insights into user behavior, traffic sources, and conversion rates with our intuitive dashboard.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format",
    features: [
      "Real-time traffic monitoring",
      "User journey tracking",
      "Conversion funnels",
      "Custom reporting",
      "Heatmaps",
      "Export and integration options"
    ]
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedProduct } = useProduct();
  const { toast } = useToast();
  
  const productId = parseInt(id || '1');
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  
  useEffect(() => {
    // Set the product in context for checkout
    setSelectedProduct(product);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [product, setSelectedProduct]);
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  const handleBuyNow = () => {
    setSelectedProduct(product);
    navigate('/checkout');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          <motion.div 
            className="rounded-xl overflow-hidden border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover max-h-[400px]"
            />
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Digital Product</div>
                <div className="text-gray-400 text-sm">ID: {product.id}</div>
              </div>
              <p className="text-xl font-bold text-purple-400 mb-6">${product.price}</p>
              <p className="text-gray-300 mb-6">{product.description}</p>
            </div>
            
            {product.features && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 w-full sm:w-auto"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button 
                variant="outline" 
                className="text-white border-white px-6 py-6 w-full sm:w-auto"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="bg-gray-900 py-12 border-t border-gray-800 mt-24">
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

export default ProductDetail;
