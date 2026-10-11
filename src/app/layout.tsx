import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { EscrowProvider } from '@/context/EscrowContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ViewBook | Sovereign Zero-Theft Escrow & Deliverable Vault',
  description:
    'Guaranteed milestone funding and theft-proof forensic deliverable vaults for high-ticket clients, freelancers, and agencies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#070a11] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <AuthProvider>
          <EscrowProvider>{children}</EscrowProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
