"use client";

import React, { memo } from "react";

interface GeneratedLinkModalProps {
  title: string;
  url: string;
  onClose: () => void;
  onCopy: () => void;
  onOpen: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const GeneratedLinkModal = memo(function GeneratedLinkModal({
  title,
  url,
  onClose,
  onCopy,
  onOpen,
}: GeneratedLinkModalProps) {
  // Truncate extremely long URLs to prevent rendering issues
  const displayUrl = url.length > 500 ? url.substring(0, 500) + "..." : url;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* URL Display */}
        <div className="mb-6">
          <p className="text-gray-700 mb-3 font-medium">
            URL to redirect users to Coinbase:
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-sm text-gray-800 break-all max-h-24 overflow-y-auto font-mono">
              {displayUrl}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCopy}
            className="w-full sm:w-1/2 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Copy URL
          </button>
          <button
            onClick={onOpen}
            className="w-full sm:w-1/2 bg-black-600 border-2 border-gray-300 hover:bg-black-700 text-black py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Open URL
          </button>
        </div>

        {/* Note */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            This link will redirect users directly to Coinbase to complete their
            purchase.
          </p>
        </div>
      </div>
    </div>
  );
});

export default GeneratedLinkModal;
