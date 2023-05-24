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
import { useState } from "react";
import BeVolunteer from "../../Icons/BeVolunteer";

function BeVolunteerForm() {
  const [isKVKKAcknowledged, setIsKVKKAcknowledged] = useState(false);
  /*
  const [formData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  */

  const isFormOpen = useIsFormOpen();
  const { toggleForm } = useBeVolunteerStoreActions();

  if (!isFormOpen) return null;

  return (
    <Box component="form" autoComplete="off">
      <Button onClick={toggleForm}>Be a Volunteer</Button>
      <Dialog open={isFormOpen} onClose={toggleForm}>
        <DialogTitle sx={styles.titleContainer}>
          <BeVolunteer />
          <Typography sx={styles.title}>Be a Volunteer</Typography>
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
                {/* TODO: Open KVKK popup by clicking text in <u>...</u> */}
                <u>KVKK Açık Rıza Metni’ni</u> okudum onaylıyorum.
              </p>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button sx={styles.button} variant="contained" onClick={toggleForm}>
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
