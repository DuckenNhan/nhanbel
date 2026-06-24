export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

export const generateShortLink = (id: string): string => {
  return `https://phongtro3d.com/r/${id}`;
};

export const generateEmbedCode = (roomId: string): string => {
  return `<iframe src="https://phongtro3d.com/embed/${roomId}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
};

export const HCM_DISTRICTS = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
  'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Thủ Đức', 'Gò Vấp',
  'Bình Thạnh', 'Tân Bình', 'Tân Phú', 'Phú Nhuận', 'Bình Tân',
  'Củ Chi', 'Hóc Môn', 'Bình Chánh', 'Nhà Bè', 'Cần Giờ'
];

export const TIME_SLOTS = [
  { id: 'morning', label: 'Sáng', time: '08:00 - 11:30', icon: 'sunrise' },
  { id: 'afternoon', label: 'Chiều', time: '13:00 - 17:00', icon: 'sun' },
  { id: 'evening', label: 'Tối', time: '18:00 - 21:00', icon: 'moon' }
];

export const AMENITIES = [
  { id: 'ac', label: 'Máy lạnh', icon: 'ac' },
  { id: 'fridge', label: 'Tủ lạnh', icon: 'fridge' },
  { id: 'bed', label: 'Giường đệm', icon: 'bed' },
  { id: 'washer', label: 'Máy giặt', icon: 'washer' },
  { id: 'balcony', label: 'Ban công', icon: 'balcony' },
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'parking', label: 'Chỗ để xe', icon: 'parking' },
  { id: 'security', label: 'Bảo vệ', icon: 'security' },
  { id: 'kitchen', label: 'Bếp riêng', icon: 'kitchen' },
  { id: 'water-heater', label: 'Nóng lạnh', icon: 'water-heater' },
];

export interface RoomListing {
  id: string;
  name: string;
  address: string;
  district: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  landlordName: string;
  landlordPhone: string;
  description: string;
  measurements: { x: number; y: number; label: string; value: string }[];
  hasMezzanine: boolean;
  available: boolean;
  createdAt: string;
  views: number;
}

// Renter-specific room listings for discovery catalog
export const ROOM_LISTINGS: RoomListing[] = [
  {
    id: 'room-listing-1',
    name: 'Phòng Studio Cao Cấp Quận Bình Thạnh',
    address: '123 Đường Nguyễn Xí, Phường 26',
    district: 'Bình Thạnh',
    price: 4500000,
    area: 25,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['ac', 'fridge', 'bed', 'wifi', 'parking', 'water-heater'],
    images: [
      'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2767243/pexels-photo-2767243.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    landlordName: 'Anh Tuấn',
    landlordPhone: '0901 234 567',
    description: 'Phòng studio mới xây, thoáng mát, gần chợ và trường học. Điện nước giá dân, không chung chủ.',
    measurements: [
      { x: 20, y: 30, label: 'Chiều rộng phòng', value: '3.5m' },
      { x: 50, y: 15, label: 'Chiều dài phòng', value: '7.1m' },
      { x: 80, y: 45, label: 'Chiều cao trần', value: '3.2m' },
      { x: 35, y: 70, label: 'Diện tích WC', value: '3m²' }
    ],
    hasMezzanine: false,
    available: true,
    createdAt: '2024-01-15',
    views: 234
  },
  {
    id: 'room-listing-2',
    name: 'Căn hộ Mini Gác Lửng Quận 7',
    address: '456 Đường Nguyễn Lương Bằng, Phường Tân Phong',
    district: 'Quận 7',
    price: 5500000,
    area: 38,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['ac', 'fridge', 'bed', 'washer', 'balcony', 'wifi', 'parking', 'security', 'water-heater'],
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2259917/pexels-photo-2259917.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    landlordName: 'Chị Lan',
    landlordPhone: '0912 345 678',
    description: 'Phòng có gác lửng rộng, nội thất đầy đủ, view sông thoáng mát. Khu an ninh 24/7.',
    measurements: [
      { x: 25, y: 25, label: 'Chiều rộng phòng', value: '4.2m' },
      { x: 55, y: 20, label: 'Chiều dài phòng', value: '9.0m' },
      { x: 85, y: 50, label: 'Chiều cao trần', value: '4.5m' },
      { x: 30, y: 65, label: 'Chiều rộng gác lửng', value: '2.5m' },
      { x: 60, y: 75, label: 'Chiều cao gác', value: '1.8m' }
    ],
    hasMezzanine: true,
    available: true,
    createdAt: '2024-01-20',
    views: 189
  },
  {
    id: 'room-listing-3',
    name: 'Phòng Trọ Gác Lửng Thủ Đức',
    address: '789 Đường Lê Văn Việt, Phường Hiệp Phú',
    district: 'Thủ Đức',
    price: 3800000,
    area: 28,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['ac', 'bed', 'wifi', 'parking', 'security'],
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2087385/pexels-photo-2087385.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2796554/pexels-photo-2796554.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    landlordName: 'Anh Hùng',
    landlordPhone: '0903 456 789',
    description: 'Gần trường ĐH, KTX. Phù hợp sinh viên. Điện 3500/kwh, nước 100k/người.',
    measurements: [
      { x: 22, y: 28, label: 'Chiều rộng phòng', value: '3.2m' },
      { x: 58, y: 18, label: 'Chiều dài phòng', value: '8.7m' },
      { x: 78, y: 55, label: 'Chiều cao trần', value: '4.0m' },
      { x: 40, y: 70, label: 'Chiều rộng gác', value: '2.2m' }
    ],
    hasMezzanine: true,
    available: true,
    createdAt: '2024-01-25',
    views: 156
  },
  {
    id: 'room-listing-4',
    name: 'Studio Full Nội Thất Quận 3',
    address: '234 Đường Võ Văn Tần, Phường 5',
    district: 'Quận 3',
    price: 5200000,
    area: 30,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['ac', 'fridge', 'bed', 'washer', 'wifi', 'parking', 'kitchen', 'water-heater', 'security'],
    images: [
      'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2767243/pexels-photo-2767243.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    landlordName: 'Chị Mai',
    landlordPhone: '0904 567 890',
    description: 'Nội thất full như khách sạn, giường, tủ quần áo, bàn trang điểm, TV 43 inch. Vào ở ngay.',
    measurements: [
      { x: 20, y: 30, label: 'Chiều rộng phòng', value: '4.0m' },
      { x: 50, y: 15, label: 'Chiều dài phòng', value: '7.5m' },
      { x: 80, y: 45, label: 'Chiều cao trần', value: '3.0m' },
      { x: 35, y: 70, label: 'Diện tích WC', value: '4m²' }
    ],
    hasMezzanine: false,
    available: true,
    createdAt: '2024-01-28',
    views: 312
  },
  {
    id: 'room-listing-5',
    name: 'Phòng Chung Cư Mini Tân Phú',
    address: '567 Đường Tân Ký Tân Quý, Phường Tân Thành',
    district: 'Tân Phú',
    price: 4200000,
    area: 32,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['ac', 'fridge', 'bed', 'balcony', 'wifi', 'parking', 'security', 'water-heater'],
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2259917/pexels-photo-2259917.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    landlordName: 'Anh Đức',
    landlordPhone: '0905 678 901',
    description: 'Tầng cao view thoáng, có ban công phơi đồ. Gần Metro, khu dân cư yên tĩnh.',
    measurements: [
      { x: 25, y: 25, label: 'Chiều rộng phòng', value: '4.5m' },
      { x: 55, y: 20, label: 'Chiều dài phòng', value: '7.1m' },
      { x: 85, y: 50, label: 'Chiều cao trần', value: '3.1m' },
      { x: 30, y: 65, label: 'Chiều rộng ban công', value: '1.2m' }
    ],
    hasMezzanine: false,
    available: true,
    createdAt: '2024-02-01',
    views: 98
  },
  {
    id: 'room-listing-6',
    name: 'Căn Hộ 1PN Quận 4',
    address: '890 Đường Khánh Hội, Phường 6',
    district: 'Quận 4',
    price: 6500000,
    area: 45,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['ac', 'fridge', 'bed', 'washer', 'balcony', 'wifi', 'parking', 'kitchen', 'water-heater', 'security'],
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2087385/pexels-photo-2087385.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2796554/pexels-photo-2796554.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    landlordName: 'Chị Ngọc',
    landlordPhone: '0906 789 012',
    description: 'Chính chủ cho thuê căn hộ 1PN, đầy đủ nội thất. Gần Aeon Mall, Maximark.',
    measurements: [
      { x: 22, y: 28, label: 'Chiều rộng phòng', value: '5.0m' },
      { x: 58, y: 18, label: 'Chiều dài phòng', value: '9.0m' },
      { x: 78, y: 55, label: 'Chiều cao trần', value: '3.2m' },
      { x: 40, y: 70, label: 'Diện tích bếp', value: '6m²' }
    ],
    hasMezzanine: false,
    available: false,
    createdAt: '2024-01-10',
    views: 445
  }
];

export const PACKAGES = [
  {
    id: 'studio',
    name: 'Gói 3D Studio',
    price: 500000,
    description: 'Cho phòng đơn < 25m²',
    features: ['Quét 3D toàn bộ phòng', '10 ảnh HDR chất lượng cao', 'Mô hình 3D tương tác web', 'Link chia sẻ vĩnh viễn', 'Mã nhúng website'],
    maxArea: 25
  },
  {
    id: 'duplex',
    name: 'Gói 3D Duplex',
    price: 800000,
    description: 'Cho phòng có gác lửng < 40m²',
    features: ['Quét 3D nhiều tầng', '15 ảnh HDR chất lượng cao', 'Mô hình 3D tương tác web', 'Link chia sẻ vĩnh viễn', 'Mã nhúng website', 'Đo đạc chi tiết gác lửng'],
    maxArea: 40,
    popular: true
  },
  {
    id: 'combo',
    name: 'Gói Combo Tòa Nhà',
    price: null,
    description: 'Cho cả chung cư mini',
    features: ['Quét 3D toàn bộ tòa nhà', 'Ảnh HDR không giới hạn', 'Mô hình 3D tổng thể', 'Dashboard quản lý riêng', 'API tích hợp', 'Hỗ trợ kỹ thuật 24/7'],
    maxArea: null
  }
];

// Sample rooms for 3D showcase (landlord view - for measurements reference)
export const SAMPLE_ROOMS = [
  {
    id: 'room-1',
    name: 'Phòng Studio Quận Bình Thạnh',
    address: 'Đường Nguyễn Xí, Phường 26, Quận Bình Thạnh',
    area: 22,
    price: 3500000,
    hasMezzanine: false,
    images: [
      'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2767243/pexels-photo-2767243.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    measurements: [
      { x: 20, y: 30, label: 'Chiều rộng phòng', value: '3.5m' },
      { x: 50, y: 15, label: 'Chiều dài phòng', value: '6.3m' },
      { x: 80, y: 45, label: 'Chiều cao trần', value: '3.2m' },
      { x: 35, y: 70, label: 'Diện tích WC', value: '2.8m²' }
    ]
  },
  {
    id: 'room-2',
    name: 'Căn hộ Mini Quận 7',
    address: 'Đường Nguyễn Lương Bằng, Phường Tân Phong, Quận 7',
    area: 35,
    price: 5500000,
    hasMezzanine: true,
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2259917/pexels-photo-2259917.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    measurements: [
      { x: 25, y: 25, label: 'Chiều rộng phòng', value: '4.2m' },
      { x: 55, y: 20, label: 'Chiều dài phòng', value: '8.3m' },
      { x: 85, y: 50, label: 'Chiều cao trần', value: '4.5m' },
      { x: 30, y: 65, label: 'Chiều rộng gác lửng', value: '2.5m' },
      { x: 60, y: 75, label: 'Chiều cao gác', value: '1.8m' }
    ]
  },
  {
    id: 'room-3',
    name: 'Phòng trọ gác lửng Thủ Đức',
    address: 'Đường Lê Văn Việt, Phường Hiệp Phú, TP. Thủ Đức',
    area: 28,
    price: 4200000,
    hasMezzanine: true,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2087385/pexels-photo-2087385.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2796554/pexels-photo-2796554.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    measurements: [
      { x: 22, y: 28, label: 'Chiều rộng phòng', value: '3.2m' },
      { x: 58, y: 18, label: 'Chiều dài phòng', value: '8.7m' },
      { x: 78, y: 55, label: 'Chiều cao trần', value: '4.0m' },
      { x: 40, y: 70, label: 'Chiều rộng gác', value: '2.2m' }
    ]
  }
];
