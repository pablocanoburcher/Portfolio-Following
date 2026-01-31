'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface UpdateReportsButtonProps {
  onUpdate: () => Promise<void>;
}

export default function UpdateReportsButton({ onUpdate }: UpdateReportsButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={isUpdating}
      className={`flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-blue-600 disabled:bg-dark-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/30 disabled:shadow-none ${
        isUpdating ? 'animate-pulse' : ''
      }`}
    >
      <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} />
      {isUpdating ? 'Updating Reports...' : 'UPDATE REPORTS'}
    </button>
  );
}
