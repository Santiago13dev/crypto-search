import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'font-mono font-bold transition-all rounded-none disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-[#00ff00] text-black hover:brightness-125': variant === 'primary',
            'bg-[#0a0f1e] border border-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/10': variant === 'secondary',
            'bg-transparent text-[#00ff00] hover:bg-[#00ff00]/10': variant === 'ghost',
            'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30': variant === 'danger',
            'px-3 py-2 text-sm': size === 'sm',
            'px-4 py-3 text-base': size === 'md',
            'px-6 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;