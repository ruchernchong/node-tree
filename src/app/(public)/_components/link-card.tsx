"use client";

import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LinkCardProps {
  slug: string;
  title: string;
  url: string;
  icon: string | null;
  description: string | null;
  category: string | null;
}

export const LinkCard = ({
  slug,
  title,
  url,
  icon,
  description,
  category,
}: LinkCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event={`link-click-${slug}`}
      className="block transition-transform hover:scale-105"
    >
      <Card className="flex items-center gap-4 p-4 hover:bg-accent">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-2xl">
            {icon}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{title}</h3>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>

          {description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}

          {category && (
            <span className="text-xs text-muted-foreground">{category}</span>
          )}
        </div>
      </Card>
    </a>
  );
};
