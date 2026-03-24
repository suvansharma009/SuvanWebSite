import Image from "next/image";
import type { GalleryImage } from "@/lib/site";

function isRemoteSrc(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type ContentImageGalleryProps = {
  images: GalleryImage[];
  className?: string;
};

/** Renders a responsive grid of images from `public/` paths or remote URLs. */
export function ContentImageGallery({ images, className = "" }: ContentImageGalleryProps) {
  if (!images?.length) return null;

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${className}`.trim()}
      role="group"
      aria-label="Photo gallery"
    >
      {images.map((img, i) => (
        <figure
          key={`${img.src}-${i}`}
          className="overflow-hidden rounded border border-[var(--color-ink)]/15 bg-neutral-100/50 shadow-sm"
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={900}
            height={675}
            className="aspect-[4/3] h-auto w-full object-cover"
            sizes="(max-width: 640px) 100vw, 420px"
            unoptimized={isRemoteSrc(img.src)}
          />
        </figure>
      ))}
    </div>
  );
}
