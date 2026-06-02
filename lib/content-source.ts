import fs from "fs";
import path from "path";
import { buildCloudinaryRawUrl } from "./cloudinary-content";

export const CONTENT_FILES = [
  "site.json",
  "about.json",
  "blogs.json",
  "gallery.json",
] as const;

export type ContentFilename = (typeof CONTENT_FILES)[number];

const DATA_DIR = path.join(process.cwd(), "data");

export function isContentFilename(filename: string): filename is ContentFilename {
  return CONTENT_FILES.includes(filename as ContentFilename);
}

export function assertContentFilename(filename: string): ContentFilename {
  if (!isContentFilename(filename)) {
    throw new Error(`Unsupported content file: ${filename}`);
  }

  return filename;
}

export function getContentFileUrl(filename: ContentFilename) {
  const baseUrl = process.env.CONTENT_REMOTE_BASE_URL?.replace(/\/+$/, "");
  if (baseUrl) {
    return `${baseUrl}/${filename}`;
  }

  return buildCloudinaryRawUrl(filename);
}

function readLocalJsonFile<T>(filename: ContentFilename): T {
  const filePath = path.join(DATA_DIR, filename);
  let raw: string;

  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(`[data] Missing required file: ${filePath}`);
    }
    throw err;
  }

  try {
    return JSON.parse(raw) as T;
  } catch (err: any) {
    throw new Error(`[data] Malformed JSON in ${filePath}: ${err.message}`);
  }
}

export async function readContentFile<T>(filename: ContentFilename): Promise<T> {
  const remoteUrl = getContentFileUrl(filename);

  if (!remoteUrl) {
    return readLocalJsonFile<T>(filename);
  }

  const response = await fetch(remoteUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `[content] Failed to fetch ${filename}: ${response.status} ${response.statusText}`,
    );
  }

  try {
    return (await response.json()) as T;
  } catch (err: any) {
    throw new Error(`[content] Malformed JSON in ${remoteUrl}: ${err.message}`);
  }
}

export async function readAllContentFiles() {
  const entries = await Promise.all(
    CONTENT_FILES.map(async (filename) => [
      filename,
      await readContentFile(filename),
    ]),
  );

  return Object.fromEntries(entries) as Record<ContentFilename, unknown>;
}
