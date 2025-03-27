
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  features?: string[];
}

interface ProductContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
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
