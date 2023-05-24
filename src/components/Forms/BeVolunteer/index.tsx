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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSingletonsStore } from "@/features/singletons";

type Props = {
  neighborhoodId?: number;
};

type InformationProps = {
  open: boolean;
  onClose: (_: boolean) => void;
};

const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

const LocationInformation: React.FC<InformationProps> = ({ open, onClose }) => {
  const { t } = useTranslation("home");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={styles.titleContainer}>
        <InfoOutlinedIcon sx={styles.icon} />
        <Typography sx={styles.infoTitle}>
          {t("forms.beVolunteer.info.title")}
        </Typography>
      </DialogTitle>
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
  const [infoPanelOpen, setInfoPanelOpen] = useState<boolean>(false);
  const { api } = useSingletonsStore();
  const { setFieldValue, ...form } = useFormik({
    enableReinitialize: true,
    initialValues: {
      neighborhoodId: neighborhoodId ?? 0,
      name: "",
      surname: "",
      email: "",
      phone: "",
      kvkkAccepted: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(
        t("forms.beVolunteer.validation.name").toString()
      ),
      surname: Yup.string().required(
        t("forms.beVolunteer.validation.surname").toString()
      ),
      email: Yup.string()
        .email(t("forms.beVolunteer.validation.email").toString())
        .required(t("forms.beVolunteer.validation.email").toString()),
      phone: Yup.string().required(
        t("forms.beVolunteer.validation.phone").toString()
      ),
      kvkkAccepted: Yup.boolean()
        .oneOf([true], t("forms.beVolunteer.validation.kvkk").toString())
        .required(t("forms.beVolunteer.validation.kvkk").toString()),
    }),
    onSubmit: async (values) => {
      const res = await api.applyVolunteer(values);
      if (res) {
        toast.success(t("forms.beVolunteer.status.ok"), toastConfig);
        form.resetForm();
        return toggleForm();
      }

      return toast.error(t("forms.beVolunteer.status.fail"), toastConfig);
    },
  });

  const isFormOpen = useIsFormOpen();
  const { toggleKVKK } = useModalStoreActions();
  const { toggleForm } = useBeVolunteerStoreActions();

  useEffect(() => {
    if (neighborhoodId) {
      setFieldValue("neighborhoodId", neighborhoodId);
    }
  }, [setFieldValue, neighborhoodId]);

  useEffect(() => {
    if (form.values.kvkkAccepted) {
      toggleKVKK();
    }
  }, [form.values.kvkkAccepted, toggleKVKK]);

  if (!isFormOpen) return null;

  const openInfoPanel = () => {
    setInfoPanelOpen(true);
  };

  const onInfoPanelClose = (isConfirmed: boolean) => {
    if (isConfirmed) {
      form.handleSubmit();
    }
    setInfoPanelOpen(false);
  };

  return (
    <Box component="form" autoComplete="on">
      <KvkkDialog />
      <LocationInformation open={infoPanelOpen} onClose={onInfoPanelClose} />
      <ToastContainer />
      <Dialog open={isFormOpen} onClose={toggleForm} sx={styles.dialog}>
        <DialogTitle sx={styles.titleContainer}>
          <BeVolunteer color="#344054" />
          <Typography sx={styles.title}>
            {t("forms.beVolunteer.title")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("forms.beVolunteer.subtitle")}
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label={t("forms.beVolunteer.inputs.name")}
            type="text"
            fullWidth
            autoComplete="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={!!form.touched.name && !!form.errors.name}
            helperText={form.touched.name && form.errors.name}
          />
          <TextField
            margin="dense"
            id="surname"
            label={t("forms.beVolunteer.inputs.surname")}
            type="text"
            fullWidth
            autoComplete="family-name"
            value={form.values.surname}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={!!form.touched.surname && !!form.errors.surname}
            helperText={form.touched.surname && form.errors.surname}
          />
          <TextField
            margin="dense"
            id="phone"
            label={t("forms.beVolunteer.inputs.phone")}
            type="phone"
            fullWidth
            autoComplete="tel"
            value={form.values.phone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={!!form.touched.phone && !!form.errors.phone}
            helperText={form.touched.phone && form.errors.phone}
          />
          <TextField
            margin="dense"
            id="email"
            label={t("forms.beVolunteer.inputs.email")}
            type="email"
            fullWidth
            autoComplete="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={!!form.touched.email && !!form.errors.email}
            helperText={form.touched.email && form.errors.email}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.values.kvkkAccepted}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                name="kvkkAccepted"
                id="kvkkAccepted"
              />
            }
            label={
              <>
                <p>
                  <u onClick={toggleKVKK}>
                    {t("forms.beVolunteer.kvkkClickableText")}
                  </u>{" "}
                  {t("forms.beVolunteer.kvkkText")}
                </p>
                {form.touched.kvkkAccepted && form.errors.kvkkAccepted
                  ? form.errors.kvkkAccepted
                  : null}
              </>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            sx={styles.button}
            size="large"
            color="success"
            variant="contained"
            onClick={openInfoPanel}
          >
            <BeVolunteer />
            <Typography variant="button" color="white" sx={styles.buttonText}>
              {t("forms.beVolunteer.submit")}
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
  dialog: (theme: Theme) => ({
    minHeight: "50vh",
    minWidth: "50vw",
    ".MuiDialog-scrollPaper": {
      [theme.breakpoints.down("sm")]: {
        alignItems: "flex-end",
      },
    },
    ".MuiPaper-root": {
      [theme.breakpoints.down("sm")]: {
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
        minWidth: "50vw",
        minHeight: "50vh",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
        borderRadius: "10px",
      },
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
  infoTitle: () => ({
    fontWeight: "500",
    ml: "1rem",
    fontSize: "1.2rem",
  }),
  icon: () => ({
    width: "1.2rem",
    height: "1.2rem",
  }),
  buttonText: () => ({
    marginLeft: ".5rem",
  }),
};

export default BeVolunteerForm;
