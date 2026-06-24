import React, { useState } from 'react';
import {
  Search,
  Heart,
  Eye,
  MapPin,
  Bed,
  Bath,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { ROOM_LISTINGS, AMENITIES, formatCurrency, RoomListing } from '../utils/helpers';
import Room3DModal from '../components/Room3DModal';

interface RenterDashboardPageProps {
  onNavigate: (view: 'search' | 'saved') => void;
}

const RenterDashboardPage: React.FC<RenterDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { isRoomSaved, toggleSaveRoom, savedCount } = useSavedRooms();
  const [selectedRoom, setSelectedRoom] = useState<RoomListing | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredRooms = ROOM_LISTINGS.filter(r => r.available).slice(0, 4);
  const recentlyViewedRooms = ROOM_LISTINGS.slice(0, 3);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredRooms.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, featuredRooms.length - 2)) % Math.max(1, featuredRooms.length - 2));
  };

  const getAmenityLabel = (id: string) => {
    return AMENITIES.find(a => a.id === id)?.label || id;
  };

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Chào buổi sáng' : currentTime < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-blue-600/25">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-blue-100 text-sm font-medium">{greeting}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Chào mừng quay trở lại, {user?.fullName?.split(' ').pop() || 'Bạn'}!
                </h1>
                <p className="text-blue-100 max-w-lg">
                  Hôm nay bạn muốn tìm phòng trọ thế nào? Khám phá các phòng trọ mới nhất với mô hình 3D chân thực.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{savedCount}</p>
                  <p className="text-sm text-blue-100">Phòng đã lưu</p>
                </div>
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=fff&color=2563eb'}
                  alt={user?.fullName}
                  className="w-16 h-16 rounded-full border-4 border-white/30"
                />
              </div>
            </div>

            {/* Quick Search */}
            <div className="mt-6 relative">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    placeholder="Tìm quận, địa chỉ, hoặc tên phòng..."
                    className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <button
                  onClick={() => onNavigate('search')}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden md:inline">Tìm kiếm</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => onNavigate('search')}
            className="bg-white rounded-xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-semibold text-slate-900">Tìm phòng trọ</p>
            <p className="text-sm text-slate-500">Tìm phòng phù hợp với bạn</p>
          </button>

          <button
            onClick={() => onNavigate('saved')}
            className="bg-white rounded-xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <p className="font-semibold text-slate-900">Phòng đã lưu</p>
            <p className="text-sm text-slate-500">{savedCount} phòng yêu thích</p>
          </button>

          <div className="bg-white rounded-xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-slate-900">Phòng nổi bật</p>
            <p className="text-sm text-slate-500">Xu hướng tìm kiếm</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <p className="font-semibold text-slate-900">Mới đăng hôm nay</p>
            <p className="text-sm text-slate-500">3 phòng mới</p>
          </div>
        </section>

        {/* Featured Rooms Carousel */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Phòng trọ nổi bật</h2>
              <p className="text-slate-500">Những phòng trọ được xem nhiều nhất tuần này</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.slice(0, 3).map(room => (
              <div key={room.id} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Nổi bật
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSaveRoom(room.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      isRoomSaved(room.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isRoomSaved(room.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{room.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {room.district}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(room.price)}
                      <span className="text-xs font-normal text-slate-500">/tháng</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                    <span>{room.area}m²</span>
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" /> {room.bedrooms} PN
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" /> {room.bathrooms} WC
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {room.amenities.slice(0, 3).map(amenity => (
                      <span key={amenity} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                        {getAmenityLabel(amenity)}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Xem bố cục 3D
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate('search')}
              className="btn-outline inline-flex items-center gap-2"
            >
              Xem tất cả phòng trọ
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewedRooms.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Đã xem gần đây</h2>
                <p className="text-slate-500">Tiếp tục xem những phòng bạn đã quan tâm</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {recentlyViewedRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className="bg-white rounded-xl p-4 shadow shadow-slate-200/50 border border-slate-100 hover:shadow-md transition-all flex items-center gap-4 text-left"
                >
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 line-clamp-1">{room.name}</h3>
                    <p className="text-sm text-slate-500">{room.district}</p>
                    <p className="text-blue-600 font-semibold mt-1">{formatCurrency(room.price)}/tháng</p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{room.views}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Room 3D Modal */}
      {selectedRoom && (
        <Room3DModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default RenterDashboardPage;
