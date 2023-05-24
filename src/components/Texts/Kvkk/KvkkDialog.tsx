import { useKvkkModalOpen, useModalStoreActions } from "@/stores/modals";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SxProps,
  Theme,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";

export default function KvkkDialog() {
  const { t } = useTranslation("home");
  const isOpen = useKvkkModalOpen();
  const { toggleKVKK } = useModalStoreActions();

  useEffect(() => {
    console.log("sa");
  }, [isOpen]);

  const getContentTranslation = (): string[] => {
    const content = t("forms.kvkk.content", { returnObjects: true });
    return content as string[];
  };

  return (
    <Dialog open={isOpen} onClose={toggleKVKK} sx={styles.dialog}>
      <DialogTitle>{t("forms.kvkk.title")}</DialogTitle>
      <DialogContent>
        {getContentTranslation().map((content, index) => (
          <DialogContentText key={index}>{content}</DialogContentText>
        ))}
      </DialogContent>
    </Dialog>
  );
}

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const styles: IStyles = {
  dialog: (theme: Theme) => ({
    minHeight: "50vh",
    minWidth: "50vw",
    ".MuiDialog-scrollPaper": {
      [theme.breakpoints.up("xs")]: {
        alignItems: "flex-end",
      },
    },
    ".MuiPaper-root": {
      [theme.breakpoints.up("xs")]: {
        minWidth: "100vw",
        maxWidth: "100vw",
        minHeight: "90vh",
        maxHeight: "90%",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
      },
      [theme.breakpoints.up("sm")]: {
        minWidth: "90vw",
        minHeight: "90vh",
      },
      [theme.breakpoints.up("md")]: {
        minWidth: "90vw",
        minHeight: "90vh",
      },
      [theme.breakpoints.up("lg")]: {
        minWidth: "90vw",
        minHeight: "90vh",
      },
      [theme.breakpoints.up("xl")]: {
        minWidth: "90vw",
        minHeight: "90vh",
      },
    },
  }),
};
