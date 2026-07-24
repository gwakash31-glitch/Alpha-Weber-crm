import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Alpha Weber CRM | Business Growth OS', description: 'Mobile-first SaaS CRM and Business Growth Operating System for leads, clients, campaigns, WhatsApp workflows, and analytics.' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#05060d' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
