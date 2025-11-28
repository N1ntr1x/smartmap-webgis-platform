"use client";

import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export default function FormInput({ label, id, error, className = "", ...props }: FormInputProps) {
  return (
    <div>
      {/* htmlFor={id} collega il label al form corrispondente */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-2">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 select-none ${className}`}
        {...props} // Ulteriori attributi standard passati a input
      />
      {/* Messaggio di errore opzionale sotto l'input */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
