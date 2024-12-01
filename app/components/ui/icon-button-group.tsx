import React from 'react';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { cn } from '~/lib/utils';

type IconButtonGroupOption = {
  value: string;
  icon: React.ReactNode;
  tooltip?: string;
  label?: string;
};

interface IconButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: IconButtonGroupOption[];
  className?: string;
  showLabels?: boolean;
}

export const IconButtonGroup: React.FC<IconButtonGroupProps> = ({ 
  value, 
  onChange, 
  options, 
  className,
  showLabels = false
}) => {
  return (
    <div className={cn("flex gap-[2px] flex-wrap", className)}>
      {options.map((option) => (
        <TooltipProvider key={option.value}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={value === option.value ? "default" : "ghost"}
                size={showLabels ? "sm" : "icon"}
                onClick={() => onChange(option.value)}
                className={cn(showLabels ? "gap-2" : "", {
                  "flex-1": showLabels
                })}
              >
                {option.icon}
                {showLabels && option.label && (
                  <span className="text-xs">{option.label}</span>
                )}
              </Button>
            </TooltipTrigger>
            {!showLabels && option.tooltip && <TooltipContent>{option.tooltip}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
