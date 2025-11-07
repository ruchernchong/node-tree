import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  displayUsername: string | null;
  displayName: string;
  bio: string | null;
  image: string | null;
}

export const ProfileHeader = ({
  displayUsername,
  displayName,
  bio,
  image,
}: ProfileHeaderProps) => {
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src={image ?? undefined} alt={displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        {displayUsername && (
          <p className="text-sm text-muted-foreground">@{displayUsername}</p>
        )}
        {bio && <p className="text-muted-foreground">{bio}</p>}
      </div>
    </div>
  );
};
