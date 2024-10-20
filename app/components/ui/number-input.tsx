import React from 'react';
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

interface NumberInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min, max, step, unit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || (Number(newValue) >= (min || -Infinity) && Number(newValue) <= (max || Infinity))) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Label className="w-8 text-xs">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      {unit && <span className="text-xs text-gray-500">{unit}</span>}
    </div>
  );
};
