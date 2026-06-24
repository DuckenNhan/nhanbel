import React, { useState } from 'react';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Eye,
  Trash2,
  Phone,
  Calendar,
  Search
} from 'lucide-react';
import { ROOM_LISTINGS, formatCurrency, RoomListing, AMENITIES } from '../utils/helpers';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { useToast } from '../context/ToastContext';
import Room3DModal from '../components/Room3DModal';

const SavedRoomsPage: React.FC = () => {
  const { savedRoomIds, unsaveRoom, isRoomSaved } = useSavedRooms();
  const { showToast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<RoomListing | null>(null);

  // Only get rooms that are actually saved
  const savedRooms = ROOM_LISTINGS.filter(room => isRoomSaved(room.id));

  const handleRemove = (roomId: string) => {
    unsaveRoom(roomId);
    showToast('Đã xóa khỏi danh sách yêu thích', 'success');
  };

  const getAmenityLabel = (id: string) => {
    return AMENITIES.find(a => a.id === id)?.label || id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Phòng đã lưu</h1>
              <p className="text-slate-500">{savedRooms.length} phòng trong danh sách yêu thích</p>
            </div>
          </div>
        </div>

        {savedRooms.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <Heart className="w-16 h-16 text-blue-200" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Chưa có phòng nào được lưu</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Hãy tìm và lưu những phòng trọ ưng ý. Danh sách này sẽ giúp bạn dễ dàng so sánh và quyết định sau này.
            </p>
            <button className="btn-primary">
              Tìm phòng ngay
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Tổng phòng đã lưu</p>
                <p className="text-2xl font-bold text-slate-900">{savedRooms.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Giá thấp nhất</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(Math.min(...savedRooms.map(r => r.price)))}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Giá cao nhất</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(Math.max(...savedRooms.map(r => r.price)))}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Diện tích TB</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(savedRooms.reduce((sum, r) => sum + r.area, 0) / savedRooms.length)}m²
                </p>
              </div>
            </div>

            {/* Rooms List */}
            <div className="space-y-4">
              {savedRooms.map(room => (
                <div key={room.id} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-80 aspect-video md:aspect-auto relative">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        {room.available ? (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg">
                            Còn phòng
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg">
                            Đã thuê
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(room.id)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">{room.name}</h3>
                          <p className="text-slate-500 flex items-center gap-1 mb-3">
                            <MapPin className="w-4 h-4" />
                            {room.address}
                          </p>

                          <div className="flex flex-wrap gap-3 mb-3">
                            <span className="text-2xl font-bold text-blue-600">
                              {formatCurrency(room.price)}
                              <span className="text-sm font-normal text-slate-500">/tháng</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                            <span className="font-medium">{room.area}m²</span>
                            <span className="flex items-center gap-1">
                              <Bed className="w-4 h-4" /> {room.bedrooms} PN
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="w-4 h-4" /> {room.bathrooms} WC
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Eye className="w-4 h-4" /> {room.views}
                            </span>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {room.amenities.slice(0, 5).map(amenity => (
                              <span key={amenity} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                                {getAmenityLabel(amenity)}
                              </span>
                            ))}
                            {room.amenities.length > 5 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                                +{room.amenities.length - 5}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 md:min-w-[160px]">
                          <button
                            onClick={() => setSelectedRoom(room)}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm"
                          >
                            Xem bố cục 3D
                          </button>
                          <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            Gọi chủ phòng
                          </button>
                          <button className="px-4 py-2.5 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Đặt lịch xem
                          </button>
                        </div>
                      </div>

                      {/* Landlord Info */}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {room.landlordName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{room.landlordName}</p>
                            <p className="text-sm text-slate-500">{room.landlordPhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compare Section */}
            {savedRooms.length > 1 && (
              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-slate-900 mb-4">So sánh nhanh</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Tiêu chí</th>
                        {savedRooms.slice(0, 3).map(room => (
                          <th key={room.id} className="text-center py-3 px-4 text-sm font-medium text-slate-900">
                            {room.name.slice(0, 20)}...
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-100">
                        <td className="py-3 px-4 text-sm text-slate-600">Giá thuê</td>
                        {savedRooms.slice(0, 3).map(room => (
                          <td key={room.id} className="text-center py-3 px-4 text-sm font-semibold text-blue-600">
                            {formatCurrency(room.price)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-blue-100">
                        <td className="py-3 px-4 text-sm text-slate-600">Diện tích</td>
                        {savedRooms.slice(0, 3).map(room => (
                          <td key={room.id} className="text-center py-3 px-4 text-sm font-semibold text-slate-900">
                            {room.area}m²
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-blue-100">
                        <td className="py-3 px-4 text-sm text-slate-600">Tiện ích</td>
                        {savedRooms.slice(0, 3).map(room => (
                          <td key={room.id} className="text-center py-3 px-4 text-sm text-slate-600">
                            {room.amenities.length} tiện ích
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-slate-600">Vị trí</td>
                        {savedRooms.slice(0, 3).map(room => (
                          <td key={room.id} className="text-center py-3 px-4 text-sm text-slate-600">
                            {room.district}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
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

export default SavedRoomsPage;
