import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exact Diagonalization — Heisenberg Spin Chain',
  description: 'Interactive visualization of exact diagonalization for the 1D Heisenberg XXZ spin chain. Explore energy spectra, entanglement entropy, and quantum phase transitions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gunmetal text-pastel-petal antialiased`}>
        {children}
      </body>
    </html>
  );
}
