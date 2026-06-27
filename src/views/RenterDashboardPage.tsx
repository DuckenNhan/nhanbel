import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RenterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Chào buổi sáng' : currentTime < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const quickActions = [
    {
      id: 'search',
      title: 'Tìm phòng trọ',
      description: 'Khám phá danh sách phòng trọ thực tế với mô hình 3D tương tác.',
      icon: Search,
      iconBg: 'bg-blue-600 text-white shadow-sm',
      cardClasses: 'bg-gradient-to-br from-blue-50/80 to-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer',
      path: '/search'
    },
    {
      id: 'mentor',
      title: 'Mentor',
      subtitle: 'Kết nối Người hướng dẫn',
      description: 'Trò chuyện 1:1 với Mentor để được tư vấn khu vực an toàn và tìm phòng chuẩn.',
      icon: MessageCircle,
      iconBg: 'bg-slate-800 text-white shadow-sm',
      cardClasses: 'bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer',
      path: '/mentor'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 text-sm font-medium">{greeting}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Chào mừng quay trở lại, {user?.fullName?.split(' ').pop() || 'Bạn'}!
          </h1>
          <p className="text-slate-500 max-w-2xl">
            PhongTro3D giúp bạn tìm phòng trọ an toàn với hình ảnh thực tế và mô hình 3D tương tác.
          </p>
        </section>

        {/* Main 2-Card Layout */}
        <section className="mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => navigate(action.path)}
                  className={`${action.cardClasses} text-left group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    {action.title}
                  </h2>
                  {action.subtitle && (
                    <p className="text-blue-600 font-medium text-sm mb-2">{action.subtitle}</p>
                  )}
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {action.description}
                  </p>

                  <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Truy cập ngay</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Tại sao chọn PhongTro3D?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Xác thực chủ trọ</h4>
                  <p className="text-sm text-slate-500">Mentor giúp bạn kiểm tra thông tin chủ nhà và khu vực an ninh.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Mô hình 3D thực tế</h4>
                  <p className="text-sm text-slate-500">Xem phòng từ mọi góc độ, đo kích thước chính xác từng cm.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Hỗ trợ 1:1</h4>
                  <p className="text-sm text-slate-500">Tư vấn trực tiếp từ Mentor có kinh nghiệm tìm trọ tại Sài Gòn.</p>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
};

export default RenterDashboardPage;
