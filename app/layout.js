import "./globals.css";

export const metadata = {
  title: "OUR COACHING — Attendance & Operations",
  description: "Smart Attendance, Fees & Batch Operations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}