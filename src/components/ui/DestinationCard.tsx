import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Destination } from '../../types';
import Button from './Button';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    const slug = destination.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/destination/${slug}`);
  };

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden h-60">
        <img 
          src={destination.image_url} 
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold">{destination.name}</h3>
          <div className="flex items-center mt-1">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{destination.location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <Star size={18} className="text-yellow-400 mr-1" fill="currentColor" />
            <span className="font-medium">{destination.rating}</span>
          </div>
          <div className="font-bold text-lg text-primary-600">₹{destination.price}</div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {destination.description1}
        </p>
        
        <Button fullWidth variant="primary">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default DestinationCard;