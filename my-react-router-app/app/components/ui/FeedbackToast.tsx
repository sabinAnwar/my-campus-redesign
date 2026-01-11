import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-react';

// TYPES

export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface FeedbackToastProps {
  type: FeedbackType;
  title: string;
  message?: string;
  isVisible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

// FEEDBACK CONFIGURATION

const FEEDBACK_CONFIG = {
  success: {
    icon: CheckCircle2,
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderClass: 'border-emerald-500/30 dark:border-emerald-500/50',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    titleClass: 'text-emerald-800 dark:text-emerald-300',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-red-500/10 dark:bg-red-500/20',
    borderClass: 'border-red-500/30 dark:border-red-500/50',
    iconClass: 'text-red-600 dark:text-red-400',
    titleClass: 'text-red-800 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderClass: 'border-amber-500/30 dark:border-amber-500/50',
    iconClass: 'text-amber-600 dark:text-amber-400',
    titleClass: 'text-amber-800 dark:text-amber-300',
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-500/10 dark:bg-blue-500/20',
    borderClass: 'border-blue-500/30 dark:border-blue-500/50',
    iconClass: 'text-blue-600 dark:text-blue-400',
    titleClass: 'text-blue-800 dark:text-blue-300',
  },
  loading: {
    icon: Loader2,
    bgClass: 'bg-slate-500/10 dark:bg-slate-500/20',
    borderClass: 'border-slate-500/30 dark:border-slate-500/50',
    iconClass: 'text-slate-700 dark:text-slate-200 animate-spin',
    titleClass: 'text-slate-800 dark:text-slate-300',
  },
};

// FEEDBACK TOAST COMPONENT

export function FeedbackToast({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 4000,
}: FeedbackToastProps) {
  const config = FEEDBACK_CONFIG[type];
  const IconComponent = config.icon;

  React.useEffect(() => {
    if (isVisible && autoClose && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose, type]);

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed top-6 right-6 z-[9999] max-w-md w-full
        ${config.bgClass} ${config.borderClass}
        backdrop-blur-xl border rounded-2xl shadow-2xl
        p-5 flex items-start gap-4
        animate-in slide-in-from-top-4 fade-in duration-300
      `}
    >
      <div className={`p-2 rounded-xl ${config.bgClass}`}>
        <IconComponent className={`w-6 h-6 ${config.iconClass}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-base ${config.titleClass}`}>
          {title}
        </h4>
        {message && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {message}
          </p>
        )}
      </div>

      {onClose && type !== 'loading' && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

// INLINE FEEDBACK COMPONENT (for forms)

export interface InlineFeedbackProps {
  type: FeedbackType;
  message: string;
  className?: string;
}

export function InlineFeedback({ type, message, className = '' }: InlineFeedbackProps) {
  const config = FEEDBACK_CONFIG[type];
  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={`
        ${config.bgClass} ${config.borderClass}
        border rounded-xl p-4 flex items-center gap-3
        animate-in fade-in slide-in-from-top-2 duration-300
        ${className}
      `}
    >
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.iconClass}`} />
      <p className={`text-sm font-medium ${config.titleClass}`}>
        {message}
      </p>
    </div>
  );
}

// HOOK FOR MANAGING FEEDBACK STATE

export function useFeedback() {
  const [feedback, setFeedback] = React.useState<{
    type: FeedbackType;
    title: string;
    message?: string;
    isVisible: boolean;
  }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false,
  });

  const showFeedback = React.useCallback((
    type: FeedbackType,
    title: string,
    message?: string
  ) => {
    setFeedback({ type, title, message, isVisible: true });
  }, []);

  const hideFeedback = React.useCallback(() => {
    setFeedback(prev => ({ ...prev, isVisible: false }));
  }, []);

  const showSuccess = React.useCallback((title: string, message?: string) => {
    showFeedback('success', title, message);
  }, [showFeedback]);

  const showError = React.useCallback((title: string, message?: string) => {
    showFeedback('error', title, message);
  }, [showFeedback]);

  const showWarning = React.useCallback((title: string, message?: string) => {
    showFeedback('warning', title, message);
  }, [showFeedback]);

  const showInfo = React.useCallback((title: string, message?: string) => {
    showFeedback('info', title, message);
  }, [showFeedback]);

  const showLoading = React.useCallback((title: string, message?: string) => {
    showFeedback('loading', title, message);
  }, [showFeedback]);

  return {
    feedback,
    showFeedback,
    hideFeedback,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
}
// my-react-router-app/app/hooks/useChat.ts:10-20
function findLearningAnswer(query: string, language: "de" | "en"): string | null {
  const normalized = query.toLowerCase();
  const knowledge = LEARNING_KNOWLEDGE[language];
  for (const item of knowledge) {
    const matchCount = item.keywords.filter(k => normalized.includes(k)).length;
    if (matchCount >= 1) return item.answer;
  }
  return null;
}
