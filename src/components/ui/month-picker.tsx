'use client';

import { useState } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function MonthPicker({ value, onChange, placeholder = 'Pick a month', className }: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear, setViewYear] = useState(date?.getFullYear() ?? new Date().getFullYear());
  const selectedMonth = date && date.getFullYear() === viewYear ? date.getMonth() : -1;

  const displayText = date
    ? `${MONTHS_FULL[date.getMonth()]} ${date.getFullYear()}`
    : placeholder;

  const handleSelect = (monthIndex: number) => {
    const d = new Date(viewYear, monthIndex, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    onChange(`${yyyy}-${mm}-01`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'flex items-center gap-1 cursor-pointer flex-1 min-w-0 rounded border border-[#d1d5db] text-[0.88rem] bg-[#f9fafb] select-none hover:bg-gray-100 focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] p-[4px_6px]',
            !date && 'text-gray-400',
            className
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className="flex-1 min-w-0">{displayText}</span>
          <CalendarIcon className="w-[14px] h-[14px] shrink-0 text-gray-500" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start">
        {/* Year header */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setViewYear((y) => y - 1)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold">{viewYear}</span>
          <button
            type="button"
            onClick={() => setViewYear((y) => y + 1)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {MONTHS.map((month, idx) => (
            <button
              type="button"
              key={month}
              onClick={() => handleSelect(idx)}
              className={cn(
                "h-9 rounded-md text-[0.8rem] font-medium transition-colors",
                selectedMonth === idx
                  ? "bg-[#1f4f8f] text-white"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
