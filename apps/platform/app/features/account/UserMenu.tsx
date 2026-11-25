import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@wibeblock/ui";
import { User } from "lucide-react";
import { Link } from "react-router";
import type { Profile } from "~/lib/accounts.server";

export function UserMenu({ profile }: { profile: Profile }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button intent="ghost">
          <Avatar size="sm">
            <AvatarImage src={profile.avatarUrl ?? undefined} />
            <AvatarFallback name={profile.displayName} />
          </Avatar>
          <span>{profile.displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User /> Profile
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
