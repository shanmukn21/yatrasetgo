import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, MapPin, Search } from 'lucide-react';

import Hero from '../components/ui/Hero';
import GroupCard from '../components/ui/GroupCard';
import Button from '../components/ui/Button';
import { groups } from '../data/groups';

const Groups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter groups based on search term
  const filteredGroups = groups.filter(group => 
    group.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
        title="Join a Travel Group"
        subtitle="Connect with like-minded travelers, share experiences, and split costs on your dream Indian adventure"
        imageUrl="https://images.pexels.com/photos/5257553/pexels-photo-5257553.jpeg"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Introduction */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Travel Better Together</h2>
            <p className="text-gray-600 mb-6">
              Joining a travel group is the perfect way to meet new friends, split costs, and get access to group discounts. 
              Browse existing groups below or create your own!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => alert('Create group functionality coming soon!')}
              >
                Create a Group
              </Button>
              <Button
                variant="outline"
                icon={<Users size={18} />}
                onClick={() => window.scrollTo({ top: document.getElementById('browse-groups')?.offsetTop - 100, behavior: 'smooth' })}
              >
                Browse Groups
              </Button>
            </div>
          </div>
          
          {/* How It Works */}
          <div className="max-w-5xl mx-auto mb-16">
            <h3 className="text-2xl font-semibold text-center mb-10">How It Works</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Find a Group</h4>
                <p className="text-gray-600">
                  Browse available groups based on destination, budget, and travel dates.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={28} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Join & Connect</h4>
                <p className="text-gray-600">
                  Request to join a group and connect with fellow travelers in the group chat.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={28} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Travel Together</h4>
                <p className="text-gray-600">
                  Split costs, share experiences, and make memories with your new travel companions.
                </p>
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div id="browse-groups" className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by destination..."
                className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
            </div>
          </div>
          
          {/* Groups Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {filteredGroups.map(group => (
              <motion.div key={group.id} variants={itemVariants}>
                <GroupCard group={group} />
              </motion.div>
            ))}
          </motion.div>
          
          {/* No Results Message */}
          {filteredGroups.length === 0 && (
            <div className="text-center py-10">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No groups found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or create your own group!</p>
              <Button 
                variant="primary" 
                icon={<Plus size={18} />}
                onClick={() => alert('Create group functionality coming soon!')}
              >
                Create a Group
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Join Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Benefits of Group Travel</h2>
            <p className="text-gray-600">
              Discover why joining a travel group with Pack Your Bags makes for a better travel experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Calendar size={24} className="text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cost Sharing</h3>
              <p className="text-gray-600">
                Split accommodation, transportation, and activity costs to make your trip more affordable.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Users size={24} className="text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">New Friendships</h3>
              <p className="text-gray-600">
                Meet like-minded travelers and form connections that can last a lifetime.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MapPin size={24} className="text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Group Discounts</h3>
              <p className="text-gray-600">
                Access special rates and discounts that are only available to groups.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Search size={24} className="text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safety in Numbers</h3>
              <p className="text-gray-600">
                Enjoy added security and peace of mind while traveling with a group.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Groups;