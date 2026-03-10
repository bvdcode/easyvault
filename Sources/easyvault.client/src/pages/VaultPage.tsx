import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Settings, VaultList } from "../components";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useVault } from "../contexts/VaultContext";

const VaultPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const password = location.state?.password;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { setPassword, loadVaultData } = useVault();

  useEffect(() => {
    if (!password) {
      navigate("/login");
      return;
    }

    setPassword(password);
    loadVaultData(password);
  }, [password, navigate, setPassword, loadVaultData]);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: "auto",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        aria-label="basic tabs example"
      >
        <Tab label={t("vaultPage.tabs.list")} />
        <Tab label={t("vaultPage.tabs.settings")} />
      </Tabs>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
        flex={1}
        overflow="auto"
        padding={2}
      >
        {selectedTab === 0 && <VaultList />}
        {selectedTab === 1 && <Settings onTabChange={setSelectedTab} />}
      </Box>
    </Paper>
  );
};

export default VaultPage;
