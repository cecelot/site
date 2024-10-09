import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

interface Props {
  name: string;
  date: string;
  width: string;
  height: string;
}

const BASE_URL = "/img/gallery";

export default function GalleryItem({ name, date, width, height }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const src = `${BASE_URL}/${name}`;

  return (
    <div className="m-1">
      <Button
        onClick={open}
        className="rounded-lg bg-mantle text-sm border-2 border-crust hover:border-mauve transition-all ease-in-out duration-200"
      >
        <img className="rounded-lg" src={src} width={width} height={height} />
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
                src={`${BASE_URL}/${name}`}
                width={width}
                height={height}
              />
              <Button className="text-mauve hover:underline" onClick={close}>
                Close
              </Button>{" "}
              |{" "}
              <a href={`${BASE_URL}/${name}`} target="_blank">
                View Original
              </a>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
