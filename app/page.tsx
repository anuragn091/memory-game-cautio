'use client';

import MemoryGame from "@/components/MemoryGame/MemoryGame";

export default function Home() {
  return (
    <div className="font-sans min-h-screen w-full">
     <main className="w-full">
      <MemoryGame />
    </main>
    </div>
  );
}
