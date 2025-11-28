import { Button, ButtonProps } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

// Generic per supportare diversi tipi di valori (string literal types)
interface TabButtonProps<T extends string = string> {
  value: T;
  label: string;
  activeTab: T;
  onClick: (value: T) => void;
  icon?: IconDefinition;
  activeClass?: string; // Classe CSS custom per stato attivo
  inactiveClass?: string; // Classe CSS custom per stato inattivo
  className?: string;
}

export default function TabButton<T extends string = string>({
  value,
  label,
  activeTab,
  onClick,
  icon,
  activeClass,
  inactiveClass,
  className,
}: TabButtonProps<T>) {
  // Salva il tab attivo
  const isActive = activeTab === value;

  let finalClass = className ?? "";

  // Decide quale classe CSS applicare in base allo stile passato e se attivo o no
  if (activeClass || inactiveClass) {
    if (isActive) {
      finalClass = `${finalClass} ${activeClass ?? ""}`.trim();
    } else {
      finalClass = `${finalClass} ${inactiveClass ?? ""}`.trim();
    }
  }

  // Determina variante in base a custom classes se attivi o no
  let variant: ButtonProps["variant"];

  if (activeClass || inactiveClass) {
    variant = "normal";
  } else if (isActive) {
    variant = "primary";
  } else {
    variant = "secondary";
  }

  return (
    <Button
      onClick={() => onClick(value)}
      variant={variant}
      size="sm"
      className={finalClass}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2 w-4" />}
      {label}
    </Button>
  );
}
