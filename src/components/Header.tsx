'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [files, setFiles] = useState<string[]>([]);
  const pathname = usePathname();

  const fetchFiles = () => {
    const keys = Object.keys(localStorage)
      .filter((key) => key.startsWith('csv-'))
      .map((key) => decodeURIComponent(key.replace('csv-', ''))); // decode for display
    setFiles(keys);
  };

  useEffect(() => {
    fetchFiles();
    const listener = () => fetchFiles();
    window.addEventListener('csv-update', listener);
    return () => window.removeEventListener('csv-update', listener);
  }, []);

  const deleteFile = (slug: string) => {
    if (confirm(`Are you sure you want to delete "${slug}"?`)) {
      localStorage.removeItem(`csv-${encodeURIComponent(slug)}`); // encode to match storage
      window.dispatchEvent(new Event('csv-update'));
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-500 transition"
        >
          Tabula | xammaops.win
        </Link>

        <nav className="flex items-center space-x-4 overflow-x-auto">
          {files.length === 0 ? (
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              No files uploaded
            </span>
          ) : (
            files.map((slug) => {
              const encodedSlug = encodeURIComponent(slug);
              return (
                <div key={slug} className="flex items-center space-x-1">
                  <Link
                    href={`/files/${encodedSlug}`}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition whitespace-nowrap ${
                      pathname === `/files/${encodedSlug}`
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {slug}
                  </Link>
                  <button
                    onClick={() => deleteFile(slug)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold transition"
                    title="Delete file"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </nav>
      </div>
    </header>
  );
}
