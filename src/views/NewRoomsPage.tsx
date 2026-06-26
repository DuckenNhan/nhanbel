import React from 'react';
import { Clock, MapPin, Bed, Bath, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { useToast } from '../context/ToastContext';
import { ROOM_LISTINGS, AMENITIES, formatCurrency } from '../utils/helpers';

const NewRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isRoomSaved, toggleSaveRoom } = useSavedRooms();
  const { showToast } = useToast();

  // Mock "new today" - use the last 3 rooms as "new"
  const newRooms = ROOM_LISTINGS.slice(-3).map(room => ({
    ...room,
    postedAt: new Date().toLocaleDateString('vi-VN')
  }));

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
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Mới đăng hôm nay</h1>
              <p className="text-slate-500">Phòng trọ mới cập nhật trong 24h qua</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-8 inline-flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-slate-600">Cập nhật lần cuối:</span>
          </div>
          <span className="font-semibold text-slate-900">{new Date().toLocaleString('vi-VN')}</span>
        </div>

        {/* Room Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newRooms.map(room => (
            <div
              key={room.id}
              onClick={() => handleCardClick(room.id)}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
            >
              {/* New Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg">
                  Mới
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={(e) => handleToggleSave(e, room.id)}
                    className={`p-2 rounded-full transition-all ${
                      isRoomSaved(room.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isRoomSaved(room.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Posted Time */}
                <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>Đăng hôm nay, {room.postedAt}</span>
                </div>

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

        {/* Info Banner */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Nhận thông báo phòng mới</h3>
              <p className="text-sm text-slate-600 mb-4">
                Đăng ký nhận email thông báo khi có phòng trọ mới phù hợp với tiêu chí của bạn.
              </p>
              <button className="btn-primary text-sm py-2">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoomsPage;
