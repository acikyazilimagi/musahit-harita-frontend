import { parseEnv } from "znv";
import { z } from "zod";

export const { API_URL } = parseEnv(process.env, {
  API_URL: {
    schema: z.string().url(),
    defaults: {
      development: "https://backend.gonullu.io",
      production: "https://backend.gonullu.io",
    },
  },
});
