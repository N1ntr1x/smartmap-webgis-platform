import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface StatsCardProps {
  icon: IconDefinition;
  label: string;
  value: string | number;
  variant?: "horizontal" | "centered";
  borderColor?: string;
  iconColor?: string;
  className?: string;
  href?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  variant = "horizontal",
  borderColor = "border-transparent",
  iconColor = "text-blue-600",
  className = "",
  href,
}: StatsCardProps) {

  const LabelContent = href ? <Link href={href}>{label}</Link> : <>{label}</>;

  if (variant === "horizontal") {
    // Layout per Dashboard (invariato)
    return (
      <div className={`flex items-center gap-4 rounded-2xl border-l-4 bg-white p-4 shadow-sm md:p-6 ${borderColor} ${className}`}>
        <FontAwesomeIcon icon={icon} className="text-xl text-gray-400 md:text-2xl" />
        <div>
          <p className="text-sm font-semibold text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900 md:text-3xl">{value}</p>
        </div>
      </div>
    );
  }

  if (variant === "centered") {
    // Layout per HomePage e DatasetPage
    return (
      <div className={`flex flex-col items-center justify-center space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
        <FontAwesomeIcon icon={icon} className={`mb-2 text-2xl ${iconColor}`} />
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <div className="text-xs text-gray-500 hover:text-blue-600">
          {LabelContent}
        </div>
      </div>
    );
  }

  return null;
}