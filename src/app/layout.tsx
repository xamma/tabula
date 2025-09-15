import './globals.css';
import Header from '../components/Header';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Tabula',
  description: 'Upload, view, and manage your CSV files with style',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen relative font-sans text-gray-800">
        {/* Full background image */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/modern-bg.jpg')" }}
        />

        {/* Optional subtle overlay */}
        <div className="absolute inset-0 -z-10 bg-white/30 dark:bg-black/30" />

        {/* Header stays on top */}
        <Header />

        {/* Main content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>

        {/* Footer stays on top */}
        <footer className="relative z-10 text-center py-6 text-gray-200">
          &copy; {new Date().getFullYear()} xammaops.win | All rights reserved.
        </footer>
      </body>
    </html>
  );
}
