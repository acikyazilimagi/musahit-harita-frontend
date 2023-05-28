import { FEATURE_BALLOT_BOX_REPORT } from "@/env";

export const isBallotBoxReportFeatureEnabled = () => {
  return FEATURE_BALLOT_BOX_REPORT === true;
};
