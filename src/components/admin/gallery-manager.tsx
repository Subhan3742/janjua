"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Star, Trash2, Upload } from "lucide-react";
import { createGalleryItem, deleteGalleryItem, toggleGalleryFeatured } from "@/app/actions/admin";
import { EmptyState, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_CATEGORIES } from "@/lib/site";
import { cn, formatDate, slugify } from "@/lib/utils";
import type { GalleryImage } from "@/types/database";

const MAX_BYTES = 5 * 1024 * 1024;

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const pickFile = (nextFile: File | null) => {
    setMessage(null);

    if (!nextFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setMessage({ tone: "error", text: "Please choose an image file." });
      return;
    }

    if (nextFile.size > MAX_BYTES) {
      setMessage({ tone: "error", text: "Images must be 5 MB or smaller." });
      return;
    }

    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    if (!title) setTitle(nextFile.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setDescription("");
    setFeatured(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage({ tone: "error", text: "Choose an image to upload." });
      return;
    }
    if (title.trim().length < 2) {
      setMessage({ tone: "error", text: "Add a title for this image." });
      return;
    }

    setUploading(true);
    const supabase = createClient();

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const storagePath = `${category.toLowerCase()}/${Date.now()}-${slugify(title) || "image"}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, file, { cacheControl: "31536000", upsert: false });

    if (uploadError) {
      setUploading(false);
      setMessage({
        tone: "error",
        text: "Upload failed. Check that the `gallery` storage bucket exists and you are signed in.",
      });
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(storagePath);

    const result = await createGalleryItem({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      is_featured: featured,
      image_url: publicUrl,
      storage_path: storagePath,
    });

    setUploading(false);

    if (!result.ok) {
      // Keep storage clean if the row could not be written.
      await supabase.storage.from("gallery").remove([storagePath]);
      setMessage({ tone: "error", text: result.message });
      return;
    }

    resetForm();
    setMessage({ tone: "ok", text: "Image added to the gallery." });
    router.refresh();
  };

  const toggleFeatured = (image: GalleryImage) => {
    setBusyId(image.id);
    startTransition(async () => {
      await toggleGalleryFeatured(image.id, !image.is_featured);
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = (image: GalleryImage) => {
    if (!window.confirm(`Delete "${image.title}" permanently?`)) return;

    setBusyId(image.id);
    startTransition(async () => {
      await deleteGalleryItem(image.id, image.storage_path);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Panel className="h-fit">
        <h2 className="font-display text-xl font-light text-cream">Upload image</h2>
        <p className="mt-2 text-[13px] text-cream/40">
          JPEG, PNG or WebP up to 5 MB. Files are stored in the Supabase <code>gallery</code>{" "}
          bucket.
        </p>

        <form onSubmit={upload} className="mt-7 space-y-6">
          <div>
            <label
              htmlFor="gallery-file"
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-8 text-center transition-colors",
                preview ? "border-gold/40" : "border-cream/15 hover:border-gold/50",
              )}
            >
              {preview ? (
                // Local blob preview — next/image is not useful before upload.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Selected image preview" className="max-h-44 w-auto" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gold" strokeWidth={1.2} />
                  <span className="mt-3 text-[13.5px] text-cream/55">
                    Click to choose an image
                  </span>
                </>
              )}
            </label>
            <input
              ref={fileRef}
              id="gallery-file"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
            />
            {file ? (
              <button
                type="button"
                onClick={resetForm}
                className="mt-3 text-[12px] tracking-[0.12em] text-cream/40 uppercase transition-colors hover:text-gold"
              >
                Remove selection
              </button>
            ) : null}
          </div>

          <Field label="Title" htmlFor="gallery-title" tone="dark" required>
            <Input
              id="gallery-title"
              tone="dark"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Living room blackout curtains"
            />
          </Field>

          <Field label="Description" htmlFor="gallery-description" tone="dark">
            <Textarea
              id="gallery-description"
              tone="dark"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional — shown in the lightbox."
            />
          </Field>

          <Field label="Category" htmlFor="gallery-category" tone="dark" required>
            <Select
              id="gallery-category"
              tone="dark"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {GALLERY_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Checkbox
            tone="dark"
            label="Feature on the home page"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />

          {message ? (
            <p
              className={cn(
                "border px-4 py-3 text-[13px]",
                message.tone === "ok"
                  ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-300"
                  : "border-red-500/30 bg-red-500/5 text-red-400",
              )}
              role="status"
            >
              {message.text}
            </p>
          ) : null}

          <Button type="submit" variant="gold" size="md" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
                Uploading
              </>
            ) : (
              "Add to Gallery"
            )}
          </Button>
        </form>
      </Panel>

      <div>
        {images.length === 0 ? (
          <EmptyState
            title="No gallery images yet"
            description="Uploaded images appear on the public gallery page immediately."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {images.map((image) => (
              <figure
                key={image.id}
                className="group flex flex-col border border-cream/8 bg-ink/45"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {image.is_featured ? (
                    <span className="absolute top-3 left-3 flex items-center gap-1.5 border border-gold/50 bg-ink/80 px-2.5 py-1 text-[10px] tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-current" strokeWidth={0} />
                      Featured
                    </span>
                  ) : null}
                </div>

                <figcaption className="flex flex-1 flex-col p-4">
                  <p className="text-[14.5px] text-cream">{image.title}</p>
                  <p className="mt-1 text-[12.5px] text-cream/35">
                    {image.category} · {formatDate(image.created_at)}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-cream/8 pt-4">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(image)}
                      disabled={pending && busyId === image.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase transition-colors disabled:opacity-40",
                        image.is_featured
                          ? "text-gold hover:text-gold-light"
                          : "text-cream/40 hover:text-gold",
                      )}
                    >
                      <Star
                        className={cn("h-3.5 w-3.5", image.is_featured && "fill-current")}
                        strokeWidth={1.4}
                      />
                      {image.is_featured ? "Featured" : "Feature"}
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(image)}
                      disabled={pending && busyId === image.id}
                      aria-label={`Delete ${image.title}`}
                      className="text-cream/30 transition-colors hover:text-red-400 disabled:opacity-40"
                    >
                      {pending && busyId === image.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.4} />
                      ) : (
                        <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
