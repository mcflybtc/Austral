import "@/app/globals.css";
export const metadata = { title: "Astro App", description: "Astronomy data via astronomy.ts" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="pt-br"><body>{children}</body></html>); }
