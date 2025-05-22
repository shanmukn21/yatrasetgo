import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { Group } from '../../types';
import Button from './Button';

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/group/${group.id}`);
  };

  // Calculate available slots
  const availableSlots = group.maxMembers - group.currentMembers;
  
  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{group.destination}</h3>
        <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
          ₹{group.budget}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span className="text-sm">
            {formatDate(group.startDate)} - {formatDate(group.endDate)}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Users size={16} className="mr-2" />
          <span className="text-sm">
            {group.currentMembers}/{group.maxMembers} members joined
          </span>
        </div>
        
        <div className="text-sm text-gray-600">
          Created by <span className="font-medium">{group.creator}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2 text-sm">
          <span>Available slots</span>
          <span className={availableSlots > 0 ? 'text-green-600' : 'text-red-600'}>
            {availableSlots > 0 ? `${availableSlots} spots left` : 'Full'}
          </span>
        </div>
        
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary-500 rounded-full"
            style={{ width: `${(group.currentMembers / group.maxMembers) * 100}%` }}
          ></div>
        </div>
        
        <Button 
          fullWidth 
          variant={availableSlots > 0 ? "primary" : "outline"} 
          className="mt-4"
          disabled={availableSlots === 0}
          onClick={handleViewDetails}
        >
          {availableSlots > 0 ? 'Join Group' : 'View Details'}
        </Button>
      </div>
    </div>
  );
};

export default GroupCard;