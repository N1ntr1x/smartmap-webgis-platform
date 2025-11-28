"use client"

import { ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { faChartSimple, faShield, faDatabase, faHands } from "@fortawesome/free-solid-svg-icons";

import { Logo } from "@/components/layout";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

/*
AuthLayout - Layout per pagine autenticazione (login/register)
Split screen con features a sinistra e form a destra
*/
export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row md:h-full items-center justify-center lg:gap-12 xl:gap-20 px-5 py-8 bg-white text-gray-900">

      {/* Sezione sinistra - Features prodotto */}
      <div className="w-full sm:w-xl lg:w-1/2 xl:max-w-xl flex flex-col justify-center space-y-6 mb-8 lg:mb-0">

        <Logo textSize="text-2xl" />

        <div className="text-base lg:text-lg text-gray-700">
          La soluzione completa per visualizzare, analizzare e gestire i tuoi dati geografici con tecnologie all'avanguardia.
        </div>

        {/* Grid features principali */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="py-3 px-3 flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-green-100 rounded-lg text-xl py-2 px-2 text-green-700 flex-shrink-0">
              <FontAwesomeIcon icon={faMap} />
            </div>
            <div className="flex flex-col ml-3">
              <span className="font-semibold text-sm lg:text-base">Mappe Interattive</span>
              <span className="text-xs lg:text-sm text-gray-500">
                Visualizza e naviga i tuoi dati geografici in tempo reale
              </span>
            </div>
          </div>

          <div className="py-3 px-3 flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-cyan-100 rounded-lg text-xl py-2 px-2 text-cyan-700 flex-shrink-0">
              <FontAwesomeIcon icon={faChartSimple} />
            </div>
            <div className="flex flex-col ml-3">
              <span className="font-semibold text-sm lg:text-base">Analisi Dati</span>
              <span className="text-xs lg:text-sm text-gray-500">
                Estrai insight dai tuoi dati con strumenti avanzati
              </span>
            </div>
          </div>

          <div className="py-3 px-3 flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 rounded-lg text-xl py-2 px-2 text-blue-700 flex-shrink-0">
              <FontAwesomeIcon icon={faShield} />
            </div>
            <div className="flex flex-col ml-3">
              <span className="font-semibold text-sm lg:text-base">Sicurezza</span>
              <span className="text-xs lg:text-sm text-gray-500">
                I tuoi dati protetti con crittografia avanzata
              </span>
            </div>
          </div>

          <div className="py-3 px-3 flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-orange-100 rounded-lg text-xl py-2 px-2 text-orange-700 flex-shrink-0">
              <FontAwesomeIcon icon={faDatabase} />
            </div>
            <div className="flex flex-col ml-3">
              <span className="font-semibold text-sm lg:text-base">Database Scalabile</span>
              <span className="text-xs lg:text-sm text-gray-500">
                Gestisci milioni di punti dati senza compromessi
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Sezione destra - Form autenticazione */}
      <div className="w-sm px-2 mb-20 lg:mb-0 md:px-2 md:w-md select-none">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">

          <div className="text-center lg:mb-8">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="flex items-center justify-center text-sm text-gray-500 bg-green-50 rounded-lg my-4 py-3 px-4 shadow">
                <FontAwesomeIcon icon={faHands} color="pink" size="xl" className="pr-4" />
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
