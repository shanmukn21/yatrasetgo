import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Plus, Minus, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadDestinationImage } from '../../lib/supabase-client';
import Button from '../../components/ui/Button';
import { Destination } from '../../types';

const EditDestination: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [expectations, setExpectations] = useState<string[]>(['']);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description1: '',
    description2: '',
    price: '',
    rating: '',
    category: '',
    best_time: '',
  });

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            name: data.name,
            location: data.location,
            description1: data.description1,
            description2: data.description2 || '',
            price: data.price.toString(),
            rating: data.rating.toString(),
            category: data.category,
            best_time: data.best_time || '',
          });
          setCurrentImageUrl(data.image_url);
          setExpectations(data.expectations || ['']);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      let imageUrl = currentImageUrl;

      // Upload new image if provided
      if (imageFile) {
        imageUrl = await uploadDestinationImage(imageFile);
      }

      // Filter out empty expectations
      const filteredExpectations = expectations.filter(exp => exp.trim() !== '');

      // Update destination in database
      const { error: updateError } = await supabase
        .from('destinations')
        .update({
          name: formData.name,
          location: formData.location,
          description1: formData.description1,
          description2: formData.description2 || null,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          category: formData.category,
          image_url: imageUrl,
          best_time: formData.best_time || null,
          expectations: filteredExpectations,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Destination</h1>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start mb-6">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <span>{error}</span>
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
              Category *
            </label>
            <select
              name="category"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              <option value="solo">Solo Adventures</option>
              <option value="friends">Friends Fun</option>
              <option value="couples">Couple Escapes</option>
              <option value="family">Family Pilgrimages</option>
              <option value="spiritual">Spiritual</option>
              <option value="adventure">Adventure</option>
            </select>
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
            Current Image
          </label>
          <img
            src={currentImageUrl}
            alt="Current destination"
            className="w-40 h-40 object-cover rounded-lg mb-4"
          />
          
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Image (optional)
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDestination;