"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { InputHTMLAttributes } from "react";

// Esclude con Omit 'type' e 'onChange' per fornire implementazione custom
interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Cerca...",
  className = "",
  ...props
}: SearchBarProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-md ${className}`}>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-sm" aria-hidden="true" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)} // Viene chiamata la funzione onChange chiamante con il parametro digiato in input
        className="flex-1 bg-transparent text-gray-500 text-sm outline-none placeholder:text-gray-400"
        aria-label={placeholder}
        {...props}
      />
    </div>
  );
}
