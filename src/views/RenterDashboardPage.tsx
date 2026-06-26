import React from 'react';
import {
  Search,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RenterDashboardPageProps {
  onNavigate: (view: 'search' | 'saved' | 'mentor') => void;
}

const RenterDashboardPage: React.FC<RenterDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Chào buổi sáng' : currentTime < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const quickActions = [
    {
      id: 'search',
      title: 'Tìm phòng trọ',
      description: 'Khám phá danh sách phòng trọ thực tế với mô hình 3D tương tác.',
      icon: Search,
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
      cardBg: 'bg-gradient-to-br from-blue-50 to-slate-50',
      borderHover: 'hover:border-blue-300',
      view: 'search' as const
    },
    {
      id: 'mentor',
      title: 'Mentor',
      subtitle: 'Kết nối Người hướng dẫn',
      description: 'Trò chuyện 1:1 với Mentor để được tư vấn khu vực an toàn và tìm phòng chuẩn.',
      icon: MessageCircle,
      iconBg: 'bg-slate-800',
      iconColor: 'text-white',
      cardBg: 'bg-gradient-to-br from-slate-50 to-blue-50',
      borderHover: 'hover:border-slate-400',
      view: 'mentor' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                  onClick={() => onNavigate(action.view)}
                  className={`relative overflow-hidden rounded-2xl border-2 border-slate-200 ${action.borderHover} bg-white p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 opacity-50 ${action.cardBg}`} />

                  {/* Content */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl ${action.iconBg} ${action.iconColor} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                      {action.title}
                    </h2>
                    {action.subtitle && (
                      <p className="text-blue-600 font-medium text-sm mb-3">{action.subtitle}</p>
                    )}
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {action.description}
                    </p>

                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      <span>Truy cập ngay</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${action.iconBg.replace('bg-', 'bg-').replace('600', '100').replace('800', '100')} opacity-30 group-hover:scale-150 transition-transform duration-500`} />
                </button>
              );
            })}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Tại sao chọn PhongTro3D?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Xác thực chủ trọ</h4>
                  <p className="text-sm text-slate-500">Mentor giúp bạn kiểm tra thông tin chủ nhà và khu vực an ninh.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Mô hình 3D thực tế</h4>
                  <p className="text-sm text-slate-500">Xem phòng từ mọi góc độ, đo kích thước chính xác từng cm.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Hỗ trợ 1:1</h4>
                  <p className="text-sm text-slate-500">Tư vấn trực tiếp từ Mentor có kinh nghiệm tìm trọ tại Sài Gòn.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-blue-600/25">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Cần hỗ trợ tìm phòng?</h3>
                <p className="text-blue-100">
                  Kết nối ngay với Mentor Hoàng Cường để được tư vấn khu vực an toàn và phòng trọ phù hợp với ngân sách của bạn.
                </p>
              </div>
              <button
                onClick={() => onNavigate('mentor')}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat với Mentor
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RenterDashboardPage;
