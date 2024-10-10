import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

interface Props {
  name: string;
  date: string;
  width?: number;
  height?: number;
}

interface Transform {
  width: number;
  height: number;
  quality: 50 | 75 | 100;
  format?: "auto" | "jpeg";
}

const BASE_URL = "/img/gallery";
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

export default function GalleryItem({ name, date, width, height }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const imageTransform = (transform: Transform) => {
    const format = transform.format ? transform.format : "auto";
    return `https://sydneyn.dev/cdn-cgi/image/width=${transform.width},height=${transform.height},quality=${transform.quality},format=${format}${BASE_URL}/${name}`;
  };
  return (
    <div className="m-1">
      <Button
        name={`Expand ${name}`}
        onClick={open}
        className="rounded-lg bg-mantle text-sm border-2 border-crust hover:border-mauve transition-all ease-in-out duration-75"
      >
        {/* TODO: better alt text */}
        <img
          className="rounded-lg"
          src={imageTransform({
            width: (width || DEFAULT_WIDTH) * 0.04,
            height: (height || DEFAULT_HEIGHT) * 0.04,
            quality: 100,
          })}
          alt={name}
          width={width}
          height={height}
        />
      </Button>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-screen-md rounded-xl bg-mantle border-2 border-crust p-2 duration-75 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="relative">
                <p>
                  {name} | {width}x{height} | {date}
                </p>
              </DialogTitle>
              <img
                className="rounded-lg my-2"
                src={imageTransform({
                  width: (width || DEFAULT_WIDTH) * 0.25,
                  height: (height || DEFAULT_HEIGHT) * 0.25,
                  quality: 100,
                })}
                width={width}
                height={height}
              />
              <Button
                name="Close expanded image"
                className="text-mauve hover:text-pink underline"
                onClick={close}
              >
                Close
              </Button>{" "}
              |{" "}
              <a
                href={imageTransform({
                  width: width || DEFAULT_WIDTH,
                  height: height || DEFAULT_HEIGHT,
                  quality: 100,
                  format: "jpeg",
                })}
                target="_blank"
              >
                View Original
              </a>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
