import type { Metadata } from 'next';
import './globals.css';
import ReactQueryClientProvider from './QueryClientProvider';

export const metadata: Metadata = {
  title: 'Mentorship Platform',
  description: 'Connect with experienced mentors for career guidance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
