import "dotenv/config"
import { Hono } from "hono"
import { serveStatic } from "@hono/node-server/serve-static";
import { getPrisma } from "./prisma/adapter"
import { generateRandomStr } from "./utils/identifiers"
import { jsxRenderer } from 'hono/jsx-renderer'
import { Editor } from "./components/Editor"

const app = new Hono()

app.use("/*", serveStatic({ root: "./public" }))

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
  const paste = await (await getPrisma()).paste.findUnique({
    where: { id }
  });

  if (!paste) {
    return c.html("<h1>Paste not found</h1>", 404);
  }

  return c.render(<Editor content={paste.content} language={paste.language} edit={false} />);
})

app.post("/", async (c) => {
  const { content, language } = await c.req.json();
  const prisma = await getPrisma();

  let id = generateRandomStr(10);
  let existing = await prisma.paste.findUnique({ where: { id } });
  let attempts = 0;

  while (existing && attempts < 10) {
    id = generateRandomStr(10);
    existing = await prisma.paste.findUnique({ where: { id } });
    attempts++;
  }

  const paste = await (await getPrisma()).paste.create({
    data: {
      id,
      content: content as string,
      language: (language as string) || "plaintext"
    }
  });

  return c.json({ id: paste.id });
})

export default app;