
import React from 'react';
import { CheckCircle, Mail, Download, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ConfirmationMessageProps {
  orderNumber: string;
  email: string;
  isFreeProduct?: boolean;
}

const ConfirmationMessage = ({ orderNumber, email, isFreeProduct = false }: ConfirmationMessageProps) => {
  return (
    <div className="bg-white rounded-lg border p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold">
        {isFreeProduct ? 'Your Download is Complete!' : 'Thank You for Your Purchase!'}
      </h2>
      
      <p className="text-gray-600 max-w-lg mx-auto">
        {isFreeProduct 
          ? 'Your free product has been downloaded successfully. A backup link has also been sent to your email address.' 
          : 'Your order has been confirmed and is now being processed. We have sent a confirmation email with your order details.'}
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {isFreeProduct ? <Download className="h-5 w-5 text-gray-600" /> : <CreditCard className="h-5 w-5 text-gray-600" />}
          <p className="font-medium text-gray-800">{isFreeProduct ? 'Download Reference' : 'Order Number'}</p>
        </div>
        <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
      </div>
      
      {email && (
        <div className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5 text-gray-600" />
          <p className="text-gray-700">
            {isFreeProduct
              ? `A backup download link has been sent to ${email}`
              : `A confirmation email has been sent to ${email}`}
          </p>
        </div>
      )}
      
      <div className="pt-6">
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
