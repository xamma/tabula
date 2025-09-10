'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CSVPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || '';
  const [data, setData] = useState<Record<string, any>[]>([]);

  const fetchData = () => {
    if (slug) {
      const saved = localStorage.getItem(`csv-${encodeURIComponent(slug)}`);
      setData(saved ? JSON.parse(saved) : []);
    }
  };

  useEffect(() => {
    fetchData();
    const listener = () => fetchData();
    window.addEventListener('csv-update', listener);
    return () => window.removeEventListener('csv-update', listener);
  }, [slug]);

  if (!data || data.length === 0) {
    return (
      <div className="mt-20 text-center text-gray-500 dark:text-gray-400 text-xl">
        No data found for <span className="font-semibold">{slug}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-300">{slug}</h1>

      <div className="overflow-x-auto rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {Object.values(row).map((value, i) => (
                  <td key={i} className="px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {value as string | number}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
        Total rows: {data.length}
      </p>
    </div>
  );
}
