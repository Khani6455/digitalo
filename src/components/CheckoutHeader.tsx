
import React from 'react';
import Logo from './Logo';
import { Separator } from '@/components/ui/separator';

const CheckoutHeader = () => {
  return (
    <header className="w-full py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 9H15V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm">Support</span>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mt-6" />
    </header>
  );
};

export default CheckoutHeader;
