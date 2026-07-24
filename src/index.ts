import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastify from "fastify"
import path from "path"
import { prisma } from "./prisma/adapter"

const fastifyInstance = fastify()

fastifyInstance.register(fastifyView, {
  engine: {
    ejs: require("ejs")
  },
  root: path.join(__dirname, "views"),
  options: {
    cache: false
  }
})

fastifyInstance.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/"
})

fastifyInstance.get("/", async (req: any, reply: any) => {
  return reply.view("editor.ejs", { content: "", edit: true });
})

fastifyInstance.get("/favicon.ico", async (req: any, reply: any) => {
  return reply.code(404).send();
})

fastifyInstance.get("/:id", async (req: any, reply: any) => {
  const id = req.params.id;
  const paste = await prisma.paste.findUnique({
    where: { id }
  });

  if (!paste) {
    return reply.code(404).send({ error: "Paste not found" });
  }

  return reply.view("editor.ejs", { content: paste.content, language: paste.language, edit: false });
})

fastifyInstance.post("/", async (req: any, reply: any) => {
  const { content, language } = req.body;

  const paste = await prisma.paste.create({
    data: {
      content,
      language: language || "plaintext"
    }
  });

  return reply.send({ id: paste.id });
})

fastifyInstance.listen({ port: 3000 }, (err: any) => {
  if (err) throw err;

  const port = fastifyInstance?.server?.address()?.port;
  console.log(`server listening on ${port}`);
})