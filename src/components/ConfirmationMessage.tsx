
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, WhatsApp } from "lucide-react";
import { Link } from 'react-router-dom';

// WhatsApp number - admin can replace this with their number
const WHATSAPP_NUMBER = "923000000000";

interface ConfirmationMessageProps {
  orderNumber: string;
  email: string;
  isFreeProduct?: boolean;
}

const ConfirmationMessage = ({ orderNumber, email, isFreeProduct = false }: ConfirmationMessageProps) => {
  const handleWhatsAppClick = () => {
    const message = `Hello! I'm checking about my order: ${orderNumber}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-1 text-center text-2xl font-bold text-gray-900">
          {isFreeProduct ? 'Download Complete' : 'Order Received!'}
        </h2>
        <p className="text-center text-gray-600">
          {isFreeProduct 
            ? 'Your download should start automatically.' 
            : 'Thank you for your order. We\'ve received your payment details.'}
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Order Number</p>
            <p className="font-mono text-gray-900">{orderNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-900">{email}</p>
          </div>
        </div>
      </div>

      {!isFreeProduct && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-800">Next Steps</h3>
          <ul className="ml-4 list-disc text-sm text-blue-800">
            <li className="mb-1">Send your payment screenshot to us on WhatsApp for verification</li>
            <li className="mb-1">Once verified, we'll send your digital product to your email</li>
            <li>For any questions, please contact us via WhatsApp</li>
          </ul>
          
          <Button 
            onClick={handleWhatsAppClick}
            className="mt-4 w-full bg-green-500 text-white hover:bg-green-600"
          >
            <WhatsApp className="mr-2 h-4 w-4" />
            Contact on WhatsApp
          </Button>
        </div>
      )}

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
        {isFreeProduct && (
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            Download Again
          </Button>
        )}
        
        <Button asChild className="flex-1" variant="outline">
          <Link to="/products">
            Browse More Products
          </Link>
        </Button>
        
        <Button asChild className="flex-1">
          <Link to="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
