import React, { useState, useMemo } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Home,
  Calendar,
  Clock,
  User,
  Phone,
  CreditCard,
  Sparkles,
  CheckCircle,
  Loader2,
  Sun,
  Sunrise,
  Moon
} from 'lucide-react';
import { PACKAGES, HCM_DISTRICTS, formatCurrency } from '../utils/helpers';

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = [
    { id: 1, title: 'Thông tin phòng', icon: Home },
    { id: 2, title: 'Thời gian', icon: Calendar },
    { id: 3, title: 'Xác nhận', icon: CheckCircle }
  ];

  const calculatePrice = useMemo(() => {
    if (!selectedPackage) return 0;
    const pkg = PACKAGES.find(p => p.id === selectedPackage);
    if (!pkg || !pkg.price) return 0;

    const areaNum = parseFloat(area) || 0;
    const extraArea = Math.max(0, areaNum - (pkg.maxArea || 0));
    const extraPrice = extraArea * 20000;

    return pkg.price + extraPrice;
  }, [selectedPackage, area]);

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDay(),
        dayName: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][date.getDay()],
        dayNum: date.getDate(),
        month: date.getMonth() + 1
      });
    }
    return dates;
  }, []);

  const timeSlots = [
    { id: 'morning', label: 'Sáng', time: '08:00 - 11:30', icon: Sunrise },
    { id: 'afternoon', label: 'Chiều', time: '13:00 - 17:00', icon: Sun },
    { id: 'evening', label: 'Tối', time: '18:00 - 21:00', icon: Moon }
  ];

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-blue-600 text-white'
                    : isActive
                      ? 'bg-slate-900 text-white ring-4 ring-slate-900/20'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`mt-2 text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                  isCompleted ? 'bg-blue-600' : 'bg-slate-200'
                }`}
                style={{ maxWidth: '100px' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thông tin phòng</h2>
        <p className="text-slate-500">Chọn gói phù hợp và nhập địa chỉ phòng trọ của bạn</p>
      </div>

      {/* Package Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`relative card-hover p-6 cursor-pointer transition-all ${
              selectedPackage === pkg.id
                ? 'ring-2 ring-blue-600 ring-offset-2'
                : 'hover:ring-2 hover:ring-blue-200'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                Phổ biến
              </div>
            )}
            <div className="text-center">
              <h3 className="font-bold text-lg text-slate-900">{pkg.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{pkg.description}</p>
              <div className="mb-4">
                {pkg.price ? (
                  <span className="text-3xl font-bold text-blue-600">{formatCurrency(pkg.price)}</span>
                ) : (
                  <span className="text-2xl font-bold text-slate-400">Liên hệ</span>
                )}
              </div>
              <ul className="space-y-2 text-sm text-left">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Address and Area */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline-block mr-1" />
            Quận/Huyện
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="input-field"
          >
            <option value="">Chọn quận/huyện</option>
            {HCM_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline-block mr-1" />
            Địa chỉ cụ thể
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường..."
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Home className="w-4 h-4 inline-block mr-1" />
          Diện tích phòng (m²)
        </label>
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Nhập diện tích chính xác"
          className="input-field max-w-xs"
        />
        {selectedPackage && area && (
          <p className="mt-2 text-sm text-slate-500">
            Tổng phí dịch vụ: <span className="font-bold text-blue-600">{formatCurrency(calculatePrice)}</span>
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Chọn thời gian</h2>
        <p className="text-slate-500">Chọn ngày và khung giờ thuận tiện để đội ngũ đến quét phòng</p>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          <Calendar className="w-4 h-4 inline-block mr-1" />
          Ngày hẹn
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {availableDates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex-shrink-0 w-20 p-3 rounded-xl text-center transition-all ${
                selectedDate === d.date
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <p className="text-xs font-medium opacity-75">{d.dayName}</p>
              <p className="text-2xl font-bold">{d.dayNum}</p>
              <p className="text-xs opacity-75">Tháng {d.month}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          <Clock className="w-4 h-4 inline-block mr-1" />
          Khung giờ
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          {timeSlots.map((slot) => {
            const Icon = slot.icon;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-4 rounded-xl transition-all flex items-center gap-4 ${
                  selectedSlot === slot.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedSlot === slot.id ? 'bg-white/20' : 'bg-blue-100'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">{slot.label}</p>
                  <p className="text-sm opacity-75">{slot.time}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Xác nhận & Thanh toán</h2>
        <p className="text-slate-500">Kiểm tra lại thông tin và hoàn tất đặt lịch</p>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Thông tin đặt lịch</h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-slate-500">Gói dịch vụ:</dt>
            <dd className="font-medium text-slate-900">
              {PACKAGES.find(p => p.id === selectedPackage)?.name}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Địa chỉ:</dt>
            <dd className="font-medium text-slate-900">{address}, {district}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Diện tích:</dt>
            <dd className="font-medium text-slate-900">{area}m²</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Ngày hẹn:</dt>
            <dd className="font-medium text-slate-900">
              {availableDates.find(d => d.date === selectedDate)?.dayName},{' '}
              {availableDates.find(d => d.date === selectedDate)?.dayNum}/
              {availableDates.find(d => d.date === selectedDate)?.month}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Khung giờ:</dt>
            <dd className="font-medium text-slate-900">
              {timeSlots.find(s => s.id === selectedSlot)?.label} ({timeSlots.find(s => s.id === selectedSlot)?.time})
            </dd>
          </div>
          <hr className="border-slate-200" />
          <div className="flex justify-between text-lg">
            <dt className="font-semibold text-slate-900">Tổng thanh toán:</dt>
            <dd className="font-bold text-blue-600">{formatCurrency(calculatePrice)}</dd>
          </div>
        </dl>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <User className="w-4 h-4 inline-block mr-1" />
            Họ tên chủ trọ
          </label>
          <input
            type="text"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
            placeholder="Nhập họ tên đầy đủ"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4 inline-block mr-1" />
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0xxx xxx xxx"
            className="input-field"
          />
        </div>
      </div>

      {/* Payment Mock */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-slate-50 border-none">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Thanh toán an toàn</h3>
            <p className="text-sm text-slate-500">Hỗ trợ MoMo, ZaloPay, thẻ ATM/Visa</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {['MoMo', 'ZaloPay', 'Visa', 'ATM'].map((method) => (
            <div
              key={method}
              className="bg-white rounded-lg p-3 text-center cursor-pointer hover:ring-2 hover:ring-blue-600 transition-all"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-slate-100" />
              <p className="text-xs font-medium text-slate-600">{method}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping" />
          <div className="relative w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path className="success-checkmark" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-3">Đặt lịch thành công!</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút để xác nhận lịch hẹn. Cảm ơn bạn đã lựa chọn PhongTro3D!
        </p>

        <div className="card max-w-sm mx-auto p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-slate-900">Mã đặt lịch: #PT{Date.now().toString().slice(-6)}</span>
          </div>
          <p className="text-sm text-slate-500">
            Mã này đã được gửi qua SMS đến số điện thoại {phone}
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentStep(1);
            setSelectedPackage(null);
            setAddress('');
            setDistrict('');
            setArea('');
            setSelectedDate('');
            setSelectedSlot('');
            setLandlordName('');
            setPhone('');
            setIsSuccess(false);
          }}
          className="mt-8 btn-primary"
        >
          Đặt lịch mới
        </button>
      </div>
    </div>
  );

  if (isSuccess) return renderSuccess();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {renderStepIndicator()}

        <div className="card p-6 md:p-8 mb-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            className={`btn-outline flex items-center gap-2 ${currentStep === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary flex items-center gap-2"
              disabled={
                (currentStep === 1 && (!selectedPackage || !address || !district || !area)) ||
                (currentStep === 2 && (!selectedDate || !selectedSlot))
              }
            >
              Tiếp theo
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !landlordName || !phone}
              className="btn-primary flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Hoàn tất
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
