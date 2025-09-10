'use client';

import CSVUploader from '../components/CSVUploader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [files, setFiles] = useState<string[]>([]);
  const router = useRouter();

  const fetchFiles = () => {
    const keys = Object.keys(localStorage)
      .filter((key) => key.startsWith('csv-'))
      // decode for display
      .map((key) => decodeURIComponent(key.replace('csv-', '')));
    setFiles(keys);
  };

  useEffect(() => {
    fetchFiles();
    const listener = () => fetchFiles();
    window.addEventListener('csv-update', listener);
    return () => window.removeEventListener('csv-update', listener);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-transparent">
      {/* Upload Section */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 flex flex-col items-center space-y-6 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Tabula CSV viewer
        </h1>
        <p className="text-gray-500 text-center">
          Upload your CSV files and manage them effortlessly.
        </p>
        <CSVUploader />
      </div>

      {/* Uploaded CSV Cards */}
      <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {files.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center mt-10 text-lg">
            No CSV files uploaded yet.
          </p>
        ) : (
          files.map((file) => (
            <div
              key={file}
              onClick={() => router.push(`/files/${encodeURIComponent(file)}`)}
              className="cursor-pointer bg-white rounded-3xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-semibold text-gray-900 truncate">
                {file}
              </h3>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-400 text-sm">Click to view</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${file}"?`)) {
                      // encode to match localStorage key
                      localStorage.removeItem(`csv-${encodeURIComponent(file)}`);
                      window.dispatchEvent(new Event('csv-update'));
                    }
                  }}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Delete file"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
