import { ContentCopy, Computer as ComputerIcon, LinkSharp } from "@mui/icons-material";
import { Box, Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  type ChangeEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { VaultData } from "../types";
import AllowedValuesEditor from "./AllowedValuesEditor";
import SecretValuesEditor from "./SecretValuesEditor";

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
  const [newAddress, setNewAddress] = useState<string>("");
  const [newUserAgent, setNewUserAgent] = useState<string>("");

  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
  }));

  const handleAppNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({
      ...previous,
      appName: event.target.value,
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
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
                      color: "text.secondary",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://${window.location.hostname}/api/v1/vault/secrets/${formData.keyId}`,
                        );
                        toast.info(t("vaultEdit.linkCopied"));
                      }}
                      sx={{ color: "text.secondary" }}
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
                      sx={{ color: "text.secondary" }}
                    >
                      <ContentCopy color="primary" fontSize="small" />
                    </IconButton>
                  </Box>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
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
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <SecretValuesEditor
            values={formData.values}
            onValuesChange={(values) =>
              setFormData((previous) => ({ ...previous, values }))
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <AllowedValuesEditor
              label={t("vaultEdit.allowedAddressesLabel")}
              placeholder={t("vaultEdit.addressPlaceholder")}
              values={formData.allowedAddresses}
              inputValue={newAddress}
              icon={<ComputerIcon />}
              onInputChange={setNewAddress}
              onValuesChange={(allowedAddresses) =>
                setFormData((previous) => ({
                  ...previous,
                  allowedAddresses,
                }))
              }
            />
            <Divider />
            <AllowedValuesEditor
              label={t("vaultEdit.allowedUserAgentsLabel")}
              placeholder={t("vaultEdit.userAgentPlaceholder")}
              values={formData.allowedUserAgents}
              inputValue={newUserAgent}
              onInputChange={setNewUserAgent}
              onValuesChange={(allowedUserAgents) =>
                setFormData((previous) => ({
                  ...previous,
                  allowedUserAgents,
                }))
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

export default VaultEntryEditForm;
