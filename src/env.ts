import { parseEnv } from "znv";
import { z } from "zod";

export const { API_URL } = parseEnv(process.env, {
  API_URL: {
    schema: z.string().url(),
    defaults: {
      development: "http://18.194.199.255",
      production: "http://18.194.199.255",
    },
  },
});
