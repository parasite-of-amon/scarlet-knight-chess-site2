import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupVite(app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientPath = path.resolve(__dirname, "..", "client");
      const template = fs.readFileSync(
        path.resolve(clientPath, "index.html"),
        "utf-8",
      );
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
