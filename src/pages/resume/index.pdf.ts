import type { APIRoute } from "astro";
import { mkdirSync, readFileSync } from "fs";

const CHROMIUM_PATH = "https://sydneyn.dev/blob/chromium-v123.0.0-pack.tar";

async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const chromium = await import("@sparticuz/chromium-min").then(
      (mod) => mod.default
    );

    const puppeteerCore = await import("puppeteer-core").then(
      (mod) => mod.default
    );

    const executablePath = await chromium.executablePath(CHROMIUM_PATH);

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    return browser;
  } else {
    const puppeteer = await import("puppeteer").then((mod) => mod.default);

    const browser = await puppeteer.launch();
    return browser;
  }
}

export const GET: APIRoute = async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  const url =
    process.env.VERCEL_ENV === "production"
      ? "https://sydneyn.dev"
      : "http://localhost:4321";
  await page.goto(`${url}/resume`, {
    waitUntil: "networkidle2",
  });
  try {
    mkdirSync("_downloads");
  } catch (_) {
    // already exists
  }
  await page.pdf({
    path: "_downloads/resume.pdf",
  });
  await browser.close();
  return new Response(readFileSync("_downloads/resume.pdf"), {
    headers: {
      "Content-Type": "application/pdf; charset=utf-8",
    },
  });
};
