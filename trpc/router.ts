import { z } from "zod";
import sampleRouter from "./sample.trpc";
import { publicProcedure, router } from "./trpc";

// combined router
export const appRouter = router({
  test: publicProcedure
    .input(
      z.object({
        hello: z.string(),
      })
    )
    .query((req) => {
      req.input; // string
      console.log(req);
      return { id: req.input, name: "world" };
    }),
  sample: sampleRouter,
});

// type definition of trpc API
export type AppRouter = typeof appRouter;
