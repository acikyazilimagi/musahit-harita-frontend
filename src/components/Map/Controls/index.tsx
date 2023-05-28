import { useState } from "react";
import {
  MapTypeMapLayerViewComponent,
  useMTMLView,
} from "../../MTMLView/MTMLView";
import { AttributionComponent } from "../../Attributions/Attributions";
import {
  ButtonGroup,
  IconButton,
  Stack,
  SxProps,
  Theme,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { LocaleSwitchComponent } from "../../LocaleSwitch/LocaleSwitch";
import { FilterButtonComponent } from "../../Button/Filter";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LayersIcon from "@mui/icons-material/Layers";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useMap } from "react-leaflet";
import { Control } from "./Control";
import { LayerButton } from "./LayerButton";
import { useTranslation } from "next-i18next";
import { DoubleClickStopPropagation } from "@/components/DoubleClickStopPropagation";
import {
  FilterVotingLocations,
  useVotingLocations,
} from "@/features/location-categories";
import { CooldownButtonComponent } from "@/components/Button/Cooldown";
import Link from "next/link";
import { isBallotBoxReportFeatureEnabled } from "@/features/ballot-box-report/isBallotBoxReportFeatureEnabled";
import { CloudUpload } from "@mui/icons-material";
import { useBallotBoxReportState } from "@/features/ballot-box-report/useBallotBoxReportState";

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const MapZoomControl = () => {
  const parentMap = useMap();
  return (
    <Box>
      <ButtonGroup
        sx={styles.button}
        size="small"
        orientation="vertical"
        aria-label="small button group"
      >
        <IconButton
          color="inherit"
          onClick={() => {
            parentMap.zoomIn();
          }}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => {
            parentMap.zoomOut();
          }}
        >
          <RemoveIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

interface IMapLayerControlProps {
  showOnly: "mobile" | "desktop";
}

const MapLayerControl = (props: IMapLayerControlProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const mtmlView = useMTMLView();

  return matches ? (
    props.showOnly === "desktop" ? (
      <LayerButton
        onClick={() => mtmlView.toggle(!mtmlView.isOpen)}
        image={"default"}
        checked={false}
      />
    ) : null
  ) : props.showOnly === "mobile" ? (
    <Box>
      <IconButton
        sx={styles.button}
        color="inherit"
        onClick={() => mtmlView.toggle(!mtmlView.isOpen)}
      >
        <LayersIcon />
      </IconButton>
    </Box>
  ) : null;
};

export const MapControls = () => {
  const { t } = useTranslation("home");

  const votingLocationsFilter = useVotingLocations();
  const ballotBoxReportState = useBallotBoxReportState();
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(true);

  return (
    <DoubleClickStopPropagation>
      <div>
        <Control position="topleft">
          <DoubleClickStopPropagation>
            <Stack display={"flex"} direction={"column"} rowGap={1}>
              <MapZoomControl />
              <MapLayerControl showOnly={"mobile"} />
            </Stack>
          </DoubleClickStopPropagation>
        </Control>
        <Control position="bottomleft">
          <Stack display={"flex"} direction={"column"} rowGap={1}>
            <Box
              sx={{
                padding: {
                  xs: "0px 0px 28px 8px",
                  sm: "0",
                  md: "0",
                },
              }}
            >
              <Link target="_blank" href="https://afet.org">
                <img
                  src="/aya.jpeg"
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  alt="logo"
                  loading="eager"
                  width={48}
                  height={48}
                />
              </Link>
            </Box>
            <MapTypeMapLayerViewComponent />
            <MapLayerControl showOnly={"desktop"} />
          </Stack>
        </Control>

        <Control position="topright">
          <Stack
            display={"flex"}
            direction={"column"}
            rowGap={2}
            alignItems={"flex-end"}
          >
            <Stack display={"flex"} direction={"row"} columnGap={2}>
              {isBallotBoxReportFeatureEnabled() && (
                <FilterButtonComponent
                  variant="contained"
                  buttonLabel={t("filter.uploadBallotBoxReportTitle")}
                  icon={<CloudUpload />}
                  onClick={() => {
                    ballotBoxReportState.actions.setIsOpen(
                      !ballotBoxReportState.isOpen
                    );
                  }}
                />
              )}
              <FilterButtonComponent
                buttonLabel={t("filter.findVotingLocationsTitle")}
                icon={<SearchIcon />}
                onClick={() => {
                  votingLocationsFilter.actions.setIsOpen(
                    !votingLocationsFilter.isOpen
                  );
                }}
              />
            </Stack>
            <Stack display={"flex"} direction={"row"} columnGap={2}>
              <FilterVotingLocations />
            </Stack>
          </Stack>
        </Control>
        <Control position="bottomright">
          <Stack
            display={"flex"}
            direction={"column"}
            rowGap={1}
            alignItems={"flex-end"}
          >
            <Stack display={"flex"} direction={"row"}>
              <LocaleSwitchComponent />
            </Stack>
            <Stack display={"flex"} direction={"row"}>
              <AttributionComponent />
            </Stack>
          </Stack>
        </Control>

        <Box sx={styles.fixedMidBottom}>
          {infoSnackbarOpen && (
            <Box sx={styles.infoSnackbar}>
              <Box sx={styles.infoSnackbarText}>
                {t("info.infoSnackbarText")}
              </Box>

              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setInfoSnackbarOpen(false)}
                sx={styles.infoSnackbarCloseButton}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <CooldownButtonComponent />
        </Box>
      </div>
    </DoubleClickStopPropagation>
  );
};

const styles: IStyles = {
  button: (theme: Theme) => ({
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.grey[300]}`,
    color: `${theme.palette.grey[700]} !important`,
    borderRadius: "8px !important",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
  }),
  buttonBox: () => ({
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  }),
  marginTopLeft: {
    margin: "10px 10px",
  },
  marginLeft: {
    margin: "0px 0px 10px 10px",
  },
  pointerNone: {
    pointerEvents: "none",
  },
  pointerAll: {
    pointerEvents: "all",
  },
  fixedMidBottom: () => ({
    position: "fixed",
    bottom: "32px",
    left: "0px",
    width: "100%",
    zIndex: 1030,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  }),
  infoSnackbar: {
    background: "#fff",
    boxShadow: "0px 2px 4px rgba(22, 22, 22, 0.16)",
    borderRadius: "16px",
    pointerEvents: "all",
    margin: "0 8px 12px 8px",
    maxWidth: "420px",
    display: "flex",
    alignItems: "flex-start",
    textAlign: "center",
  },
  infoSnackbarText: {
    fontSize: "14px",
    padding: "12px 0 12px 12px",
  },
  infoSnackbarCloseButton: {
    position: "relative",
    top: "4px",
    right: "4px",
  },
};
