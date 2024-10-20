import React from 'react';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { cn } from "~/lib/utils";

interface IconButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
  onClick: () => void;
  isActive?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, tooltip, onClick, isActive = false }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn(
              "transition-colors",
              isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};
