import {
  Box,
  Stack,
  Select,
  Switch,
  Button,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import {
  Upload,
  Download,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../contexts/ThemeContext";
import { useVault } from "../contexts/VaultContext";
import { VaultDataSchema } from "../types/VaultDataSchema";

interface SettingsProps {
  onTabChange: (tab: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ onTabChange }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const { vaultData, password, importVaultData } = useVault();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maskedKey = `****${password?.slice(-4) ?? ""}`;

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleExport = () => {
    if (!vaultData || vaultData.length === 0) {
      toast.info(t("vaultList.emptyMessage"));
      return;
    }

    try {
      const dataStr = JSON.stringify(vaultData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `easyvault-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t("settings.exportSuccess"));
    } catch (error) {
      toast.error(
        t("settings.importError", {
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== "string") {
          toast.error(t("settings.invalidFileFormat"));
          return;
        }

        const parsedData = VaultDataSchema.array().safeParse(
          JSON.parse(content),
        );
        if (!parsedData.success) {
          toast.error(t("settings.invalidFileFormat"));
          return;
        }

        importVaultData(parsedData.data);
        toast.success(t("settings.importSuccess"));
        onTabChange(0);
      } catch (error) {
        toast.error(
          t("settings.importError", {
            error: error instanceof Error ? error.message : String(error),
          }),
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
  };

  return (
    <Box sx={{ p: 3, width: "100%", mx: "auto" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        hidden
      />
      <Stack
        spacing={4}
        sx={{
          mt: 3,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputLabel id="language-select-label">
            {t("settings.darkMode")}
          </InputLabel>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto",
            }}
          >
            <Brightness7
              sx={{
                mr: 2,
                color: isDarkMode ? "text.disabled" : "warning.light",
              }}
            />
            <Switch
              id="theme-switch"
              checked={isDarkMode}
              onChange={toggleTheme}
              name="themeMode"
              color="primary"
            />
            <Brightness4
              sx={{ ml: 2, color: isDarkMode ? "info.light" : "text.disabled" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputLabel id="language-select-label">
            {t("settings.language")}
          </InputLabel>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Select
              labelId="language-select-label"
              id="language-select"
              value={i18n.language.substring(0, 2)}
              onChange={handleLanguageChange}
              label={t("settings.language")}
              variant="standard"
            >
              <MenuItem value="en">{t("settings.languages.en")}</MenuItem>
              <MenuItem value="ru">{t("settings.languages.ru")}</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => navigate("/login")}
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            {t("settings.changeEncryptionKey", { keyPart: maskedKey })}
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Button
            onClick={handleImport}
            variant="outlined"
            fullWidth
            endIcon={<Upload />}
          >
            {t("settings.import")}
          </Button>
          <Button
            onClick={handleExport}
            variant="outlined"
            fullWidth
            endIcon={<Download />}
            disabled={!vaultData || vaultData.length === 0}
          >
            {t("settings.export")}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Settings;
