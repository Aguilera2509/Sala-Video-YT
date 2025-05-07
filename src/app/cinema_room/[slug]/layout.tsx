import type { Metadata } from "next";
import "../../globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Cinema Room | YT",
  description: "Cinema Room get ready to control upon the video or see how other take the control.",
};

export default function SlugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}

      <Script src="https://www.youtube.com/iframe_api"></Script>
    </>
  );
}
