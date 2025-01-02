import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent) => void;
}

export const Form: React.FC<FormProps> = ({ children, onSubmit, className = '', ...props }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className={`space-y-6 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  required = false
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ error, icon, className = '', ...props }) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`
          block w-full rounded-md shadow-sm
          ${icon ? 'pl-10' : 'pl-3'}
          ${error ? 'border-red-300' : 'border-gray-300'}
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({ error, options, className = '', ...props }) => {
  return (
    <select
      className={`
        block w-full rounded-md border-gray-300 shadow-sm
        focus:border-blue-500 focus:ring-blue-500 sm:text-sm
        ${error ? 'border-red-300' : 'border-gray-300'}
        ${className}
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ error, className = '', ...props }) => {
  return (
    <textarea
      className={`
        block w-full rounded-md border-gray-300 shadow-sm
        focus:border-blue-500 focus:ring-blue-500 sm:text-sm
        ${error ? 'border-red-300' : 'border-gray-300'}
        ${className}
      `}
      {...props}
    />
  );
};