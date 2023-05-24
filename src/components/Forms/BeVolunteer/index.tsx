import {
  useBeVolunteerStoreActions,
  useIsFormOpen,
} from "@/stores/beVolunteer";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Box,
  FormControlLabel,
  Checkbox,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BeVolunteer from "../../Icons/BeVolunteer";
import { useModalStoreActions } from "@/stores/modals";
import KvkkDialog from "@/components/Texts/Kvkk/KvkkDialog";
import { useTranslation } from "next-i18next";
import moduleCss from "./BeVolunteer.module.css";

type Props = {
  neighborhoodId?: number;
};

type InformationProps = {
  open: boolean;
  onClose: (_: boolean) => void;
};

const LocationInformation: React.FC<InformationProps> = ({ open, onClose }) => {
  const { t } = useTranslation("home");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("forms.beVolunteer.info.title")}</DialogTitle>
      <DialogContent>{t("forms.beVolunteer.info.content")}</DialogContent>
      <DialogActions>
        <div className={moduleCss.buttonGroup}>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={() => onClose(false)}
          >
            {t("forms.beVolunteer.info.cancel")}
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => onClose(true)}
          >
            {t("forms.beVolunteer.info.create")}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

function BeVolunteerForm({ neighborhoodId }: Props) {
  const { t } = useTranslation("home");
  const [isKVKKAcknowledged, setIsKVKKAcknowledged] = useState<boolean>(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState<boolean>(false);
  const [formData] = useState({
    neighborhoodId: neighborhoodId,
    name: "",
    email: "",
    phone: "",
  });

  const isFormOpen = useIsFormOpen();
  const { toggleKVKK } = useModalStoreActions();
  const { toggleForm } = useBeVolunteerStoreActions();

  useEffect(() => {
    formData.neighborhoodId = neighborhoodId;
  }, [formData, neighborhoodId]);

  useEffect(() => {
    if (isKVKKAcknowledged) {
      toggleKVKK();
    }
  }, [isKVKKAcknowledged, toggleKVKK]);

  if (!isFormOpen) return null;

  const openInfoPanel = () => {
    setInfoPanelOpen(true);
  };

  const submit = async () => {};

  const onInfoPanelClose = (isConfirmed: boolean) => {
    if (isConfirmed) {
      submit();
    }
    setInfoPanelOpen(false);
  };

  return (
    <Box component="form" autoComplete="off">
      <KvkkDialog />
      <LocationInformation open={infoPanelOpen} onClose={onInfoPanelClose} />
      <Dialog open={isFormOpen} onClose={toggleForm}>
        <DialogTitle sx={styles.titleContainer}>
          <BeVolunteer color="#344054" />
          <Typography sx={styles.title}>
            {t("forms.beVolunteer.title")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To be a volunteer, please enter your information here. We will send
            you an email to confirm your information.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="surname"
            label="Surname"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="phone"
            label="Phone"
            type="phone"
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isKVKKAcknowledged}
                onChange={(e) => setIsKVKKAcknowledged(e.target.checked)}
              />
            }
            label={
              <p>
                <u onClick={toggleKVKK}>KVKK Açık Rıza Metni’ni</u> okudum
                onaylıyorum.
              </p>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={styles.button}
            variant="contained"
            onClick={openInfoPanel}
          >
            <Typography variant="button" color="white">
              Basvur
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const styles: IStyles = {
  button: () => ({
    backgroundColor: "#96FFAD",
    height: "3rem",
    width: "15rem",
    margin: "auto",
  }),
  titleContainer: () => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    svg: {
      width: "1.5rem",
      height: "1.5rem",
    },
  }),
  title: () => ({
    fontWeight: "500",
    ml: "1rem",
    fontSize: "1.5rem",
  }),
};

export default BeVolunteerForm;
