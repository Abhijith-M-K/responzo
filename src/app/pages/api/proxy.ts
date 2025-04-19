import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { targetUrl } = req.query;
  const { method, headers, body } = req.body;

  if (!targetUrl || typeof targetUrl !== "string") {
    return res.status(400).json({ error: "Missing or invalid targetUrl" });
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    res.status(response.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
