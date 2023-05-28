import invariant from "tiny-invariant";

invariant(
  process.env.NEXT_PUBLIC_BASE_URL,
  "NEXT_PUBLIC_BASE_URL is not defined, change .env.sample filename to .env.development to fix it"
);

export const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Feature flag to control ballot box feature enrollment
export const FEATURE_BALLOT_BOX_REPORT =
  process.env.NEXT_PUBLIC_FEATURE_BALLOT_REPORT === "true";
