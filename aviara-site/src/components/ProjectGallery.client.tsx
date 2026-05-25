"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import type { ProjectPhoto } from "@/data/portfolio";

type Props = {
  photos: ProjectPhoto[];
  projectTitle: string;
};

// Pick a grid + card shape that matches the project's photo mix:
//   - single photo  -> one big card spanning the row, native aspect
//   - all landscape -> 2-col grid of landscape cards (Fallbrook Estate)
//   - everything else -> 2-col mobile / 3-col desktop portrait cards
//     (uniform look Brooklyn liked; any landscape photo mixed in gets
//     center-cropped to fit, which is the trade-off for the cleaner grid)
function gridShape(photos: ProjectPhoto[]) {
  const single = photos.length === 1;
  const allLandscape =
    photos.length > 0 &&
    photos.every((p) => (p.width || 0) > (p.height || 0));
  if (single) {
    const p = photos[0];
    const landscape = (p.width || 0) > (p.height || 0);
    return {
      ulClass: "grid grid-cols-1 max-w-3xl mx-auto",
      itemClass: "",
      aspect: landscape ? "aspect-[3/2]" : "aspect-[4/5]",
    };
  }
  if (allLandscape) {
    return {
      ulClass: "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4",
      itemClass: "",
      aspect: "aspect-[3/2]",
    };
  }
  return {
    ulClass: "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4",
    itemClass: "",
    aspect: "aspect-[4/5]",
  };
}

export default function ProjectGallery({ photos, projectTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const { ulClass, itemClass, aspect } = gridShape(photos);

  // Lightbox slides — title only. Description was bleeding into the title
  // row and rendering as overlapping text; alt text already lives on the
  // image element for screen readers, so we don't need it in the caption.
  const slides = photos.map((p) => ({
    src: p.url,
    alt: p.alt,
    title: p.room || projectTitle,
  }));

  return (
    <>
      <ul className={ulClass} data-testid="project-photo-grid">
        {photos.map((photo, i) => (
          <li key={photo.url} className={`relative ${itemClass}`}>
            <button
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className={`group block w-full overflow-hidden bg-linen relative cursor-zoom-in ${aspect}`}
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${photo.alt}`}
              data-testid={`project-photo-${i}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading={i < 6 ? "eager" : "lazy"}
              />
              {photo.room && (
                <span
                  aria-hidden="true"
                  className="absolute top-3 left-3 z-10 text-[0.6rem] uppercase tracking-widest font-medium text-ivory bg-ink/55 backdrop-blur px-2 py-1"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                >
                  {photo.room}
                </span>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(28,24,21,0) 60%, rgba(28,24,21,0.45) 100%)",
                }}
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Captions, Counter, Thumbnails]}
        carousel={{ finite: false }}
        animation={{ fade: 300, swipe: 300 }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        thumbnails={{ position: "bottom", border: 0, gap: 8, imageFit: "cover" }}
        captions={{ showToggle: false, descriptionTextAlign: "center" }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(28,24,21,0.96)" },
          thumbnailsContainer: { backgroundColor: "rgba(28,24,21,0.96)" },
        }}
        on={{
          view: ({ index: i }) => setIndex(i),
        }}
        labels={{
          Previous: "Previous photo",
          Next: "Next photo",
          Close: `Close ${projectTitle} gallery`,
        }}
      />
    </>
  );
}
