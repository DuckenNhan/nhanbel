import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Heart,
  Bed,
  Bath,
  Sparkles,
  Eye,
  SlidersHorizontal,
  X,
  Filter
} from 'lucide-react';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { useToast } from '../context/ToastContext';
import { ROOM_LISTINGS, AMENITIES, formatCurrency, RoomListing } from '../utils/helpers';
import Room3DModal from '../components/Room3DModal';

const RenterHomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomListing | null>(null);

  const { isRoomSaved, toggleSaveRoom } = useSavedRooms();
  const { showToast } = useToast();

  const districts = [...new Set(ROOM_LISTINGS.map(r => r.district))];

  const filteredRooms = ROOM_LISTINGS.filter(room => {
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !room.address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedDistrict && room.district !== selectedDistrict) {
      return false;
    }
    if (room.price < priceRange[0] || room.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  const handleToggleSave = (roomId: string) => {
    toggleSaveRoom(roomId);
    const wasSaved = isRoomSaved(roomId);
    showToast(
      wasSaved ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã lưu vào danh sách yêu thích',
      'success'
    );
  };

  const getAmenityLabel = (id: string) => {
    return AMENITIES.find(a => a.id === id)?.label || id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      {/* Search Header */}
      <section className="bg-white border-b border-slate-100 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên hoặc địa chỉ..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
              />
            </div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all min-w-[160px]"
            >
              <option value="">Tất cả quận</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="border-t border-slate-100 bg-slate-50 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mức giá: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="500000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1 accent-blue-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="500000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1 accent-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tiện ích
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.slice(0, 6).map(amenity => (
                      <button
                        key={amenity.id}
                        className="px-3 py-1.5 bg-white text-slate-600 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-200"
                      >
                        {amenity.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Room Listings */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {filteredRooms.length} phòng trọ phù hợp
              </h1>
              <p className="text-sm text-slate-500">
                {selectedDistrict ? `Tại ${selectedDistrict}` : 'Toàn TP. Hồ Chí Minh'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Sắp xếp:</span>
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600/50">
                <option>Mới nhất</option>
                <option>Giá thấp nhất</option>
                <option>Giá cao nhất</option>
                <option>Diện tích lớn nhất</option>
              </select>
            </div>
          </div>

          {/* Room Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div key={room.id} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {room.hasMezzanine && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg">
                        Có gác lửng
                      </span>
                    )}
                    {!room.available && (
                      <span className="px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg">
                        Đã thuê
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleSave(room.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      isRoomSaved(room.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isRoomSaved(room.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {room.images.slice(0, 3).map((_, idx) => (
                      <div key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
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
                    <p className="text-xl font-bold text-blue-600 whitespace-nowrap">
                      {formatCurrency(room.price)}
                      <span className="text-sm font-normal text-slate-500">/tháng</span>
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">{room.area}m²</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {room.bedrooms} PN
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {room.bathrooms} WC
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-slate-400">
                      <Eye className="w-4 h-4" />
                      {room.views}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {room.amenities.slice(0, 4).map(amenity => (
                      <span key={amenity} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                        {getAmenityLabel(amenity)}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                        +{room.amenities.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Xem bố cục 3D</span>
                    </button>
                    <button
                      onClick={() => handleToggleSave(room.id)}
                      className={`px-4 py-2.5 rounded-xl font-medium border transition-all ${
                        isRoomSaved(room.id)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isRoomSaved(room.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Không tìm thấy phòng trọ</h3>
              <p className="text-slate-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </section>

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

export default RenterHomePage;
