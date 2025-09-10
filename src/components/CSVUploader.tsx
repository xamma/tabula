'use client';

import { useState } from 'react';
import Papa from 'papaparse';

export default function CSVUploader() {
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Encode filename for safe storage
          const safeName = encodeURIComponent(file.name);
          localStorage.setItem(`csv-${safeName}`, JSON.stringify(results.data));
          window.dispatchEvent(new Event('csv-update'));
          setError('');
        } catch (e) {
          setError('Failed to save CSV to localStorage');
        }
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label className="cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg font-medium flex items-center space-x-2 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0 0l-3-3m3 3l3-3M12 4v8"
          />
        </svg>
        <span>Upload CSV</span>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
      </label>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
