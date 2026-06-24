import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Ruler, RotateCcw, Maximize2, Info, CheckCircle, Home, Layers } from 'lucide-react';
import { SAMPLE_ROOMS, formatCurrency } from '../utils/helpers';

interface Measurement {
  x: number;
  y: number;
  label: string;
  value: string;
}

const ShowcasePage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(SAMPLE_ROOMS[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMeasureMode, setIsMeasureMode] = useState(false);
  const [rotation, setRotation] = useState({ x: 15, y: -15 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [activeMeasurement, setActiveMeasurement] = useState<Measurement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      { label: 'Chiều rộng', value: `${(2 + Math.random() * 3).toFixed(1)}m` },
      { label: 'Chiều cao', value: `${(2.5 + Math.random() * 2).toFixed(1)}m` },
      { label: 'Diện tích', value: `${(1 + Math.random() * 4).toFixed(1)}m²` },
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

      // Room dimensions (scaled based on rotation)
      const roomWidth = width * 0.5;
      const roomHeight = height * 0.4;
      const roomDepth = width * 0.15;

      const centerX = width / 2;
      const centerY = height * 0.55;

      // Transform based on rotation
      const rotateX = rotation.x * Math.PI / 180;
      const rotateY = rotation.y * Math.PI / 180;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Floor (bottom face)
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
      ctx.fillStyle = selectedRoom.hasMezzanine ? '#e8e4df' : '#faf7f4';
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

      // Draw mezzanine if room has one
      if (selectedRoom.hasMezzanine) {
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

      // Window on back wall
      const windowW = roomWidth * 0.25;
      const windowH = roomHeight * 0.25;
      ctx.beginPath();
      ctx.rect(-windowW/2, -roomHeight/2 + 30, windowW, windowH);
      ctx.fillStyle = '#bfdbfe';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Door on left wall
      const doorW = roomWidth * 0.15;
      const doorH = roomHeight * 0.4;
      ctx.save();
      ctx.transform(1, 0.2 * Math.sin(rotateX), 0, 1, 0, 0);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-roomWidth/2 + 20, -doorH/2 + roomHeight/4, doorW, doorH);
      ctx.restore();

      // Bed/furniture representation
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      const bedW = roomWidth * 0.3;
      const bedH = roomHeight * 0.2;
      ctx.fillRect(-roomWidth/4 - bedW/2, roomHeight/6 - bedH/2, bedW, bedH);
      ctx.strokeRect(-roomWidth/4 - bedW/2, roomHeight/6 - bedH/2, bedW, bedH);

      ctx.restore();

      // Draw measurement points with blue accent
      selectedRoom.measurements.forEach((m, idx) => {
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

      // Draw active measurement tooltip
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
  }, [rotation, selectedRoom, activeMeasurement, isMeasureMode]);

  const resetView = () => {
    setRotation({ x: 15, y: -15 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Khám phá 3D</h1>
          <p className="text-slate-600">Trải nghiệm xem phòng từ mọi góc độ với công nghệ 3D tương tác</p>
        </div>

        {/* Room selector */}
        <div className="mb-6 flex flex-wrap gap-3">
          {SAMPLE_ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoom(room);
                setSelectedImageIndex(0);
                resetView();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedRoom.id === room.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{room.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left - Image Gallery */}
          <div className="space-y-4">
            <div className="card overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={selectedRoom.images[selectedImageIndex]}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-slate-900">
                  Ảnh thực tế
                </div>
              </div>
            </div>

            {/* Thumbnail gallery */}
            <div className="flex gap-3">
              {selectedRoom.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-1 aspect-video rounded-xl overflow-hidden ${
                    selectedImageIndex === idx
                      ? 'ring-2 ring-blue-600 ring-offset-2'
                      : 'opacity-70 hover:opacity-100'
                  } transition-all`}
                >
                  <img src={img} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Room info */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedRoom.name}</h2>
              <p className="text-slate-500 mb-4">{selectedRoom.address}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Diện tích</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedRoom.area}m²</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Giá thuê</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedRoom.price)}/tháng</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {selectedRoom.hasMezzanine && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    <Layers className="w-4 h-4" />
                    Có gác lửng
                  </span>
                )}
                <span className="badge-success">
                  <CheckCircle className="w-4 h-4" />
                  Đã xác thực
                </span>
              </div>
            </div>
          </div>

          {/* Right - 3D Viewer */}
          <div className="space-y-4">
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-blue-600" />
                  Mô hình 3D
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMeasureMode(!isMeasureMode)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                      isMeasureMode
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Ruler className="w-4 h-4" />
                    <span className="hidden sm:inline">Thước đo</span>
                  </button>
                  <button
                    onClick={resetView}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Reset góc nhìn"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                ref={containerRef}
                className="relative aspect-square bg-slate-100 cursor-grab active:cursor-grabbing"
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
                  width={600}
                  height={600}
                  className="w-full h-full"
                  onClick={handleCanvasClick}
                />

                {isMeasureMode && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse-soft">
                    <Info className="w-4 h-4 inline mr-2" />
                    Click vào phòng để đo
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-slate-500">
                  {isMeasureMode
                    ? 'Chế độ đo: Click vào các vị trí để xem kích thước'
                    : 'Kéo thả để xoay phòng 360°'}
                </div>
              </div>

              {/* Measurement list */}
              <div className="p-4 bg-slate-50">
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  Kích thước chi tiết
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRoom.measurements.map((m, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-slate-100">
                      <p className="text-xs text-slate-500">{m.label}</p>
                      <p className="font-semibold text-slate-900">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help card */}
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-slate-50 border-none">
              <h3 className="font-semibold text-slate-900 mb-3">Hướng dẫn tương tác</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">1</span>
                  Kéo thả chuột (hoặc ngón tay) để xoay phòng 360°
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">2</span>
                  Bật "Thước đo" để xem kích thước chi tiết
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">3</span>
                  Click vào các điểm trên phòng để đo từ vị trí bất kỳ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage;
