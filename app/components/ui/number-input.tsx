import React from 'react';
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Minus, Plus } from "lucide-react";
import { cn } from '~/lib/utils';

interface NumberInputProps {
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hideArrows?: boolean;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min, max, step, unit, hideArrows = false, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || (Number(newValue) >= (min || -Infinity) && Number(newValue) <= (max || Infinity))) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = Number(value) + 1;
    if (newValue <= (max || Infinity)) {
      onChange(newValue.toString());
    }
  };

  const handleDecrement = () => {
    const newValue = Number(value) - 1;
    if (newValue >= (min || -Infinity)) {
      onChange(newValue.toString());
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={cn("w-full", {
          "p-1 [&>input]:text-center": hideArrows
        })}
        after={!hideArrows && (
          <div className="flex">
            <button 
              onClick={handleDecrement} 
              className="h-full w-6 flex items-center justify-center hover:bg-gray-50 rounded-sm"
            >
              <Minus className="h-6 w-3 text-gray-500" />
            </button>
            <button 
              onClick={handleIncrement} 
              className="h-full w-6 flex items-center justify-center hover:bg-gray-50 rounded-sm"
            >
              <Plus className="h-6 w-3 text-gray-500" />
            </button>
          </div>
        )}
      />
      {unit && <span className="text-xs text-gray-500">{unit}</span>}
    </div>
  );
};
