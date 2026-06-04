"use client";

import { useEffect, useState } from "react";

export default function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex h-[300px] w-full flex-col justify-end rounded-[20px] bg-hero bg-cover bg-dark-3 p-8">
      <div className="glassmorphism2 rounded-xl p-4 w-fit">
        <h1 className="text-5xl font-extrabold text-white lg:text-7xl">{time}</h1>
        <p className="mt-2 text-lg font-medium text-sky-200">{date}</p>
      </div>
    </div>
  );
}
