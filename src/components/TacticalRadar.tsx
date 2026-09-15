import React, { useRef, useEffect, useState } from 'react';
import {
  Radar as RadarIcon,
  Crosshair,
  Radio,
  AlertOctagon,
  ShieldCheck,
  Disc,
  Activity,
  Layers,
} from 'lucide-react';
import { RadarTarget } from '../types';
import { soundEngine } from '../utils/audio';

interface TacticalRadarProps {
  targets: RadarTarget[];
  soundEnabled: boolean;
}

export function TacticalRadar({ targets, soundEnabled }: TacticalRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget | null>(targets[0]);
  const [rangeKm, setRangeKm] = useState<number>(50);
  const [pingOnSweep, setPingOnSweep] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepRad = 0;
    const size = canvas.width;
    const center = size / 2;
    const maxRadius = center - 24;

    const render = () => {
      // Background
      ctx.fillStyle = '#060b08';
      ctx.fillRect(0, 0, size, size);

      // Range rings
      const rings = [0.25, 0.5, 0.75, 1.0];
      ctx.lineWidth = 1;

      rings.forEach((ratio, idx) => {
        const r = maxRadius * ratio;
        ctx.strokeStyle = idx === 3 ? 'rgba(34, 197, 94, 0.45)' : 'rgba(34, 197, 94, 0.18)';
        ctx.beginPath();
        ctx.arc(center, center, r, 0, Math.PI * 2);
        ctx.stroke();

        // Distance text
        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
        ctx.fillText(`${Math.round(rangeKm * ratio)}km`, center + 4, center - r + 11);
      });

      // Cardinal axes & diagonal crosshairs
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.22)';
      ctx.beginPath();
      ctx.moveTo(center, 20);
      ctx.lineTo(center, size - 20);
      ctx.moveTo(20, center);
      ctx.lineTo(size - 20, center);
      ctx.stroke();

      // Degree labels
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.fillText('000° [N]', center - 18, 16);
      ctx.fillText('090° [E]', size - 46, center + 4);
      ctx.fillText('180° [S]', center - 18, size - 8);
      ctx.fillText('270° [W]', 4, center + 4);

      // Rotating radar sweep & phosphor trail
      const sweepEndX = center + maxRadius * Math.cos(sweepRad);
      const sweepEndY = center + maxRadius * Math.sin(sweepRad);

      const trailAngle = 0.35;
      const trailGrad = ctx.createRadialGradient(center, center, 10, center, center, maxRadius);
      trailGrad.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
      trailGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');

      // Phosphor trail wedge
      ctx.fillStyle = trailGrad;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, maxRadius, sweepRad - trailAngle, sweepRad);
      ctx.closePath();
      ctx.fill();

      // Sharp sweep line
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(sweepEndX, sweepEndY);
      ctx.stroke();

      // Targets plotting
      targets.forEach((tgt) => {
        const rad = (tgt.angleDeg * Math.PI) / 180;
        const distRatio = tgt.distanceKm / rangeKm;
        const tx = center + maxRadius * distRatio * Math.cos(rad);
        const ty = center + maxRadius * distRatio * Math.sin(rad);

        // Check if current sweep line is touching target
        const angleDiff = Math.abs((sweepRad % (Math.PI * 2)) - (rad % (Math.PI * 2)));
        const isSwept = angleDiff < 0.08;

        if (isSwept && pingOnSweep && soundEnabled && Math.random() > 0.7) {
          soundEngine.playRadarPing(true);
        }

        const isSelected = tgt.id === selectedTarget?.id;

        // Target blip styling
        let blipColor = '#22c55e';
        if (tgt.threatLevel === 'CRITICAL') blipColor = '#ef4444';
        else if (tgt.threatLevel === 'HIGH') blipColor = '#f59e0b';
        else if (tgt.threatLevel === 'ELEVATED') blipColor = '#eab308';

        ctx.fillStyle = blipColor;
        ctx.beginPath();
        ctx.arc(tx, ty, isSwept ? 5 : isSelected ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Selection ring
        if (isSelected) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(tx - 7, ty - 7, 14, 14);
        }

        // Target label
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = isSelected ? '#38bdf8' : blipColor;
        ctx.fillText(tgt.callsign, tx + 8, ty - 2);
      });

      sweepRad += 0.015;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [targets, selectedTarget, rangeKm, pingOnSweep, soundEnabled]);

  // Click canvas to select target
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const size = canvas.width;
    const scale = size / rect.width;
    const scaledX = clickX * scale;
    const scaledY = clickY * scale;

    const center = size / 2;
    const maxRadius = center - 24;

    const hit = targets.find((tgt) => {
      const rad = (tgt.angleDeg * Math.PI) / 180;
      const distRatio = tgt.distanceKm / rangeKm;
      const tx = center + maxRadius * distRatio * Math.cos(rad);
      const ty = center + maxRadius * distRatio * Math.sin(rad);
      return Math.hypot(tx - scaledX, ty - scaledY) < 18;
    });

    if (hit) {
      if (soundEnabled) soundEngine.playTargetLock(true);
      setSelectedTarget(hit);
    }
  };

  return (
    <section id="radar" className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f3825] pb-3 mb-4 gap-3">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-1.5 rounded bg-[#102214] border border-[#264c2e]">
            <RadarIcon className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-arabic-display font-black text-zinc-100 tracking-wide">
              منظومة الرادار التكتيكي ثلاثي الأبعاد
            </h2>
            <p className="text-xs text-zinc-400 font-arabic-display">
              رصد تتبع المجالات الجوية والسطحية بالنطاق X-BAND والتعرف على بصمات الأهداف
            </p>
          </div>
        </div>

        {/* Range and Audio Ping Controls */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono">
          <div className="flex items-center bg-[#0d1c11] border border-[#23452a] p-1 rounded">
            {[25, 50, 100].map((rng) => (
              <button
                key={rng}
                onClick={() => {
                  if (soundEnabled) soundEngine.playUiClick(true);
                  setRangeKm(rng);
                }}
                className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${
                  rangeKm === rng ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-emerald-300'
                }`}
              >
                {rng}KM
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playRadarPing(true);
              setPingOnSweep((prev) => !prev);
            }}
            className={`px-3 py-1 rounded border transition-colors ${
              pingOnSweep
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                : 'bg-[#09120c] border-[#1b3420] text-zinc-500'
            }`}
          >
            SONAR PING: {pingOnSweep ? 'ENABLED' : 'MUTED'}
          </button>
        </div>
      </div>

      {/* Grid: Canvas Radar + Target Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Radar Canvas (Col 1-7) */}
        <div className="lg:col-span-7 tactical-box rounded-sm p-4 bg-[#050b07] border border-[#1b3420] shadow-2xl flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[480px] aspect-square">
            <canvas
              ref={canvasRef}
              width={560}
              height={560}
              onClick={handleCanvasClick}
              className="w-full h-full rounded-full border-2 border-[#1e3825] shadow-[0_0_30px_rgba(34,197,94,0.15)] cursor-crosshair"
            />
          </div>

          {/* Technical Readout Footer under radar */}
          <div className="w-full mt-3 pt-2.5 border-t border-[#182f1d] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
            <span>FREQ: 9.42 GHz X-BAND</span>
            <span>PRF: 1250 Hz</span>
            <span>BEAMWIDTH: 1.4°</span>
            <span className="text-emerald-400 font-bold">RADAR MODE: TWS (TRACK WHILE SCAN)</span>
          </div>
        </div>

        {/* Target Dossier / Telemetry Card (Col 8-12) */}
        <div className="lg:col-span-5 tactical-box rounded-sm p-4 sm:p-5 bg-[#0a140d] border border-[#203c26] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1b3420] pb-3 mb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-arabic-display font-black text-zinc-100">
                  بيانات تتبع الهدف الراداري
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                {selectedTarget ? selectedTarget.threatLevel : 'NO TARGET'}
              </span>
            </div>

            {selectedTarget ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Callsign & Type */}
                <div className="p-3 rounded bg-[#070e09] border border-[#1b3420] flex items-center justify-between">
                  <div>
                    <div className="text-zinc-500 text-[10px]">CALLSIGN & IFF</div>
                    <div className="text-base font-bold text-emerald-300">{selectedTarget.callsign}</div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-[10px] text-zinc-500 block">TRANSPONDER:</span>
                    <span className="text-xs text-zinc-300 font-bold">{selectedTarget.transponderId}</span>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">RANGE (DISTANCE)</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedTarget.distanceKm} KM</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">AZIMUTH / BEARING</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedTarget.bearing}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">VELOCITY (SPEED)</span>
                    <span className="text-sm font-bold text-zinc-200">{selectedTarget.speedKnots} KNOTS</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#070e09] border border-[#1b3420]">
                    <span className="text-zinc-500 text-[10px] block">ALTITUDE</span>
                    <span className="text-sm font-bold text-zinc-200">{selectedTarget.altitudeFt.toLocaleString()} FT</span>
                  </div>
                </div>

                {/* Tactical Notes */}
                <div className="p-3 rounded bg-[#070e09] border border-[#1b3420] font-arabic-display text-xs text-zinc-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-1">تقرير التحري الراداري:</span>
                  {selectedTarget.notesAr}
                </div>
              </div>
            ) : null}
          </div>

          {/* Quick Target Switcher */}
          <div className="pt-3 border-t border-[#1b3420] mt-3">
            <span className="text-[10px] font-mono text-zinc-500 block mb-1.5">RADAR CONTACTS:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-mono">
              {targets.map((tgt) => (
                <button
                  key={tgt.id}
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTargetLock(true);
                    setSelectedTarget(tgt);
                  }}
                  className={`p-1.5 rounded flex items-center justify-between text-left rtl:text-right transition-colors ${
                    selectedTarget?.id === tgt.id
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-[#08110b] text-zinc-400 hover:text-emerald-300 border border-[#193020]'
                  }`}
                >
                  <span className="truncate">{tgt.callsign}</span>
                  <span className="text-[10px] text-zinc-500">{tgt.distanceKm}km</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
