import React from 'react';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

interface IconToggleProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  tooltip?: string;
}

export const IconToggle: React.FC<IconToggleProps> = ({ icon, isActive, onClick, tooltip }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            size="icon"
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};
