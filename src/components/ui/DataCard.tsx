"use client";

import { ReactNode } from 'react';
import { formatDate } from '@/utils/format';
import { CardData } from '@/types/CardData';

interface DataCardProps {
  data: CardData;        // Dati principali della scheda
  actions?: ReactNode;   // Elementi JSX per le azioni (es. bottoni)
  badges?: ReactNode;    // Badge o tag aggiuntivi
  stats?: ReactNode;     // Statistiche o metadati da mostrare
  footer?: ReactNode;    // Contenuto footer opzionale
}

export default function DataCard({
  data,
  actions,
  badges,
  stats,
  footer
}: DataCardProps) {
  return (
    <div className="flex flex-col space-y-1 rounded p-2 text-sm border border-gray-200 shadow-sm">

      {/* Header: titolo e azioni */}
      <div className="flex justify-between items-start overflow-hidden text-md">
        <span className="font-medium font-semibold text-gray-800 w-full break-words break-all">
          {data.name}
        </span>

        {/* Azioni JSX/TSX opzionali fornite dal chiamante */}
        {actions && <div className="flex gap-1">{actions}</div>}
      </div>

      {/* Descrizione */}
      {data.description && (
        <span className="text-xs text-gray-500">{data.description}</span>
      )}

      {/* Categoria e posizione */}
      {(data.category || data.location) && (
        <div className="flex gap-2 text-xs text-gray-400">
          {data.category && (
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
              {data.category}
            </span>
          )}
          {data.location && <span>📍 {data.location}</span>}
        </div>
      )}

      {/* Badges opzionali */}
      {badges && (
          <div className="flex flex-wrap gap-2 text-xs mt-2">{badges}</div>
      )
      }

      {/* Statistiche */}
      {stats && (
        <>
          <hr className='m-2 text-gray-200' />
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">{stats}</div>
        </>
      )}

      {/* Footer: usa il footer passato se presente, altrimenti mostra updatedAt se disponibile */}
      {footer ? (
        <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
          {footer}
        </div>
      ) : data.updatedAt ? (
        <span className="text-xs text-gray-400">
          Aggiornato: {formatDate(data.updatedAt)}
        </span>
      ) : null}
    </div>
  );
}
