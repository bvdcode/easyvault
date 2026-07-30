import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
} from "@mui/icons-material";
import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SecretValuesEditorProps {
  values: Record<string, string>;
  onValuesChange: (values: Record<string, string>) => void;
}

const SecretValuesEditor = ({
  values,
  onValuesChange,
}: SecretValuesEditorProps) => {
  const { t } = useTranslation();
  const [newKey, setNewKey] = useState<string>("");

  const handleAdd = () => {
    const trimmedKey = newKey.trim();
    if (!trimmedKey || trimmedKey in values) {
      return;
    }

    onValuesChange({ ...values, [trimmedKey]: "" });
    setNewKey("");
  };

  const handleDelete = (key: string) => {
    const updatedValues = { ...values };
    delete updatedValues[key];
    onValuesChange(updatedValues);
  };

  const handleValueChange = (key: string, value: string) => {
    onValuesChange({ ...values, [key]: value.trim() });
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontWeight: "medium" }}
      >
        {t("vaultEdit.secretValuesLabel")}
      </Typography>
      <Box
        role="region"
        aria-label={t("vaultEdit.secretValuesLabel")}
        sx={{
          maxHeight: { xs: "12.5rem", sm: "15rem" },
          overflowY: "auto",
          scrollbarGutter: "stable",
          pr: 0.5,
        }}
      >
        {Object.entries(values).map(([key, value]) => (
          <Grid container spacing={2} key={key} sx={{ mb: 1 }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                value={key}
                disabled
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <KeyIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 10, sm: 6 }}>
              <TextField
                fullWidth
                value={value}
                onChange={(event) =>
                  handleValueChange(key, event.target.value)
                }
                placeholder={t("vaultEdit.valuePlaceholder")}
                size="small"
              />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              size={{ xs: 2, sm: 1 }}
            >
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(key)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Box>
      <Grid container spacing={2} sx={{ alignItems: "center", mt: 2 }}>
        <Grid size={{ xs: 10, sm: 11 }}>
          <TextField
            fullWidth
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
            placeholder={t("vaultEdit.keyPlaceholder")}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <KeyIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                ),
              },
            }}
          />
        </Grid>
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          size={{ xs: 2, sm: 1 }}
        >
          <IconButton
            size="small"
            color="primary"
            aria-label={t("common.add")}
            title={t("common.add")}
            onClick={handleAdd}
            disabled={!newKey.trim()}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecretValuesEditor;
