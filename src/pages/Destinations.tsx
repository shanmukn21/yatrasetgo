import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

import { getDestinations } from '../lib/supabase-client';
import DestinationCard from '../components/ui/DestinationCard';
import Button from '../components/ui/Button';
import Hero from '../components/ui/Hero';
import { Destination } from '../types';

const Destinations: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [activeFilter, setActiveFilter] = useState<string>(categoryParam || 'all');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (err) {
        setError('Failed to load destinations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();

    // Set up real-time subscription
    const subscription = supabase
      .channel('destinations_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'destinations' 
        }, 
        async () => {
          // Refetch destinations when changes occur
          const { data } = await supabase
            .from('destinations')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (data) setDestinations(data);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredDestinations = destinations.filter(dest => 
    activeFilter === 'all' || dest.category === activeFilter
  );

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

  return (
    <main>
      <Hero
        title="Explore India's Wonders"
        subtitle="Discover the diverse landscapes, cultures, and experiences across incredible India"
        imageUrl="https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {error && (
            <div className="text-red-600 text-center mb-8">{error}</div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
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
                    <DestinationCard 
                      destination={destination}
                      onClick={() => navigate(`/destination/${destination.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    />
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
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Destinations;