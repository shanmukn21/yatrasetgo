import { Destination } from '../types';

export const destinations: Destination[] = [
  // Solo Adventures
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    location: 'Uttarakhand',
    description: 'The Yoga Capital of the World, perfect for solo travelers seeking adventure and spirituality.',
    price: 7999,
    rating: 4.8,
    category: 'solo',
    imageUrl: 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
    videoUrl: 'https://player.vimeo.com/external/414986254.hd.mp4?s=1afba93b2ebe89e9b7151bd2faa23e24f1a4b78f&profile_id=175&oauth2_token_id=57447761'
  },
  {
    id: 'spiti-valley',
    name: 'Spiti Valley',
    location: 'Himachal Pradesh',
    description: 'A cold desert mountain valley with breathtaking landscapes and ancient monasteries.',
    price: 12999,
    rating: 4.7,
    category: 'solo',
    imageUrl: 'https://images.pexels.com/photos/13458334/pexels-photo-13458334.jpeg',
  },
  {
    id: 'hampi',
    name: 'Hampi',
    location: 'Karnataka',
    description: 'Ancient ruins, boulder-strewn landscapes, and a laid-back atmosphere perfect for backpackers.',
    price: 5999,
    rating: 4.5,
    category: 'solo',
    imageUrl: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg',
  },
  
  // Friends Fun
  {
    id: 'goa',
    name: 'Goa',
    location: 'Goa',
    description: 'Beach parties, water sports, and vibrant nightlife make it perfect for friend groups.',
    price: 9999,
    rating: 4.6,
    category: 'friends',
    imageUrl: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg',
    videoUrl: 'https://player.vimeo.com/external/368484050.hd.mp4?s=eb966988c69a956aee68cc50b689b0116ef3346e&profile_id=175&oauth2_token_id=57447761'
  },
  {
    id: 'wonderla',
    name: 'Wonderla',
    location: 'Bangalore',
    description: 'India\'s best amusement park with thrilling rides and water attractions.',
    price: 6999,
    rating: 4.4,
    category: 'friends',
    imageUrl: 'https://images.pexels.com/photos/784916/pexels-photo-784916.jpeg',
  },
  {
    id: 'kasol',
    name: 'Kasol',
    location: 'Himachal Pradesh',
    description: 'A picturesque village with scenic trails and a relaxed atmosphere.',
    price: 8499,
    rating: 4.5,
    category: 'friends',
    imageUrl: 'https://images.pexels.com/photos/4254555/pexels-photo-4254555.jpeg',
  },
  
  // Couples
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    description: 'A UNESCO World Heritage site and symbol of love, perfect for romantic getaways.',
    price: 8999,
    rating: 4.9,
    category: 'couples',
    imageUrl: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg',
    videoUrl: 'https://player.vimeo.com/external/308162286.hd.mp4?s=af6dc041bf8c76d896d721c95c371a9d3a26bed7&profile_id=175&oauth2_token_id=57447761'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    location: 'Rajasthan',
    description: 'The "City of Lakes" with stunning palaces and romantic boat rides.',
    price: 11999,
    rating: 4.8,
    category: 'couples',
    imageUrl: 'https://images.pexels.com/photos/11522845/pexels-photo-11522845.jpeg',
  },
  {
    id: 'alleppey',
    name: 'Alleppey',
    location: 'Kerala',
    description: 'Serene backwaters and houseboat stays for the perfect romantic retreat.',
    price: 13999,
    rating: 4.7,
    category: 'couples',
    imageUrl: 'https://images.pexels.com/photos/17929046/pexels-photo-17929046/free-photo-of-sunset-at-the-beach.jpeg',
  },
  
  // Family
  {
    id: 'varanasi',
    name: 'Varanasi',
    location: 'Uttar Pradesh',
    description: 'One of the world\'s oldest living cities with sacred ghats and evening aarti ceremonies.',
    price: 9999,
    rating: 4.6,
    category: 'family',
    imageUrl: 'https://images.pexels.com/photos/16292239/pexels-photo-16292239/free-photo-of-man-performing-a-ritual-at-ganges-river.jpeg',
    videoUrl: 'https://player.vimeo.com/external/370331493.hd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842d6a9d111&profile_id=175&oauth2_token_id=57447761'
  },
  {
    id: 'rameswaram',
    name: 'Rameswaram',
    location: 'Tamil Nadu',
    description: 'A significant pilgrimage site with the Ramanathaswamy Temple and beautiful beaches.',
    price: 7499,
    rating: 4.5,
    category: 'family',
    imageUrl: 'https://images.pexels.com/photos/13458372/pexels-photo-13458372.jpeg',
  },
  {
    id: 'tirupati',
    name: 'Tirupati',
    location: 'Andhra Pradesh',
    description: 'Home to the famous Tirumala Venkateswara Temple, one of the most visited religious sites.',
    price: 6999,
    rating: 4.7,
    category: 'family',
    imageUrl: 'https://images.pexels.com/photos/16110027/pexels-photo-16110027/free-photo-of-temple-in-forest.jpeg',
  }
];

export const getDestinationsByCategory = (category: string) => {
  return destinations.filter(destination => destination.category === category);
};

export const getDestinationById = (id: string) => {
  return destinations.find(destination => destination.id === id);
};