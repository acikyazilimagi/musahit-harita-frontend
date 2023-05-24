import { useTranslation } from "next-i18next";
import styles from "./Attributions.module.css";

export function AttributionComponent() {
  const { t } = useTranslation("common");
  return (
    <div className={styles.attribution}>
      <a href="./cerez.pdf" target="_blank">
        {t("footer.politic.cookie")}
      </a>
      <a href="./gizlilik.pdf" target="_blank">
        {t("footer.politic.privacy")}
      </a>
      <a href="https://maps.google.com/">Google Maps</a>
      <a href="https://leafletjs.com/">Leaflet</a>
    </div>
  );
}
