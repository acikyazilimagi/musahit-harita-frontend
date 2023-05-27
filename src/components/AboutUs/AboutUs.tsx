import {
  Container,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  SxProps,
  Theme,
  Button,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ExpandMore } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import moduleStyles from "./AboutUs.module.css";

interface IStyles {
  [key: string]: SxProps<Theme>;
}

const translationKeys = [
  "whoWeAre",
  "whatAreWeDoing",
  "ourPurpose",
  "howCanYouHelp",
];

export default function AboutUs() {
  const { t } = useTranslation("about-us");

  const translateContent = (key: string): string[] => {
    const content = t(`items.${key}.content`, { returnObjects: true });
    return content as string[];
  };

  return (
    <Container sx={styles.container}>
      <h2 className={moduleStyles.title}>{t("title")}</h2>

      {translationKeys.map((key) => (
        <Accordion key={key} sx={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={styles.accordionSummary}
          >
            <Typography>
              <b>{t(`items.${key}.title`)}</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.accordionRoot}>
            {translateContent(key).map((item, index) => (
              <Typography key={`about-us-item-${index}`} gutterBottom>
                {item}
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      <Accordion sx={styles.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={styles.accordionSummary}
        >
          <Typography>
            <b>{t(`items.contact.title`)}</b>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={styles.accordionRoot}>
          Email: <strong>info@gonullu.io</strong>
          <Links />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

const links = {
  Discord: "https://discord.gg/itdepremyardim",
  Github: "https://github.com/orgs/acikkaynak",
  Instagram: "https://www.instagram.com/acikyazilimagi",
  Twitter: "https://twitter.com/acikyazilimagi",
  Linkedin: "https://www.linkedin.com/company/aya-tr",
};

const Links = () => {
  return (
    <>
      {Object.entries(links).map(([label, href]) => (
        <div
          key={label}
          style={{ display: "flex", gap: 4, alignItems: "center" }}
        >
          <div>{label}</div>
          <div>
            <strong>
              <Button
                href={href}
                endIcon={<OpenInNewIcon />}
                target="_blank"
                rel="noreferrer"
              >
                Link
              </Button>
            </strong>
          </div>
        </div>
      ))}
    </>
  );
};

const styles: IStyles = {
  container: (theme: Theme) => ({
    backgroundColor: "#F7F7F7",
    paddingBottom: "17px",
    [theme.breakpoints.up("xs")]: {
      height: "100%",
    },
    overflowY: "auto",
  }),
  accordion: () => ({
    borderRadius: "8px !important",
    border: "1px solid #f0f0f0",
    marginBottom: "17px",
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
    },
  }),
  accordionRoot: () => ({
    padding: "16px",
  }),
  accordionSummary: () => ({
    "&.Mui-expanded": {
      "&:after": {
        content: "' '",
        width: "95%",
        bottom: "0",
        position: "absolute",
        height: "1px",
        backgroundColor: "#e7eef5",
      },
      color: "error.main",
      "svg.MuiSvgIcon-root": {
        color: "error.main",
      },
    },
  }),
};
