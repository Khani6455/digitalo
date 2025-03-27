
import React from 'react';
import { Separator } from "@/components/ui/separator";

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  licenseType: string;
}

interface OrderSummaryProps {
  product: ProductItem;
}

const OrderSummary = ({ product }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl bg-gray-50 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-700">Order Summary</h3>
          </div>

          <div className="glass-card flex flex-col space-y-4 rounded-lg bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-xs text-gray-500">{product.licenseType} License</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatPrice(product.price)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Tax</span>
            <span>{formatPrice(0)}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border p-6">
        <h3 className="text-base font-medium">What you're getting</h3>
        <p className="text-sm text-gray-600">
          {product.description}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Instant Digital Download
          </li>
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {product.licenseType} License
          </li>
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            12 Months Support
          </li>
          <li className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Lifetime Updates
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrderSummary;
