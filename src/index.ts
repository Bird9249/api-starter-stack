import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import "reflect-metadata";
import { ValiError, flatten } from "valibot";
import authRouter from "./modules/users/routers/auth.router";
import permissionRouter from "./modules/users/routers/permissions.router";
import roleRouter from "./modules/users/routers/role.router";
import userRouter from "./modules/users/routers/user.router";

const app = new Hono();

app
  .use("/public/*", serveStatic({ root: "./" }))
  .use(cors())

  .get("/ui", swaggerUI({ url: "public/openapi.yml" }))
  .route("/auth", authRouter)
  .route("/users", userRouter)
  .route("/roles", roleRouter)
  .route("/permissions", permissionRouter)
  .onError((err, c) => {
    switch (true) {
      case err instanceof ValiError:
        return c.json(flatten(err), 400);

      case err instanceof HTTPException:
        return c.json({ message: err.message }, err.status);

      default:
        console.log(err);

        return c.json(err, 500);
    }
  });

console.log(`application run on port: ${process.env.PORT}`);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
