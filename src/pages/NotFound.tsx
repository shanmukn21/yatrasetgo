import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-6 rounded-full">
            <MapPin size={64} className="text-primary-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! It seems you've wandered off the trail. The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button variant="primary" fullWidth>
              Back to Home
            </Button>
          </Link>
          
          <Link to="/destinations">
            <Button variant="outline" fullWidth>
              Explore Destinations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;