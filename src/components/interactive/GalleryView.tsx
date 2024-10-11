import { useEffect, useState } from "react";
import GalleryItem from "./GalleryItem";

interface GalleryItemT {
  name: string;
  date: string;
  width?: number;
  height?: number;
}

interface GalleryProps {
  galleryItems: GalleryItemT[];
}

export default function GalleryView({ galleryItems }: GalleryProps) {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const index = searchParams.get("image");
    if (index) {
      setActiveItem(parseInt(index, 10));
    }
  });

  return (
    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] [grid-template-rows:masonry]">
      {galleryItems
        .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))
        .map((item, key) => (
          <GalleryItem
            key={key}
            id={key}
            name={item.name}
            date={item.date}
            width={item.width}
            height={item.height}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        ))}
    </div>
  );
}
