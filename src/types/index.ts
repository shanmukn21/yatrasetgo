export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  category: 'solo' | 'friends' | 'couples' | 'family';
  imageUrl: string;
  videoUrl?: string;
}

export interface Group {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  maxMembers: number;
  currentMembers: number;
  creator: string;
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