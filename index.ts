import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import * as trpcExpress from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/trpc";
import prisma from "./config/prisma";
import axios from "axios";

// init express server
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // for parsing application/json
app.use(morgan("dev")); // for pretty logging

// ROUTES
app.get("/", (req, res) => {
  res.send("hello, world!");
});

// initialize trpc on express server with playground
const TRPC_ENDPOINT = "/trpc";
const TRPC_PLAYGROUND_ENDPOINT = "/trpc-playground";
app.use(
  TRPC_ENDPOINT,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
expressHandler({
  trpcApiEndpoint: TRPC_ENDPOINT,
  playgroundEndpoint: TRPC_PLAYGROUND_ENDPOINT,
  router: appRouter,
  // uncomment this if you're using superjson
  // request: {
  //   superjson: true,
  // },
}).then((handeler: any) => {
  app.use(handeler);
});

// start the express server
app.listen(port, () => {
  console.log(
    `[server]: Server is running at PORT ${port} at ${`http://localhost:${port}`}`
  );
});
