import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import { APP_CONFIG } from "@/configs"

interface LogoProps {
    textSize?: string;
}

export default function Logo({ textSize = "md" }: LogoProps) {
    return (
        <Link className={`flex items-center ${textSize} space-x-1`} href={"/"}>
            <div className="text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-1.5 py-1 rounded-xl">
                <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <h1 className="font-bold">{APP_CONFIG.name}</h1>
        </Link>
    );
}