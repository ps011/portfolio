import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  CONTENT_FILES,
  assertContentFilename,
  readAllContentFiles,
  readContentFile,
} from "@/lib/content-source";
import { uploadJsonToCloudinary } from "@/lib/cloudinary-content";

function backupFilename(filename: string) {
  const base = filename.replace(/\.json$/, "");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `backups/${base}-${timestamp}.json`;
}

function isJsonSerializable(value: unknown) {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}

function validateContentShape(filename: string, data: unknown) {
  if (filename === "blogs.json" || filename === "gallery.json") {
    return Array.isArray(data);
  }

  return Boolean(data) && typeof data === "object" && !Array.isArray(data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!isAdminRequestAuthenticated(req.headers.cookie)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const content = await readAllContentFiles();
    return res.status(200).json({ files: CONTENT_FILES, content });
  }

  if (req.method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let filename;
  try {
    filename = assertContentFilename(req.body?.filename);
  } catch {
    return res.status(400).json({ error: "Unsupported content file" });
  }

  const data = req.body?.data;
  if (data === undefined || !isJsonSerializable(data)) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  if (!validateContentShape(filename, data)) {
    return res.status(400).json({ error: "Invalid content shape" });
  }

  try {
    const currentContent = await readContentFile(filename);
    await uploadJsonToCloudinary(backupFilename(filename), currentContent);
  } catch (err) {
    console.warn(`Unable to save backup for ${filename}`, err);
  }

  try {
    const result = await uploadJsonToCloudinary(filename, data);
    return res.status(200).json({
      saved: true,
      file: filename,
      url: result?.secure_url,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || "Unable to save content",
    });
  }
}
