import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

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
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const { data, error } = await supabase
      .from('destinations')
      .select('image_url');
    
    if (data) {
      setDestinations(data);
    }
  };

  useEffect(() => {
    if (destinations.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === destinations.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [destinations]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, location')
        .or(`name.ilike.%${value}%,location.ilike.%${value}%`)
        .limit(5);

      if (data) {
        setSearchResults(data);
        setShowResults(true);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (destination: any) => {
    const slug = destination.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/destination/${slug}`);
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {destinations.length > 0 && (
            <img
              src={destinations[currentImageIndex].image_url}
              alt="Background"
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
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
              className="max-w-xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for destinations..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setShowResults(true)}
                  className="w-full px-5 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition-colors">
                  <Search size={20} />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      className="w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-100 flex items-center"
                      onClick={() => handleResultClick(result)}
                    >
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.location}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;