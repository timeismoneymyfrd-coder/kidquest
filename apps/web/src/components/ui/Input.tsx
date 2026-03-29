import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2 rounded-lg bg-secondary border border-accent-cyan/30 text-white
                       placeholder-gray-400 focus:outline-none focus:border-accent-cyan
                       transition-colors duration-200 ${
                         error ? 'border-accent-pink' : ''
                       } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent-pink">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
