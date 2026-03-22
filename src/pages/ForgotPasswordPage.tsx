import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // This assumes you will add a `forgotPassword` method to your apiClient
      const response = await apiClient.forgotPassword(email);
      setSuccess(response.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Forgot Your Password?</h2>
        <p className="text-gray-500 mb-8">
          No problem. Enter your email and we'll send you a reset link.
        </p>
      </div>

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={!!success} // Disable input after success
        />

        <Button type="submit" loading={loading} disabled={!!success} className="w-full mt-6">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </AuthShell>
  );
};