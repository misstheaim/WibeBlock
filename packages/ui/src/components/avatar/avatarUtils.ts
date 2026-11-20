export const avatarTones = [
  "secondary",
  "primary",
  "accent",
  "success",
  "warning",
] as const;

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getAvatarTone(name: string): (typeof avatarTones)[number] {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return avatarTones[sum % avatarTones.length];
}
