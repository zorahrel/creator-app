import React from 'react';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

type IconButtonGroupOption = {
  value: string;
  icon: React.ReactNode;
  tooltip?: string;
};

interface IconButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: IconButtonGroupOption[];
}

export const IconButtonGroup: React.FC<IconButtonGroupProps> = ({ value, onChange, options }) => {
  return (
    <div className="flex">
      {options.map((option) => (
        <TooltipProvider key={option.value}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={value === option.value ? "default" : "ghost"}
                size="icon"
                onClick={() => onChange(option.value)}
              >
                {option.icon}
              </Button>
            </TooltipTrigger>
            {option.tooltip && <TooltipContent>{option.tooltip}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
