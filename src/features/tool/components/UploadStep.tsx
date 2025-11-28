"use client";

import { useState, DragEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import { SupportedFormatsGuide } from "@/features/tool";

interface UploadStepProps {
  onFileAccept: (file: File) => void;
  isLoading: boolean;
}

const SUPPORTED_FORMATS = ".csv, .json, .geojson";

/*
UploadStep - Step upload file con drag&drop e guida formati
Supporta CSV, JSON array, GeoJSON FeatureCollection
*/
export default function UploadStep({ onFileAccept, isLoading }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileAccept(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Area drag&drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-12 border-2 border-dashed rounded-xl text-center transition-colors${isDragging ? " border-blue-500 bg-blue-50" : " border-gray-300"
          }`}
      >
        {isLoading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analisi del file in corso...</p>
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faUpload} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Trascina un file o sceglilo dal tuo computer</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">File supportati: CSV, JSON, GeoJSON</p>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Scegli file
              <input
                type="file"
                className="hidden"
                accept={SUPPORTED_FORMATS}
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </label>
          </>
        )}
      </div>

      {/* Guida formati supportati */}
      <SupportedFormatsGuide />
    </div>
  );
}
