import type {Metadata} from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import QueryProvider from '@/components/query-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'EduCore LMS',
  description: 'Empower Every Learner. Manage Every Classroom.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                },
                success: {
                  iconTheme: { primary: '#4f772d', secondary: '#fff' },
                  style: { background: '#f0f7ea', color: '#1e3a0e', border: '1px solid #c5dfae' },
                },
                error: {
                  iconTheme: { primary: '#dc2626', secondary: '#fff' },
                  style: { background: '#fef2f2', color: '#7f1d1d', border: '1px solid #fecaca' },
                },
                loading: {
                  style: { background: '#f0f7ea', color: '#1e3a0e', border: '1px solid #c5dfae' },
                },
              }}
            />
            <QueryProvider>
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
