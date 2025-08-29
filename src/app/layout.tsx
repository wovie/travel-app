import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { AppProvider } from '@/contexts/AppContext';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Travel App',
  description: 'Find new places to visit and plan your next trip',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.className}  antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
