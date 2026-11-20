import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import {
  dropdownMenuContentVariants,
  dropdownMenuIndicatorVariants,
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
  dropdownMenuRadioItemVariants,
  dropdownMenuSeparatorVariants,
} from "./dropdownMenuVariants";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Check } from "lucide-react";

export function DropdownMenu(
  props: ComponentProps<typeof DropdownMenuPrimitive.Root>,
) {
  return <DropdownMenuPrimitive.Root {...props}></DropdownMenuPrimitive.Root>;
}

export function DropdownMenuTrigger(
  props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>,
) {
  return (
    <DropdownMenuPrimitive.Trigger {...props}></DropdownMenuPrimitive.Trigger>
  );
}

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...rest
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(dropdownMenuContentVariants(), className)}
        sideOffset={sideOffset}
        {...rest}
      ></DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  intent,
  ...rest
}: ComponentProps<typeof DropdownMenuPrimitive.Item> &
  VariantProps<typeof dropdownMenuItemVariants>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(dropdownMenuItemVariants({ intent }), className)}
      {...rest}
    ></DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuLabel({
  className,
  ...rest
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(dropdownMenuLabelVariants(), className)}
      {...rest}
    ></DropdownMenuPrimitive.Label>
  );
}

export function DropdownMenuSeparator({
  className,
  ...rest
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn(dropdownMenuSeparatorVariants(), className)}
      {...rest}
    ></DropdownMenuPrimitive.Separator>
  );
}

export function DropdownMenuRadioGroup(
  props: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>,
) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      {...props}
    ></DropdownMenuPrimitive.RadioGroup>
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...rest
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        dropdownMenuItemVariants(),
        dropdownMenuRadioItemVariants(),
        className,
      )}
      {...rest}
    >
      <span className={dropdownMenuIndicatorVariants()}>
        <DropdownMenuPrimitive.ItemIndicator>
          <Check />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}
