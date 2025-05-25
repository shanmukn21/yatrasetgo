import React, { useEffect, useState } from 'react';
import { MapPin, Star, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/layout/ProfileLayout';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { Destination } from '../../types';

const SavedPlaces: React.FC = () => {
  const navigate = useNavigate();
  const [savedPlaces, setSavedPlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  const fetchSavedPlaces = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('saved_destinations')
        .select(`
          destination_id,
          destinations (
            id,
            name,
            location,
            rating,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedPlaces(data.map((item: any) => item.destinations));
    } catch (err) {
      console.error('Error fetching saved places:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (destinationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('saved_destinations')
        .delete()
        .eq('user_id', user.id)
        .eq('destination_id', destinationId);

      setSavedPlaces(prev => prev.filter(place => place.id !== destinationId));
    } catch (err) {
      console.error('Error removing saved place:', err);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlaces.map((place) => (
            <div key={place.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  onClick={() => handleUnsave(place.id)}
                >
                  <Bookmark size={20} className="text-primary-600 fill-primary-600" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin size={16} className="mr-1" />
                  <span>{place.location}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-400 mr-1" fill="currentColor" />
                    <span className="font-medium">{place.rating}</span>
                  </div>
                  <div className="font-bold text-lg text-primary-600">₹{place.price}</div>
                </div>
                
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(`/destination/${place.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}

          {savedPlaces.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No saved places</h3>
              <p className="text-gray-600 mb-6">
                Start saving your favorite destinations for quick access later!
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

export default SavedPlaces;