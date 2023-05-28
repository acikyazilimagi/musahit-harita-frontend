import { Filter } from "@/components/Filter/Filter";
import { FilterHeader } from "@/components/Filter/FilterHeader";
import { Button, CardActionArea } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useState } from "react";
import { useBallotBoxReportState } from "./useBallotBoxReportState";
import { compressImage } from "@/utils/compressImage";

const FILE_SIZE_LIMIT_TO_COMPRESS = 400 * 1024;
const COMPRESSED_IMAGE_DIMENSION = 1824;

export const UploadBallotBoxReport = () => {
  const { t } = useTranslation("home");
  const { isOpen, actions } = useBallotBoxReportState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;

    setUploading(true);

    if (selectedFile.size > FILE_SIZE_LIMIT_TO_COMPRESS) {
      try {
        const base64 = await compressImage(
          selectedFile,
          COMPRESSED_IMAGE_DIMENSION
        );

        await fetch(`/api/upload-report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: base64 }),
        });
        setSelectedFile(null);
      } catch (err) {
        console.log(`Could not upload image`, err);
      }

      setUploading(false);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result as string;

      try {
        await fetch(`/api/upload-report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: base64 }),
        });
        setSelectedFile(null);
      } catch (err) {
        console.log(`Could not upload image`, err);
      }

      setUploading(false);
    };

    reader.readAsDataURL(selectedFile);
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
        type="file"
        sx={{ display: "none" }}
        onChange={handleFileSelect}
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
                src={URL.createObjectURL(selectedFile)}
                alt="Ballot box report"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "calc(100vh - 525px)",
                  objectFit: "cover",
                }}
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
      <Button
        disabled={!selectedFile || uploading}
        variant="contained"
        onClick={handleUploadClick}
      >
        {uploading
          ? t("uploadBallotReport.uploadingLabel")
          : t("uploadBallotReport.uploadLabel")}
      </Button>
    </Filter>
  );
};
