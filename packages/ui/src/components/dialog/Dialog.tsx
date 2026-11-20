import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  dialogCloseVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from "./dialogVariants";
import { IconButton } from "../icon-button";
import { X } from "lucide-react";

export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(
  props: ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogClose(
  props: ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close {...props} />;
}

export function DialogContent({
  className,
  children,
  ...rest
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={dialogOverlayVariants()}
      ></DialogPrimitive.Overlay>
      <DialogPrimitive.Content
        className={cn(dialogContentVariants(), className)}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <IconButton
            className={dialogCloseVariants()}
            intent="ghost"
            size="sm"
            aria-label="Close"
          >
            <X />
          </IconButton>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cn(dialogHeaderVariants(), className)} {...rest} />;
}

export function DialogFooter({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cn(dialogFooterVariants(), className)} {...rest} />;
}

export function DialogTitle({
  className,
  ...rest
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(dialogTitleVariants(), className)}
      {...rest}
    />
  );
}

export function DialogDescription({
  className,
  ...rest
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn(dialogDescriptionVariants(), className)}
      {...rest}
    />
  );
}
