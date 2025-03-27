
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";

const PaymentForm = ({ onComplete }: { onComplete: () => void }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    
    for (let i = 0; i < digits.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    } else if (digits.length === 2) {
      return `${digits}/`;
    }
    
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = "Valid card number is required";
      }
      
      if (!cardName) {
        newErrors.cardName = "Name on card is required";
      }
      
      if (!expiry || !expiry.includes('/') || expiry.length < 5) {
        newErrors.expiry = "Valid expiry date is required (MM/YY)";
      }
      
      if (!cvc || cvc.length < 3) {
        newErrors.cvc = "Valid CVC is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Payment successful", {
        description: "Your order has been processed successfully."
      });
      onComplete();
    }, 1500);
  };

  return (
    <div className="w-full animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Method</h3>
          
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod} 
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <div className={`relative flex cursor-pointer rounded-lg p-4 ${paymentMethod === 'card' ? 'border-2 border-black shadow-sm' : 'border border-gray-200'}`}>
              <RadioGroupItem value="card" id="card" className="sr-only" />
              <div className="flex flex-1 items-center justify-between">
                <Label htmlFor="card" className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5" />
                  <span>Credit / Debit Card</span>
                </Label>
                {paymentMethod === 'card' && (
                  <CheckCircle2 className="h-5 w-5 text-black" />
                )}
              </div>
            </div>
            
            <div className={`relative flex cursor-pointer rounded-lg p-4 ${paymentMethod === 'payoneer' ? 'border-2 border-black shadow-sm' : 'border border-gray-200'}`}>
              <RadioGroupItem value="payoneer" id="payoneer" className="sr-only" />
              <div className="flex flex-1 items-center justify-between">
                <Label htmlFor="payoneer" className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 10C20 13.3137 17.3137 16 14 16C10.6863 16 8 13.3137 8 10C8 6.68629 10.6863 4 14 4C17.3137 4 20 6.68629 20 10Z" fill="#FF4800" />
                    <path d="M22 19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V5C2 4.44772 2.44772 4 3 4H6.10876C6.03809 4.32835 6 4.66037 6 5C6 9.41828 9.58172 13 14 13C16.5638 13 18.8151 11.7814 20.141 9.87121C20.067 9.91308 20 9.95304 20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 9.66037 4.03809 9.32835 4.10876 9H7.8077C7.8077 9 7.62657 10 9.8077 10C12.5 10 12.8077 7 10.8077 7C8.62657 7 7.8077 8 7.8077 8H4.87778C6.03301 5.61099 8.79086 4 12 4C13.4616 4 14.8302 4.40192 16 5.10876V5C16 4.66037 15.9619 4.32835 15.8912 4H21C21.5523 4 22 4.44772 22 5V19Z" fill="#173252" />
                  </svg>
                  <span>Payoneer</span>
                </Label>
                {paymentMethod === 'payoneer' && (
                  <CheckCircle2 className="h-5 w-5 text-black" />
                )}
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {paymentMethod === 'card' ? (
          <div className="space-y-4 opacity-100 transition-opacity duration-300">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={errors.cardNumber ? "border-red-500" : ""}
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-500">{errors.cardNumber}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className={errors.cardName ? "border-red-500" : ""}
                />
                {errors.cardName && (
                  <p className="text-sm text-red-500">{errors.cardName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  className={errors.expiry ? "border-red-500" : ""}
                  maxLength={5}
                />
                {errors.expiry && (
                  <p className="text-sm text-red-500">{errors.expiry}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={errors.cvc ? "border-red-500" : ""}
                  maxLength={4}
                />
                {errors.cvc && (
                  <p className="text-sm text-red-500">{errors.cvc}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
            <div className="rounded-full bg-blue-50 p-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 10C20 13.3137 17.3137 16 14 16C10.6863 16 8 13.3137 8 10C8 6.68629 10.6863 4 14 4C17.3137 4 20 6.68629 20 10Z" fill="#FF4800" />
                <path d="M22 19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V5C2 4.44772 2.44772 4 3 4H6.10876C6.03809 4.32835 6 4.66037 6 5C6 9.41828 9.58172 13 14 13C16.5638 13 18.8151 11.7814 20.141 9.87121C20.067 9.91308 20 9.95304 20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 9.66037 4.03809 9.32835 4.10876 9H7.8077C7.8077 9 7.62657 10 9.8077 10C12.5 10 12.8077 7 10.8077 7C8.62657 7 7.8077 8 7.8077 8H4.87778C6.03301 5.61099 8.79086 4 12 4C13.4616 4 14.8302 4.40192 16 5.10876V5C16 4.66037 15.9619 4.32835 15.8912 4H21C21.5523 4 22 4.44772 22 5V19Z" fill="#173252" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium">Payoneer Account</h3>
              <p className="text-sm text-gray-500">You'll be redirected to Payoneer to complete your purchase securely.</p>
            </div>
          </div>
        )}
        
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
              <span>Complete Purchase</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;
