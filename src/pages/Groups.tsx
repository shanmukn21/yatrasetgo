import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, MapPin, Search, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Hero from '../components/ui/Hero';
import GroupCard from '../components/ui/GroupCard';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';

interface Group {
  id: string;
  name: string;
  destination: {
    id: string;
    name: string;
    location: string;
    image_url: string;
  };
  creator: {
    id: string;
    email: string;
  };
  start_date: string;
  end_date: string;
  budget: number;
  max_members: number;
  description?: string;
  members_count: number;
}

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    destination_id: '',
    start_date: '',
    end_date: '',
    max_members: 2,
    budget: 0,
    description: ''
  });
  
  useEffect(() => {
    fetchGroups();
    fetchDestinations();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          destination:destinations (
            id,
            name,
            location,
            image_url
          ),
          creator:auth.users (
            id,
            email
          ),
          members_count:group_members(count)
        `);

      if (error) throw error;
      setGroups(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    const { data } = await supabase
      .from('destinations')
      .select('id, name, location');
    setDestinations(data || []);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('groups')
        .insert({
          ...formData,
          creator_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as first member
      await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: user.id
        });

      setShowCreateModal(false);
      fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id
        });

      if (error) throw error;

      fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.destination.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <main>
      <Hero
        title="Join a Travel Group"
        subtitle="Connect with like-minded travelers, share experiences, and split costs on your dream Indian adventure"
        imageUrl="https://images.pexels.com/photos/5257553/pexels-photo-5257553.jpeg"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start mb-6">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
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
                onClick={() => setShowCreateModal(true)}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGroups.map(group => (
              <GroupCard 
                key={group.id} 
                group={group}
                onJoin={() => handleJoinGroup(group.id)}
              />
            ))}
          </div>
          
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No groups found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or create your own group!
              </p>
              <Button 
                variant="primary" 
                icon={<Plus size={18} />}
                onClick={() => setShowCreateModal(true)}
              >
                Create a Group
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Create a New Group</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <select
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.destination_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination_id: e.target.value }))}
                >
                  <option value="">Select a destination</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name} - {dest.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Members *
                  </label>
                  <input
                    type="number"
                    required
                    min="2"
                    max="20"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={formData.max_members}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_members: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Groups;