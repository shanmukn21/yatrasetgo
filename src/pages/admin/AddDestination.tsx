import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Minus, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadDestinationImage } from '../../lib/supabase-client';
import Button from '../../components/ui/Button';
import { TRAVEL_CATEGORIES } from '../../types';

const AddDestination: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expectations, setExpectations] = useState<string[]>(['']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description1: '',
    description2: '',
    price: '',
    rating: '',
    best_time: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleExpectationChange = (index: number, value: string) => {
    const newExpectations = [...expectations];
    newExpectations[index] = value;
    setExpectations(newExpectations);
  };

  const addExpectation = () => {
    if (expectations.length < 4) {
      setExpectations([...expectations, '']);
    }
  };

  const removeExpectation = (index: number) => {
    const newExpectations = expectations.filter((_, i) => i !== index);
    setExpectations(newExpectations);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (!imageFile) {
        throw new Error('Please select an image');
      }

      if (selectedCategories.length === 0) {
        throw new Error('Please select at least one category');
      }

      // Upload image to Supabase Storage
      const imageUrl = await uploadDestinationImage(imageFile);

      // Filter out empty expectations
      const filteredExpectations = expectations.filter(exp => exp.trim() !== '');

      // Create destination in database
      const { data, error: insertError } = await supabase
        .from('destinations')
        .insert([
          {
            name: formData.name,
            location: formData.location,
            description1: formData.description1,
            description2: formData.description2 || null,
            price: parseFloat(formData.price),
            rating: parseFloat(formData.rating),
            categories: selectedCategories,
            image_url: imageUrl,
            best_time: formData.best_time || null,
            expectations: filteredExpectations,
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Redirect to the new destination page using the destination name
      const destinationSlug = formData.name.toLowerCase().replace(/\s+/g, '-');
      navigate(`/destination/${destinationSlug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Add New Destination</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <input
              type="number"
              name="rating"
              required
              min="0"
              max="5"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              value={formData.rating}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Best Time to Visit
            </label>
            <input
              type="text"
              name="best_time"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              value={formData.best_time}
              onChange={handleInputChange}
              placeholder="e.g., October to March"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Categories *
          </label>
          
          <div className="space-y-4">
            {/* Traveler Types */}
            <div>
              <h4 className="text-sm font-medium mb-2">By Type of Traveler</h4>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_CATEGORIES.types.map(category => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={selectedCategories.includes(category.id) ? "primary" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Travel Purposes */}
            <div>
              <h4 className="text-sm font-medium mb-2">By Travel Purpose</h4>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_CATEGORIES.purposes.map(category => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={selectedCategories.includes(category.id) ? "primary" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <textarea
            name="description1"
            required
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            value={formData.description1}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            name="description2"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            value={formData.description2}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What to Expect (max 4 points)
          </label>
          {expectations.map((expectation, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={expectation}
                onChange={(e) => handleExpectationChange(index, e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder={`Expectation ${index + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeExpectation(index)}
              >
                <Minus size={20} />
              </Button>
            </div>
          ))}
          {expectations.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={addExpectation}
              className="mt-2"
            >
              <Plus size={20} className="mr-2" />
              Add Expectation
            </Button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
              {imageFile && (
                <p className="text-sm text-gray-600">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Destination'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDestination;