import React, { useState } from 'react';
import { Boxes, Loader2, User, Building2, X, Check, Eye, EyeOff, Mail, Lock, Phone, Calendar, UserCircle } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LoginScreenProps {
  onLoginComplete: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginComplete }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<any>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  // Onboarding form state (for Google login)
  const [onboardingForm, setOnboardingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    role: '' as UserRole
  });
  const [onboardingErrors, setOnboardingErrors] = useState<Record<string, string>>({});

  const { login, loginWithEmail, register } = useAuth();
  const { showToast } = useToast();

  // Validate login form
  const validateLoginForm = () => {
    const errors: Record<string, string> = {};
    if (!loginForm.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = 'Email không hợp lệ';
    }
    if (!loginForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (loginForm.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate register form
  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};

    if (!registerForm.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!registerForm.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!registerForm.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(registerForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!registerForm.age.trim()) {
      errors.age = 'Vui lòng nhập tuổi';
    } else {
      const ageNum = parseInt(registerForm.age);
      if (ageNum < 18 || ageNum > 100) {
        errors.age = 'Tuổi phải từ 18 đến 100';
      }
    }

    if (!registerForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!registerForm.role) {
      errors.role = 'Vui lòng chọn vai trò';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate onboarding form
  const validateOnboardingForm = () => {
    const errors: Record<string, string> = {};

    if (!onboardingForm.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!onboardingForm.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardingForm.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!onboardingForm.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(onboardingForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!onboardingForm.age.trim()) {
      errors.age = 'Vui lòng nhập tuổi';
    } else {
      const ageNum = parseInt(onboardingForm.age);
      if (ageNum < 18 || ageNum > 100) {
        errors.age = 'Tuổi phải từ 18 đến 100';
      }
    }

    if (!onboardingForm.role) {
      errors.role = 'Vui lòng chọn vai trò';
    }

    setOnboardingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate Google login - generate mock data
      setGoogleUserData({
        email: `user${Date.now()}@gmail.com`,
        fullName: 'Người Dùng Google',
        avatar: 'https://ui-avatars.com/api/?name=Google+User&background=2563eb&color=fff'
      });
      setIsLoading(false);
      setShowOnboarding(true);
      // Pre-fill onboarding form
      setOnboardingForm(prev => ({
        ...prev,
        fullName: 'Người Dùng Google',
        email: `user${Date.now()}@gmail.com`
      }));
    }, 1500);
  };

  // Handle email/password login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const user = loginWithEmail(loginForm.email, loginForm.password);
      setIsLoading(false);

      if (user) {
        showToast(`Đăng nhập thành công! Chào mừng, ${user.fullName}!`, 'success');
        onLoginComplete();
      } else {
        showToast('Email hoặc mật khẩu không đúng!', 'error');
        setLoginErrors({ general: 'Email hoặc mật khẩu không đúng!' });
      }
    }, 1000);
  };

  // Handle registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const result = register({
        fullName: registerForm.fullName.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim(),
        age: parseInt(registerForm.age),
        role: registerForm.role,
        password: registerForm.password
      });

      setIsLoading(false);

      if (result.success) {
        showToast('Đăng ký thành công! Đang chuyển hướng...', 'success');
        setTimeout(() => onLoginComplete(), 500);
      } else {
        showToast(result.error || 'Đăng ký thất bại!', 'error');
        setRegisterErrors({ general: result.error || 'Đăng ký thất bại!' });
      }
    }, 1000);
  };

  // Handle Google onboarding completion
  const handleOnboardingSubmit = () => {
    if (!validateOnboardingForm()) return;

    const newUser = {
      id: `google_${Date.now()}`,
      fullName: onboardingForm.fullName.trim(),
      email: onboardingForm.email.trim(),
      phone: onboardingForm.phone.trim(),
      age: parseInt(onboardingForm.age),
      role: onboardingForm.role,
      password: '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(onboardingForm.fullName)}&background=2563eb&color=fff`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    login(newUser);
    showToast('Đăng nhập thành công!', 'success');
    onLoginComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-4">
            <Boxes className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            PhongTro<span className="text-blue-600">3D</span>
          </h1>
          <p className="text-slate-500 mt-2">Công nghệ quét phòng 3D tiên tiến</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Auth Mode Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-4 font-medium transition-colors ${
                authMode === 'login'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-4 font-medium transition-colors ${
                authMode === 'register'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div className="p-6">
            {authMode === 'login' ? (
              <>
                {/* Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                  {loginErrors.general && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                      {loginErrors.general}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                      />
                    </div>
                    {loginErrors.email && <p className="text-red-500 text-sm mt-1">{loginErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {loginErrors.password && <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng nhập'}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-sm text-slate-400">hoặc</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 rounded-xl font-medium text-slate-700 transition-all duration-300 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Đăng nhập bằng Google</span>
                    </>
                  )}
                </button>

                {/* Demo credentials hint */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-2">Tài khoản demo:</p>
                  <p className="text-sm text-slate-600">Email: nguyenvana@gmail.com</p>
                  <p className="text-sm text-slate-600">Mật khẩu: 123456</p>
                </div>
              </>
            ) : (
              <>
                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                  {registerErrors.general && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                      {registerErrors.general}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                      />
                    </div>
                    {registerErrors.fullName && <p className="text-red-500 text-sm mt-1">{registerErrors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Tuổi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          value={registerForm.age}
                          onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })}
                          placeholder="25"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                        />
                      </div>
                      {registerErrors.age && <p className="text-red-500 text-xs mt-1">{registerErrors.age}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        SĐT <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          placeholder="0901234567"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                        />
                      </div>
                      {registerErrors.phone && <p className="text-red-500 text-xs mt-1">{registerErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                      />
                    </div>
                    {registerErrors.email && <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="******"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                      />
                      {registerErrors.password && <p className="text-red-500 text-xs mt-1">{registerErrors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Xác nhận MK <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        placeholder="******"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                      />
                      {registerErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{registerErrors.confirmPassword}</p>}
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRegisterForm({ ...registerForm, role: 'renter' })}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          registerForm.role === 'renter'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          registerForm.role === 'renter' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <p className={`text-sm font-medium ${registerForm.role === 'renter' ? 'text-blue-600' : 'text-slate-700'}`}>
                          Người thuê
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegisterForm({ ...registerForm, role: 'landlord' })}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          registerForm.role === 'landlord'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          registerForm.role === 'landlord' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <p className={`text-sm font-medium ${registerForm.role === 'landlord' ? 'text-blue-600' : 'text-slate-700'}`}>
                          Người cho thuê
                        </p>
                      </button>
                    </div>
                    {registerErrors.role && <p className="text-red-500 text-sm mt-2">{registerErrors.role}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng ký tài khoản'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding Modal (for Google login) */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Hoàn tất đăng ký</h3>
                <p className="text-sm text-slate-500">Vui lòng điền thông tin để tiếp tục</p>
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={onboardingForm.fullName}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                />
                {onboardingErrors.fullName && <p className="text-red-500 text-sm mt-1">{onboardingErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={onboardingForm.email}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                />
                {onboardingErrors.email && <p className="text-red-500 text-sm mt-1">{onboardingErrors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={onboardingForm.phone}
                    onChange={(e) => setOnboardingForm({ ...onboardingForm, phone: e.target.value })}
                    placeholder="0901 234 567"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                  />
                  {onboardingErrors.phone && <p className="text-red-500 text-sm mt-1">{onboardingErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tuổi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={onboardingForm.age}
                    onChange={(e) => setOnboardingForm({ ...onboardingForm, age: e.target.value })}
                    placeholder="25"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                  />
                  {onboardingErrors.age && <p className="text-red-500 text-sm mt-1">{onboardingErrors.age}</p>}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Bạn là ai? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setOnboardingForm({ ...onboardingForm, role: 'renter' })}
                    className={`p-5 rounded-xl border-2 transition-all text-center ${
                      onboardingForm.role === 'renter'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      onboardingForm.role === 'renter' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <p className={`font-semibold ${onboardingForm.role === 'renter' ? 'text-blue-600' : 'text-slate-700'}`}>
                      Người thuê
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Tìm phòng trọ</p>
                    {onboardingForm.role === 'renter' && (
                      <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnboardingForm({ ...onboardingForm, role: 'landlord' })}
                    className={`p-5 rounded-xl border-2 transition-all text-center ${
                      onboardingForm.role === 'landlord'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      onboardingForm.role === 'landlord' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <p className={`font-semibold ${onboardingForm.role === 'landlord' ? 'text-blue-600' : 'text-slate-700'}`}>
                      Người cho thuê
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Chủ trọ</p>
                    {onboardingForm.role === 'landlord' && (
                      <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                    )}
                  </button>
                </div>
                {onboardingErrors.role && <p className="text-red-500 text-sm mt-2">{onboardingErrors.role}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                onClick={handleOnboardingSubmit}
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
              >
                Hoàn tất đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
