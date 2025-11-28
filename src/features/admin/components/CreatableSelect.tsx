"use client";

import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface CreatableSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

/*
CreatableSelect - Input che permette di scegliere da lista o creare nuova opzione
Utile per categorie dataset dove si può aggiungere nuove al volo
*/
export default function CreatableSelect({ options, value, onValueChange, placeholder }: CreatableSelectProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onValueChange(e.target.value);
  };

  return (
    <div>
      <input
        list="category-options"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
      />
      <datalist id="category-options">
        {options.map(option => (
          <option key={option.value} value={option.label} />
        ))}
      </datalist>
      <p className="text-xs text-gray-500 mt-1">Scegli dalla lista o scrivi per creare una nuova categoria.</p>
    </div>
  );
}
