"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface NumericInputDisplayProps {
  value: string;
  isExpense: boolean;
}

const NumericInputDisplay: FC<NumericInputDisplayProps> = ({ value, isExpense }) => {
  return (
    <div
      className={cn(
        "text-7xl md:text-8xl lg:text-9xl font-mono font-semibold transition-colors duration-300 ease-in-out select-none",
        isExpense ? "text-red-500" : "text-green-500"
      )}
    >
      {value}
    </div>
  );
};

export default NumericInputDisplay;
