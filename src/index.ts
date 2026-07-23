import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastify from "fastify"
import path from "path"
import chokidar from "chokidar"

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
  return reply.view("index.ejs", { name: "User" });
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