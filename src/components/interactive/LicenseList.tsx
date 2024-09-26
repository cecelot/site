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
    <section>
      <ul className="flex flex-col space-y-3">
        {licenses.map(({ name, text }) => (
          <Disclosure key={name} as="div" id={name}>
            {({ open }) => (
              <li className="bg-mantle rounded-md p-3">
                <DisclosureButton className="flex flex-wrap items-center gap-2">
                  <ChevronDownIcon
                    width={20}
                    className={clsx(
                      "w-5 transition-all duration-75",
                      open && "rotate-180",
                    )}
                  />
                  <h1 className="font-semibold text-sm md:text-xl lg:text-2xl">
                    {name}
                  </h1>
                </DisclosureButton>
                <DisclosurePanel
                  transition
                  className="origin-top transition duration-75 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                >
                  <p
                    className="border-t-2 border-crust pt-5 m-4"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                </DisclosurePanel>
              </li>
            )}
          </Disclosure>
        ))}
      </ul>
    </section>
  );
}
