import {
  Button,
  IconButton,
  SxProps,
  Theme,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface IStyles {
  [key: string]: SxProps<Theme>;
}
interface IDisposableLinkButtonProps {
  dispose: boolean;
  icon: React.ReactNode;
  buttonLabel: string;
  href: string;
}

export const DisposableLinkButtonComponent = (
  props: IDisposableLinkButtonProps
) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  return matches ? (
    <Button
      sx={styles.button}
      style={{ opacity: props.dispose ? 0 : 1 }}
      color="inherit"
      variant="contained"
      startIcon={props.icon}
      href={props.href}
    >
      {props.buttonLabel}
    </Button>
  ) : (
    <IconButton sx={styles.button} color="inherit" href={props.href}>
      {props.icon}
    </IconButton>
  );
};
const styles: IStyles = {
  button: (theme: Theme) => ({
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.grey[300]}`,
    color: `${theme.palette.grey[700]} !important`,
    borderRadius: "8px !important",
    justifyContent: "left",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
  }),
};
