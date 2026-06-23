import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TraineeProvider } from "@/context/TraineeContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HeyShishu Training",
  description: "HeyShishu Nanny Training Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <TraineeProvider>
            <Toaster position="top-right" />
            {children}
          </TraineeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
