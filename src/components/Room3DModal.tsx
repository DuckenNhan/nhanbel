import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, Html, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { X, Ruler, RotateCcw, Info, Maximize2, Bed, Bath, MousePointerClick } from 'lucide-react';
import { RoomListing, formatCurrency, AMENITIES } from '../utils/helpers';

interface Room3DModalProps {
  room: RoomListing;
  onClose: () => void;
}

interface MeasurementMarker {
  id: string;
  position: [number, number, number];
  label: string;
  value: string;
}

/* ─────────────────────────────────────────────────────────────
   Scene Components
   ───────────────────────────────────────────────────────────── */

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.1} />
      </mesh>
      <Grid
        position={[0, 0.01, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#3b82f6"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#60a5fa"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={false}
      />
    </group>
  );
}

function Wall({
  position,
  size,
  rotation = [0, 0, 0],
  color = '#3b82f6',
  opacity = 0.25,
}: {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
      <Edges color="#93c5fd" threshold={15} />
    </mesh>
  );
}

function Doorway({ position, size, rotation = [0, 0, 0] }: { position: [number, number, number]; size: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#334155" side={THREE.DoubleSide} />
      <Edges color="#64748b" threshold={15} />
    </mesh>
  );
}

function Mezzanine({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[4, 0.15, 2.5]} />
      <meshStandardMaterial
        color="#64748b"
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
      <Edges color="#94a3b8" threshold={15} />
    </mesh>
  );
}

function MeasurementPoint({
  position,
  label,
  value,
  onRemove,
}: {
  position: [number, number, number];
  label: string;
  value: string;
  onRemove?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#f59e0b' : '#2563eb'}
          emissive={hovered ? '#f59e0b' : '#1d4ed8'}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-xs font-semibold transform -translate-y-1/2">
          <div className="text-blue-200 text-[10px] leading-tight">{label}</div>
          <div className="text-sm font-bold">{value}</div>
        </div>
      </Html>
    </group>
  );
}

function RoomGeometry({ hasMezzanine }: { hasMezzanine: boolean }) {
  const wallHeight = 3.0;
  const wallThickness = 0.15;
  const roomW = 6;
  const roomD = 8;
  const bathW = 2.5;
  const bathD = 2.0;

  return (
    <group>
      {/* Floor base */}
      <Floor />

      {/* Main room walls */}
      {/* Back wall */}
      <Wall position={[0, wallHeight / 2, -roomD / 2]} size={[roomW, wallHeight, wallThickness]} />
      {/* Front wall (left segment) */}
      <Wall position={[-roomW / 2 + 0.9, wallHeight / 2, roomD / 2]} size={[1.8, wallHeight, wallThickness]} />
      {/* Front wall (right segment) */}
      <Wall position={[roomW / 2 - 1.1, wallHeight / 2, roomD / 2]} size={[2.2, wallHeight, wallThickness]} />
      {/* Left wall */}
      <Wall position={[-roomW / 2, wallHeight / 2, 0]} size={[wallThickness, wallHeight, roomD]} />
      {/* Right wall (main room) */}
      <Wall position={[roomW / 2, wallHeight / 2, -roomD / 2 + bathD / 2]} size={[wallThickness, wallHeight, roomD - bathD]} />

      {/* Bathroom partition walls */}
      {/* Bathroom back wall */}
      <Wall position={[roomW / 2 - bathW / 2, wallHeight / 2, roomD / 2 - bathD]} size={[bathW, wallHeight, wallThickness]} />
      {/* Bathroom right wall */}
      <Wall position={[roomW / 2 - bathW, wallHeight / 2, roomD / 2 - bathD / 2]} size={[wallThickness, wallHeight, bathD]} />

      {/* Door frame / gap */}
      <Doorway position={[0, wallHeight / 2 - 0.5, roomD / 2 + 0.05]} size={[1.0, 2.0, wallThickness]} />

      {/* Window on back wall */}
      <mesh position={[0, wallHeight / 2 + 0.3, -roomD / 2 + 0.05]}>
        <boxGeometry args={[2.5, 1.5, 0.05]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.6} side={THREE.DoubleSide} />
        <Edges color="#2563eb" threshold={15} />
      </mesh>

      {/* Mezzanine */}
      {hasMezzanine && (
        <>
          <Mezzanine position={[-roomW / 4, 2.0, -roomD / 4]} />
          {/* Mezzanine support */}
          <Wall position={[-roomW / 4 + 2, 1.0, -roomD / 4 + 1.25]} size={[0.1, 2.0, 0.1]} color="#475569" opacity={0.6} />
          <Wall position={[-roomW / 4 + 2, 1.0, -roomD / 4 - 1.25]} size={[0.1, 2.0, 0.1]} color="#475569" opacity={0.6} />
        </>
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   Scene wrapper
   ───────────────────────────────────────────────────────────── */

function Scene({
  hasMezzanine,
  isMeasureMode,
  markers,
  onAddMarker,
}: {
  hasMezzanine: boolean;
  isMeasureMode: boolean;
  markers: MeasurementMarker[];
  onAddMarker: (marker: MeasurementMarker) => void;
}) {
  const { camera, gl } = useThree();

  const handlePointerDown = useCallback(
    (event: THREE.Event) => {
      if (!isMeasureMode) return;
      const e = event as unknown as { point: THREE.Vector3; stopPropagation: () => void };
      e.stopPropagation();
      const point = e.point;

      const randomMeasurements = [
        { label: 'Chiều rộng tường', value: `${(2 + Math.random() * 3).toFixed(1)}m` },
        { label: 'Chiều cao', value: `${(2.5 + Math.random() * 2).toFixed(1)}m` },
        { label: 'Khoảng cách', value: `${(1 + Math.random() * 4).toFixed(1)}m` },
        { label: 'Chiều rộng cửa', value: `${(0.8 + Math.random() * 0.6).toFixed(1)}m` },
        { label: 'Diện tích', value: `${(2 + Math.random() * 5).toFixed(1)}m²` },
      ];
      const randomMeasure = randomMeasurements[Math.floor(Math.random() * randomMeasurements.length)];

      onAddMarker({
        id: Math.random().toString(36).slice(2),
        position: [point.x, point.y, point.z],
        label: randomMeasure.label,
        value: randomMeasure.value,
      });
    },
    [isMeasureMode, onAddMarker]
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 8, -5]} intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#3b82f6" />

      <group onPointerDown={handlePointerDown}>
        <RoomGeometry hasMezzanine={hasMezzanine} />
      </group>

      {markers.map((m) => (
        <MeasurementPoint
          key={m.id}
          position={m.position}
          label={m.label}
          value={m.value}
          onRemove={() => onAddMarker(m)} // we re-filter in parent
        />
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={25}
        target={[0, 1.5, 0]}
        enablePan
        panSpeed={0.8}
        rotateSpeed={0.6}
        zoomSpeed={1.0}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Modal
   ───────────────────────────────────────────────────────────── */

const Room3DModal: React.FC<Room3DModalProps> = ({ room, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMeasureMode, setIsMeasureMode] = useState(false);
  const [markers, setMarkers] = useState<MeasurementMarker[]>([]);

  const handleAddMarker = useCallback((marker: MeasurementMarker) => {
    setMarkers((prev) => {
      const exists = prev.find((m) => m.id === marker.id);
      if (exists) {
        return prev.filter((m) => m.id !== marker.id);
      }
      return [...prev, marker];
    });
  }, []);

  const resetView = () => {
    setMarkers([]);
  };

  const getAmenityLabel = (id: string) => {
    const amenity = AMENITIES.find((a) => a.id === id);
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
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-6 p-4 md:p-6">
            {/* Left - Image Gallery & Info */}
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
                      <Bed className="w-5 h-5" />
                      {room.bedrooms}
                      <Bath className="w-5 h-5 ml-2" />
                      {room.bathrooms}
                    </p>
                    <p className="text-sm text-slate-500">PN / WC</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Tiện ích nội thất</h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {getAmenityLabel(amenity)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Mô tả chi tiết</h4>
                <p className="text-slate-600 leading-relaxed">{room.description}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Thông tin chủ phòng</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{room.landlordName}</p>
                    <p className="text-sm text-blue-600">{room.landlordPhone}</p>
                  </div>
                  <button className="btn-primary text-sm py-2 px-4">Gọi ngay</button>
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

                <div className="relative aspect-square">
                  <Canvas
                    shadows
                    camera={{ position: [8, 6, 10], fov: 50, near: 0.1, far: 100 }}
                    gl={{ antialias: true, alpha: false }}
                    style={{ background: '#0f172a' }}
                  >
                    <Scene
                      hasMezzanine={room.hasMezzanine}
                      isMeasureMode={isMeasureMode}
                      markers={markers}
                      onAddMarker={handleAddMarker}
                    />
                  </Canvas>

                  {/* Floating instruction overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-sm text-slate-300 px-4 py-2 rounded-lg text-xs flex items-center gap-2 border border-slate-700/50">
                      <MousePointerClick className="w-3.5 h-3.5 text-blue-400" />
                      Sử dụng chuột/cảm ứng để xoay, thu phóng và xem bố cục kiến trúc.
                    </div>
                  </div>

                  {isMeasureMode && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse flex items-center gap-2 pointer-events-none">
                      <Info className="w-4 h-4" />
                      Click vào tường/sàn để đo
                    </div>
                  )}

                  {markers.length > 0 && (
                    <div className="absolute top-4 right-4 bg-slate-800/90 text-white px-3 py-2 rounded-lg text-xs font-medium pointer-events-none border border-slate-700">
                      {markers.length} điểm đo
                    </div>
                  )}
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
