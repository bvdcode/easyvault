import "./App.css";
import { GitHub } from "@mui/icons-material";
import { LoginPage, VaultPage } from "./pages";
import "react-toastify/dist/ReactToastify.css";
import { Box, CssBaseline, Fab } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VaultProvider } from "./contexts/VaultContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Box className="app">
      <ThemeProvider>
        <VaultProvider>
          <ConfirmProvider>
            <BrowserRouter basename="/">
              <Routes>
                <Route path="/vault" element={<VaultPage />} />
                <Route path="*" element={<LoginPage />} />
              </Routes>
            </BrowserRouter>
            <CssBaseline enableColorScheme={true} />
            <Fab
              color="primary"
              aria-label="add"
              sx={{ position: "fixed", bottom: 16, right: 16 }}
              href="https://github.com/bvdcode/EasyVault"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </Fab>
          </ConfirmProvider>
        </VaultProvider>
      </ThemeProvider>
    </Box>
  );
}

export default App;
