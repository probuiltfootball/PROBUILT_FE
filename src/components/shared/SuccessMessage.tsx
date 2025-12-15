interface SuccessMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export default function SuccessMessage({
  message,
  className = '',
  onDismiss,
}: SuccessMessageProps) {
  return (
    <div
      className={`p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center justify-between ${className}`}
      role="alert"
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-green-400 hover:text-green-300 transition-colors"
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}

