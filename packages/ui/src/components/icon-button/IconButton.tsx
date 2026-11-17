import { cn } from "../../lib/cn";
import { Button, type ButtonProps } from "../button";
import { iconButtonVariants } from "./iconButtonVariants";

export type IconButtonProps = ButtonProps & { "aria-label": string };

export function IconButton({ className, size, ...rest }: IconButtonProps) {
  return (
    <Button
      className={cn(iconButtonVariants({ size }), className)}
      size={size}
      {...rest}
    />
  );
}
