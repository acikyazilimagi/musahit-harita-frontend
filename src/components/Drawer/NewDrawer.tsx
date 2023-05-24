import styles from "./Drawer.module.css";
import { default as MuiDrawer } from "@mui/material/Drawer";
import { useMapActions } from "@/stores/mapStore";
import { ChannelDetailData } from "@/types";
import Button from "@mui/material/Button";
import { useTranslation } from "next-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, Typography } from "@mui/material";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter } from "next/router";
import omit from "lodash.omit";
import Link from "next/link";
import { getTimeAgo } from "@/utils/date";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {
  intensityColorSelector,
  intensityTextSelector,
} from "@/utils/intensity";
import { useEffect, useState } from "react";
import { useSingletonsStore } from "@/features/singletons";

const DrawerIDLabel = ({ id }: { id: number }) => {
  return <span className={styles.contentIdSection}>ID: {id}</span>;
};

const LastUpdate = ({ lastUpdate }: { lastUpdate: string }) => {
  const { t } = useTranslation("home");
  return (
    <div className={styles.contentInfo}>
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
  name,
}: {
  name: string;
  details: string[];
}) => {
  return (
    <div className={styles.neighbourhoodDetails}>
      <Typography color={"blue"}>{name}</Typography>
      <div className={styles.neighbourhoodWrapper}>
        {details.map((detail, index) => (
          <Typography key={index}>{detail}</Typography>
        ))}
      </div>
    </div>
  );
};

const IntensitySection = ({ intensity }: { intensity: string }) => {
  const { t } = useTranslation("home");
  return (
    <div className={styles.intensitySection}>
      <Typography color={"blue"} sx={{ marginBottom: "0.5rem" }}>
        {t("cluster.intensity")}
      </Typography>
      <span
        className={styles.intensity}
        style={{
          backgroundColor: intensityColorSelector(intensity),
        }}
      >
        <span>
          {t(`cluster.intensity_data.${intensityTextSelector(intensity)}`)}
        </span>
      </span>
    </div>
  );
};

const ButtonGroup = ({
  onCopyBillboard,
}: {
  data: ChannelDetailData;
  onCopyBillboard: (_clipped: string) => void;
}) => {
  const [isShared, setIsShared] = useState(false);
  const { t } = useTranslation("home");

  const copy = () => {
    const currentUrl = window.location.href;
    console.log("currentUrl", currentUrl);
    onCopyBillboard(currentUrl);
    setIsShared(true);
  };

  const doVolunteer = () => {};

  return (
    <>
      <div className={styles.buttonGroup}>
        <Button onClick={copy} variant="contained" color="inherit">
          <ShareIcon className={styles.buttonIcon}></ShareIcon>
          <Typography
            sx={{
              marginLeft: "0.5rem",
            }}
            color="white"
          >
            {t("cluster.shareLink")}
          </Typography>
        </Button>
        <Button onClick={doVolunteer} variant="contained" color="success">
          <FavoriteBorderOutlinedIcon
            className={styles.buttonIcon}
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
        <Alert severity="success" color="info" className={styles.shareAlert}>
          {t("cluster.shareOk")}
        </Alert>
      )}
    </>
  );
};

type DrawerProps = {
  onCopyBillboard: (_clipped: string) => void;
};

export const Drawer = ({ onCopyBillboard }: DrawerProps) => {
  const size = useWindowSize();
  const { api } = useSingletonsStore();
  const anchor = size.width > 768 ? "left" : "bottom";
  const router = useRouter();
  const [data, setData] = useState<ChannelDetailData | null>(null);
  const { setDrawerData } = useMapActions();

  useEffect(() => {
    if (router.query.id) {
      api.fetchDetail(router.query.id as string).then((res) => setData(res));
    } else {
      setData(null);
    }
  }, [router.query.id, api]);

  return (
    <MuiDrawer
      className={styles.drawer}
      open={!!data}
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
          <DrawerContent data={data} onCopyBillboard={onCopyBillboard} />
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
            className={styles.closeButton}
          />
        </Link>
      </Box>
    </MuiDrawer>
  );
};

const DrawerContent = ({
  data,
  onCopyBillboard,
}: {
  data: ChannelDetailData;
  onCopyBillboard: DrawerProps["onCopyBillboard"];
}) => {
  const title = data.name;

  return (
    <div className={styles.content}>
      {data?.neighbourhoodId && <DrawerIDLabel id={data.neighbourhoodId} />}
      {title && <h3 style={{ maxWidth: "45ch" }}>{title}</h3>}
      <LastUpdate lastUpdate={data.lastUpdateTime} />
      <NeighbourhoodDetails name={data.name!} details={data.details} />
      <IntensitySection intensity={data.intensity.toString()} />
      {/* we don't have lat and lng for now
      <MapButtons drawerData={data} />
       */}
      <ButtonGroup data={data} onCopyBillboard={onCopyBillboard} />
    </div>
  );
};
