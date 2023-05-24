import { Container, Fade, SxProps, Theme } from "@mui/material";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import AboutUs from "./AboutUs";
import PopupHeader from "../Header/PopupHeader";

interface AboutUsStore {
  isOpen: boolean;
  toggle: (_: boolean) => void;
}

export const useAboutView = create<AboutUsStore>()(
  devtools(
    (set) => ({
      isOpen: false,
      toggle: (checked: boolean) =>
        set(() => ({ isOpen: checked }), undefined, { type: "toggle" }),
    }),
    { name: "AboutUsStore" }
  )
);

export default function AboutUsOverlay() {
  const aboutView = useAboutView();
  if (!aboutView.isOpen) return null;
  return (
    <Fade in={aboutView.isOpen}>
      <Container sx={styles.container}>
        <PopupHeader
          onBack={() => {
            aboutView.toggle(!aboutView.isOpen);
          }}
        />

        <AboutUs></AboutUs>
      </Container>
    </Fade>
  );
}

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const styles: IStyles = {
  container: (theme: Theme) => ({
    pointerEvents: "all",
    [theme.breakpoints.up("xs")]: {
      maxWidth: "100%",
      height: "100vh",
      borderRadius: "0px",
      overflow: "auto",
      padding: "0",
    },
    [theme.breakpoints.up("sm")]: {
      maxWidth: 550,
      height: "auto",
      borderRadius: "8px",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: 550,
      height: "auto",
      borderRadius: "8px",
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: 550,
      height: "auto",
      borderRadius: "8px",
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: 550,
      height: "auto",
      borderRadius: "8px",
    },
  }),
};
