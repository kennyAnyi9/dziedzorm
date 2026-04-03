import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { LiquidGlassFilters } from "@/components/liquid-glass-filters";
import { Footer } from "@/components/footer";
import { NavigationSoundProvider } from "@/components/navigation-sound-provider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "KENNEDY ANYIDOHO",
  description: "My personal portolfio app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-mono", jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="font-mono antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <LiquidGlassFilters />
          <NavigationSoundProvider />
          {/*<DarkModeToggle />*/}
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
