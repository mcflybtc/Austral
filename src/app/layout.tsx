import "@/app/globals.css";
export const metadata = { title: "Lyra Orrery", description: "Astronomy data via astronomy.ts" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
