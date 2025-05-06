import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../components/utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Brand */}
      <div className="hidden md:flex md:w-1/2 bg-greenlove flex-col justify-center items-center">
        <div className="text-white text-center px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">BLACKCLOVER</h1>
          <div className="mt-4 space-y-2">
            <h2 className="text-5xl font-bold">Quản Lý</h2>
            <h2 className="text-5xl font-bold">Thư Viện</h2>
          </div>
          <p className="mt-6 text-white/80 max-w-md mx-auto">
            Hệ thống quản lý thư viện hiệu quả, tiện lợi và dễ sử dụng
          </p>
        </div>
        {/* Simple book stack illustration */}
        <div className="mt-12">
          <svg className="w-40 h-40 text-white/30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5V4.5C4 4.5 5 3.5 8 3.5C11 3.5 13 5.5 16 5.5C19 5.5 20 4.5 20 4.5V19.5C20 19.5 19 20.5 16 20.5C13 20.5 11 18.5 8 18.5C5 18.5 4 19.5 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12C4 12 5 11 8 11C11 11 13 13 16 13C19 13 20 12 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 4.5C4 4.5 5 3.5 8 3.5C11 3.5 13 5.5 16 5.5C19 5.5 20 4.5 20 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-greenlove mb-1">BLACKCLOVER</h1>
            <h2 className="text-3xl font-bold text-gray-800">Quản Lý Thư Viện</h2>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đăng Nhập</h2>
          <p className="text-gray-600 mb-8">Đăng nhập vào tài khoản quản trị của bạn</p>
          
          {error && (
            <div className="p-4 mb-6 text-sm rounded bg-red-50 text-red-500 border-l-4 border-red-500">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenlove focus:border-greenlove transition-all duration-200"
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <a href="#" className="text-sm font-medium text-greenlove hover:text-greenlove_1">
                  Quên mật khẩu?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenlove focus:border-greenlove transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center mb-6">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-greenlove border-gray-300 rounded focus:ring-greenlove"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-greenlove hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <span className="text-sm text-gray-500">
              © 2025 BlackClover Library Management System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
