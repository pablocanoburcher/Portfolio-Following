'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Clock } from 'lucide-react';

interface UpdateReportsButtonProps {
  onUpdate: () => Promise<void>;
  cooldownRemainingMs: number;
  cooldownDurationMs: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function UpdateReportsButton({
  onUpdate,
  cooldownRemainingMs,
  cooldownDurationMs
}: UpdateReportsButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [remainingMs, setRemainingMs] = useState(cooldownRemainingMs);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update remaining time when prop changes
  useEffect(() => {
    setRemainingMs(cooldownRemainingMs);
  }, [cooldownRemainingMs]);

  // Countdown timer
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (remainingMs <= 0) return;

    intervalRef.current = setInterval(() => {
      setRemainingMs(prev => {
        const newValue = prev - 1000;
        return newValue <= 0 ? 0 : newValue;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [remainingMs]);

  const isOnCooldown = remainingMs > 0;

  const handleUpdate = async () => {
    if (isOnCooldown) return;

    setIsUpdating(true);
    try {
      await onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const isDisabled = isUpdating || isOnCooldown;

  return (
    <button
      onClick={handleUpdate}
      disabled={isDisabled}
      className={`flex items-center gap-2 px-6 py-3 ${
        isOnCooldown
          ? 'bg-dark-700 cursor-not-allowed'
          : isUpdating
          ? 'bg-dark-700 cursor-not-allowed animate-pulse'
          : 'bg-accent-blue hover:bg-blue-600 shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/30'
      } text-white font-medium rounded-lg transition-all ${
        isDisabled ? 'disabled:shadow-none' : ''
      }`}
    >
      {isOnCooldown ? (
        <>
          <Clock className="h-5 w-5" />
          <span>Available in {formatTime(remainingMs)}</span>
        </>
      ) : (
        <>
          <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Updating Reports...' : 'UPDATE REPORTS'}
        </>
      )}
    </button>
  );
}
