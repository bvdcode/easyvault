import {
  Box,
  Alert,
  Paper,
  Button,
  TextField,
  IconButton,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [password, setPassword] = React.useState<string>("");

  const handleLogin = () => {
    if (!password) {
      alert(t("loginPage.emptyPasswordError"));
      return;
    }

    navigate("/vault", { state: { password } });
  };

  return (
    <Paper
      elevation={3}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth={600}
        margin="auto"
        padding={2}
      >
        <InputLabel htmlFor="password-input">
          {t("loginPage.passwordTitle")}
        </InputLabel>
        <TextField
          id="password-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          autoFocus
          type={isHidden ? "password" : "text"}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton onClick={() => setIsHidden(!isHidden)}>
                  {isHidden ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={!password}
        >
          {t("loginPage.loginButton")}
        </Button>
        <Alert severity="info" style={{ marginTop: 16 }}>
          {t("loginPage.infoMessage")}
        </Alert>
      </Box>
    </Paper>
  );
};

export default LoginPage;
