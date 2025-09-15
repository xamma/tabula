'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CSVPage() {
  const params = useParams();
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || '';
  const slug = decodeURIComponent(rawSlug);
  const [data, setData] = useState<Record<string, any>[]>([]);

  const fetchData = async () => {
    let parsed: Record<string, any>[] = [];

    const saved = localStorage.getItem(`csv-${encodeURIComponent(slug)}`);
    if (saved) {
      parsed = JSON.parse(saved);
    } else {
      // Try fetching from /public/csv/
      try {
        // Build safe URL
        const fileName = slug.endsWith('.csv') ? slug : `${slug}.csv`;
        const safeUrl = `/csv/${encodeURIComponent(fileName)}`;

        const res = await fetch(safeUrl);
        if (res.ok) {
          const text = await res.text();
          const Papa = (await import('papaparse')).default;
          const result = Papa.parse(text, { header: true, skipEmptyLines: true });
          parsed = result.data as Record<string, any>[];
        } else {
          console.warn(`CSV not found at ${safeUrl}`);
        }
      } catch (err) {
        console.error('Error fetching public CSV:', err);
      }
    }

    setData(parsed);
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
                  <td
                    key={i}
                    className="px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
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
