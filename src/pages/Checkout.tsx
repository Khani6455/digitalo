
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OrderSummary, { ProductItem } from '@/components/OrderSummary';
import BillingDetailsForm, { BillingFormData } from '@/components/BillingDetailsForm';
import PaymentForm from '@/components/PaymentForm';
import CheckoutSteps from '@/components/CheckoutSteps';
import ConfirmationMessage from '@/components/ConfirmationMessage';
import CheckoutHeader from '@/components/CheckoutHeader';
import { useProduct } from '@/contexts/ProductContext';
import { toast } from "sonner";

const DEFAULT_PRODUCT: ProductItem = {
  id: 'prod_01',
  name: 'Design System Pro',
  description: 'A comprehensive design system with 300+ components and 50+ templates for building modern web applications.',
  price: 149.99,
  licenseType: 'Standard'
};

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [billingDetails, setBillingDetails] = useState<BillingFormData | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const { selectedProduct } = useProduct();
  const navigate = useNavigate();
  
  const steps = ['Billing', 'Payment', 'Confirmation'];
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    if (!selectedProduct) {
      toast.error("No product selected", {
        description: "Please select a product before checkout",
      });
      navigate('/products');
    }
  }, [selectedProduct, navigate]);
  
  // Create a product item from the selected product or use the default
  const productToCheckout: ProductItem = selectedProduct ? {
    id: String(selectedProduct.id),
    name: selectedProduct.name,
    description: selectedProduct.description,
    price: selectedProduct.price,
    licenseType: 'Standard'
  } : DEFAULT_PRODUCT;
  
  const handleBillingComplete = (data: BillingFormData) => {
    setBillingDetails(data);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePaymentComplete = () => {
    // Generate random order number
    setOrderNumber(`ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BillingDetailsForm onComplete={handleBillingComplete} />;
      case 1:
        return <PaymentForm onComplete={handlePaymentComplete} email={billingDetails?.email || ''} />;
      case 2:
        return <ConfirmationMessage orderNumber={orderNumber} email={billingDetails?.email || ''} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <CheckoutHeader />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-center text-2xl font-semibold md:text-3xl">
            {currentStep === 2 ? 'Order Complete' : 'Checkout'}
          </h1>
          
          {currentStep < 2 && (
            <CheckoutSteps currentStep={currentStep} steps={steps} />
          )}
          
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {currentStep < 2 ? (
              <>
                <motion.div 
                  className="col-span-1 lg:col-span-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {renderStep()}
                </motion.div>
                
                <motion.div
                  className="col-span-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <OrderSummary product={productToCheckout} />
                </motion.div>
              </>
            ) : (
              <div className="col-span-1 lg:col-span-3">
                {renderStep()}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Digitalio. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
            <a href="#" className="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
