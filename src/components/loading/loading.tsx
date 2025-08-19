"use client";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-white backdrop-blur-[32px] z-99999"
      // z-99999 to ensure it sits above everything, like your modal
    >
      <div className="relative rounded-3xl bg-white/10 dark:bg-gray-900/50 p-8 flex flex-col items-center gap-4 backdrop-filter backdrop-blur-lg">
        <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-white rounded-full"></div>
        <p className="text-white font-semibold text-lg">Loading...</p>
      </div>
    </div>
  );
}
