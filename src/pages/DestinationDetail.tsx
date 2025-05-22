import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Users, ArrowLeft, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

import Button from '../components/ui/Button';
import { getDestinationById } from '../data/destinations';
import { Destination } from '../types';

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const dest = getDestinationById(id);
      setDestination(dest || null);
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Destination not found</h2>
        <p className="text-gray-600 mb-6">The destination you are looking for does not exist or has been removed.</p>
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
          src={destination.imageUrl} 
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
                  {destination.description}
                  
                  {/* Extended description (this would come from the API in a real app) */}
                  <br /><br />
                  {destination.category === 'solo' && 'Perfect for adventurous souls seeking self-discovery, this destination offers a mix of thrilling activities and peaceful moments for reflection. You\'ll find yourself immersed in local culture while having the freedom to craft your own journey.'}
                  {destination.category === 'friends' && 'This vibrant destination is ideal for creating memories with your gang. From exciting activities to amazing nightlife, you\'ll find plenty of opportunities for fun and bonding with your friends.'}
                  {destination.category === 'couples' && 'Romance comes alive in this enchanting setting. With intimate experiences, breathtaking views, and serene environments, this destination provides the perfect backdrop for couples to strengthen their bond and create lasting memories together.'}
                  {destination.category === 'family' && 'This destination offers a spiritually enriching experience perfect for families looking to connect with their roots and traditions. With sacred sites and cultural attractions, it provides a meaningful journey for all generations.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Clock size={20} className="text-primary-600 mr-3" />
                    <div>
                      <h4 className="font-medium">Best Time to Visit</h4>
                      <p className="text-sm text-gray-600">October to March</p>
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
                
                {destination.videoUrl && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Destination Preview</h3>
                    <div className="rounded-lg overflow-hidden aspect-video">
                      <video 
                        src={destination.videoUrl} 
                        controls
                        poster={destination.imageUrl}
                        className="w-full h-full object-cover"
                      ></video>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">What to Expect</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2 mt-0.5">1</div>
                      <span>Guided tours of key attractions with expert local guides</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2 mt-0.5">2</div>
                      <span>Comfortable accommodations selected for their quality and location</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2 mt-0.5">3</div>
                      <span>Authentic cultural experiences and interactions with locals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2 mt-0.5">4</div>
                      <span>Free time to explore at your own pace and discover hidden gems</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Location</h2>
                <div className="rounded-lg overflow-hidden aspect-video bg-gray-200">
                  {/* In a real app, this would be a Google Maps embed */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <MapPin size={32} className="mr-2" />
                    <span>Map of {destination.name}, {destination.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Book This Trip</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users size={18} className="text-gray-400" />
                    </div>
                    <select className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white">
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5+ People</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Base price</span>
                    <span>₹{destination.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span>₹{Math.round(destination.price * 0.18)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span>₹{destination.price + Math.round(destination.price * 0.18)}</span>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  fullWidth
                  size="lg"
                  onClick={() => alert('Booking functionality coming soon!')}
                >
                  Book Now
                </Button>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => window.location.href = '/groups'}
                  >
                    Join a Group Instead
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  By booking, you agree to our <Link to="/terms" className="text-primary-600">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary-600">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Similar Destinations */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-8">You May Also Like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would be dynamically populated in a real app */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/5257553/pexels-photo-5257553.jpeg" 
                  alt="Similar Destination"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">Manali</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">Himachal Pradesh</span>
                </div>
                <div className="text-primary-600 font-semibold">₹8,999</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/5257563/pexels-photo-5257563.jpeg" 
                  alt="Similar Destination"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">Jaipur</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">Rajasthan</span>
                </div>
                <div className="text-primary-600 font-semibold">₹7,499</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg" 
                  alt="Similar Destination"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">Munnar</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">Kerala</span>
                </div>
                <div className="text-primary-600 font-semibold">₹9,299</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DestinationDetail;