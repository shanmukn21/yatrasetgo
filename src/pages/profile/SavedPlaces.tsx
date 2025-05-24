import React from 'react';
import { MapPin, Star, Bookmark } from 'lucide-react';
import ProfileLayout from '../../components/layout/ProfileLayout';
import Button from '../../components/ui/Button';

const SavedPlaces: React.FC = () => {
  const savedPlaces = [
    {
      id: 1,
      name: 'Taj Mahal',
      location: 'Agra, Uttar Pradesh',
      rating: 4.9,
      price: 8999,
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg',
    },
    {
      id: 2,
      name: 'Varanasi',
      location: 'Uttar Pradesh',
      rating: 4.6,
      price: 9999,
      image: 'https://images.pexels.com/photos/16292239/pexels-photo-16292239/free-photo-of-man-performing-a-ritual-at-ganges-river.jpeg',
    },
  ];

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlaces.map((place) => (
            <div key={place.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  onClick={() => {/* Handle unsave */}}
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
                  onClick={() => {/* Handle view details */}}
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
                onClick={() => window.location.href = '/destinations'}
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