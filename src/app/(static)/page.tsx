import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faMap, faDatabase, faMessage, faFloppyDisk, faUsers, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { StatsCard, FeatureCard } from "@/components/ui";

import { APP_CONFIG } from "@/configs";

const statsData = [
    { icon: faDatabase, value: "100%", label: "Dataset GIS", href: "#" },
    { icon: faMessage, value: "5+", label: "Chatbot AI", href: "#" },
    { icon: faFloppyDisk, value: "24/7", label: "Layer Salvati", href: "#" },
    { icon: faMap, value: "Massima", label: "Navigazione", href: "#" },
];


function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">{subtitle}</p>
        </div>
    );
}

const featuresData = [
    { title: "Navigazione Mappe", description: "Esplora mappe interattive con dataset geospaziali curati dagli amministratori.", iconBgClass: "bg-blue-50" },
    { title: "Chatbot Intelligente", description: "Interroga l'AI per ricerche avanzate, calcoli e analisi dei dati geografici.", iconBgClass: "bg-violet-50" },
    { title: "Salva Layer Personalizzati", description: "Registra e conserva i layer creati dalle tue ricerche con il chatbot.", iconBgClass: "bg-orange-50" },
    { title: "Gestione Layer", description: "Attiva/disattiva layer, filtra dati e personalizza la visualizzazione.", iconBgClass: "bg-yellow-50" },
    { title: "Ricerca Avanzata", description: "Trova luoghi, coordinate e punti di interesse con ricerca intelligente.", iconBgClass: "bg-cyan-50" },
    { title: "Libreria Personale", description: "Organizza e accedi rapidamente ai tuoi layer e ricerche salvate.", iconBgClass: "bg-lime-50" },
];

export default function HomePage() {
    return (
        <>
            {/* Sezione iniziale home */}
            <section className="bg-white text-gray-700 flex flex-col space-y-5 sm:space-y-10 py-10 px-4 md:py-40 md:px-20 items-center justify-center text-wrap w-full">
                {/* Titolo */}
                <div>
                    <span className="text-6xl sm:text-8xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-600 via-lime-600 to-yellow-600 bg-clip-text text-transparent">
                        {APP_CONFIG.name}
                    </span>
                </div>
                {/* Subtitolo */}
                <div className="text-center">
                    <span className="text-lg sm:text-2xl tracking-wide font-stretch-ultra-expanded font-base tracking-wide">
                        Naviga mappe interattive, interroga l&apos;AI e salva le tue ricerche personalizzate
                    </span>
                </div>
                {/* Bottoni */}
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-center justify-around text-lg font-bold w-md">
                    <Link href="/login" className="shadow-lg text-white bg-blue-600 focus:outline-none rounded-lg text-sm px-4 py-3 text-center">
                        <FontAwesomeIcon icon={faLock} className="mr-2" />
                        Accedi alla Piattaforma
                    </Link>
                    <Link href="#div-funz" className="border border-gray-200 shadow-lg bg-gray-100 focus:outline-none rounded-lg text-sm px-8 py-3 text-center">
                        Scopri Come Funziona
                    </Link>
                </div>
                {/* Card base */}
                <div className="w-full max-w-3xl py-10 sm:py-20">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 sm:mx-0">
                        {statsData.map((stat) => (
                            <StatsCard
                                key={stat.label}
                                variant="centered"
                                icon={stat.icon}
                                value={stat.value}
                                label={stat.label}
                                href={stat.href}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Sezione Funzionalità */}
            <section id="features" className="w-full items-center justify-center bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <SectionHeader title="Esplora Dati GIS con Potenza e Semplicità" subtitle="Accedi a dataset curati, interagisci con l'AI e salva le tue ricerche personalizzate." />
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {featuresData.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
                    </div>
                </div>
            </section>

            {/* come funziona */}
            <section className="bg-white text-gray-700 flex flex-col space-y-1 sm:space-y-2 py-10 md:py-20 px-4 md:px-20 items-center justify-center text-wrap w-full">
                {/* Titolo */}
                <SectionHeader title="Come Funziona" subtitle="Esplora dati geospaziali in tre semplici passaggi." />
                {/* Flusso */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-5 sm:mx-0 my-10">
                    <div className="flex flex-col space-y-4 items-center justify-center">
                        <div className="flex items-center justify-center text-white font-bold font-mono text-2xl w-15 h-15 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50">
                            <span>01</span>
                        </div>
                        <FontAwesomeIcon icon={faLock} className="text-4xl text-gray-400" />
                        <p className="font-medium text-lg text-gray-800">Crea Account</p>
                        <p className="text-sm text-gray-600 text-center">Registrati gratuitamente per accedere a tutte le funzionalità della piattaforma</p>
                    </div>
                    <div className="flex flex-col space-y-4 items-center justify-center">
                        <div className="relative flex items-center justify-center text-white font-bold font-mono text-2xl w-15 h-15 rounded-full bg-orange-600 shadow-lg shadow-orange-500/50">
                            <span>02</span>
                            <div role="separator" aria-hidden="true" className="absolute -bottom-1.5 -left-70 lg:w-155 md:h-1 rounded-full bg-gradient-to-r from-blue-600 via-orange-400 to-green-500 shadow-sm" />
                        </div>
                        <FontAwesomeIcon icon={faMessage} className="text-4xl text-gray-400" />
                        <p className="font-medium text-lg text-gray-800">Esplora & Interroga</p>
                        <p className="text-sm text-gray-600 text-center">Naviga i dataset GIS e usa il chatbot AI per ricerche e analisi avanzate</p>
                    </div>
                    <div className="flex flex-col space-y-4 items-center justify-center">
                        <div className="flex items-center justify-center text-white font-bold font-mono text-2xl w-15 h-15 rounded-full bg-green-600 shadow-lg shadow-green-500/50">
                            <span>03</span>
                        </div>
                        <FontAwesomeIcon icon={faFloppyDisk} className="text-4xl text-gray-400" />
                        <p className="font-medium text-lg text-gray-800">Salva Ricerche</p>
                        <p className="text-sm text-gray-600 text-center">Conserva i layer personalizzati creati dalle tue ricerche con il chatbot</p>
                    </div>
                </div>
            </section>

            {/* Chi fa cosa */}
            <section className=" bg-linear-to-r from-slate-950 to-slate-900 text-white flex flex-col space-y-1 sm:space-y-2 py-10 md:py-20 px-4 md:px-20 items-center justify-center text-wrap w-full">
                {/* Titolo */}
                <div className="text-center">
                    <span className="font-bold text-4xl tracking-wide font-stretch-ultra-expanded font-base tracking-wide">
                        Chi Fa Cosa
                    </span>
                </div>
                {/* Subtitolo */}
                <div className="text-center">
                    <span className="text-gray-300 text-base sm:text-lg tracking-wide font-stretch-ultra-expanded font-base tracking-wide">
                        Due ruoli, un&apos;unica piattaforma collaborativa
                    </span>
                </div>
                {/* Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-5 mt-10 md:mt-15 sm:mx-0">
                    {/* Card 1 */}
                    <div className="flex flex-col items-start justify-center space-y-6 bg-gradient-to-r from-violet-950 to-fuchsia-950 rounded-xl shadow-md px-6 py-10 cursor-pointer border border-violet-800">
                        <div className="w-15 h-15 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center rounded-2xl">
                            <FontAwesomeIcon icon={faDatabase} className="text-4xl text-white" />
                        </div>
                        <p className="font-bold text-2xl">Amministratori</p>
                        <ul className="text-sm md:text-base space-y-2 list-disc list-outside ml-5 marker:text-violet-500 text-gray-300 font-semibold">
                            <li>Caricano e gestiscono i dataset GeoJSON sulla piattaforma</li>
                            <li>Curano la qualità e l&apos;organizzazione dei dati geografici</li>
                            <li>Mantengono i dataset aggiornati e accessibili agli utenti</li>
                        </ul>
                    </div>


                    {/* Card 2 */}
                    <div className="flex flex-col items-start justify-center space-y-6 bg-gradient-to-r from-cyan-950 to-teal-950 rounded-xl shadow-md px-6 py-10 cursor-pointer border border-cyan-800">
                        <div className="w-15 h-15 bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center rounded-2xl">
                            <FontAwesomeIcon icon={faUsers} className="text-4xl text-white" />
                        </div>
                        <p className="font-bold text-2xl">Utenti</p>
                        <ul className="text-sm md:text-base space-y-2 list-disc list-outside ml-5 marker:text-cyan-500 text-gray-300 font-semibold">
                            <li>Navigano le mappe con i dataset caricati dagli amministratori</li>
                            <li>Interagiscono con il chatbot AI per ricerche e analisi avanzate</li>
                            <li>Salvano layer personalizzati creati dalle ricerche del chatbot</li>
                        </ul>
                    </div>


                    {/* Card 3 */}
                    <div className="md:col-span-2 text-center flex flex-col items-center justify-center text-gray-400 bg-gradient-to-r from-gray-900 to-gray-800 space-y-6 rounded-2xl shadow-md px-4 py-6 cursor-pointer border border-gray-600">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-4xl text-yellow-300" />
                        <p className="font-bold"> <span className="text-white">L&apos;account serve agli utenti</span> per salvare e organizzare i layer generati dalle interazioni con il chatbot, creando una libreria personalizzata di ricerche geospaziali.</p>
                    </div>
                </div>
            </section>
        </>
    )
}