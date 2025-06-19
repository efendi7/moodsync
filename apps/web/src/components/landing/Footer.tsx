// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { Heart, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'; // Added social icons

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  const linkClasses = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const socialIconClasses = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900';

  return (
    <footer
      className={`border-t ${
        isDarkMode ? 'border-gray-800' : 'border-gray-200'
      } px-6 py-12`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MoodSync
              </div>
            </div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-2 max-w-xs md:text-center`}>
              Your AI-Powered Mental Wellness Journey.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-lg mb-2">Company</h4>
              <Link href="/about" className={linkClasses}>About Us</Link>
              <Link href="/contact" className={linkClasses}>Contact</Link>
              <Link href="/blog" className={linkClasses}>Blog</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-lg mb-2">Resources</h4>
              <Link href="/faq" className={linkClasses}>FAQ</Link>
              <Link href="/privacy" className={linkClasses}>Privacy Policy</Link>
              <Link href="/terms" className={linkClasses}>Terms of Service</Link>
              {/* Using plain <a> tag for external links if applicable */}
              <a href="https://support.moodsync.com" target="_blank" rel="noopener noreferrer" className={linkClasses}>Support Center</a>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <h4 className="font-semibold text-lg mb-2">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className={socialIconClasses}>
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className={socialIconClasses}>
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className={socialIconClasses}>
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className={socialIconClasses}>
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`mt-8 pt-8 border-t ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          } text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          <p>
            &copy; {currentYear} MoodSync - AI-Powered Mental Wellness Platform. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;