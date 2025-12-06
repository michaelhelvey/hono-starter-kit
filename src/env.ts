import { type InferOutput, object, optional, parse, string } from "valibot";

export const environmentSchema = object({
  SIGNING_SECRET: optional(string()),
  PORT: optional(string()),
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends InferOutput<typeof environmentSchema> {}
  }
}

parse(environmentSchema, process.env);
