import fs from "node:fs";
import path from "node:path";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/**
 * Dev-only plugin that adds a POST /api/save-timetable endpoint
 * so the UI can persist timetable edits back to the source JSON files.
 */
function saveDataPlugin(): Plugin {
  return {
    name: "save-data",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== "/api/save-timetable" || req.method !== "POST") {
          return next();
        }

        let body = "";
        req.on("data", (chunk: string) => (body += chunk));
        req.on("end", () => {
          try {
            const { mode, data } = JSON.parse(body) as {
              mode: string;
              data: unknown;
            };

            const filename =
              mode === "regular"
                ? "timetable-regular.json"
                : "timetable-evening.json";

            const filepath = path.resolve(
              import.meta.dirname,
              "src/data",
              filename
            );

            fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + "\n");

            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    saveDataPlugin(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
