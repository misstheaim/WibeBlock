import {
  toastCloseVariants,
  toastDescriptionVariants,
  toastTitleVariants,
  toastVariants,
  toastViewportVariants,
} from "./toastVariants";
import { Toast as ToastPrimitive } from "radix-ui";
import { dismissToast, useToasts } from "./toastStore";
import { X } from "lucide-react";
import { IconButton } from "../icon-button";

export function Toaster() {
  const toasts = useToasts();
  return (
    <ToastPrimitive.Provider>
      {toasts.map((toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          open={toast.open}
          className={toastVariants({ tone: toast.tone })}
          onOpenChange={(open) => !open && dismissToast(toast.id)}
        >
          <ToastPrimitive.Title className={toastTitleVariants()}>
            {toast.title}
          </ToastPrimitive.Title>
          {toast.description && (
            <ToastPrimitive.Description className={toastDescriptionVariants()}>
              {toast.description}
            </ToastPrimitive.Description>
          )}
          <ToastPrimitive.Close asChild>
            <IconButton
              className={toastCloseVariants()}
              intent="ghost"
              size="sm"
              aria-label="Dismiss"
            >
              <X />
            </IconButton>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport
        className={toastViewportVariants()}
      ></ToastPrimitive.Viewport>
    </ToastPrimitive.Provider>
  );
}
