
// app/layout.tsx (Update existing layout)
import { Footer } from '@/components/footer';
import { LabsProvider } from '@/providers/LabsProvider';
import { Navigation } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <LabsProvider>
          <div className="min-h-screen">
            <Navigation />
            <main>{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </LabsProvider>
      </body>
    </html>
  );
}