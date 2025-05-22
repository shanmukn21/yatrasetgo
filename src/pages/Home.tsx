import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Heart, Home as HomeIcon, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import Hero from '../components/ui/Hero';
import DestinationCard from '../components/ui/DestinationCard';
import GroupCard from '../components/ui/GroupCard';
import Button from '../components/ui/Button';

import { getDestinationsByCategory } from '../data/destinations';
import { groups } from '../data/groups';

const Home: React.FC = () => {
  const soloDestinations = getDestinationsByCategory('solo').slice(0, 3);
  const friendsDestinations = getDestinationsByCategory('friends').slice(0, 3);
  const couplesDestinations = getDestinationsByCategory('couples').slice(0, 3);
  const familyDestinations = getDestinationsByCategory('family').slice(0, 3);
  
  const featuredGroups = groups.slice(0, 3);

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
      {/* Hero Section */}
      <Hero
        title="Discover the Magic of India"
        subtitle="From majestic mountains to serene beaches, explore India's diverse landscapes with us."
        videoUrl="https://player.vimeo.com/external/414986254.hd.mp4?s=1afba93b2ebe89e9b7151bd2faa23e24f1a4b78f&profile_id=175&oauth2_token_id=57447761"
        showSearch={true}
      />

      {/* Travel Types Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">How Do You Want to Travel?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose your preferred travel style and discover experiences tailored just for you
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Solo */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all">
              <Link to="/destinations?category=solo" className="block">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg" 
                    alt="Solo Travel" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-primary-100 text-primary-600 rounded-full mb-3">
                    <User size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Solo Adventures</h3>
                  <p className="text-gray-600 mb-4">Discover yourself on journeys of self-exploration</p>
                  <Button variant="outline">Explore</Button>
                </div>
              </Link>
            </motion.div>

            {/* Friends */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all">
              <Link to="/destinations?category=friends" className="block">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg" 
                    alt="Friends Travel" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-secondary-100 text-secondary-600 rounded-full mb-3">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Friends Fun</h3>
                  <p className="text-gray-600 mb-4">Create unforgettable memories with your gang</p>
                  <Button variant="outline">Explore</Button>
                </div>
              </Link>
            </motion.div>

            {/* Couples */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all">
              <Link to="/destinations?category=couples" className="block">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg" 
                    alt="Couple Travel" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-accent-100 text-accent-600 rounded-full mb-3">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Couple Escapes</h3>
                  <p className="text-gray-600 mb-4">Romantic getaways for unforgettable moments</p>
                  <Button variant="outline">Explore</Button>
                </div>
              </Link>
            </motion.div>

            {/* Family */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all">
              <Link to="/destinations?category=family" className="block">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/16292239/pexels-photo-16292239/free-photo-of-man-performing-a-ritual-at-ganges-river.jpeg" 
                    alt="Family Travel" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-primary-100 text-primary-600 rounded-full mb-3">
                    <HomeIcon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Family Pilgrimages</h3>
                  <p className="text-gray-600 mb-4">Sacred journeys for spiritual connections</p>
                  <Button variant="outline">Explore</Button>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Popular Destinations</h2>
              <p className="text-gray-600">Explore India's most beloved travel experiences</p>
            </div>
            <Button 
              variant="ghost" 
              className="hidden md:block"
              onClick={() => window.location.href = '/destinations'}
            >
              View All Destinations
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {couplesDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
          
          <div className="text-center md:hidden">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/destinations'}
            >
              View All Destinations
            </Button>
          </div>
        </div>
      </section>

      {/* Join a Group Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Join a Travel Group</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with like-minded travelers, share experiences, and split costs on your next adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="primary"
              onClick={() => window.location.href = '/groups'}
            >
              Explore All Groups
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">What Our Travelers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our community about their experiences with Pack Your Bags
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Ananya S."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Ananya S.</h4>
                  <p className="text-gray-500 text-sm">Solo Traveler</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Joining a travel group through Pack Your Bags made my solo trip to Rishikesh so much more fun! 
                I met amazing people and saved money too. Highly recommend!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Vikram K."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Vikram K.</h4>
                  <p className="text-gray-500 text-sm">Group Traveler</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The Goa trip was perfectly organized. Our group of 6 had a blast with the itinerary suggestions
                and the local experiences were truly authentic."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Priya & Rahul"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">Priya & Rahul</h4>
                  <p className="text-gray-500 text-sm">Couple</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Our anniversary trip to Udaipur was magical. The romantic package was worth every penny, 
                and the lakeside dinner arrangement was a beautiful surprise!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Pack Your Bags?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Your next adventure in India is just a click away. Join our community of travelers today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-600"
              onClick={() => window.location.href = '/destinations'}
            >
              Explore Destinations
            </Button>
            <Button
              variant="ghost"
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/register'}
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;