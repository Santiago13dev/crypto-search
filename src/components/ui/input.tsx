import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={clsx(
            'w-full bg-[#0a0f1e] border text-[#00ff00] placeholder-[#00ff00]/50 px-4 py-3 font-mono focus:outline-none rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-500/40 focus:border-red-500' : 'border-[#00ff00]/40 focus:border-[#00ff00]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;