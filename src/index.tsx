import "dotenv/config"
import { Hono } from "hono"
import { serveStatic } from "@hono/node-server/serve-static";
import { getPrisma } from "./prisma/adapter"
import { generateRandomStr } from "./utils/identifiers"
import { jsxRenderer } from 'hono/jsx-renderer'
import { Editor } from "./components/Editor"
import { rateLimitMiddleware } from "./middleware/rateLimit"

const app = new Hono()

async function cleanupExpiredPastes() {
  const prisma = await getPrisma();
  const now = new Date();
  const result = await prisma.paste.deleteMany({
    where: {
      OR: [
        { content: { equals: "" } },
        { expiryTime: null },
        { expiryTime: { lt: now } }
      ]
    }
  });
  console.log(`Cleaned up ${result.count} expired pastes`);
}

cleanupExpiredPastes();

app.use("/*", serveStatic({ root: "./public" }))

app.use(
  "*",
  jsxRenderer(({ children }: { children?: any }) => (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>WickyPastebin</title>
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

  if (paste.expiryTime && paste.expiryTime < new Date()) {
    return c.html("<h1>Paste has expired</h1>", 404);
  }

  return c.render(<Editor content={paste.content} language={paste.language} edit={false} />);
})

app.get("/:id/raw", async (c) => {
  const id = c.req.param("id");
  const paste = await (await getPrisma()).paste.findUnique({
    where: { id }
  });

  if (!paste) {
    return c.text("Paste not found", 404);
  }

  if (paste.expiryTime && paste.expiryTime < new Date()) {
    return c.text("Paste has expired", 404);
  }

  return c.text(paste.content, 200, {
    "Content-Type": "text/plain; charset=utf-8"
  });
})

app.post("/", rateLimitMiddleware, async (c) => {
  const { content, language, expiration } = await c.req.json();
  const prisma = await getPrisma();

  if (!content || content.trim().length === 0) {
    return c.json({ error: "Content is required" }, 400);
  }

  let id = generateRandomStr(10);
  let existing = await prisma.paste.findUnique({ where: { id } });
  let attempts = 0;

  while (existing && attempts < 10) {
    id = generateRandomStr(10);
    existing = await prisma.paste.findUnique({ where: { id } });
    attempts++;
  }

  let expiryTime: Date | null = null;
  // if (expiration && expiration !== 'never') {
  if (expiration) {
    const now = new Date();
    const days = parseInt(expiration);
    expiryTime = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  } else {
    // Default to 7 days if no expiration is set
    const now = new Date();
    expiryTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  const paste = await (await getPrisma()).paste.create({
    data: {
      id,
      content: content as string,
      language: (language as string) || "plaintext",
      expiryTime
    }
  });

  return c.json({ id: paste.id });
})

export default app;