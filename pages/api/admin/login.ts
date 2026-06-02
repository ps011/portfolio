import type { NextApiRequest, NextApiResponse } from "next";
import {
  createAdminSessionCookie,
  createAdminSessionValue,
  isAdminPasswordValid,
} from "@/lib/admin-auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!isAdminPasswordValid(password)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  res.setHeader("Set-Cookie", createAdminSessionCookie(createAdminSessionValue()));
  return res.status(200).json({ authenticated: true });
}
