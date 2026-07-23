import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastify from "fastify"
import path from "path"
import chokidar from "chokidar"

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
  return reply.view("editor.ejs", { name: "User" });
})

fastifyInstance.get("/api/files", async (req: any, reply: any) => {
  return reply.send(Array.from(fileCache.values()));
})

fastifyInstance.get("/:id", async (req: any, reply: any) => {
  const id = req.params.id;
  const file = fileCache.get(id);
  if (!file) {
    return reply.code(404).send({ error: "File not found" });
  }
  return reply.send(file);
})

fastifyInstance.listen({ port: 3000 }, (err: any) => {
  if (err) throw err;
  console.log(`server listening on ${fastifyInstance?.server?.address()?.port}`);
})

const watcher = chokidar.watch([
  path.join(__dirname, "views"),
  path.join(__dirname, "public")
], {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

watcher.on("change", (path) => {
  console.log(`File changed: ${path}`)
})

watcher.on("add", (path) => {
  console.log(`File added: ${path}`)
})

watcher.on("unlink", (path) => {
  console.log(`File removed: ${path}`)
})
