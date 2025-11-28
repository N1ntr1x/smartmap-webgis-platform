import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FeatureCardProps {
  icon?: IconDefinition;
  title: string;
  description: string;
  iconBgClass: string;
}

export default function FeatureCard({ icon, title, description, iconBgClass }: FeatureCardProps) {
  return (
    <div className="flex transform flex-col items-start space-y-4 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-md transition-transform duration-300 hover:-translate-y-2">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgClass}`}>
        {icon && <FontAwesomeIcon icon={icon} className="text-2xl text-gray-700" />}
      </div>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}