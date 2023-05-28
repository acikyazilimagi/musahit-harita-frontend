import { Filter } from "@/components/Filter/Filter";
import { FilterHeader } from "@/components/Filter/FilterHeader";
import { Button, CardActionArea } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useState } from "react";
import { useBallotBoxReportState } from "./useBallotBoxReportState";

export const UploadBallotBoxReport = () => {
  const { t } = useTranslation("home");
  const { isOpen, actions } = useBallotBoxReportState();
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const handleUploadClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader) {
        setSelectedFile([reader.result] as any);
      }
    };

    const file = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Filter
      isOpen={isOpen}
      header={
        <FilterHeader
          title={t("filter.uploadBallotBoxReportTitle")}
          onClose={() => {
            actions.setIsOpen(false);
          }}
        />
      }
    >
      <Box
        component="input"
        accept="image/*"
        id="upload-input"
        multiple
        type="file"
        sx={{ display: "none" }}
        onChange={handleUploadClick}
      />
      <CardActionArea sx={{ maxWidth: 400 }}>
        <Box
          component="label"
          htmlFor="upload-input"
          sx={{
            display: "block",
            border: "2px dashed #cdcdcd",
            borderRadius: 1,
            cursor: "pointer",
          }}
        >
          {selectedFile ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1,
                pb: 1,
              }}
            >
              <img
                src={selectedFile as any}
                alt="Ballot box report"
                style={{ width: "100%", height: "auto" }}
              />
              <Button sx={{ pointerEvents: "none" }}>
                {t("uploadBallotReport.chooseNewPhoto")}
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Button sx={{ pointerEvents: "none" }}>
                {t("uploadBallotReport.clickToChoosePhoto")}
              </Button>
            </Box>
          )}
        </Box>
      </CardActionArea>
      <Button disabled={!selectedFile} variant="contained">
        {t("uploadBallotReport.uploadLabel")}
      </Button>
    </Filter>
  );
};
