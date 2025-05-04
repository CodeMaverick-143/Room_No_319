import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: loginError } = await login(email, password);
      
      if (loginError) {
        setError(loginError.message || 'Invalid login credentials');
        return;
      }
      
      // Redirect based on role
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-auth-pattern">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-dark-300">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary-400 hover:text-primary-300">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="bg-dark-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-dark-800">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-error-500/10 text-error-500 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  fullWidth
                  required
                  leftIcon={<Mail className="h-5 w-5 text-dark-400" />}
                  className="bg-dark-800 border-dark-700 text-white placeholder-dark-400"
                />
                
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  fullWidth
                  required
                  leftIcon={<Lock className="h-5 w-5 text-dark-400" />}
                  className="bg-dark-800 border-dark-700 text-white placeholder-dark-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500"
              >
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-900 text-dark-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-dark-700 rounded-lg shadow-sm bg-dark-800 text-sm font-medium text-dark-300 hover:bg-dark-700"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-dark-700 rounded-lg shadow-sm bg-dark-800 text-sm font-medium text-dark-300 hover:bg-dark-700"
                >
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;