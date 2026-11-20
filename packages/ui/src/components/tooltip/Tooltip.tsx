import type { ComponentProps } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { tooltipContentVariants } from "./tooltipVariants";
import { cn } from "../../lib/cn";

export function TooltipProvider({
  delayDuration = 400,
  ...rest
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...rest} />;
}

export function TooltipTrigger(
  props: ComponentProps<typeof TooltipPrimitive.Trigger>,
) {
  return <TooltipPrimitive.Trigger {...props} />;
}

export function Tooltip(props: ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 6,
  ...rest
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(tooltipContentVariants(), className)}
        sideOffset={sideOffset}
        {...rest}
      />
    </TooltipPrimitive.Portal>
  );
}
