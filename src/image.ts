import { format, parse } from "date-format-parse";
import type { Transform } from "./types";
import ExifReader from "exifreader";
const BASE_URL = "/img/gallery";

export const transformImage = (name: string, transform: Transform) => {
  const format = transform.format ? transform.format : "auto";
  return `https://sydneyn.dev/cdn-cgi/image/width=${transform.width},height=${transform.height},quality=${transform.quality},format=${format}${BASE_URL}/${name}`;
};

export const getAllImages = async () => {
  // This only exists on the server, but we also import this module on the client, so
  // use dynamic import for this.
  const { readdirSync, readFileSync } = await import("fs");

  return readdirSync("public/img/gallery")
    .filter(
      (name) =>
        name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")
    )
    .map((name) => {
      const fullPath = `public/img/gallery/${name}`;
      const buf = readFileSync(fullPath);
      const exifData = ExifReader.load(buf);
      const date = format(
        parse(
          exifData["DateTime"]?.description ?? "1970:01:01 00:00:00",
          "YYYY:MM:DD HH:mm:ss"
        ),
        "DD MMM YYYY HH:mm"
      );
      return {
        name,
        date,
        width: exifData["Image Width"]?.value,
        height: exifData["Image Height"]?.value,
      };
    });
};
