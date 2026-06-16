import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZEUS Platform',
  description: 'Decentralized ecosystem for real estate, education & construction',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className="bg-zeus-bg text-zeus-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
