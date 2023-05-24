import styles from "./Drawer.module.css";
import { default as MuiDrawer } from "@mui/material/Drawer";
import { DrawerData, useMapActions } from "@/stores/mapStore";
import { ChannelData, ChannelDetailData, ChannelFeedDetails } from "@/types";
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
import {
  intensityColorSelector,
  intensityTextColorSelector,
  intensityTextSelector,
} from "@/utils/intensity";
import { useEffect, useState } from "react";
import { useSingletonsStore } from "@/features/singletons";
import { MapButtons } from "./components/MapButtons";
import { getAllNeighborhoodsWithAllData } from "@/data/models";
import BeVolunteerForm from "../Forms/BeVolunteer";
import BeVolunteer from "../Icons/BeVolunteer";
import { useBeVolunteerStoreActions } from "@/stores/beVolunteer";

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
}: {
  details: ChannelFeedDetails[];
}) => {
  return (
    <div className={styles.neighbourhoodDetails}>
      <div className={styles.neighbourhoodWrapper}>
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
    <div className={styles.intensitySection}>
      <Typography color={"blue"} sx={{ marginBottom: "0.5rem" }}>
        {t("cluster.intensity")}
      </Typography>
      <span
        className={styles.intensity}
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

const ButtonGroup = ({
  data,
  onCopyBillboard,
}: {
  data: ChannelDetailData;
  onCopyBillboard: (_clipped: string) => void;
}) => {
  const [isShared, setIsShared] = useState(false);
  const { t } = useTranslation("home");
  const { toggleForm } = useBeVolunteerStoreActions();

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
    toggleForm();
  };

  return (
    <>
      <div className={styles.buttonGroup}>
        <Button onClick={copy} variant="contained" color="inherit">
          <ShareIcon className={styles.buttonDarkIcon}></ShareIcon>
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
          <BeVolunteer />
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
      className={styles.drawer}
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
            className={styles.closeButton}
          />
        </Link>
      </Box>
      <BeVolunteerForm neighborhoodId={detail?.neighbourhoodId} />
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
    <div className={styles.content}>
      <div className={styles.contentTop}>
        {detail.neighbourhoodId && (
          <DrawerIDLabel id={detail.neighbourhoodId} />
        )}
        <h3 style={{ maxWidth: "45ch", marginBottom: 0 }}>{title}</h3>
        <Typography className={styles.subtitle} sx={{ marginBottom: "1rem" }}>
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
