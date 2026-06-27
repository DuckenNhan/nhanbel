import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Phone,
  Shield,
  Zap,
  Camera,
  Maximize2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Tag,
  X,
  Loader2,
  Send
} from 'lucide-react';
import { ROOM_LISTINGS, AMENITIES, formatCurrency, RoomListing } from '../utils/helpers';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { useToast } from '../context/ToastContext';
import Room3DModal from '../components/Room3DModal';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRoomSaved, toggleSaveRoom } = useSavedRooms();
  const { showToast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [show3DModal, setShow3DModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [isNegotiationLoading, setIsNegotiationLoading] = useState(false);

  const room = ROOM_LISTINGS.find(r => r.id === id);
  const isSaved = room ? isRoomSaved(room.id) : false;

  if (!room) {
    return (
      <div className="min-h-screen pt-8 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy phòng trọ</h1>
          <p className="text-slate-500 mb-6">Phòng trọ này không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate('/search')}
            className="btn-primary"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  const getAmenityLabel = (id: string) => {
    return AMENITIES.find(a => a.id === id)?.label || id;
  };

  const handleToggleSave = () => {
    toggleSaveRoom(room.id);
    showToast(
      isSaved ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã lưu vào danh sách yêu thích',
      'success'
    );
  };

  const handleConsult = () => {
    navigate('/mentor', {
      state: {
        propertyContext: {
          id: room.id,
          name: room.name,
          address: room.address,
          price: room.price
        }
      }
    });
  };

  const handleNegotiationSubmit = () => {
    if (!negotiationPrice) {
      showToast('Vui lòng nhập mức giá đề xuất', 'error');
      return;
    }
    setIsNegotiationLoading(true);
    setTimeout(() => {
      setIsNegotiationLoading(false);
      setShowNegotiationModal(false);
      setNegotiationPrice('');
      setNegotiationMessage('');
      showToast('Đề xuất của bạn đã được gửi đến chủ trọ. Vui lòng chờ phản hồi trong vòng 24h!', 'success');
    }, 1500);
  };

  const handleTemplateClick = (text: string) => {
    setNegotiationMessage((prev) => {
      const separator = prev.trim() ? prev.trim() + ' ' : '';
      return separator + text;
    });
  };

  const negotiationTemplates = [
    'Mình là sinh viên thuê dài hạn (cam kết ở trên 1 năm), mong chủ nhà hỗ trợ giảm chút đỉnh ạ.',
    'Mình có thể thanh toán trước tiền nhà 6 tháng/lần, không biết giá có được ưu đãi hơn không?',
    'Mình ở một mình, ít đồ đạc và cam kết giữ gìn phòng sạch sẽ, hy vọng chốt được mức giá này.',
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Đã sao chép link phòng!', 'success');
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isSaved
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Đã lưu' : 'Lưu'}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
            >
              <Share2 className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={room.images[selectedImageIndex]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {room.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === selectedImageIndex ? 'bg-white w-6' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                {room.hasMezzanine && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg">
                    Có gác lửng
                  </span>
                )}
                {room.available ? (
                  <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg">
                    Còn phòng
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-lg">
                    Đã thuê
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedImageIndex ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* 3D View Button */}
            <button
              onClick={() => setShow3DModal(true)}
              className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all"
            >
              <Maximize2 className="w-5 h-5" />
              Xem bố cục 3D
            </button>
          </div>

          {/* Property Info */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{room.name}</h1>
              <p className="flex items-center gap-2 text-slate-500 mb-4">
                <MapPin className="w-5 h-5" />
                {room.address}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-blue-600">
                  {formatCurrency(room.price)}
                </span>
                <span className="text-slate-500">/tháng</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Ruler className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-slate-900">{room.area}m²</p>
                <p className="text-sm text-slate-500">Diện tích</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Bed className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-slate-900">{room.bedrooms}</p>
                <p className="text-sm text-slate-500">Phòng ngủ</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Bath className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-slate-900">{room.bathrooms}</p>
                <p className="text-sm text-slate-500">WC</p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-semibold text-slate-900 mb-3">Tiện ích nội thất</h2>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    {getAmenityLabel(amenity)}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-slate-900 mb-3">Mô tả chi tiết</h2>
              <p className="text-slate-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Landlord Info */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h2 className="font-semibold text-slate-900 mb-3">Thông tin chủ phòng</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {room.landlordName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{room.landlordName}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {room.landlordPhone}
                    </p>
                  </div>
                </div>
                <button className="btn-outline text-sm">Gọi ngay</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConsult}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
              >
                <MessageCircle className="w-5 h-5" />
                Tư vấn về phòng này
              </button>
              <button
                onClick={() => setShowNegotiationModal(true)}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all"
              >
                <Tag className="w-5 h-5" />
                Thương lượng giá thuê
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all">
                <Phone className="w-5 h-5" />
                Gọi chủ phòng
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium text-slate-900">An ninh tốt</p>
              <p className="text-sm text-slate-500">Khu vực có bảo vệ 24/7</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium text-slate-900">Ảnh thực tế</p>
              <p className="text-sm text-slate-500">Ảnh đã được xác thực 100%</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="font-medium text-slate-900">Mô hình 3D</p>
              <p className="text-sm text-slate-500">Xem bố cục chi tiết</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Modal */}
      {show3DModal && (
        <Room3DModal
          room={room}
          onClose={() => setShow3DModal(false)}
        />
      )}

      {/* Price Negotiation Modal */}
      {showNegotiationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Đề xuất mức giá của bạn</h3>
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 space-y-5">
              {/* Current Price */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Giá niêm yết</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">{formatCurrency(room.price)}</span>
                  <span className="text-slate-500">/tháng</span>
                </div>
              </div>

              {/* Proposed Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mức giá đề xuất (VNĐ/tháng)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={negotiationPrice}
                    onChange={(e) => setNegotiationPrice(e.target.value)}
                    placeholder="Nhập mức giá bạn muốn đề xuất..."
                    className="input-field text-lg font-semibold"
                    min="0"
                    step="100000"
                  />
                  {negotiationPrice && Number(negotiationPrice) < room.price && (
                    <p className="mt-1.5 text-sm text-blue-600 font-medium">
                      Giảm {formatCurrency(room.price - Number(negotiationPrice))} so với giá gốc
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Lý do / Điều kiện đi kèm để được giảm giá
                </label>
                <textarea
                  value={negotiationMessage}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                  placeholder="Nhập lý do hoặc điều kiện để được giảm giá..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* Smart Templates */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Mẫu câu thương lượng</p>
                <div className="flex flex-col gap-2">
                  {negotiationTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTemplateClick(template)}
                      className="text-left text-sm px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-all"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleNegotiationSubmit}
                disabled={isNegotiationLoading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isNegotiationLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Gửi đề xuất
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
