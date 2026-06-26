import React from 'react';
import { Star, MapPin, Bed, Bath, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { useToast } from '../context/ToastContext';
import { ROOM_LISTINGS, AMENITIES, formatCurrency } from '../utils/helpers';

const FeaturedRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isRoomSaved, toggleSaveRoom } = useSavedRooms();
  const { showToast } = useToast();

  // Get featured rooms (those with most views)
  const featuredRooms = [...ROOM_LISTINGS]
    .filter(r => r.available)
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const handleToggleSave = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    toggleSaveRoom(roomId);
    showToast(
      isRoomSaved(roomId) ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã lưu vào danh sách yêu thích',
      'success'
    );
  };

  const handleCardClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const getAmenityLabel = (id: string) => {
    return AMENITIES.find(a => a.id === id)?.label || id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Phòng nổi bật</h1>
              <p className="text-slate-500">Những phòng trọ được xem nhiều nhất tuần này</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-2xl font-bold text-yellow-600">{featuredRooms.length}</p>
            <p className="text-sm text-slate-500">Phòng nổi bật</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{featuredRooms.reduce((sum, r) => sum + r.views, 0)}</p>
            <p className="text-sm text-slate-500">Tổng lượt xem</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-2xl font-bold text-green-600">{featuredRooms.filter(r => r.hasMezzanine).length}</p>
            <p className="text-sm text-slate-500">Có gác lửng</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              {Math.round(featuredRooms.reduce((sum, r) => sum + r.area, 0) / featuredRooms.length)}m²
            </p>
            <p className="text-sm text-slate-500">Diện tích TB</p>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRooms.map((room, index) => (
            <div
              key={room.id}
              onClick={() => handleCardClick(room.id)}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
            >
              {/* Ranking Badge */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Nổi bật
                  </span>
                </div>
                <button
                  onClick={(e) => handleToggleSave(e, room.id)}
                  className={`absolute top-3 left-3 p-2 rounded-full transition-all ${
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
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {room.district}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(room.price)}
                    <span className="text-sm font-normal text-slate-500">/tháng</span>
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
                  <span className="flex items-center gap-1 ml-auto text-yellow-600 font-medium">
                    <Eye className="w-4 h-4" />
                    {room.views}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.slice(0, 3).map(amenity => (
                    <span key={amenity} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                      {getAmenityLabel(amenity)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedRoomsPage;
