"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface ButtonSidebarProps {
  icon?: IconDefinition;
  text: string;
  isExpanded: boolean;
  href: string;
  isActive?: boolean;
}

export default function ButtonSidebar({ icon, text, isExpanded, href, isActive}: ButtonSidebarProps) {

  const isActiveClass = isActive ? "bg-blue-600 text-white" : "";
  const isExpandedClass = isExpanded ? "justify-start" : "justify-center";

  return (
    <div className="relative flex items-center w-full">
      <Link
        href={href} passHref
        className={`${isExpandedClass} ${isActiveClass} flex items-center w-full px-2 py-2 rounded-lg transition-colors`}
      >
        {icon && <FontAwesomeIcon icon={icon} />}
        {isExpanded && <span className="ml-3 text-sm font-medium">{text}</span>}
      </Link>
    </div>
  );
}
