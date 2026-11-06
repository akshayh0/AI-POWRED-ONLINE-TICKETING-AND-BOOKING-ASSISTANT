import type { Metadata } from 'next';
import './globals.css';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalFooter } from '@/components/layout/GlobalFooter';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'TicketEase AI — Karnataka Corridor & Chinnaswamy Match Platform',
  description:
    'AI-powered multimodal journey discovery, match passes, and high-speed corridor transit for Bengaluru and Mysuru.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: '#080B18', color: '#F8FAFC' }}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background-color: #080B18 !important;
                color: #F8FAFC !important;
                margin: 0;
                padding: 0;
              }
              a {
                color: inherit;
                text-decoration: none;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            `,
          }}
        />
      </head>
      <body
        style={{ backgroundColor: '#080B18', color: '#F8FAFC' }}
        className="bg-[#080B18] text-[#F8FAFC] font-['Inter'] antialiased min-h-screen flex flex-col selection:bg-[#8B5CF6]/30 selection:text-[#F8FAFC]"
      >
        <LanguageProvider>
          <GlobalHeader />
          <main className="w-full pt-16 flex-1 flex flex-col">{children}</main>
          <GlobalFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
