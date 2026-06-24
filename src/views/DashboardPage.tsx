import React, { useState } from 'react';
import {
  Home,
  Eye,
  TrendingUp,
  Code,
  Share2,
  ChevronRight,
  X,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Copy,
  ExternalLink,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatCurrency, generateEmbedCode, generateShortLink } from '../utils/helpers';

interface Property {
  id: string;
  name: string;
  address: string;
  area: number;
  status: 'completed' | 'processing';
  views: number;
  createdAt: string;
  thumbnail: string;
}

const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Phòng Studio Quận Bình Thạnh',
    address: 'Đường Nguyễn Xí, Phường 26',
    area: 22,
    status: 'completed',
    views: 1284,
    createdAt: '2024-01-15',
    thumbnail: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'prop-2',
    name: 'Căn hộ Mini Quận 7',
    address: 'Đường Nguyễn Lương Bằng, Phường Tân Phong',
    area: 35,
    status: 'completed',
    views: 856,
    createdAt: '2024-01-20',
    thumbnail: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'prop-3',
    name: 'Phòng trọ gác lửng Thủ Đức',
    address: 'Đường Lê Văn Việt, Phường Hiệp Phú',
    area: 28,
    status: 'processing',
    views: 0,
    createdAt: '2024-01-25',
    thumbnail: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const viewData = [32, 45, 78, 92, 65, 110, 145, 98, 87, 134, 156, 178];

const DashboardPage: React.FC = () => {
  const [properties] = useState<Property[]>(mockProperties);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { showToast } = useToast();

  const stats = [
    {
      label: 'Tổng số phòng đã quét',
      value: properties.filter(p => p.status === 'completed').length,
      icon: Home,
      color: 'bg-blue-600'
    },
    {
      label: 'Lượt xem mô hình 3D',
      value: properties.reduce((sum, p) => sum + p.views, 0),
      icon: Eye,
      color: 'bg-slate-800'
    },
    {
      label: 'Tỷ lệ chốt phòng',
      value: '89%',
      icon: TrendingUp,
      color: 'bg-amber-500'
    }
  ];

  const handleGetEmbedCode = (property: Property) => {
    setSelectedProperty(property);
    setShowEmbedModal(true);
  };

  const handleQuickShare = (property: Property) => {
    setSelectedProperty(property);
    setShowShareModal(true);
  };

  const copyEmbedCode = () => {
    if (!selectedProperty) return;
    const embedCode = generateEmbedCode(selectedProperty.id);
    navigator.clipboard.writeText(embedCode);
    showToast('Đã sao chép mã nhúng!');
  };

  const copyShareLink = () => {
    if (!selectedProperty) return;
    const shortLink = generateShortLink(selectedProperty.id);
    navigator.clipboard.writeText(shortLink);
    showToast('Đã sao chép link chia sẻ!');
    setShowShareModal(false);
  };

  const MiniChart: React.FC = () => {
    const maxVal = Math.max(...viewData);
    const width = 280;
    const height = 80;

    return (
      <svg width={width} height={height} className="w-full h-full">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${height} ${viewData.map((v, i) => {
            const x = (i / (viewData.length - 1)) * width;
            const y = height - (v / maxVal) * (height - 10);
            return `L ${x} ${y}`;
          }).join(' ')} L ${width} ${height} Z`}
          fill="url(#gradient)"
          fillOpacity="0.15"
        />
        <path
          d={`M 0 ${height - (viewData[0] / maxVal) * (height - 10)} ${viewData.map((v, i) => {
            const x = (i / (viewData.length - 1)) * width;
            const y = height - (v / maxVal) * (height - 10);
            return `L ${x} ${y}`;
          }).join(' ')}`}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Kênh Chủ Trọ</h1>
          <p className="text-slate-600">Quản lý phòng trọ và theo dõi hiệu quả của mô hình 3D</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {idx === 1 && (
                    <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      +12%
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value.toLocaleString('vi-VN')}</h3>
                <p className="text-slate-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Views Chart */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Lượt xem theo thời gian
              </h3>
              <p className="text-sm text-slate-500">Số lượt xem trong 30 ngày qua</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{viewData.reduce((a, b) => a + b, 0)}</p>
              <p className="text-sm text-blue-600">+18% so với tháng trước</p>
            </div>
          </div>
          <div className="h-20">
            <MiniChart />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card p-5 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Quản lý khách thuê tiềm năng</p>
              <p className="text-sm text-slate-500">12 khách đang quan tâm</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
          </div>

          <div className="card p-5 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Nâng cấp gói dịch vụ</p>
              <p className="text-sm text-slate-500">Tiết kiệm 20% khi đăng ký năm</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
          </div>

          <div className="card p-5 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Đặt lịch quét mới</p>
              <p className="text-sm text-slate-500">+3 phòng đang chờ xử lý</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
          </div>
        </div>

        {/* Properties Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Danh sách phòng đã quét</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Phòng</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Địa chỉ</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Diện tích</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Trạng thái</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Lượt xem</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.thumbnail}
                          alt={property.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{property.name}</p>
                          <p className="text-sm text-slate-500">{property.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {property.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{property.area}m²</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          property.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {property.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Đã hoàn thành
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            Đang xử lý
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Eye className="w-4 h-4 text-slate-400" />
                        {property.views.toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {property.status === 'completed' && (
                          <>
                            <button
                              onClick={() => handleGetEmbedCode(property)}
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Code className="w-4 h-4" />
                              Lấy mã nhúng
                            </button>
                            <button
                              onClick={() => handleQuickShare(property)}
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                            >
                              <Share2 className="w-4 h-4" />
                              Chia sẻ nhanh
                            </button>
                          </>
                        )}
                        {property.status === 'processing' && (
                          <span className="text-sm text-slate-400">Chờ cập nhật</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Embed Code Modal */}
      {showEmbedModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Mã nhúng 3D
              </h3>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Sao chép đoạn mã dưới đây và dán vào website của bạn để hiển thị mô hình 3D.
              </p>

              <div className="bg-slate-900 rounded-xl p-4 mb-4 overflow-x-auto">
                <code className="text-blue-400 text-sm whitespace-pre">
                  {generateEmbedCode(selectedProperty.id)}
                </code>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyEmbedCode}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Sao chép mã
                </button>
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="btn-outline"
                >
                  Đóng
                </button>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mã nhúng hoạt động trên mọi nền tảng web
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                Chia sẻ nhanh
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Link chia sẻ đã được tối ưu cho Zalo, Facebook và các nền tảng khác.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-4 flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900 font-medium truncate">
                  {generateShortLink(selectedProperty.id)}
                </span>
              </div>

              <button
                onClick={copyShareLink}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Sao chép link
              </button>

              <div className="mt-6">
                <p className="text-sm text-slate-500 mb-3">Hoặc chia sẻ trực tiếp:</p>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center">
                    Facebook
                  </button>
                  <button className="p-4 bg-blue-400 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center justify-center">
                    Zalo
                  </button>
                  <button className="p-4 bg-blue-700 hover:bg-blue-800 rounded-xl text-white font-medium transition-colors flex items-center justify-center">
                    Messenger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
