import "dotenv/config"
import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastify from "fastify"
import path from "path"
import ejs from "ejs"
import { prisma } from "./prisma/adapter"
import { generateRandomStr } from "./utils/identifiers"

const fastifyInstance = fastify()

fastifyInstance.register(fastifyView, {
  engine: { ejs },
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
      content,
      language: language || "plaintext"
    }
  });

  return reply.send({ id: paste.id });
})

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

fastifyInstance.listen({ port: PORT, host: HOST }, (err: any) => {
  if (err) throw err;

  console.log(`server listening on ${HOST}:${PORT}`);
})