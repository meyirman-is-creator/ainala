// src/components/ui/dropzone.tsx
"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  className?: string;
  onDrop: (acceptedFiles: File[]) => void;
}

export function Dropzone({ className, onDrop }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer transition-colors",
        isDragActive ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-gray-400"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Перетащите файлы сюда..."
            : "Перетащите файлы сюда или нажмите для выбора"}
        </p>
        <p className="text-xs text-gray-500">
          Поддерживаются файлы JPG, PNG и GIF до 10MB
        </p>
      </div>
    </div>
  );
}
