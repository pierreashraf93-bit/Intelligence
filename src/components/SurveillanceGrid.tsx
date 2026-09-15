import React, { useRef, useEffect, useState } from 'react';
import {
  Eye,
  MapPin,
  Shield,
  Layers,
  Crosshair,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Radio,
  Navigation,
} from 'lucide-react';
import { TacticalGridZone, TacticalGridUnit } from '../types';
import { soundEngine } from '../utils/audio';

interface SurveillanceGridProps {
  zones: TacticalGridZone[];
  units: TacticalGridUnit[];
  soundEnabled: boolean;
}

export function SurveillanceGrid({ zones, units, soundEnabled }: SurveillanceGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedZone, setSelectedZone] = useState<TacticalGridZone | null>(zones[0]);
  const [selectedUnit, setSelectedUnit] = useState<TacticalGridUnit | null>(null);
  const [showSweep, setShowSweep] = useState<boolean>(true);
  const [showRadiuses, setShowRadiuses] = useState<boolean>(true);

  // Moving units state
  const [localUnits, setLocalUnits] = useState<TacticalGridUnit[]>(units);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sweepAngle = 0;
    let pulseScale = 0;

    const render = () => {
      // Dynamic canvas sizing
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background
      ctx.fillStyle = '#060c08';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw tactical coordinate grid
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Fictional sector boundaries and street grid lines
      ctx.strokeStyle = 'rgba(46, 74, 53, 0.35)';
      ctx.lineWidth = 1.5;
      // Main axes
      ctx.beginPath();
      ctx.moveTo(width * 0.45, 0);
      ctx.lineTo(width * 0.45, height);
      ctx.moveTo(0, height * 0.55);
      ctx.lineTo(width, height * 0.55);
      ctx.stroke();

      // Curved road / highway representations
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.5, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Monitored Zones
      zones.forEach((zone) => {
        const zx = (zone.x / 100) * width;
        const zy = (zone.y / 100) * height;
        const zr = (zone.radius / 100) * Math.min(width, height);

        // Zone color mapping
        let strokeColor = '#22c55e';
        let fillColor = 'rgba(34, 197, 94, 0.07)';

        if (zone.status === 'HIGH RISK') {
          strokeColor = '#ef4444';
          fillColor = 'rgba(239, 68, 68, 0.12)';
        } else if (zone.status === 'ACTIVE') {
          strokeColor = '#10b981';
          fillColor = 'rgba(16, 185, 129, 0.08)';
        } else if (zone.status === 'UNKNOWN') {
          strokeColor = '#f59e0b';
          fillColor = 'rgba(245, 158, 11, 0.09)';
        } else if (zone.status === 'OFFLINE') {
          strokeColor = '#6b7280';
          fillColor = 'rgba(107, 114, 128, 0.05)';
        }

        // Zone Fill and Border
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = zone.id === selectedZone?.id ? 2.5 : 1.2;

        ctx.beginPath();
        ctx.arc(zx, zy, zr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pulsing rings for high risk / active
        if (showRadiuses && (zone.status === 'HIGH RISK' || zone.status === 'ACTIVE')) {
          const pulseR = zr + Math.sin(pulseScale) * 8 + 6;
          ctx.strokeStyle = zone.status === 'HIGH RISK' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(zx, zy, pulseR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Zone Center Marker & Label
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(zx, zy, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = strokeColor;
        ctx.fillText(`[${zone.code}]`, zx - 18, zy - zr - 6);
      });

      // 4. Moving Tactical Units
      localUnits.forEach((unit) => {
        const ux = (unit.x / 100) * width;
        const uy = (unit.y / 100) * height;

        // Draw unit icon / blip
        ctx.save();
        ctx.translate(ux, uy);

        if (unit.type === 'TARGET') {
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(-5, -5, 10, 10);
          ctx.fill();
          ctx.stroke();
        } else if (unit.type === 'DRONE') {
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#7dd3fc';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -7);
          ctx.lineTo(6, 6);
          ctx.lineTo(0, 3);
          ctx.lineTo(-6, 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = '#22c55e';
          ctx.strokeStyle = '#86efac';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Unit callsign label
        ctx.font = '10px monospace';
        ctx.fillStyle = unit.type === 'TARGET' ? '#fca5a5' : '#86efac';
        ctx.fillText(unit.callsign, 8, 3);

        ctx.restore();
      });

      // 5. Rotating Surveillance Sweep Line
      if (showSweep) {
        const cx = width * 0.5;
        const cy = height * 0.5;
        const radius = Math.max(width, height) * 0.8;

        const endX = cx + radius * Math.cos(sweepAngle);
        const endY = cy + radius * Math.sin(sweepAngle);

        // Gradient sweep trail
        const sweepGradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
        sweepGradient.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
        sweepGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

        ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Trail sector
        ctx.fillStyle = 'rgba(34, 197, 94, 0.04)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, sweepAngle - 0.25, sweepAngle);
        ctx.closePath();
        ctx.fill();
      }

      // 6. HUD Grid Border & Overlay Coordinates
      ctx.strokeStyle = '#1e3825';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);

      // Coordinate tick marks
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
      ctx.fillText('N 33°31\'00"', 10, 18);
      ctx.fillText('E 36°18\'00"', width - 85, 18);
      ctx.fillText('GRID: THEATER-OMEGA-04', 10, height - 12);
      ctx.fillText('STATUS: LIVE MESH', width - 115, height - 12);

      sweepAngle += 0.012;
      pulseScale += 0.05;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [zones, localUnits, showSweep, showRadiuses, selectedZone]);

  // Subtle patrol movement simulation
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setLocalUnits((prev) =>
        prev.map((u) => {
          if (u.speed === 0) return u;
          const rad = (u.heading * Math.PI) / 180;
          const deltaX = Math.cos(rad) * (u.speed * 0.012);
          const deltaY = Math.sin(rad) * (u.speed * 0.012);

          let nextX = u.x + deltaX;
          let nextY = u.y + deltaY;
          let nextHeading = u.heading;

          // Bounce off boundary edges
          if (nextX < 10 || nextX > 90) nextHeading = (180 - nextHeading) % 360;
          if (nextY < 10 || nextY > 90) nextHeading = (360 - nextHeading) % 360;

          return {
            ...u,
            x: Math.max(10, Math.min(90, nextX)),
            y: Math.max(10, Math.min(90, nextY)),
            heading: (nextHeading + 360) % 360,
          };
        })
      );
    }, 100);

    return () => clearInterval(moveInterval);
  }, []);

  // Handle canvas click to select zone
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked near any zone
    const hitZone = zones.find((z) => {
      const dist = Math.hypot(z.x - clickX, z.y - clickY);
      return dist <= z.radius + 3;
    });

    if (hitZone) {
      if (soundEnabled) soundEngine.playTargetLock(true);
      setSelectedZone(hitZone);
      setSelectedUnit(null);
      return;
    }

    // Check if clicked near any unit
    const hitUnit = localUnits.find((u) => {
      const dist = Math.hypot(u.x - clickX, u.y - clickY);
      return dist <= 5;
    });

    if (hitUnit) {
      if (soundEnabled) soundEngine.playTargetLock(true);
      setSelectedUnit(hitUnit);
      return;
    }
  };

  return (
    <section id="grid" className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f3825] pb-3 mb-4 gap-3">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-1.5 rounded bg-[#102214] border border-[#264c2e]">
            <Eye className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-arabic-display font-black text-zinc-100 tracking-wide">
              شبكة المراقبة الجغرافية والتكتيكية
            </h2>
            <p className="text-xs text-zinc-400 font-arabic-display">
              رصد حي لتحركات الأهداف والوحدات الميدانية والقطاعات الأمنية
            </p>
          </div>
        </div>

        {/* Tactical Controls & Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playUiClick(true);
              setShowSweep((prev) => !prev);
            }}
            className={`px-3 py-1 rounded border transition-colors ${
              showSweep
                ? 'bg-[#152e1b] border-emerald-500 text-emerald-300'
                : 'bg-[#09120c] border-[#1b3420] text-zinc-500'
            }`}
          >
            SWEEP: {showSweep ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playUiClick(true);
              setShowRadiuses((prev) => !prev);
            }}
            className={`px-3 py-1 rounded border transition-colors ${
              showRadiuses
                ? 'bg-[#152e1b] border-emerald-500 text-emerald-300'
                : 'bg-[#09120c] border-[#1b3420] text-zinc-500'
            }`}
          >
            ZONES: {showRadiuses ? 'EXPANDED' : 'MINIMAL'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Map Canvas + Telemetry Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side (Col 1-8): Large Interactive Tactical Map Canvas */}
        <div className="lg:col-span-8 tactical-box rounded-sm p-3 bg-[#050b07] border border-[#1b3420] shadow-2xl flex flex-col justify-between">
          {/* Canvas Wrapper */}
          <div className="relative w-full h-[400px] sm:h-[480px] bg-[#060c08] rounded overflow-hidden">
            <canvas
              ref={canvasRef}
              width={900}
              height={550}
              onClick={handleCanvasClick}
              className="w-full h-full object-cover cursor-crosshair"
            />

            {/* Corner Crosshairs */}
            <div className="absolute top-2 left-2 pointer-events-none text-emerald-500/60 font-mono text-[10px]">
              + [GRID ORIGIN: 0.0]
            </div>
            <div className="absolute top-2 right-2 pointer-events-none text-emerald-500/60 font-mono text-[10px]">
              + [SECTOR RAD: 25KM]
            </div>
          </div>

          {/* Map Legend Row matching exact user prompt specifications */}
          <div className="mt-3 pt-2.5 border-t border-[#182f1d] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center space-x-3 rtl:space-x-reverse text-[11px]">
              <span className="text-zinc-500">LEGEND:</span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>MONITORED</span>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse text-teal-300">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>ACTIVE</span>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>UNKNOWN</span>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>HIGH RISK</span>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-zinc-600" />
                <span>OFFLINE</span>
              </span>
            </div>

            <div className="text-[11px] text-zinc-400 font-arabic-display">
              انقر على أي قطاع أو وحدة لعرض بيانات الرصد التفصيلية
            </div>
          </div>
        </div>

        {/* Right Side (Col 9-12): Sector & Unit Telemetry Detail Card */}
        <div className="lg:col-span-4 flex flex-col justify-between tactical-box rounded-sm p-4 sm:p-5 bg-[#0a140d] border border-[#203c26] shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-[#1b3420] pb-3 mb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-arabic-display font-black text-zinc-100">
                  {selectedUnit ? 'بيانات الوحدة الميدانية' : 'تقرير القطاع الأمني'}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#132817] text-emerald-400 border border-[#26502e]">
                {selectedUnit ? selectedUnit.callsign : selectedZone ? selectedZone.code : 'SELECT'}
              </span>
            </div>

            {selectedUnit ? (
              /* Unit Selected View */
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#070e09] border border-[#1b3420]">
                  <div className="text-zinc-500 text-[10px]">CALLSIGN // TYPE</div>
                  <div className="text-sm font-bold text-emerald-300">
                    {selectedUnit.callsign} [{selectedUnit.type}]
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">CURRENT SPEED</span>
                    <span className="text-emerald-400 font-bold">{selectedUnit.speed} KM/H</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">HEADING / BEARING</span>
                    <span className="text-emerald-400 font-bold">{selectedUnit.heading}°</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#070e09] border border-[#1b3420] font-arabic-display text-xs text-zinc-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-1">التقرير العملياتي:</span>
                  {selectedUnit.notesAr}
                </div>

                <button
                  onClick={() => setSelectedUnit(null)}
                  className="w-full py-1.5 rounded border border-[#26502e] bg-[#112315] hover:bg-[#18331e] text-emerald-300 font-arabic-display text-xs transition-colors"
                >
                  العودة للقطاع العام
                </button>
              </div>
            ) : selectedZone ? (
              /* Zone Selected View */
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#070e09] border border-[#1b3420]">
                  <div className="text-zinc-500 text-[10px]">SECTOR NAME & CODE</div>
                  <div className="text-sm font-arabic-display font-bold text-zinc-100">
                    {selectedZone.nameAr}
                  </div>
                  <div className="text-[11px] text-zinc-400">{selectedZone.nameEn}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">STATUS</span>
                    <span className={`font-bold ${selectedZone.status === 'HIGH RISK' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedZone.status}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">SIGNAL STRENGTH</span>
                    <span className="text-emerald-400 font-bold">{selectedZone.signalStrength}%</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">ACTIVE UNITS</span>
                    <span className="text-zinc-200 font-bold">{selectedZone.activeUnitsCount} UNITS</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">LAST TELEMETRY PING</span>
                    <span className="text-zinc-300">{selectedZone.lastPing}</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#070e09] border border-[#1b3420] font-arabic-display text-xs text-zinc-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-1">التقرير الميداني للقطاع:</span>
                  {selectedZone.detailsAr}
                </div>
              </div>
            ) : null}
          </div>

          {/* Quick Zone Selector Buttons */}
          <div className="pt-3 border-t border-[#1b3420] mt-3">
            <span className="text-[10px] font-mono text-zinc-500 block mb-1.5">QUICK SECTOR JUMP:</span>
            <div className="grid grid-cols-5 gap-1 text-[11px] font-mono">
              {zones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => {
                    if (soundEnabled) soundEngine.playUiClick(true);
                    setSelectedZone(z);
                    setSelectedUnit(null);
                  }}
                  className={`py-1 rounded text-center transition-colors ${
                    selectedZone?.id === z.id
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-[#0a160e] text-zinc-400 hover:text-emerald-300 border border-[#1b3420]'
                  }`}
                >
                  {z.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
