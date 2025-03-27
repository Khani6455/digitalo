
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, CheckCircle } from "lucide-react";

interface ConfirmationMessageProps {
  orderNumber: string;
  email: string;
}

const ConfirmationMessage = ({ orderNumber, email }: ConfirmationMessageProps) => {
  return (
    <div className="flex animate-scale-in flex-col items-center justify-center space-y-6 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={1.5} />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Thank you for your purchase!</h2>
        <p className="text-gray-600">
          Order #{orderNumber} confirmed
        </p>
      </div>
      
      <div className="glass-card max-w-md space-y-4 p-6 text-left">
        <p className="text-sm text-gray-600">
          We've sent a confirmation email to <span className="font-medium">{email}</span> with your order details and download instructions.
        </p>
        
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium">Next Steps</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-xs">1</span>
              <span>Check your email for download instructions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-xs">2</span>
              <span>Download your product using the link below</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-xs">3</span>
              <span>Follow the installation instructions in the README file</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Button className="group flex bg-black text-white hover:bg-black/90">
          <Download className="mr-2 h-4 w-4" />
          Download Product
        </Button>
        
        <Button variant="outline" className="group flex border-black hover:bg-gray-50">
          View Order Details
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
