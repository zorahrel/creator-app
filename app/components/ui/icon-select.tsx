import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

type IconSelectOption = {
  value: string;
  icon: React.ReactNode;
  label?: string;
};

interface IconSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: IconSelectOption[];
}

export const IconSelect: React.FC<IconSelectProps> = ({ value, onChange, options }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {options.find(option => option.value === value)?.icon}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center">
              {option.icon}
              {option.label && <span className="ml-2">{option.label}</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
