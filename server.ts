import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Example health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "ViralVibe Core" });
  });

  // Imagine this was for persistence or complex analytics
  app.post("/api/analytics/track", (req, res) => {
    // console.log("Tracking event:", req.body);
    res.json({ success: true });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ViralVibe engine online at http://localhost:${PORT}`);
  });
}

startServer();
