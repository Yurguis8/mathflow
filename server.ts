import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 5173;

  app.use(express.json());

  // API Routes
  app.get("/api/topics", (req, res) => {
    try {
      const data = fs.readFileSync(path.join(process.cwd(), "data", "topics.json"), "utf-8");
      const topics = JSON.parse(data);
      // Return only essential info for listing
      res.json(topics.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        icon: t.icon,
        difficulty: t.difficulty
      })));
    } catch (error) {
      res.status(500).json({ error: "Erro ao carregar assuntos" });
    }
  });

  app.get("/api/topics/:id", (req, res) => {
    try {
      const data = fs.readFileSync(path.join(process.cwd(), "data", "topics.json"), "utf-8");
      const topics = JSON.parse(data);
      const topic = topics.find((t: any) => t.id === req.params.id);
      if (topic) {
        res.json(topic);
      } else {
        res.status(404).json({ error: "Assunto não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao carregar assunto" });
    }
  });

  app.get("/api/exercises/:topicId", (req, res) => {
    try {
      const data = fs.readFileSync(path.join(process.cwd(), "data", "exercises.json"), "utf-8");
      const exercisesMap = JSON.parse(data);
      const exercises = exercisesMap[req.params.topicId];
      if (exercises) {
        res.json(exercises);
      } else {
        res.status(404).json({ error: "Exercícios não encontrados para este assunto" });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao carregar exercícios" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
