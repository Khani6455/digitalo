
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
      
      setProducts(formattedProducts || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast({
        title: "Error",
        description: "Failed to load products",
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
