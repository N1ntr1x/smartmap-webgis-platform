"use client";

import { useState, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui"

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function CollapsibleSection({ title, children, className }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-lg bg-gray-50/70 transition-shadow hover:shadow-sm ${className}`}>
      <Button
        variant="normal"
        size="auto"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-gray-500 transition-transform duration-200"
        />
      </Button>
      {isOpen && (
        <div className="px-4">
          {children}
        </div>
      )}
    </div>
  );
}