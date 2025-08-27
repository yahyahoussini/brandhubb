import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import compression from "compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const isProduction = process.env.NODE_ENV === "production";

const resolve = (p) => path.resolve(__dirname, p);

const getStyleSheets = async () => {
  if (!isProduction) return "";
  try {
    const assets = await fs.readdir(resolve("dist/client/assets"));
    const css = assets.filter((f) => f.endsWith(".css"));
    return css.map((file) => `<link rel="stylesheet" href="/assets/${file}">`).join("\n");
  } catch {
    return "";
  }
};

async function createServer() {
  const app = express();
  app.use(compression());

  let vite;
  if (!isProduction) {
    vite = await (
      await import("vite")
    ).createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use((await import("serve-static")).default(resolve("dist/client"), { index: false }));
  }

  const csrRoutes = ["/auth", "/blog/admin", "/blog/new", /^\/blog\/edit\/.+/];

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    const isCsr = csrRoutes.some((route) => {
      if (route instanceof RegExp) {
        return route.test(url);
      }
      return url === route;
    });

    try {
      let template;
      if (!isProduction) {
        template = await fs.readFile(resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = await fs.readFile(resolve("dist/client/index.html"), "utf-8");
      }

      let appHtml = "";
      if (!isCsr) {
        let render;
        if (!isProduction) {
          render = (await vite.ssrLoadModule("/src/app/entry-server.tsx")).render;
        } else {
          render = (await import("./dist/server/entry-server.js")).render;
        }
        const rendered = render(url);
        appHtml = rendered.html;
      }

      const stylesheets = await getStyleSheets();
      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`</head>`, `${stylesheets}</head>`);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (vite) vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  return { app };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log("HTTP server is running at http://localhost:5173");
    })
  );
}
