import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastify from "fastify"
import path from "path"

const fastifyInstance = fastify()

fastifyInstance.register(fastifyView, {
  engine: {
    ejs: require("ejs")
  },
  root: path.join(__dirname, "views")
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