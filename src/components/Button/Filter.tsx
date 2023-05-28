import {
  Button,
  ButtonProps,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface IFilterButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  buttonLabel: string;
  color?: ButtonProps["color"];
  variant?: ButtonProps["variant"];
}

export const FilterButtonComponent = (props: IFilterButtonProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  return matches ? (
    <Button
      color={props.color}
      variant={props.variant ?? "outlined"}
      startIcon={props.icon}
      onClick={props.onClick}
    >
      {props.buttonLabel}
    </Button>
  ) : (
    <IconButton color="inherit" onClick={props.onClick}>
      {props.icon}
    </IconButton>
  );
};
