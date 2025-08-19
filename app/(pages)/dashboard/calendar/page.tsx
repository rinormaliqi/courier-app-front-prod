import Link from "next/link";
import React from "react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 mt-[-120px]">
      <div className="max-w-md text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#00b294]/10 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[#00b294]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Coming Soon
        </h1>
        <p className="text-gray-600 mb-6">
          This feature is still under construction. Check back soon!
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2 rounded-full bg-[#00b294] text-white hover:bg-[#019e83] transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
