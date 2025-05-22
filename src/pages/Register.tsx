import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      // Google OAuth will handle the redirect automatically
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-display font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of travelers
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">{error}</div>
            <button 
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="py-3"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="py-3"
              icon={<User size={16} />}
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              Sign up with Google
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;