import React, { useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import ProfileLayout from '../../components/layout/ProfileLayout';
import Button from '../../components/ui/Button';

const Trips: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const trips = [
    {
      id: 1,
      destination: 'Rishikesh',
      location: 'Uttarakhand',
      date: '2025-06-15',
      status: 'upcoming',
      image: 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
    },
    {
      id: 2,
      destination: 'Goa',
      location: 'Goa',
      date: '2024-12-20',
      status: 'completed',
      image: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg',
    },
  ];

  const filteredTrips = trips.filter(trip => 
    (activeTab === 'upcoming' && trip.status === 'upcoming') ||
    (activeTab === 'completed' && trip.status === 'completed') ||
    (activeTab === 'cancelled' && trip.status === 'cancelled')
  );

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
                  src={trip.image}
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    trip.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                    trip.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{trip.destination}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>{trip.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(trip.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {/* Handle view details */}}
                  >
                    View Details
                  </Button>
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

export default Trips;