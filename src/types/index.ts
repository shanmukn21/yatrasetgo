export interface Destination {
  id: string;
  name: string;
  location: string;
  description1: string;
  description2?: string;
  price: number;
  rating: number;
  category: string;
  image_url: string;
  best_time?: string;
  expectations?: string[];
  created_at?: string;
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