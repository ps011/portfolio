import { createHash } from "crypto";

const DEFAULT_CONTENT_FOLDER = "portfolio-content";

function getRequiredCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary configuration");
  }

  return { cloudName, apiKey, apiSecret };
}

export function getCloudinaryContentFolder() {
  return (process.env.CONTENT_CLOUDINARY_FOLDER || DEFAULT_CONTENT_FOLDER)
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

export function buildCloudinaryPublicId(filename: string) {
  const folder = getCloudinaryContentFolder();
  return folder ? `${folder}/${filename}` : filename;
}

export function buildCloudinaryRawUrl(filename: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return null;

  const publicId = buildCloudinaryPublicId(filename)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
}

function signUploadParams(
  params: Record<string, string>,
  apiSecret: string,
) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

export async function uploadJsonToCloudinary(filename: string, data: unknown) {
  const { cloudName, apiKey, apiSecret } = getRequiredCloudinaryConfig();
  const publicId = buildCloudinaryPublicId(filename);
  const timestamp = Math.round(Date.now() / 1000).toString();
  const signedParams = {
    invalidate: "true",
    overwrite: "true",
    public_id: publicId,
    timestamp,
  };
  const signature = signUploadParams(signedParams, apiSecret);
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  const body = new FormData();

  body.append(
    "file",
    new Blob([payload], { type: "application/json" }),
    filename,
  );
  body.append("public_id", publicId);
  body.append("overwrite", "true");
  body.append("invalidate", "true");
  body.append("timestamp", timestamp);
  body.append("api_key", apiKey);
  body.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Cloudinary upload failed for ${filename}: ${response.status} ${response.statusText} ${message}`.trim(),
    );
  }

  return response.json();
}
