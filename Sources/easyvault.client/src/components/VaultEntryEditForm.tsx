import {
  Box,
  TextField,
  Divider,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
  Computer as ComputerIcon,
  ContentCopy,
  LinkSharp,
} from "@mui/icons-material";
import { VaultData } from "../types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import AllowedValuesEditor from "./AllowedValuesEditor";

interface VaultEntryEditFormProps {
  item: VaultData;
}

export interface VaultEntryEditFormRef {
  getFormData: () => VaultData;
}

const VaultEntryEditForm = forwardRef<
  VaultEntryEditFormRef,
  VaultEntryEditFormProps
>(({ item }, ref) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<VaultData>({
    keyId: item.keyId,
    appName: item.appName,
    values: { ...item.values },
    allowedAddresses: [...item.allowedAddresses],
    allowedUserAgents: [...item.allowedUserAgents],
  });

  const [newKey, setNewKey] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [newUserAgent, setNewUserAgent] = useState<string>("");

  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
  }));

  const handleAppNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, appName: e.target.value }));
  };

  const handleAddKeyValue = () => {
    if (!newKey.trim() || newKey in formData.values) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      values: { ...prev.values, [newKey]: "" },
    }));

    setNewKey("");
  };

  return (
    <Box sx={{ p: 2, maxHeight: "40rem", overflow: "auto" }}>
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: "medium",
          }}
        >
          {t("vaultEdit.apiKeyLabel")}
        </Typography>
        <TextField
          fullWidth
          disabled
          value={formData.keyId}
          variant="outlined"
          size="small"
          placeholder={t("vaultEdit.apiKeyPlaceholder")}
          slotProps={{
            input: {
              endAdornment: (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "text.secondary",
                    gap: 0.5,
                  }}
                >
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "https://" +
                          window.location.hostname +
                          "/api/v1/vault/secrets/" +
                          formData.keyId,
                      );
                      toast.info(t("vaultEdit.linkCopied"));
                    }}
                    sx={{ cursor: "pointer", color: "text.secondary" }}
                    size="small"
                  >
                    <LinkSharp color="primary" fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(formData.keyId);
                      toast.info(t("vaultEdit.apiKeyCopied"));
                    }}
                    sx={{ cursor: "pointer", color: "text.secondary" }}
                  >
                    <ContentCopy color="primary" fontSize="small" />
                  </IconButton>
                </Box>
              ),
            },
          }}
        />
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: "medium",
          }}
        >
          {t("vaultEdit.appNameLabel")}
        </Typography>
        <TextField
          fullWidth
          value={formData.appName}
          onChange={handleAppNameChange}
          variant="outlined"
          size="small"
          placeholder={t("vaultEdit.appNamePlaceholder")}
        />
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: "medium",
          }}
        >
          {t("vaultEdit.secretValuesLabel")}
        </Typography>

        {Object.entries(formData.values).map(([key, value]) => (
          <Grid container spacing={2} key={key} sx={{ mb: 1 }}>
            <Grid size={5}>
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
            <Grid size={6}>
              <TextField
                fullWidth
                value={value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    values: { ...prev.values, [key]: e.target.value.trim() },
                  }))
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
              size={1}
            >
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  const updatedValues = { ...formData.values };
                  delete updatedValues[key];
                  setFormData((prev) => ({ ...prev, values: updatedValues }));
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Box sx={{ mt: 2 }}>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={11}>
              <TextField
                fullWidth
                value={newKey}
                onChange={(e) => setNewKey(e.target.value.trim())}
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
              size={1}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={handleAddKeyValue}
                disabled={!newKey.trim()}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <AllowedValuesEditor
        label={t("vaultEdit.allowedAddressesLabel")}
        placeholder={t("vaultEdit.addressPlaceholder")}
        values={formData.allowedAddresses}
        inputValue={newAddress}
        icon={<ComputerIcon />}
        onInputChange={setNewAddress}
        onValuesChange={(allowedAddresses) =>
          setFormData((previous) => ({ ...previous, allowedAddresses }))
        }
      />
      <Divider sx={{ my: 3 }} />
      <AllowedValuesEditor
        label={t("vaultEdit.allowedUserAgentsLabel")}
        placeholder={t("vaultEdit.userAgentPlaceholder")}
        values={formData.allowedUserAgents}
        inputValue={newUserAgent}
        onInputChange={setNewUserAgent}
        onValuesChange={(allowedUserAgents) =>
          setFormData((previous) => ({ ...previous, allowedUserAgents }))
        }
      />
    </Box>
  );
});

export default VaultEntryEditForm;
