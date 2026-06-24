import React from 'react';
import {
  Camera,
  Box,
  Ruler,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Scan,
  Globe,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: 'home' | 'showcase' | 'booking' | 'dashboard' | 'search' | 'saved') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Camera,
      title: 'Ảnh thực tế HDR',
      description: 'Hình ảnh chất lượng cao, trung thực 100% không chỉnh sửa gian dối'
    },
    {
      icon: Box,
      title: 'Mô hình 3D tương tác',
      description: 'Xem phòng từ mọi góc độ, xoay pan 360° ngay trên trình duyệt'
    },
    {
      icon: Ruler,
      title: 'Thước đo điện tử',
      description: 'Đo kích thước chính xác từng cm, không cần đến tận nơi'
    }
  ];

  const steps = [
    { icon: Calendar, title: 'Đặt lịch', description: 'Chọn gói phù hợp và đặt lịch quét' },
    { icon: Scan, title: 'Quét không gian', description: 'Đội ngũ chuyên nghiệp đến quét và chụp ảnh' },
    { icon: Globe, title: 'Nhận phòng mẫu', description: 'Nhận link 3D và chia sẻ ngay cho khách thuê' }
  ];

  const benefits = [
    { icon: Shield, text: 'Loại bỏ hoàn toàn ảnh giả, không lo "treo đầu dê bán thịt chó"' },
    { icon: Clock, text: 'Tiết kiệm thời gian xem phòng, khách yên tâm đặt cọc ngay' },
    { icon: Sparkles, text: 'Tăng uy tín chủ trọ, tạo sự khác biệt so với đối thủ' }
  ];

  return (
    <div className="gradient-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Công nghệ quét phòng 3D tiên tiến nhất Việt Nam</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight animate-slide-up">
              Loại bỏ{' '}
              <span className="gradient-text">ảnh giả</span>
              <br />
              Niềm tin thật cho{' '}
              <span className="gradient-text">chủ trọ</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-slide-up">
              Giúp khách thuê xem phòng thực tế từ mọi góc độ, đo đạc chính xác kích thước
              mà không cần đến tận nơi. Tiết kiệm thời gian, chốt phòng nhanh hơn.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <button
                onClick={() => onNavigate('booking')}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Đặt lịch quét ngay</span>
              </button>
              <button
                onClick={() => onNavigate('showcase')}
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Box className="w-5 h-5" />
                <span>Xem phòng mẫu 3D</span>
              </button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>500+ phòng đã quét</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>98% khách hài lòng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Hoàn tiền nếu không hài lòng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 max-w-5xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10">
            <div className="aspect-video bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 relative">
              <img
                src="https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Phòng trọ 3D"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating 3D indicator */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                  <p className="text-sm font-medium text-slate-900">Phòng Studio Bình Thạnh</p>
                  <p className="text-xs text-slate-500">Kéo thả để xoay 3D</p>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  22m²
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Giải pháp toàn diện cho chủ trọ</h2>
            <p className="section-subtitle">
              Công nghệ tiên tiến giúp bạn thể hiện phòng trọ một cách chân thực và chuyên nghiệp nhất
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-hover p-8 text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-slate-100 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tại sao chọn <span className="text-blue-400">PhongTro3D</span>?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-slate-300 text-lg">{benefit.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Căn hộ 3D"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white text-slate-900 rounded-xl p-4 shadow-xl animate-float">
                <p className="text-sm font-medium">Lượt xem mô hình</p>
                <p className="text-2xl font-bold text-blue-600">2,847</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white rounded-xl p-4 shadow-xl">
                <p className="text-sm font-medium">Tỷ lệ chốt phòng</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Quy trình đơn giản 3 bước</h2>
            <p className="section-subtitle">
              Từ khi đặt lịch đến khi nhận được mô hình 3D hoàn chỉnh chỉ trong 24 giờ
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded-full" />

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative text-center">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 mb-6 z-10">
                      <Icon className="w-10 h-10" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Sẵn sàng nâng tầm phòng trọ của bạn?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Đặt lịch quét ngay hôm nay và nhận ưu đãi giảm 20% cho khách mới
          </p>
          <button
            onClick={() => onNavigate('booking')}
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            <span>Đặt lịch ngay</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
