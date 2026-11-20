import { cn } from "../../lib/cn";
import { Button, type ButtonProps } from "../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { iconButtonVariants } from "./iconButtonVariants";

export type IconButtonProps = ButtonProps & { "aria-label": string };

export function IconButton({
  className,
  size,
  "aria-label": label,
  ...rest
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(iconButtonVariants({ size }), className)}
          size={size}
          aria-label={label}
          {...rest}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
