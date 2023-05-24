import { Container, IconButton, SxProps, Theme } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

type Props = {
  onBack: () => void;
};

export default function PopupHeader({ onBack }: Props) {
  return (
    <Container sx={styles.container}>
      <IconButton color="inherit" onClick={onBack}>
        <ArrowBackOutlinedIcon />
      </IconButton>
    </Container>
  );
}

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const styles: IStyles = {
  container: () => ({
    pointerEvents: "all",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #EAECF0",
    height: "64px",
    display: "flex",
    alignItems: "center",
  }),
};
