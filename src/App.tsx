import React, { useState, useEffect } from 'react';
import {
  CLASSIFIED_DOSSIERS,
  INTERCEPTED_MESSAGES,
  TACTICAL_ZONES,
  TACTICAL_UNITS,
  RADAR_TARGETS,
  PRIMARY_OPERATIVE,
  SYSTEM_HEALTH_MODULES,
  TIMELINE_EVENTS,
} from './data/intelligenceData';
import { ClassifiedDocument, RadarTarget } from './types';
import { soundEngine } from './utils/audio';

import { BootSequence } from './components/BootSequence';
import { ClassificationBanner } from './components/ClassificationBanner';
import { HeaderHUD } from './components/HeaderHUD';
import { HeroOperations } from './components/HeroOperations';
import { OperationStatus } from './components/OperationStatus';
import { ActiveClassifiedFiles } from './components/ActiveClassifiedFiles';
import { LiveInterceptFeed } from './components/LiveInterceptFeed';
import { SurveillanceGrid } from './components/SurveillanceGrid';
import { TacticalRadar } from './components/TacticalRadar';
import { PersonnelIdentification } from './components/PersonnelIdentification';
import { SystemMonitorAndTimeline } from './components/SystemMonitorAndTimeline';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { FooterHUD } from './components/FooterHUD';
import { DossierModal } from './components/DossierModal';
import { LockdownModal } from './components/LockdownModal';

export default function App() {
  const [hasBooted, setHasBooted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false); // Sound OFF by default per prompt
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [defcon, setDefcon] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [isLockdown, setIsLockdown] = useState<boolean>(false);
  const [selectedDossier, setSelectedDossier] = useState<ClassifiedDocument | null>(null);

  // Tactical data state
  const [dossiers, setDossiers] = useState<ClassifiedDocument[]>(CLASSIFIED_DOSSIERS);
  const [radarTargets, setRadarTargets] = useState<RadarTarget[]>(RADAR_TARGETS);

  // Set Arabic RTL as default document direction
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      soundEngine.playUiClick(true);
    }
  };

  const handleToggleCrt = () => {
    if (soundEnabled) soundEngine.playUiClick(true);
    setCrtEnabled((prev) => !prev);
  };

  const handleTriggerLockdown = () => {
    setDefcon(1);
    setIsLockdown(true);
  };

  const handleDismissLockdown = () => {
    setIsLockdown(false);
    setDefcon(2);
  };

  const handleOpenDossier = (doc: ClassifiedDocument) => {
    setSelectedDossier(doc);
  };

  return (
    <div className="min-h-screen bg-[#060c08] text-zinc-100 flex flex-col relative select-none font-arabic-display overflow-x-hidden">
      {/* Optional CRT Scanline & Grain Texture */}
      {crtEnabled && <div className="crt-overlay pointer-events-none" />}

      {/* 1. Theatrical Boot Sequence (Shows before authorization or when replayed) */}
      {!hasBooted && (
        <BootSequence
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onComplete={() => setHasBooted(true)}
        />
      )}

      {/* 2. Main High-Budget Secret Intelligence Terminal */}
      {hasBooted && (
        <div className="flex-1 flex flex-col w-full relative z-10">
          {/* Top Classification Warning Banner */}
          <ClassificationBanner />

          {/* Tactical Header HUD with Agency Branding, DEFCON Selector, Audio and Section Nav */}
          <HeaderHUD
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            crtEnabled={crtEnabled}
            onToggleCrt={handleToggleCrt}
            defcon={defcon}
            onSetDefcon={(lvl) => {
              setDefcon(lvl);
              if (lvl === 1) handleTriggerLockdown();
            }}
            onTriggerLockdown={handleTriggerLockdown}
            onReplayBoot={() => setHasBooted(false)}
          />

          {/* Main Content Sections */}
          <main className="flex-1 space-y-8 pb-10">
            {/* HERO SECTION: Decryption Scrambler Terminal (Left) + Physical Classified Dossier Folder (Right) */}
            <div id="hero">
              <HeroOperations
                soundEnabled={soundEnabled}
                onOpenDossier={handleOpenDossier}
                featuredDossier={dossiers[0]}
              />
            </div>

            {/* OPERATION STATUS: Large Cinematic Tactical Counters */}
            <div id="status">
              <OperationStatus soundEnabled={soundEnabled} />
            </div>

            {/* ACTIVE CLASSIFIED FILES: 6 Physical-Looking Dossier Cards */}
            <div id="dossiers">
              <ActiveClassifiedFiles
                documents={dossiers}
                onOpenDossier={handleOpenDossier}
                soundEnabled={soundEnabled}
              />
            </div>

            {/* LIVE COMMUNICATION FEED: Intercepted Signals Console */}
            <div id="feed">
              <LiveInterceptFeed
                initialMessages={INTERCEPTED_MESSAGES}
                soundEnabled={soundEnabled}
              />
            </div>

            {/* SURVEILLANCE GRID: Large Tactical Map with Moving Units & Zones */}
            <div id="grid">
              <SurveillanceGrid
                zones={TACTICAL_ZONES}
                units={TACTICAL_UNITS}
                soundEnabled={soundEnabled}
              />
            </div>

            {/* TACTICAL RADAR: 3D Radar Screen with Target Blips & Telemetry */}
            <div id="radar">
              <TacticalRadar
                targets={radarTargets}
                soundEnabled={soundEnabled}
              />
            </div>

            {/* AGENT / PERSONNEL SECTION: Physical Identity Card Module with Biometrics */}
            <PersonnelIdentification
              operative={PRIMARY_OPERATIVE}
              soundEnabled={soundEnabled}
            />

            {/* SYSTEM MONITOR & CHRONOLOGICAL TIMELINE: Services Matrix & Operations History */}
            <SystemMonitorAndTimeline
              systemModules={SYSTEM_HEALTH_MODULES}
              timelineEvents={TIMELINE_EVENTS}
              soundEnabled={soundEnabled}
            />

            {/* INTERACTIVE CRT TERMINAL: Command Prompt Interpreter with Fictional Responses */}
            <div id="terminal">
              <InteractiveTerminal
                soundEnabled={soundEnabled}
                onTriggerLockdown={handleTriggerLockdown}
              />
            </div>
          </main>

          {/* FOOTER: Fictional Legal Disclaimer & Build Telemetry */}
          <FooterHUD />

          {/* Full Screen Dossier Modal Popup */}
          {selectedDossier && (
            <DossierModal
              dossier={selectedDossier}
              onClose={() => setSelectedDossier(null)}
              soundEnabled={soundEnabled}
            />
          )}

          {/* Emergency Red-Alert Lockdown Screen */}
          {isLockdown && (
            <LockdownModal
              language="ar"
              soundEnabled={soundEnabled}
              onDismiss={handleDismissLockdown}
            />
          )}
        </div>
      )}
    </div>
  );
}
