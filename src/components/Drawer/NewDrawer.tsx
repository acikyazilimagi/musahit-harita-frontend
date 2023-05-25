import moduleStyles from "./Drawer.module.css";
import { default as MuiDrawer } from "@mui/material/Drawer";
import { DrawerData, useMapActions } from "@/stores/mapStore";
import { ChannelData, ChannelDetailData, ChannelFeedDetails } from "@/types";
import Button from "@mui/material/Button";
import { useTranslation } from "next-i18next";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter } from "next/router";
import omit from "lodash.omit";
import Link from "next/link";
import { getTimeAgo } from "@/utils/date";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  intensityColorSelector,
  intensityTextColorSelector,
  intensityTextSelector,
} from "@/utils/intensity";
import { useEffect, useState } from "react";
import { useSingletonsStore } from "@/features/singletons";
import { MapButtons } from "./components/MapButtons";
import { getAllNeighborhoodsWithAllData } from "@/data/models";

const DrawerIDLabel = ({ id }: { id: number }) => {
  return <span className={moduleStyles.contentIdSection}>ID: {id}</span>;
};

const LastUpdate = ({ lastUpdate }: { lastUpdate: string }) => {
  const { t } = useTranslation("home");
  return (
    <div className={moduleStyles.contentInfo}>
      <span>
        {t("cluster.lastUpdate", {
          time: getTimeAgo(lastUpdate, t("locale") ?? "en"),
        })}
      </span>
    </div>
  );
};

const NeighbourhoodDetails = ({
  details,
}: {
  details: ChannelFeedDetails[];
}) => {
  return (
    <div className={moduleStyles.neighbourhoodDetails}>
      <div className={moduleStyles.neighbourhoodWrapper}>
        {details.map((detail, index) => (
          <Typography key={index}>
            {detail.buildingName} - {detail.ballotBoxNos.join(" - ")}
          </Typography>
        ))}
      </div>
    </div>
  );
};

const IntensitySection = ({ intensity }: { intensity: string }) => {
  const { t } = useTranslation("home");
  return (
    <div className={moduleStyles.intensitySection}>
      <Typography color={"blue"} sx={{ marginBottom: "0.5rem" }}>
        {t("cluster.intensity")}
      </Typography>
      <span
        className={moduleStyles.intensity}
        style={{
          backgroundColor: intensityColorSelector(intensity),
          color: intensityTextColorSelector(intensity),
        }}
      >
        <span>
          {t(`cluster.intensity_data.${intensityTextSelector(intensity)}`)}
        </span>
      </span>
    </div>
  );
};

const RedirectInformation = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (_: boolean) => void;
}) => {
  const { t } = useTranslation("home");

  return (
    <Dialog open={open} onClose={onClose} sx={styles.redirectDialog}>
      <DialogTitle sx={styles.titleContainer}>
        <div className={moduleStyles.dialogTitleGroup}>
          <InfoOutlinedIcon sx={styles.icon} />
          <Typography sx={styles.infoTitle}>
            {t("cluster.beVolunteer.title")}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>{t("cluster.beVolunteer.content")}</DialogContent>
      <DialogActions>
        <div className={moduleStyles.dialogButtonGroup}>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={() => onClose(false)}
          >
            {t("cluster.beVolunteer.cancel")}
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => onClose(true)}
          >
            {t("cluster.beVolunteer.create")}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

const ButtonGroup = ({
  data,
  onCopyBillboard,
}: {
  data: ChannelDetailData;
  onCopyBillboard: (_clipped: string) => void;
}) => {
  const [isShared, setIsShared] = useState<boolean>(false);
  const [isVolunteerInfoOpen, setIsVolunteerInfoOpen] =
    useState<boolean>(false);
  const { t } = useTranslation("home");

  useEffect(() => {
    setIsShared(false);
  }, [data.neighbourhoodId]);

  const copy = () => {
    onCopyBillboard(
      `${window.location.origin}${window.location.pathname}?id=${data.neighbourhoodId}`
    );
    setIsShared(true);
  };

  const doVolunteer = () => {
    setIsVolunteerInfoOpen(true);
  };

  const checkConfirmRedirect = (isConfirmed: boolean) => {
    setIsVolunteerInfoOpen(false);
    if (isConfirmed) {
      window.open(process.env.NEXT_PUBLIC_BE_VOLUNTEER_URL, "_blank");
    }
  };

  return (
    <>
      <RedirectInformation
        open={isVolunteerInfoOpen}
        onClose={checkConfirmRedirect}
      />
      <div className={moduleStyles.buttonGroup}>
        <Button onClick={copy} variant="contained" color="inherit">
          <ShareIcon className={moduleStyles.buttonDarkIcon}></ShareIcon>
          <Typography
            sx={{
              marginLeft: "0.5rem",
            }}
            color="black"
          >
            {t("cluster.shareLink")}
          </Typography>
        </Button>
        <Button onClick={doVolunteer} variant="contained" color="success">
          <FavoriteBorderOutlinedIcon
            className={moduleStyles.buttonLightIcon}
          ></FavoriteBorderOutlinedIcon>
          <Typography
            sx={{
              marginLeft: "0.5rem",
            }}
            color="white"
          >
            {t("cluster.doVolunteer")}
          </Typography>
        </Button>
      </div>

      {isShared && (
        <Alert
          severity="success"
          color="info"
          className={moduleStyles.shareAlert}
        >
          {t("cluster.shareOk")}
        </Alert>
      )}

      <Typography
        sx={{
          textAlign: "center",
          marginTop: "1rem",
          opacity: 0.8,
          fontSize: ".9rem",
        }}
      >
        {t("cluster.dataProvider", { provider: "Oy ve Ötesi" })}
      </Typography>
    </>
  );
};

type DrawerProps = {
  data: DrawerData | null;
  onCopyBillboard: (_clipped: string) => void;
};

export const Drawer = ({ data, onCopyBillboard }: DrawerProps) => {
  const size = useWindowSize();
  const { api } = useSingletonsStore();
  const anchor = size.width > 768 ? "left" : "bottom";
  const router = useRouter();
  const [detail, setDetail] = useState<ChannelDetailData | null>(null);
  const { setDrawerData } = useMapActions();

  useEffect(() => {
    if (router.query.id) {
      api.fetchDetail(router.query.id as string).then((res) => setDetail(res));
    } else {
      setDetail(null);
    }
  }, [router.query.id, api]);

  useEffect(() => {
    if (detail !== null && data === null) {
      const neighborhood =
        getAllNeighborhoodsWithAllData()[detail.neighbourhoodId];
      setDrawerData({
        intensity: detail.intensity,
        location: {
          lat: neighborhood.lat,
          lng: neighborhood.lng,
        },
        properties: {
          name: neighborhood.name,
          description: `${neighborhood.districtName}, ${neighborhood.cityName}`,
        },
      });
    }
  }, [data, detail, setDrawerData]);

  return (
    <MuiDrawer
      className={moduleStyles.drawer}
      open={!!data && !!detail}
      anchor={anchor}
      hideBackdrop
    >
      <Box
        sx={{
          width: size.width > 768 ? 400 : "full",
          display: "flex",
          height: "100%",
          padding: "1rem 2rem 1rem 1rem",
          flexDirection: "column",
          overflow: "auto",
        }}
        role="presentation"
      >
        {data && (
          <DrawerContent
            data={data}
            detail={detail!}
            onCopyBillboard={onCopyBillboard}
          />
        )}
        {/* <CloseByRecord drawerData={drawerData} /> */}
        <Link
          href={{
            pathname: "/",
            query: omit(router.query, "id"),
            hash: window.location.hash,
          }}
        >
          <CloseIcon
            onClick={() => {
              setDrawerData(null);
            }}
            className={moduleStyles.closeButton}
          />
        </Link>
      </Box>
    </MuiDrawer>
  );
};

const DrawerContent = ({
  data,
  detail,
  onCopyBillboard,
}: {
  detail: ChannelDetailData | null;
  data: ChannelData;
  onCopyBillboard: DrawerProps["onCopyBillboard"];
}) => {
  const title = data.properties.name;

  if (!detail) return null;

  return (
    <div className={moduleStyles.content}>
      <div className={moduleStyles.contentTop}>
        {detail.neighbourhoodId && (
          <DrawerIDLabel id={detail.neighbourhoodId} />
        )}
        <h3 style={{ maxWidth: "45ch", marginBottom: 0 }}>{title}</h3>
        <Typography
          className={moduleStyles.subtitle}
          sx={{ marginBottom: "1rem" }}
        >
          {data.properties.description}
        </Typography>

        <LastUpdate lastUpdate={detail.lastUpdateTime} />
        <NeighbourhoodDetails details={detail.details} />
        <IntensitySection intensity={data.intensity.toString()} />
        <ButtonGroup data={detail} onCopyBillboard={onCopyBillboard} />
      </div>
      <MapButtons drawerData={data} />
    </div>
  );
};

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const styles: IStyles = {
  redirectDialog: () => ({
    ".MuiPaper-root": {
      borderRadius: "10px",
      textAlign: "center",
    },
  }),
  button: () => ({
    marginBottom: "1rem",
    marginInline: "auto",
    paddingInline: "3rem",
  }),
  titleContainer: () => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    svg: {
      width: "1.5rem",
      height: "1.5rem",
    },
  }),
  infoTitle: () => ({
    fontWeight: "500",
    fontSize: "1.2rem",
  }),
  icon: () => ({
    width: "1.2rem",
    position: "absolute",
    left: 0,
    transform: "translateX(-100%)",
    height: "1.2rem",
  }),
};
