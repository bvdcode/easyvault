import { GitHub } from "@mui/icons-material";
import { Divider, Link, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const AppFooter = () => {
  const { t } = useTranslation();

  return (
    <Stack
      component="footer"
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {t("app.version", {
          version: import.meta.env.VITE_APP_VERSION,
        })}
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Link
        href="https://github.com/bvdcode/EasyVault"
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        color="text.secondary"
        variant="caption"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          py: 0.5,
        }}
      >
        <GitHub fontSize="small" />
        {t("app.github")}
      </Link>
    </Stack>
  );
};

export default AppFooter;
