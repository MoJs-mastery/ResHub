import React from "react";
import { Utensils } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center">
        {/* Glowing background ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-orange-200 opacity-60"></div>
        {/* Outer spinner */}
        <div className="h-16 w-16 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
        {/* Center icon */}
        <div className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
          <Utensils className="h-4 w-4 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium tracking-wide text-stone-500 animate-pulse">
        Preparing fresh experiences...
      </p>
    </div>
  );
}
