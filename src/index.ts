import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastify from "fastify"
import path from "path"
import { generateRandomStr } from "./utils/identifiers"

const fastifyInstance = fastify()

//Should've used database later...
const fileCache = new Map()

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
  const file = fileCache.get(id);
  const content = file?.content || "Content is not available";
  const language = file?.language || "plaintext";

  return reply.view("editor.ejs", { content, language, edit: false });
})

fastifyInstance.post("/", async (req: any, reply: any) => {
  const { content, language } = req.body;
  const id = generateRandomStr(10);
  fileCache.set(id, { id, content, language });

  console.log(`We now have ${fileCache.size} files in cache`);

  return reply.send({ id });
})

fastifyInstance.listen({ port: 3000 }, (err: any) => {
  if (err) throw err;
  console.log(`server listening on ${fastifyInstance?.server?.address()?.port}`);
})