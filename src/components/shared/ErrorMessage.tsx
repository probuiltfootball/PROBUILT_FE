interface ErrorMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export default function ErrorMessage({
  message,
  className = '',
  onDismiss,
}: ErrorMessageProps) {
  return (
    <div
      className={`p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center justify-between ${className}`}
      role="alert"
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-400 hover:text-red-300 transition-colors"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}

