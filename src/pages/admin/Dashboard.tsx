import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, AlertCircle, Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import { Destination } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeTrips: 0,
    completedTrips: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch destinations
      const { data: destinationsData, error: destinationsError } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false });

      if (destinationsError) throw destinationsError;
      setDestinations(destinationsData || []);

      // Fetch user statistics
      const { count: totalUsers } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact' });

      const today = new Date().toISOString().split('T')[0];
      const { count: newUsers } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact' })
        .gte('created_at', today);

      // Fetch trip statistics
      const { data: tripStats } = await supabase
        .from('trip_history')
        .select('status')
        .in('status', ['planned', 'completed']);

      const activeTrips = tripStats?.filter(trip => trip.status === 'planned').length || 0;
      const completedTrips = tripStats?.filter(trip => trip.status === 'completed').length || 0;

      setStats({
        totalUsers: totalUsers || 0,
        newUsersToday: newUsers || 0,
        activeTrips,
        completedTrips
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      
      const destination = destinations.find(d => d.id === deleteId);
      if (destination) {
        const imagePath = destination.image_url.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('destination_images')
            .remove([imagePath]);
        }
      }

      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setDestinations(prev => prev.filter(d => d.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
              <Users className="text-primary-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-2">+{stats.newUsersToday} today</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Active Trips</h3>
              <Calendar className="text-secondary-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeTrips}</p>
            <p className="text-sm text-gray-500 mt-2">Currently ongoing</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Completed Trips</h3>
              <MapPin className="text-accent-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.completedTrips}</p>
            <p className="text-sm text-gray-500 mt-2">Successfully completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Conversion Rate</h3>
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {((stats.completedTrips / (stats.activeTrips + stats.completedTrips)) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-2">Trip completion rate</p>
          </div>
        </div>

        {/* Destinations Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Destinations</h2>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/destinations/add')}
              icon={<Plus size={20} />}
            >
              Add Destination
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start mb-6">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {destinations.map((destination) => (
                  <tr key={destination.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={destination.image_url}
                          alt={destination.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {destination.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {destination.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {destination.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{destination.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {destination.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        className="mr-2"
                        onClick={() => navigate(`/admin/destinations/edit/${destination.id}`)}
                        icon={<Pencil size={16} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setDeleteId(destination.id);
                          setShowDeleteModal(true);
                        }}
                        icon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this destination? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;