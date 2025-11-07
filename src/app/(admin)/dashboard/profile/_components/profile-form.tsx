"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfileSettings } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ProfileFormData, profileSchema } from "@/lib/schemas/profile";

interface ProfileFormProps {
  email: string;
  defaultValues: ProfileFormData;
}

export const ProfileForm = ({ email, defaultValues }: ProfileFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const theme = watch("theme");
  const bio = watch("bio") || "";

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await updateProfileSettings(data);
      toast.success("Profile updated successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Your email cannot be changed here
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="displayName">Display Name *</Label>
        <Input
          id="displayName"
          {...register("displayName")}
          placeholder="Your name"
          className={errors.displayName ? "border-red-500" : ""}
        />
        {errors.displayName && (
          <p className="text-sm text-red-600">{errors.displayName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register("bio")}
          placeholder="Tell us about yourself"
          className={errors.bio ? "border-red-500" : ""}
          rows={4}
        />
        <div className="flex items-center justify-between">
          <div>
            {errors.bio && (
              <p className="text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {bio.length}/500 characters
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Theme *</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setValue("theme", "light")}
            disabled={isSubmitting}
          >
            Light
          </Button>
          <Button
            type="button"
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setValue("theme", "dark")}
            disabled={isSubmitting}
          >
            Dark
          </Button>
          <Button
            type="button"
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setValue("theme", "system")}
            disabled={isSubmitting}
          >
            System
          </Button>
        </div>
        {errors.theme && (
          <p className="text-sm text-red-600">{errors.theme.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
