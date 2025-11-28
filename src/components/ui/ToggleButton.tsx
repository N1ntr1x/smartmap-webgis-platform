"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@/components/ui";

/*
  ToggleButton
  - Componente controllabile che mostra due icone (active/inactive).
*/

interface ToggleButtonProps {
  activeIcon: IconDefinition;
  inactiveIcon: IconDefinition;
  sizeIcon?: SizeProp;
  initialState?: boolean;
  onToggle: (isActive: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  label?: string;
  disabled?: boolean;
}

export default function ToggleButton({
  activeIcon,
  inactiveIcon,
  initialState = false,
  sizeIcon = "1x",
  onToggle,
  activeColor = "text-blue-600",
  inactiveColor = "text-gray-500",
  label = "Toggle",
  disabled = false,
}: ToggleButtonProps) {
  // Memorizza se il Toggle attuale è attivo o no
  const [isActive, setIsActive] = useState(initialState);

  // Aggionta lo stato isActive dall'esterno
  useEffect(() => {
    setIsActive(initialState);
  }, [initialState]);

  // Quando clicca il Toggle crea un nuovo stato, si aggiorna quello attuale e viene eseguita la callback onToggle
  const toggle = () => {
    if (disabled) return;

    const nextState = !isActive;
    setIsActive(nextState);
    onToggle(nextState);
  };

  return (
    <Button
      variant="normal"
      size="icon"
      onClick={toggle}
      disabled={disabled}
      title={disabled ? "Azione non permessa" : label}
      className={`
        ${disabled
          ? "text-gray-300"
          : isActive ? activeColor : inactiveColor
        }
      `}
    >
      <FontAwesomeIcon icon={isActive ? activeIcon : inactiveIcon} size={sizeIcon} />
    </Button>
  );
}
