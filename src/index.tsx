import "dotenv/config"
import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { prisma } from "./prisma/adapter"
import { generateRandomStr } from "./utils/identifiers"
import { jsxRenderer } from 'hono/jsx-renderer'
import { Editor } from "./components/Editor"

const app = new Hono()

app.use("/*", serveStatic({ root: "./src/public" }))

app.use(
  "*",
  jsxRenderer(({ children }: { children?: any }) => (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Pastebin</title>
      </head>
      <body>{children}</body>
    </html>
  ))
)

app.get("/", (c) => {
  return c.render(<Editor content="" edit={true} />)
})

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const paste = await prisma.paste.findUnique({
    where: { id }
  });

  if (!paste) {
    return c.html("<h1>Paste not found</h1>", 404);
  }

  return c.render(<Editor content={paste.content} language={paste.language} edit={false} />);
})

app.post("/", async (c) => {
  const { content, language } = await c.req.json();

  let id = generateRandomStr(10);
  let existing = await prisma.paste.findUnique({ where: { id } });
  let attempts = 0;

  while (existing && attempts < 10) {
    id = generateRandomStr(10);
    existing = await prisma.paste.findUnique({ where: { id } });
    attempts++;
  }

  const paste = await prisma.paste.create({
    data: {
      id,
      content: content as string,
      language: (language as string) || "plaintext"
    }
  });

  return c.json({ id: paste.id });
})

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

export default {
  port: PORT,
  host: HOST,
  fetch: app.fetch
};