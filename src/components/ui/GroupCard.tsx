import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin } from 'lucide-react';
import Button from './Button';
import { supabase } from '../../lib/supabase';

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

interface GroupCardProps {
  group: Group;
  onJoin: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onJoin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleJoin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMember) {
        setError('You are already a member of this group');
        return;
      }

      // Check if group is full
      if (group.members_count >= group.max_members) {
        setError('This group is already full');
        return;
      }

      await onJoin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = group.max_members - group.members_count;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48">
        <img 
          src={group.destination.image_url} 
          alt={group.destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold">{group.name}</h3>
          <div className="flex items-center mt-1">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{group.destination.name}, {group.destination.location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">
              {formatDate(group.start_date)} - {formatDate(group.end_date)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-2" />
            <span className="text-sm">
              {group.members_count}/{group.max_members} members joined
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            Created by <span className="font-medium">{group.creator.email}</span>
          </div>

          {group.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {group.description}
            </p>
          )}
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>Budget per person</span>
            <span className="font-semibold">₹{group.budget}</span>
          </div>
          
          <div className="flex justify-between mb-2 text-sm">
            <span>Available slots</span>
            <span className={availableSlots > 0 ? 'text-green-600' : 'text-red-600'}>
              {availableSlots > 0 ? `${availableSlots} spots left` : 'Full'}
            </span>
          </div>
          
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(group.members_count / group.max_members) * 100}%` }}
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
          
          <Button 
            fullWidth 
            variant={availableSlots > 0 ? "primary" : "outline"} 
            className="mt-4"
            disabled={loading || availableSlots === 0}
            onClick={handleJoin}
          >
            {loading ? 'Joining...' : (availableSlots > 0 ? 'Join Group' : 'Group Full')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;