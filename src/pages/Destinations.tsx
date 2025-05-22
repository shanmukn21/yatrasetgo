import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { destinations } from '../data/destinations';
import DestinationCard from '../components/ui/DestinationCard';
import Button from '../components/ui/Button';
import Hero from '../components/ui/Hero';

const Destinations: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [activeFilter, setActiveFilter] = useState<string>(categoryParam || 'all');
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  
  // Categories for filter buttons
  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'solo', label: 'Solo Adventures' },
    { id: 'friends', label: 'Friends Fun' },
    { id: 'couples', label: 'Couple Escapes' },
    { id: 'family', label: 'Family Pilgrimages' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Update filtered destinations when active filter changes
  useEffect(() => {
    let filtered = destinations;
    
    if (activeFilter !== 'all') {
      filtered = destinations.filter(dest => dest.category === activeFilter);
    }
    
    setFilteredDestinations(filtered);
    
    // Update URL with current filter
    const newUrl = activeFilter === 'all' 
      ? '/destinations' 
      : `/destinations?category=${activeFilter}`;
    
    navigate(newUrl, { replace: true });
  }, [activeFilter, navigate]);
  
  // Set hero section content based on active filter
  const getHeroContent = () => {
    switch(activeFilter) {
      case 'solo':
        return {
          title: "Solo Adventures in India",
          subtitle: "Discover yourself on journeys of self-exploration across India's diverse landscapes",
          imageUrl: "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg"
        };
      case 'friends':
        return {
          title: "Group Fun in India",
          subtitle: "Create unforgettable memories with your gang at India's most vibrant destinations",
          imageUrl: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg"
        };
      case 'couples':
        return {
          title: "Romantic Escapes in India",
          subtitle: "Experience magical moments together in India's most romantic destinations",
          imageUrl: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg"
        };
      case 'family':
        return {
          title: "Family Pilgrimages in India",
          subtitle: "Embark on sacred journeys and create lasting family bonds at India's holy sites",
          imageUrl: "https://images.pexels.com/photos/16292239/pexels-photo-16292239/free-photo-of-man-performing-a-ritual-at-ganges-river.jpeg"
        };
      default:
        return {
          title: "Explore India's Wonders",
          subtitle: "Discover the diverse landscapes, cultures, and experiences across incredible India",
          imageUrl: "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg"
        };
    }
  };
  
  const heroContent = getHeroContent();

  return (
    <main>
      <Hero
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        imageUrl={heroContent.imageUrl}
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          <div className="mb-10">
            <div className="flex items-center justify-center mb-6">
              <Filter size={20} className="mr-2 text-primary-600" />
              <h3 className="text-xl font-semibold">Filter Destinations</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "primary" : "outline"}
                  size="md"
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
            </p>
          </div>
          
          {/* Destinations Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredDestinations.map(destination => (
              <motion.div key={destination.id} variants={itemVariants}>
                <DestinationCard destination={destination} />
              </motion.div>
            ))}
          </motion.div>
          
          {/* No Results Message */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-10">
              <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-6">Try changing your filters to see more results.</p>
              <Button variant="primary" onClick={() => setActiveFilter('all')}>
                View All Destinations
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Destinations;