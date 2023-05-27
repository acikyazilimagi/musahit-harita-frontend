import { MapOptions } from "leaflet";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { HelpOutline } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAboutView } from "@/components/AboutUs/AboutUsOverlay";
import { useHelpView } from "@/components/UserGuide/UserGuide";
import { IconButton, Theme, SxProps } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const DynamicMap = dynamic(() => import("./Dynamic"), {
  ssr: false,
});
interface IStyles {
  [key: string]: SxProps<Theme>;
}
interface MapProps extends MapOptions {
  children: ReactNode;
  // eslint-disable-next-line no-unused-vars
  whenReady: (map: any) => void;
}
const styles: IStyles = {
  button: (theme: Theme) => ({
    backgroundColor: theme.palette.common.white,
    color: `${theme.palette.grey[600]} !important`,
    borderRadius: "8px !important",
    fontSize: {
      xs: "0.8rem",
    },
    display: "flex",
    alignItems: "center",
    gap: {
      xs: "2px",
      sm: "4px",
      md: "8px",
    },
    padding: {
      xs: "0",
      sm: "4px 8px",
    },
    svg: {
      fontSize: {
        xs: "1rem",
        sm: "1.4rem",
      },
    },
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
  }),
};

export const Map = (props: MapProps) => {
  const helpView = useHelpView();

  const { t } = useTranslation("home");

  const aboutView = useAboutView();
  return (
    <>
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #EAECF0",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: "0px",
          height: "60px",
          padding: "0px 16px",
          width: "100%",
          zIndex: 1030,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Image
            src="/logo.svg"
            alt="logo"
            loading="eager"
            width={100}
            height={60}
          />
        </div>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "12px",
            margin: "0px",
            padding: "0px",
          }}
        >
          <li
            style={{
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: "14px",
            }}
          >
            <IconButton
              sx={styles.button}
              color="inherit"
              onClick={() => {
                helpView.toggle(!helpView.isOpen);
                aboutView.toggle(false);
              }}
            >
              {t("header.userGuide")}
              <HelpOutline />
            </IconButton>
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: "14px",
            }}
          >
            <IconButton
              sx={styles.button}
              color="inherit"
              onClick={() => {
                aboutView.toggle(!aboutView.isOpen);
                helpView.toggle(false);
              }}
            >
              {t("header.aboutUs")}
              <InfoOutlinedIcon />
            </IconButton>
          </li>
        </ul>
      </header>
      <div
        style={{
          width: "100vw",
          height: "100% - 60px",
          top: "60px",
          bottom: "0",
          position: "absolute",
          zIndex: 1000,
        }}
      >
        <DynamicMap {...props} />
      </div>
    </>
  );
};
