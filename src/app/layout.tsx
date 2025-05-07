import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sala Video | YT",
  description: "A web site where you can see with u friends a youtube's video & one of us can take the control of the video to others completely. Enjoy the power",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
