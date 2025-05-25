import React, { useState, useEffect } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/layout/ProfileLayout';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface Trip {
  id: string;
  destination: {
    id: string;
    name: string;
    location: string;
    image_url: string;
  };
  travel_date: string;
  status: 'planned' | 'completed' | 'cancelled';
  notes?: string;
}

const Trips: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('trip_history')
        .select(`
          id,
          travel_date,
          status,
          notes,
          destinations (
            id,
            name,
            location,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setTrips(data.map((trip: any) => ({
        ...trip,
        destination: trip.destinations
      })));
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tripId: string, newStatus: 'planned' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('trip_history')
        .update({ status: newStatus })
        .eq('id', tripId);

      if (error) throw error;

      setTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, status: newStatus } : trip
      ));
    } catch (err) {
      console.error('Error updating trip status:', err);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const today = new Date();
    const travelDate = new Date(trip.travel_date);
    
    if (activeTab === 'upcoming') {
      return trip.status === 'planned' && travelDate >= today;
    } else if (activeTab === 'completed') {
      return trip.status === 'completed' || (trip.status === 'planned' && travelDate < today);
    } else {
      return trip.status === 'cancelled';
    }
  });

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div className="flex space-x-4">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 relative">
                <img
                  src={trip.destination.image_url}
                  alt={trip.destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    trip.status === 'planned' ? 'bg-green-100 text-green-800' :
                    trip.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{trip.destination.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>{trip.destination.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(trip.travel_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(`/destination/${trip.destination.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    View Destination
                  </Button>
                  
                  {trip.status === 'planned' && (
                    <>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleStatusChange(trip.id, 'completed')}
                      >
                        Mark as Completed
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => handleStatusChange(trip.id, 'cancelled')}
                      >
                        Cancel Trip
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredTrips.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No {activeTab} trips</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming trips. Start planning your next adventure!"
                  : activeTab === 'completed'
                  ? "You haven't completed any trips yet. Time to start traveling!"
                  : "You don't have any cancelled trips."}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/destinations')}
              >
                Explore Destinations
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Trips;