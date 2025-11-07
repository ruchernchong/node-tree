"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createLink, updateLink } from "@/actions/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { type LinkFormData, linkSchema } from "@/lib/schemas/link";

interface LinkFormProps {
  defaultValues?: Partial<LinkFormData> & { id?: string };
  mode: "create" | "edit";
}

export const LinkForm = ({ defaultValues, mode }: LinkFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      slug: defaultValues?.slug || "",
      title: defaultValues?.title || "",
      url: defaultValues?.url || "",
      icon: defaultValues?.icon || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || undefined,
      isActive: defaultValues?.isActive ?? true,
      startDate: defaultValues?.startDate,
      endDate: defaultValues?.endDate,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = async (data: LinkFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await createLink(data);
        toast.success("Link created successfully");
        router.push("/dashboard/links");
      } else if (defaultValues?.id) {
        await updateLink(defaultValues.id, data);
        toast.success("Link updated successfully");
        router.push("/dashboard/links");
      }
      router.refresh();
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
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          {...register("slug")}
          placeholder="my-link"
          className={errors.slug ? "border-red-500" : ""}
        />
        {errors.slug && (
          <p className="text-sm text-red-600">{errors.slug.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          This will be part of your URL: /{watch("slug")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="My Awesome Link"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          type="url"
          {...register("url")}
          placeholder="https://example.com"
          className={errors.url ? "border-red-500" : ""}
        />
        {errors.url && (
          <p className="text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="A short description of this link"
          className={errors.description ? "border-red-500" : ""}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue("isActive", checked)}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Active
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Link"
              : "Update Link"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
