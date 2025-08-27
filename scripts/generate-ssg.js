import 'dotenv/config'
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, '..', p);

// These are the static routes that will be pre-rendered
const staticRoutes = ["/", "/terms", "/privacy", "/blog"];

const getStyleSheets = async () => {
  try {
    const assets = await fs.readdir(resolve("dist/client/assets"));
    const css = assets.filter((f) => f.endsWith(".css"));
    return css.map((file) => `<link rel="stylesheet" href="/assets/${file}">`).join("\n");
  } catch (e) {
    console.error("Could not get stylesheets", e);
    return "";
  }
};

async function generate() {
  console.log("Starting SSG generation...");

  try {
    const { render } = await import(resolve("./dist/server/entry-server.js"));
    const template = await fs.readFile(resolve("dist/client/index.html"), "utf-8");
    const stylesheets = await getStyleSheets();

    for (const url of staticRoutes) {
      const { html: appHtml } = render(url);
      const finalHtml = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`</head>`, `${stylesheets}</head>`);

      const dirPath = resolve(`dist/client${url === "/" ? "" : url}`);
      if (url !== "/") {
        await fs.mkdir(dirPath, { recursive: true });
      }
      const filePath = path.join(dirPath, "index.html");

      await fs.writeFile(filePath, finalHtml);
      console.log(`Pre-rendered: ${filePath}`);
    }

    console.log("SSG generation complete.");
  } catch (error) {
    console.error("Error during SSG generation:", error);
    process.exit(1);
  }
}

generate();
