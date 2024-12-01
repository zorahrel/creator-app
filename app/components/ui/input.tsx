import * as React from "react"
import { cn } from "~/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  after?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, after, ...props }, ref) => {
    return (
      <div className={cn(
        "flex h-8 w-full px-2.5 rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        after && "pr-[2px]",
        className
      )}>
        <input
          type={type}
          className="w-full py-1 text-sm bg-transparent border-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          {...props}
        />
        {after && <div className="flex items-center border-input">{after}</div>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
