/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, UserPlus, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../types';

interface UserLoginProps {
  language: Language;
  onNavigate: (page: string) => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ language, onNavigate }) => {
  const { signIn, signUp } = useAuth();
  const t = (en: string, mr: string, hi: string) =>
    language === 'mr' ? mr : language === 'hi' ? hi : en;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        const result = await signUp(formData.email, formData.password, formData.fullName, formData.mobile);
        if (result?.needsConfirmation) {
          setMessage('Account created! Please check your email for a confirmation link before signing in.');
          setMessageType('info');
          setIsLogin(true); // Switch to login mode
        } else {
          onNavigate('my-dashboard');
        }
      }
    } catch (error: any) {
      if (error.message.includes('Email not confirmed') || error.message.includes('confirm your email')) {
        setMessage('Please check your email and click the confirmation link before signing in.');
        setMessageType('info');
      } else {
        setError(error.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-180px)] overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 px-4 py-10 flex items-center justify-center">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-green-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="modern-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 shadow-lg shadow-green-100">
              {isLogin ? <ShieldCheck className="h-8 w-8 text-white" /> : <UserPlus className="h-8 w-8 text-white" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('Gram Panchayat Login', 'ग्रामपंचायत लॉगिन', 'ग्राम पंचायत लॉगिन')}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? t('Sign in to your account', 'तुमच्या खात्यात साइन इन करा', 'अपने खाते में साइन इन करें')
                : t('Create a new account', 'नवीन खाते तयार करा', 'नया खाता बनाएं')}
            </p>
          </div>

        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage('');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('Login', 'लॉगिन', 'लॉगिन')}
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage('');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('Sign Up', 'नोंदणी', 'साइन अप')}
          </button>
        </div>

        {/* Message display */}
        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            messageType === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
            messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
            'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Full Name', 'पूर्ण नाव', 'पूरा नाम')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('Enter your full name', 'तुमचे पूर्ण नाव टाका', 'अपना पूरा नाम दर्ज करें')}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Email', 'ईमेल', 'ईमेल')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('Enter your email address', 'तुमचा ईमेल पत्ता टाका', 'अपना ईमेल पता दर्ज करें')}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Mobile Number', 'मोबाइल नंबर', 'मोबाइल नंबर')}
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('Enter your mobile number', 'तुमचा मोबाइल नंबर टाका', 'अपना मोबाइल नंबर दर्ज करें')}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Password', 'पासवर्ड', 'पासवर्ड')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('Enter your password', 'तुमचा पासवर्ड टाका', 'अपना पासवर्ड दर्ज करें')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-md hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('Please wait...', 'कृपया प्रतीक्षा करा...', 'कृपया प्रतीक्षा करें...')}
              </div>
            ) : (
              isLogin 
                ? t('Sign In', 'लॉगिन करा', 'साइन इन करें')
                : t('Create Account', 'खाते तयार करा', 'खाता बनाएं')
            )}
          </button>
        </form>

      </div>
    </div>
    </div>
  );
};

export default UserLogin;
