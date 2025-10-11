import { ValidationResult } from '@/types';

interface ValidationMessageProps {
  validation: ValidationResult;
  className?: string;
}

export const ValidationMessage = ({ validation, className = '' }: ValidationMessageProps) => {
  if (validation.isValid) return null;

  return (
    <div className={`text-sm text-red-600 mt-1 ${className}`}>
      {validation.errors.map((error, index) => (
        <div key={index} className="flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      ))}
    </div>
  );
};
