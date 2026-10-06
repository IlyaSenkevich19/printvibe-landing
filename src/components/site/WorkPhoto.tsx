import type { WorkImage } from "@/assets/work";

export function WorkPhoto({
  image,
  alt,
  sizes,
  className,
  loading = "lazy",
  priority = false,
}: {
  image: Pick<WorkImage, "src"> & Partial<Pick<WorkImage, "srcSet" | "width" | "height">>;
  alt: string;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
}) {
  const img = (
    <img
      src={image.src}
      alt={alt}
      {...(image.width !== undefined && { width: image.width })}
      {...(image.height !== undefined && { height: image.height })}
      {...(image.srcSet && { sizes })}
      loading={priority ? "eager" : loading}
      decoding="async"
      {...(priority && { fetchPriority: "high" as const })}
      className={className}
    />
  );

  if (!image.srcSet) return img;

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={image.srcSet} sizes={sizes} />
      {img}
    </picture>
  );
}
