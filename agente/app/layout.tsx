import "./globals.css";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-[#E5E7EB] min-h-screen">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
