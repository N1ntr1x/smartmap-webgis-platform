import Link from "next/link";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "@/components/layout/Logo";
import { APP_CONFIG } from "@/configs";
import { FOOTER_SECTIONS } from "@/features/routes"

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-gray-400 text-sm sm:text-base md:py-15">
            <div className="flex flex-col md:flex-row md:space-x-10 px-10 items-start justify-around">
                <section className="space-y-5 my-5 max-w-xs">
                    <Logo textSize="lg" />
                    <p>Esplora dati GIS, interroga l&apos;AI e salva le tue ricerche personalizzate.</p>
                    <Link href="#" aria-label="Instagram" className="inline-block hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faInstagram} size="xl" />
                    </Link>
                </section>
                {/* Mappatura delle sezioni definte in FOOTER_SECTIONS */}
                {FOOTER_SECTIONS.map(({ title, links }) => (
                    <nav key={title} className="my-5">
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                        <ul className="mt-2 space-y-1">
                            {links.map(({ text, href }) => (
                                <li key={text}>
                                    <Link href={href} className="hover:text-white transition-colors">
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            <hr className="my-5 mx-5 border-gray-900" />
            <p className="text-center text-sm pb-5 sm:pb-0">
                © 2025 {APP_CONFIG.name}. Tutti i diritti riservati.
            </p>
        </footer>
    );
}
