
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define the product type to match the database schema
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[] | null;
  created_at?: string;
  updated_at?: string;
}

// Demo products to use if no products are found in the database
export const demoProducts: Product[] = [
  {
    id: "demo-1",
    name: "Digital Marketing eBook",
    description: "Comprehensive guide to modern digital marketing strategies and techniques.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
    features: [
      "300+ pages of expert content",
      "Case studies from successful campaigns",
      "Actionable strategies for all platforms",
      "Free updates for life"
    ]
  },
  {
    id: "demo-2",
    name: "Premium UI Kit",
    description: "Complete UI kit with 500+ components for web and mobile applications.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1455&auto=format&fit=crop",
    features: [
      "500+ customizable components",
      "Figma and Sketch files included",
      "Light and dark themes",
      "Responsive design for all devices",
      "Regular updates"
    ]
  },
  {
    id: "demo-3",
    name: "Stock Photo Collection",
    description: "High-resolution royalty-free stock photos for commercial and personal use.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop",
    features: [
      "1000+ high-resolution images",
      "Commercial license included",
      "Organized by categories",
      "Regular new additions"
    ]
  },
  {
    id: "demo-4",
    name: "Beginner's Guide to Coding",
    description: "Step-by-step guide for beginners to learn programming fundamentals.",
    price: 0,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop",
    features: [
      "Perfect for absolute beginners",
      "Project-based learning approach",
      "Covers HTML, CSS, and JavaScript",
      "Includes practice exercises",
      "Community forum access"
    ]
  },
  {
    id: "demo-5",
    name: "Social Media Template Pack",
    description: "Professional templates for Instagram, Facebook, Twitter and more.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1374&auto=format&fit=crop",
    features: [
      "50+ editable templates",
      "Photoshop and Canva versions",
      "Ready for all social platforms",
      "Seasonal design updates"
    ]
  }
];

interface ProductContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch products on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the features from JSON to string array if needed
      const formattedProducts = data?.map(product => ({
        ...product,
        features: product.features ? 
          (Array.isArray(product.features) ? product.features : Object.values(product.features)) : 
          []
      })) as Product[];
      
      // If no products in database, use demo products
      if (!formattedProducts || formattedProducts.length === 0) {
        setProducts(demoProducts);
      } else {
        setProducts(formattedProducts || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      
      // Use demo products as fallback if there's an error
      setProducts(demoProducts);
      
      toast({
        title: "Error",
        description: "Failed to load products from database, using demo products instead",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      await refreshProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      await refreshProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      await refreshProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        selectedProduct, 
        setSelectedProduct, 
        products, 
        loading, 
        error, 
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
