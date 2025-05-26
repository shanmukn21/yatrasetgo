import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">
              <span className="text-primary-500">Yatra</span>SetGo
            </h3>
            <p className="text-gray-300 mb-4">
              Your ultimate travel companion for exploring the wonders of India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Types */}
          <div>
            <h3 className="text-lg font-bold mb-4">Travel Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/destinations?category=solo" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Solo Adventures
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=friends" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Group Fun
                </Link>
              
              </li>
              <li>
                <Link to="/destinations?category=couples" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Couple Escapes
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=family" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Family Pilgrimages
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-300">
                <Mail size={18} className="mr-2" />
                support@yatrasetgo.in
              </p>
              <p className="flex items-center text-gray-300">
                <Phone size={18} className="mr-2" />
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>© 2025 YatraSetGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;