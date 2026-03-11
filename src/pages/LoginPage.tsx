import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import { apiClient } from '../services/apiClient';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const setAuth = useAuthStore((state: any) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const result = await apiClient.login(formData.email, formData.password);
      console.log('Login successful:', result);
      setAuth(result.user, result.token);
      setSuccess('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <p className="text-gray-600 text-center mb-6">Welcome back! Sign in to continue</p>

      {error && (
        <Alert variant="error" className="mb-6" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-6">
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <Button type="submit" loading={loading} className="w-full mt-6">
          Sign In
        </Button>

        <div className="text-sm text-center mt-4">
          <Link to="/forgot-password" className="font-medium text-primary-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Sign Up
          </Link>
        </p>
      </div>

      <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Demo Accounts
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
            <span className="font-medium text-gray-700">Attendee:</span>
            <span className="text-gray-600">test@attendee.com</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
            <span className="font-medium text-gray-700">Organizer:</span>
            <span className="text-gray-600">test@organizer.com</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
            <span className="font-medium text-gray-700">Admin:</span>
            <span className="text-gray-600">test@admin.com</span>
          </div>
          <p className="text-center text-gray-600 mt-3 pt-3 border-t border-blue-200">
            Password: <span className="font-bold">password123</span>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};