import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface License {
  name: string;
  text: string;
}

interface LicenseProps {
  licenses: License[];
}

export default function LicenseList({ licenses }: LicenseProps) {
  return (
    <div className="flex flex-col space-y-3">
      {licenses.map(({ name, text }) => (
        <Disclosure key={name}>
          {({ open }) => (
            <div className="bg-mantle rounded-md p-3">
              <DisclosureButton className="flex flex-wrap items-center gap-2">
                <ChevronDownIcon
                  className={clsx(
                    "w-5 transition-all duration-75",
                    open && "rotate-180"
                  )}
                />
                <p className="font-semibold text-sm md:text-xl lg:text-2xl">
                  {name}
                </p>
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="origin-top transition duration-75 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
              >
                <hr className="w-1" />
                <p className="border-t-2 border-crust pt-5 m-4">{text}</p>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
