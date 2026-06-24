import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Ruler, RotateCcw, Info, Maximize2, Bed, Bath } from 'lucide-react';
import { RoomListing, formatCurrency, AMENITIES } from '../utils/helpers';

interface Room3DModalProps {
  room: RoomListing;
  onClose: () => void;
}

interface Measurement {
  x: number;
  y: number;
  label: string;
  value: string;
}

const Room3DModal: React.FC<Room3DModalProps> = ({ room, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMeasureMode, setIsMeasureMode] = useState(false);
  const [rotation, setRotation] = useState({ x: 15, y: -15 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [activeMeasurement, setActiveMeasurement] = useState<Measurement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMeasureMode) return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isMeasureMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || isMeasureMode) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isDragging, isMeasureMode, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isMeasureMode) return;
    setIsDragging(true);
    setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, [isMeasureMode]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isMeasureMode) return;

    const deltaX = e.touches[0].clientX - lastMousePos.x;
    const deltaY = e.touches[0].clientY - lastMousePos.y;

    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, [isDragging, isMeasureMode, lastMousePos]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMeasureMode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const randomMeasurements = [
      { label: 'Chiều rộng tường', value: `${(2 + Math.random() * 3).toFixed(1)}m` },
      { label: 'Chiều cao', value: `${(2.5 + Math.random() * 2).toFixed(1)}m` },
      { label: 'Khoảng cách', value: `${(1 + Math.random() * 4).toFixed(1)}m` },
      { label: 'Chiều rộng cửa', value: `${(0.8 + Math.random() * 0.6).toFixed(1)}m` },
      { label: 'Diện tích', value: `${(2 + Math.random() * 5).toFixed(1)}m²` },
    ];

    const randomMeasure = randomMeasurements[Math.floor(Math.random() * randomMeasurements.length)];

    const newMeasurement: Measurement = {
      x,
      y,
      label: randomMeasure.label,
      value: randomMeasure.value
    };

    setActiveMeasurement(newMeasurement);

    setTimeout(() => {
      setActiveMeasurement(null);
    }, 3000);
  }, [isMeasureMode]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRoom = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#f8fafc');
      bgGradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const roomWidth = width * 0.5;
      const roomHeight = height * 0.4;
      const roomDepth = width * 0.15;

      const centerX = width / 2;
      const centerY = height * 0.55;

      const rotateX = rotation.x * Math.PI / 180;
      const rotateY = rotation.y * Math.PI / 180;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Floor
      ctx.beginPath();
      ctx.moveTo(-roomWidth/2 + Math.sin(rotateY) * roomDepth, roomHeight/2 - Math.sin(rotateX) * roomDepth);
      ctx.lineTo(roomWidth/2 + Math.sin(rotateY) * roomDepth, roomHeight/2 + Math.sin(rotateX) * roomDepth);
      ctx.lineTo(roomWidth/2 - Math.sin(rotateY) * roomDepth, -roomHeight/2 - Math.sin(rotateX) * roomDepth);
      ctx.lineTo(-roomWidth/2 - Math.sin(rotateY) * roomDepth, -roomHeight/2 + Math.sin(rotateX) * roomDepth);
      ctx.closePath();

      const floorGradient = ctx.createLinearGradient(0, -roomHeight/2, 0, roomHeight/2);
      floorGradient.addColorStop(0, '#d4c4b1');
      floorGradient.addColorStop(1, '#c9b896');
      ctx.fillStyle = floorGradient;
      ctx.fill();
      ctx.strokeStyle = '#a89878';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Back wall
      ctx.beginPath();
      ctx.moveTo(-roomWidth/2, -roomHeight/2);
      ctx.lineTo(-roomWidth/2 + Math.sin(rotateY) * roomDepth, roomHeight/2 - Math.sin(rotateX) * roomDepth);

      const wallGradient = ctx.createLinearGradient(-roomWidth/2, 0, roomWidth/2, 0);
      wallGradient.addColorStop(0, '#f5f0eb');
      wallGradient.addColorStop(0.5, '#ffffff');
      wallGradient.addColorStop(1, '#f5f0eb');
      ctx.fillStyle = wallGradient;
      ctx.fill();
      ctx.stroke();

      // Left wall
      ctx.beginPath();
      ctx.moveTo(-roomWidth/2 - Math.sin(rotateY) * roomDepth, -roomHeight/2 + Math.sin(rotateX) * roomDepth);
      ctx.lineTo(-roomWidth/2, -roomHeight/2);
      ctx.lineTo(-roomWidth/2 + Math.sin(rotateY) * roomDepth, roomHeight/2 - Math.sin(rotateX) * roomDepth);
      ctx.lineTo(-roomWidth/2 - Math.sin(rotateY) * roomDepth, roomHeight/2 + Math.sin(rotateX) * roomDepth);
      ctx.closePath();
      ctx.fillStyle = room.hasMezzanine ? '#e8e4df' : '#faf7f4';
      ctx.fill();
      ctx.stroke();

      // Right wall
      ctx.beginPath();
      ctx.moveTo(roomWidth/2 + Math.sin(rotateY) * roomDepth, roomHeight/2 + Math.sin(rotateX) * roomDepth);
      ctx.lineTo(roomWidth/2, roomHeight/2);
      ctx.lineTo(roomWidth/2 - Math.sin(rotateY) * roomDepth, -roomHeight/2 - Math.sin(rotateX) * roomDepth);
      ctx.lineTo(roomWidth/2 + Math.sin(rotateY) * roomDepth, -roomHeight/2 + Math.sin(rotateX) * roomDepth);
      ctx.closePath();
      ctx.fillStyle = '#faf7f4';
      ctx.fill();
      ctx.stroke();

      // Mezzanine
      if (room.hasMezzanine) {
        const mezHeight = roomHeight * 0.35;
        ctx.beginPath();
        ctx.moveTo(-roomWidth/3, -roomHeight/4 + mezHeight);
        ctx.lineTo(roomWidth/4, -roomHeight/4 + mezHeight);
        ctx.lineTo(roomWidth/4 + Math.sin(rotateY) * roomDepth/2, -roomHeight/4);
        ctx.lineTo(-roomWidth/3 + Math.sin(rotateY) * roomDepth/2, -roomHeight/4);
        ctx.closePath();
        ctx.fillStyle = '#d4cab8';
        ctx.fill();
        ctx.strokeStyle = '#b8a898';
        ctx.stroke();
      }

      // Window
      const windowW = roomWidth * 0.25;
      const windowH = roomHeight * 0.25;
      ctx.beginPath();
      ctx.rect(-windowW/2, -roomHeight/2 + 30, windowW, windowH);
      ctx.fillStyle = '#bfdbfe';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Door
      const doorW = roomWidth * 0.15;
      const doorH = roomHeight * 0.4;
      ctx.save();
      ctx.transform(1, 0.2 * Math.sin(rotateX), 0, 1, 0, 0);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-roomWidth/2 + 20, -doorH/2 + roomHeight/4, doorW, doorH);
      ctx.restore();

      // Bed
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      const bedW = roomWidth * 0.3;
      const bedH = roomHeight * 0.2;
      ctx.fillRect(-roomWidth/4 - bedW/2, roomHeight/6 - bedH/2, bedW, bedH);
      ctx.strokeRect(-roomWidth/4 - bedW/2, roomHeight/6 - bedH/2, bedW, bedH);

      ctx.restore();

      // Measurement points
      room.measurements.forEach((m) => {
        ctx.beginPath();
        ctx.arc(
          centerX + (m.x / 100 - 0.5) * roomWidth * 1.5,
          centerY + (m.y / 100 - 0.5) * roomHeight * 1.5,
          8,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#2563eb';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Active measurement tooltip
      if (activeMeasurement && isMeasureMode) {
        const tooltipX = (activeMeasurement.x / 100) * width;
        const tooltipY = (activeMeasurement.y / 100) * height;
        const tooltipWidth = 140;
        const tooltipHeight = 50;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.roundRect(tooltipX - tooltipWidth/2, tooltipY - tooltipHeight - 10, tooltipWidth, tooltipHeight, 8);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(activeMeasurement.label, tooltipX, tooltipY - tooltipHeight + 20);
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(activeMeasurement.value, tooltipX, tooltipY - tooltipHeight + 40);
        ctx.restore();
      }
    };

    drawRoom();
  }, [rotation, room, activeMeasurement, isMeasureMode]);

  const resetView = () => {
    setRotation({ x: 15, y: -15 });
  };

  const getAmenityLabel = (id: string) => {
    const amenity = AMENITIES.find(a => a.id === id);
    return amenity?.label || id;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-6xl w-full shadow-2xl animate-scale-in max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">{room.name}</h3>
            <p className="text-slate-500 mt-1">{room.address}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-6 p-4 md:p-6">
            {/* Left - Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={room.images[selectedImageIndex]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  Ảnh thực tế #{selectedImageIndex + 1}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-1 aspect-video rounded-lg overflow-hidden ${
                      selectedImageIndex === idx ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
                    } transition-all`}
                  >
                    <img src={img} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Room Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(room.price)}</p>
                    <p className="text-sm text-slate-500">/tháng</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{room.area}m²</p>
                    <p className="text-sm text-slate-500">Diện tích</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-xl font-bold text-slate-900">
                      <Bed className="w-5 h-5" />{room.bedrooms}
                      <Bath className="w-5 h-5 ml-2" />{room.bathrooms}
                    </p>
                    <p className="text-sm text-slate-500">PN / WC</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Tiện ích nội thất</h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {getAmenityLabel(amenity)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Mô tả chi tiết</h4>
                <p className="text-slate-600 leading-relaxed">{room.description}</p>
              </div>

              {/* Landlord Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Thông tin chủ phòng</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{room.landlordName}</p>
                    <p className="text-sm text-blue-600">{room.landlordPhone}</p>
                  </div>
                  <button className="btn-primary text-sm py-2 px-4">
                    Gọi ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Right - 3D Viewer */}
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-700">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Maximize2 className="w-5 h-5 text-blue-400" />
                    Bố cục 3D
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMeasureMode(!isMeasureMode)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        isMeasureMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <Ruler className="w-4 h-4" />
                      Thước đo
                    </button>
                    <button
                      onClick={resetView}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="relative aspect-square cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                >
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    className="w-full h-full"
                    onClick={handleCanvasClick}
                  />

                  {isMeasureMode && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse-soft">
                      <Info className="w-4 h-4 inline mr-2" />
                      Click vào phòng để đo
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-slate-400">
                    {isMeasureMode
                      ? 'Chế độ đo: Click vào các vị trí để xem kích thước'
                      : 'Kéo thả để xoay phòng 360°'}
                  </div>
                </div>
              </div>

              {/* Measurements List */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  Kích thước chi tiết
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {room.measurements.map((m, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-slate-100">
                      <p className="text-xs text-slate-500">{m.label}</p>
                      <p className="font-semibold text-slate-900">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room3DModal;
