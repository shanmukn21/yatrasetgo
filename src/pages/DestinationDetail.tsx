import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Users, ArrowLeft, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

import { getDestinationBySlug } from '../lib/supabase-client';
import Button from '../components/ui/Button';
import { Destination } from '../types';

const DestinationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        if (!slug) throw new Error('No destination specified');
        const data = await getDestinationBySlug(slug);
        setDestination(data);
      } catch (err) {
        setError('Failed to load destination');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();

    // Set up real-time subscription for this specific destination
    const subscription = supabase
      .channel(`destination_${slug}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'destinations',
          filter: `name=eq.${slug.replace(/-/g, ' ')}`
        },
        async () => {
          const { data } = await supabase
            .from('destinations')
            .select('*')
            .ilike('name', slug.replace(/-/g, ' '))
            .single();
          
          if (data) setDestination(data);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Destination not found</h2>
        <p className="text-gray-600 mb-6">{error || 'The destination you are looking for does not exist.'}</p>
        <Link to="/destinations">
          <Button variant="primary">Back to Destinations</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <img 
          src={destination.image_url} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to="/destinations" className="inline-flex items-center text-white mb-4 hover:text-primary-300 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Destinations
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{destination.name}</h1>
            <div className="flex items-center text-white mb-4">
              <MapPin size={20} className="mr-2" />
              <span>{destination.location}</span>
              <div className="mx-4 h-1 w-1 rounded-full bg-white"></div>
              <div className="flex items-center">
                <Star size={20} className="text-yellow-400 mr-1" fill="currentColor" />
                <span>{destination.rating} rating</span>
              </div>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-lg font-semibold">
              Starting from ₹{destination.price}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Destination</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {destination.description1}
                  
                  {destination.description2 && (
                    <>
                      <br /><br />
                      {destination.description2}
                    </>
                  )}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Clock size={20} className="text-primary-600 mr-3" />
                    <div>
                      <h4 className="font-medium">Best Time to Visit</h4>
                      <p className="text-sm text-gray-600">{destination.best_time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Tag size={20} className="text-primary-600 mr-3" />
                    <div>
                      <h4 className="font-medium">Travel Category</h4>
                      <p className="text-sm text-gray-600 capitalize">{destination.category}</p>
                    </div>
                  </div>
                </div>
                
                {destination.expectations && destination.expectations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">What to Expect</h3>
                    <ul className="space-y-2 text-gray-700">
                      {destination.expectations.map((expectation, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2 mt-0.5">
                            {index + 1}
                          </div>
                          <span>{expectation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                {/* Your existing booking form */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DestinationDetail;