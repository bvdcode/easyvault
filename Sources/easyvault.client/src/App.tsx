import "./App.css";
import { LoginPage, VaultPage } from "./pages";
import "react-toastify/dist/ReactToastify.css";
import { Box, CssBaseline } from "@mui/material";
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
          </ConfirmProvider>
        </VaultProvider>
      </ThemeProvider>
    </Box>
  );
}

export default App;
