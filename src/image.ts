import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { format, parse } from "date-format-parse";
import { baseUrl } from "../data/config.json";
import type { Transform } from "./types";
import ExifReader from "exifreader";
import { DateTime } from "luxon";

const imageBase = "https://c.sydneyn.dev/gallery";

export const transformImage = (name: string, transform: Transform) => {
  const format = transform.format ? transform.format : "auto";
  return `${baseUrl}/cdn-cgi/image/width=${transform.width},height=${transform.height},quality=${transform.quality},format=${format}/${imageBase}/${name}`;
};

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${import.meta.env.R2_ACCOUNT_ID!!}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID!!,
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY!!,
  },
});

const getImageKeys = async () => {
  const imageKeys = (
    await S3.send(
      new ListObjectsV2Command({
        Bucket: import.meta.env.R2_BUCKET_NAME,
      })
    )
  )
    .Contents!!.filter((object) => object.Key!!.startsWith("gallery"))
    .map((object) => object.Key!!);
  return imageKeys;
};

const getAllImages = async () => {
  const images = [];
  for (const key of await getImageKeys()) {
    const name = key?.split("/").pop()!!;
    images.push({
      name,
      blob: await (
        await S3.send(
          new GetObjectCommand({
            Bucket: import.meta.env.R2_BUCKET_NAME,
            Key: key,
          })
        )
      ).Body!!.transformToByteArray(),
    });
  }
  return images.map((image) => {
    const buf = Buffer.from(image.blob);
    const exifData = ExifReader.load(buf);
    const parsedDate = exifData["DateTime"] ? parse(
      exifData["DateTime"]?.description ?? "1970:01:01 00:00:00", "YYYY:MM:DD HH:mm:ss") : DateTime.fromISO(exifData["DateTimeOriginal"]?.description ?? "1970").toJSDate();
    const date = format(parsedDate, "DD MMM YYYY HH:mm");
    return {
      name: image.name,
      date,
      width: exifData["Image Width"]?.value,
      height: exifData["Image Height"]?.value,
    };
  });
};

export function useMemo<T>(fn: () => Promise<T>) {
  let value: T | undefined;
  return async () => {
    if (value === undefined) {
      value = await fn();
    }
    return value;
  };
}

export const allImages = useMemo(getAllImages);
