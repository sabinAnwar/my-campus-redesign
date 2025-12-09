import React from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { useScreenReaderSafe } from '~/contexts/ScreenReaderContext';

interface ScreenReaderToggleProps {
  variant?: 'floating' | 'inline' | 'compact';
  className?: string;
}

export function ScreenReaderToggle({ variant = 'floating', className = '' }: ScreenReaderToggleProps) {
  const { isEnabled, isSpeaking, speechRate, toggleScreenReader, stop, setSpeechRate } = useScreenReaderSafe();
  const [showSettings, setShowSettings] = React.useState(false);

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleScreenReader}
        className={`p-2 rounded-lg transition-all ${
          isEnabled
            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        } ${className}`}
        aria-label={isEnabled ? 'Screen Reader deaktivieren' : 'Screen Reader aktivieren'}
        aria-pressed={isEnabled}
        title={isEnabled ? 'Vorlesen aktiv' : 'Vorlesen aktivieren'}
      >
        <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={toggleScreenReader}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
            isEnabled
              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          aria-label={isEnabled ? 'Screen Reader deaktivieren' : 'Screen Reader aktivieren'}
          aria-pressed={isEnabled}
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
          <span>{isEnabled ? 'Vorlesen An' : 'Vorlesen'}</span>
        </button>
        
        {isEnabled && (
          <>
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Sprechgeschwindigkeit"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1.0}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>
            
            {isSpeaking && (
              <button
                onClick={stop}
                className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50"
                aria-label="Vorlesen stoppen"
                title="Stoppen"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // Floating variant (bottom-right corner)
  return (
    <div className={`fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 ${className}`}>
      {/* Settings Panel */}
      {showSettings && isEnabled && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 mb-2 animate-in slide-in-from-bottom-2">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">
            Screen Reader Einstellungen
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                Geschwindigkeit
              </label>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                <option value={0.5}>Langsam (0.5x)</option>
                <option value={0.75}>Gemäßigt (0.75x)</option>
                <option value={1.0}>Normal (1x)</option>
                <option value={1.25}>Schnell (1.25x)</option>
                <option value={1.5}>Sehr schnell (1.5x)</option>
              </select>
            </div>
            
            {isSpeaking && (
              <button
                onClick={stop}
                className="w-full px-3 py-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-sm font-medium flex items-center justify-center gap-2"
              >
                <VolumeX className="w-4 h-4" />
                Stoppen
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {isEnabled && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-full shadow-lg transition-all ${
              showSettings
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            aria-label="Einstellungen"
            title="Einstellungen"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
        
        <button
          onClick={toggleScreenReader}
          className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-105 ${
            isEnabled
              ? 'bg-violet-600 text-white shadow-violet-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
          aria-label={isEnabled ? 'Screen Reader deaktivieren' : 'Screen Reader aktivieren'}
          aria-pressed={isEnabled}
          title={isEnabled ? 'Vorlesen aktiv - Klicken zum Deaktivieren' : 'Vorlesen aktivieren'}
        >
          <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
        </button>
      </div>
      
      {/* Status Badge */}
      {isEnabled && (
        <div className="text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded-full">
          {isSpeaking ? '🔊 Spricht...' : '✓ Aktiv'}
        </div>
      )}
    </div>
  );
}

// HOC to make any text readable
export function ReadableText({ 
  children, 
  as: Component = 'span',
  className = '',
  ...props 
}: { 
  children: string;
  as?: React.ElementType;
  className?: string;
  [key: string]: any;
}) {
  const { isEnabled, speak } = useScreenReaderSafe();
  
  const handleFocus = () => {
    if (isEnabled && children) {
      speak(children);
    }
  };
  
  return (
    <Component
      className={className}
      onMouseEnter={handleFocus}
      onFocus={handleFocus}
      tabIndex={isEnabled ? 0 : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}

export default ScreenReaderToggle;
