import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

export const SupportButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/923220409615"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 z-20"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <WhatsAppIcon className="w-8 h-8" />
    </a>
  );
};
