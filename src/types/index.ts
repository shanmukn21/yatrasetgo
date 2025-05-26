export interface Destination {
  id: string;
  name: string;
  location: string;
  description1: string;
  description2?: string;
  price: number;
  rating: number;
  categories: string[];
  image_url: string;
  best_time?: string;
  expectations?: string[];
  created_at?: string;
  views?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: {
    travelType: string[];
    budget: string;
  };
}

export const TRAVEL_CATEGORIES = {
  types: [
    { id: 'solo', label: 'Solo' },
    { id: 'couple', label: 'Couple' },
    { id: 'friends', label: 'Friends' },
    { id: 'group', label: 'Group' },
    { id: 'family', label: 'Family' }
  ],
  purposes: [
    { id: 'adventure', label: 'Adventure' },
    { id: 'fun', label: 'Fun' },
    { id: 'nature', label: 'Nature' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'historical', label: 'Historical' },
    { id: 'pilgrimage', label: 'Pilgrimage' }
  ]
};