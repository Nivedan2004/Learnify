import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

export const metadata = {
  title: "Learnify — AI Course Generator",
  description:
    "Generate personalized study material, notes, flashcards, and quizzes with AI.",
};

const outfit=Outfit({subsets:['latin']});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={outfit.className}
      >
        <Provider>
        {children}
        </Provider>
      
      </body>
    </html>
    </ClerkProvider>
  );
}
