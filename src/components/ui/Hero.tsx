import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
  videoUrl?: string;
  imageUrl?: string;
  showSearch?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  videoUrl,
  imageUrl,
  showSearch = false,
}) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video or Image */}
      {videoUrl ? (
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageUrl}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-display font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          
          {showSearch && (
            <motion.div 
              className="max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for destinations..."
                  className="w-full px-5 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;