import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface ScreenReaderContextType {
  isEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  toggleScreenReader: () => void;
  speak: (text: string) => void;
  stop: () => void;
  setSpeechRate: (rate: number) => void;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | undefined>(undefined);

// Clean text for speech (remove markdown and emojis)
const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold markers
    .replace(/[📅📝🔄📊🏥📆🎯📄📚📧📖🏫🪪💰🌍📞🧠👋✅❌⚠️💡🎥🗂️💪💵⏱️🍅🤔→•🔥🎓⭐🚀💻📱🏠💧🧘😴🤝😰💙🌐🔓🍽️🚌📰🎤👥]/g, '') // Remove emojis
    .replace(/[#*_~`]/g, '') // Remove markdown
    .replace(/\n+/g, '. ') // Replace newlines with pauses
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export function ScreenReaderProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  
  // Get speech synthesis (only in browser)
  const getSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      return window.speechSynthesis;
    }
    return null;
  };

  // Speak text function
  const speak = useCallback((text: string) => {
    const synthesis = getSpeechSynthesis();
    if (!synthesis) return;
    
    // Cancel any ongoing speech
    synthesis.cancel();
    
    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Try to detect language from text
    const hasGermanChars = /[äöüßÄÖÜ]/.test(text);
    const hasGermanWords = /\b(und|oder|der|die|das|ein|eine|ist|sind|werden|wurde|haben|hat|bei|für|mit|nach|von|zu)\b/i.test(text);
    utterance.lang = (hasGermanChars || hasGermanWords) ? 'de-DE' : 'en-US';
    
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesis.speak(utterance);
  }, [speechRate]);

  // Stop speaking
  const stop = useCallback(() => {
    const synthesis = getSpeechSynthesis();
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Toggle screen reader
  const toggleScreenReader = useCallback(() => {
    setIsEnabled(prev => {
      if (prev) {
        stop();
      }
      return !prev;
    });
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const synthesis = getSpeechSynthesis();
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, []);

  // Announce when screen reader is toggled
  useEffect(() => {
    if (isEnabled) {
      speak('Screen Reader aktiviert.');
    }
  }, [isEnabled]);

  // Global hover-to-read functionality
  useEffect(() => {
    if (!isEnabled) return;

    let lastReadElement: Element | null = null;
    let hoverTimeout: NodeJS.Timeout | null = null;

    const getReadableText = (element: Element): string => {
      // Check for aria-label first
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel) return ariaLabel;

      // Check for title
      const title = element.getAttribute('title');
      if (title) return title;

      // Check for alt text (images)
      if (element.tagName === 'IMG') {
        const alt = element.getAttribute('alt');
        if (alt) return alt;
      }

      // Get text content, but avoid reading too much
      const textContent = element.textContent?.trim() || '';
      
      // Limit length for performance
      if (textContent.length > 500) {
        return textContent.substring(0, 500) + '...';
      }
      
      return textContent;
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Skip if same element
      if (target === lastReadElement) return;
      
      // Clear previous timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }

      // Find the most appropriate element to read
      let elementToRead = target;
      
      // Skip certain elements
      const skipTags = ['HTML', 'BODY', 'SCRIPT', 'STYLE', 'SVG', 'PATH', 'CIRCLE', 'RECT', 'LINE'];
      if (skipTags.includes(target.tagName)) return;

      // If it's an icon inside a button/link, read the parent
      if (target.tagName === 'svg' || target.closest('svg')) {
        const parent = target.closest('button, a, [role="button"]');
        if (parent) {
          elementToRead = parent;
        } else {
          return; // Skip orphan SVGs
        }
      }

      // Get readable text
      const text = getReadableText(elementToRead);
      
      // Skip empty or too short text
      if (!text || text.length < 2) return;
      
      // Skip if just numbers or symbols
      if (/^[\d\s\-:.,]+$/.test(text)) return;

      // Debounce - wait 300ms before reading
      hoverTimeout = setTimeout(() => {
        lastReadElement = elementToRead;
        speak(text);
      }, 300);
    };

    const handleMouseOut = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    };

    // Add global listeners
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [isEnabled, speak]);

  return (
    <ScreenReaderContext.Provider
      value={{
        isEnabled,
        isSpeaking,
        speechRate,
        toggleScreenReader,
        speak,
        stop,
        setSpeechRate,
      }}
    >
      {children}
    </ScreenReaderContext.Provider>
  );
}

export function useScreenReader() {
  const context = useContext(ScreenReaderContext);
  if (context === undefined) {
    throw new Error('useScreenReader must be used within a ScreenReaderProvider');
  }
  return context;
}

// Optional: Safe hook that doesn't throw if not in provider
export function useScreenReaderSafe() {
  const context = useContext(ScreenReaderContext);
  return context || {
    isEnabled: false,
    isSpeaking: false,
    speechRate: 1.0,
    toggleScreenReader: () => {},
    speak: () => {},
    stop: () => {},
    setSpeechRate: () => {},
  };
}
