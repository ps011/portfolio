import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminLogoutCookie } from "@/lib/admin-auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Set-Cookie", createAdminLogoutCookie());
  return res.status(200).json({ authenticated: false });
}
