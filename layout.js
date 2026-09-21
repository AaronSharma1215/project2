import "./globals.css";

export const metadata = {
  title: "Hearing Accommodations Platform",
  description: "School hearing-accessibility platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#F7F5FF] to-[#FFF3EF] text-[#14131F]">
        {children}
      </body>
    </html>
  );
}
