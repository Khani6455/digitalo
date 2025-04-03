
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowRight, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProduct } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';

interface PaymentFormProps {
  onComplete: () => void;
  email: string;
}

interface PaymentMethodDetails {
  id: string;
  name: string;
  instructions: string;
  recommended: boolean;
  details?: string;
}

const PAYMENT_METHODS: PaymentMethodDetails[] = [
  {
    id: "nayapay",
    name: "NayaPay",
    instructions: "Transfer the payment to our NayaPay account using the IBAN below:",
    details: "IBAN: PK42NAYA1234503072690158",
    recommended: true
  },
  {
    id: "payoneer",
    name: "Payoneer",
    instructions: "Send the payment to our Payoneer account using the details below:",
    details: `Bank name: First Century Bank
Bank address: 1731 N Elm St Commerce, GA 30529 USA
Routing (ABA): 061120084
Account number: 4020616676964
Account type: CHECKING
Beneficiary name: Hamza Aslam`,
    recommended: true
  },
  {
    id: "paypal",
    name: "PayPal",
    instructions: "We recommend using NayaPay or Payoneer for faster processing.",
    recommended: false
  },
  {
    id: "stripe",
    name: "Stripe",
    instructions: "We recommend using NayaPay or Payoneer for faster processing.",
    recommended: false
  }
];

const WHATSAPP_NUMBER = "923144460158";

const PaymentForm = ({ onComplete, email }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState("nayapay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedProduct } = useProduct();
  const navigate = useNavigate();

  const selectedPaymentDetails = PAYMENT_METHODS.find(method => method.id === paymentMethod);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error("No product selected", {
        description: "Please select a product before proceeding to checkout."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethod,
          email,
          productId: selectedProduct.id
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success("Order received", {
          description: "Your order has been placed successfully. Please send payment screenshot via WhatsApp."
        });
        onComplete();
      } else {
        throw new Error(data?.error || "Order processing failed");
      }
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error("Order failed", {
        description: error.message || "There was an issue processing your order. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in the ${selectedProduct?.name || "product"} (Order from: ${email})`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="w-full animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Payment Method</h3>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Recommended</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
          
          <Select 
            defaultValue="nayapay"
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.id} value={method.id} className="flex items-center justify-between">
                  <div className="flex items-center justify-between w-full">
                    <span>{method.name}</span>
                    {method.recommended && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Recommended
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Payment Instructions</p>
              <p>Your digital product link will be sent to your email after confirmation of payment. Please send a screenshot of your payment to our WhatsApp for verification. You can also discuss any queries regarding the product on WhatsApp.</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {selectedPaymentDetails && (
          <div className="space-y-4">
            <h3 className="text-md font-medium">{selectedPaymentDetails.name} Details</h3>
            
            <p className="text-gray-700">{selectedPaymentDetails.instructions}</p>
            
            {selectedPaymentDetails.details && (
              <div className="rounded-md bg-gray-50 p-4">
                <pre className="text-md font-mono whitespace-pre-wrap">{selectedPaymentDetails.details}</pre>
              </div>
            )}
            
            <Button
              type="button"
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-6"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact on WhatsApp
            </Button>
          </div>
        )}
        
        <Separator />
        
        <Button 
          type="submit" 
          className="group w-full bg-black py-6 text-white hover:bg-black/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span>Complete Order</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;
