import {
  invalidateIntensityData,
  useNeighborhoodIntensityData,
} from "@/features/intensity-data";
import { useEventType } from "@/stores/mapStore";
import { EVENT_TYPES } from "@/types";
import { Button, LinearProgress, SxProps, Theme } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const scanAreaAllowList: Partial<EVENT_TYPES[]> = ["moveend", "zoomend"];

export const CooldownButtonComponent = () => {
  const { t: tHome } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");
  const { isLoading, isValidating } = useNeighborhoodIntensityData();
  const eventType = useEventType();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!scanAreaAllowList.includes(eventType)) return;

    setIsDisabled(false);
  }, [eventType]);

  const refetch = () => {
    setIsDisabled(true);
    invalidateIntensityData();
  };

  return (
    <Button
      sx={styles.button}
      variant="contained"
      onClick={refetch}
      disabled={isLoading || isValidating || isDisabled}
    >
      {isLoading || isValidating
        ? tCommon("loaders.loading")
        : tHome("scanner.text")}
      {isLoading || isValidating ? (
        <LinearProgress sx={styles.progress} />
      ) : null}
    </Button>
  );
};

const styles: IStyles = {
  button: () => ({
    pointerEvents: "all",
    height: "48px",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px !important",
  }),
  progress: () => ({
    height: "4px",
    width: "100%",
    marginTop: 0.5,
    marginBottom: 0,
  }),
};
