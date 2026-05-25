"use client";

import { useState } from "react";
import Image from "next/image";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
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

// react-photo-album expects every photo to declare width + height so it
// can build justified rows that respect each photo's native aspect ratio.
// If a photo is missing the sidecar dimensions (e.g. brand new upload,
// prebuild script hasn't been re-run yet), fall back to a 4:5 portrait
// guess so the layout doesn't crash.
const FALLBACK_W = 1800;
const FALLBACK_H = 2250;

export default function ProjectGallery({ photos, projectTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const albumPhotos = photos.map((p) => ({
    src: p.url,
    alt: p.alt,
    width: p.width ?? FALLBACK_W,
    height: p.height ?? FALLBACK_H,
    room: p.room,
    caption: p.caption,
  }));

  const slides = photos.map((p) => ({
    src: p.url,
    alt: p.alt,
    title: p.room,
    description: p.caption || p.alt,
  }));

  return (
    <>
      <div data-testid="project-photo-grid">
        <RowsPhotoAlbum
          photos={albumPhotos}
          spacing={12}
          targetRowHeight={(containerWidth) =>
            containerWidth < 640 ? 260 : containerWidth < 1024 ? 320 : 380
          }
          onClick={({ index: i }) => {
            setIndex(i);
            setOpen(true);
          }}
          render={{
            // RowsPhotoAlbum wraps each rendered image in its own clickable
            // anchor when onClick is provided, so we just return image +
            // overlays here (no inner button — would be invalid nesting).
            image: (_props, { photo, width, height, index: i }) => (
              <div
                className="group relative w-full h-full overflow-hidden bg-linen cursor-zoom-in"
                data-testid={`project-photo-${i}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt || ""}
                  width={width}
                  height={height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="block w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
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
              </div>
            ),
          }}
        />
      </div>

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
